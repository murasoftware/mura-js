
function attach(Mura){
	'use strict'

	/**
	 * login - Logs user into Mura
	 *
	 * @param	{string} username Username
	 * @param	{string} password Password
	 * @param	{string} siteid	 Siteid
	 * @return {Promise}
	 * @memberof {class} Mura
	 */

	function login(username, password, siteid) {
		return Mura.getRequestContext().login(username, password, siteid);
	}

	/**
	 * logout - Logs user out
	 *
	 * @param	{type} siteid Siteid
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function logout(siteid) {
		return Mura.getRequestContext().logout(siteid);
	}

	/**
	 * trackEvent - This is for Mura Experience Platform. It has no use with Mura standard
	 *
	 * @param	{object} data event data
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function trackEvent(data) {
		//This all needs to be cleaned up

		//Turn off metric when editing content, perhaps should be removed
		if(typeof Mura.editing != 'undefined' && Mura.editing){
			return new Promise(function(resolve, reject) {
				resolve = resolve || function() {};
				resolve();
			});
		}

		var isMXP=(typeof Mura.trackingVars != 'undefined');
		var instanceVars = {
			ga:{
				trackingvars:{}
			}
		};
		var gaFound = false;
		var trackingComplete = false;
		var attempt=0;
		var eventData={};
		
		eventData.category = data.event_category || data.eventCategory || data.category || '';
		eventData.name = data.event_action || data.eventAction || data.action || data.eventName || data.name || '';
		eventData.label = data.event_label || data.eventLabel || data.label || '';
		eventData.type =	data.hit_type || data.hitType || data.type || 'event';
		eventData.value = data.event_value || data.eventValue || data.value || undefined;

		if (typeof data.nonInteraction == 'undefined') {
			eventData.nonInteraction = false;
		} else {
			eventData.nonInteraction = data.nonInteraction;
		}

		eventData.contentid = data.contentid || Mura.contentid;
		eventData.objectid = data.objectid || '';

		function track() {
			//Only happen the first time to coral data announce tracking event
			//Subsequent calls are ignored, as the tracking is already complete
			if(!attempt){
			
				instanceVars.ga.trackingvars.eventCategory = eventData.category;
				instanceVars.ga.trackingvars.eventAction = eventData.name;
				instanceVars.ga.trackingvars.nonInteraction = eventData.nonInteraction;
				instanceVars.ga.trackingvars.hitType = eventData.type;

				if (typeof eventData.value != 'undefined' && Mura.isNumeric(eventData.value)) {
					instanceVars.ga.trackingvars.eventValue = eventData.value;
				}

				if (eventData.label) {
					instanceVars.ga.trackingvars.eventLabel = eventData.label;
				} else if(isMXP) {
					if(typeof instanceVars.object != 'undefined'){
						instanceVars.ga.trackingvars.eventLabel = instanceVars.object.title;
					} else {
						instanceVars.ga.trackingvars.eventLabel = instanceVars.content.title;
					}

					eventData.label=instanceVars.ga.trackingvars.eventLabel;
				}

				Mura(document).trigger('muraTrackEvent',instanceVars);
				Mura(document).trigger('muraRecordEvent',instanceVars);

			}

			//The method will keep trying to track until ga, gtag are found
			if (typeof gtag != 'undefined') {
				//swap out ga for gtag variables
				instanceVars.ga.trackingvars.event_category = instanceVars.ga.trackingvars.eventCategory;
				instanceVars.ga.trackingvars.event_action = instanceVars.ga.trackingvars.eventAction;
				instanceVars.ga.trackingvars.non_interaction = instanceVars.ga.trackingvars.nonInteraction;
				instanceVars.ga.trackingvars.hit_type = instanceVars.ga.trackingvars.hitType;
				instanceVars.ga.trackingvars.event_value = instanceVars.ga.trackingvars.eventValue;
				instanceVars.ga.trackingvars.event_label = instanceVars.ga.trackingvars.eventLabel;

				delete instanceVars.ga.trackingvars.eventCategory;
				delete instanceVars.ga.trackingvars.eventAction;
				delete instanceVars.ga.trackingvars.eventName;
				delete instanceVars.ga.trackingvars.nonInteraction;
				delete instanceVars.ga.trackingvars.hitType;
				delete instanceVars.ga.trackingvars.eventValue;
				delete instanceVars.ga.trackingvars.eventLabel;

				if(typeof Mura.trackingVars != 'undefined'){
					if(Mura.trackingVars.ga.trackingid){
						instanceVars.ga.trackingvars.send_to=Mura.trackingVars.ga.trackingid;
						gtag('event', instanceVars.ga.trackingvars.event_action, instanceVars.ga.trackingvars);
					} else if (Mura.trackingVars.ga.measurementid) {
						instanceVars.ga.trackingvars.send_to=Mura.trackingVars.ga.measurementid
						instanceVars.ga.trackingvars.event_name=instanceVars.ga.trackingvars.event_action;
						delete instanceVars.ga.trackingvars.event_action;
						gtag('event', instanceVars.ga.trackingvars.event_name, instanceVars.ga.trackingvars);	
					}
				} else {
					instanceVars.ga.trackingvars.event_name=instanceVars.ga.trackingvars.event_action;
					gtag('event', instanceVars.ga.trackingvars.event_name, instanceVars.ga.trackingvars);	
				}
				gaFound = true;
				trackingComplete = true;
			} else if (typeof ga != 'undefined') {
				if(isMXP){
					ga('mxpGATracker.send', eventData.type, instanceVars.ga.trackingvars);
				} else {
					ga('send', eventData.type, instanceVars.ga.trackingvars);
				}

				gaFound = true;
				trackingComplete = true;
			}

			attempt++;

			if (!gaFound && attempt <250) {
				setTimeout(track, 1);
			} else {
				trackingComplete = true;
			}

		}

		if(isMXP){
			var trackingID = data.contentid + data.objectid;

			if(typeof Mura.trackingMetadata[trackingID] != 'undefined'){
				Mura.deepExtend(instanceVars,Mura.trackingMetadata[trackingID]);
				instanceVars.eventData=eventData;
				track();
			} else {
				Mura.get(Mura.getAPIEndpoint(), {
					method: 'findTrackingProps',
					siteid: Mura.siteid,
					contentid: eventData.contentid,
					objectid: eventData.objectid
				}).then(function(response) {
					Mura.deepExtend(instanceVars,response.data);
					instanceVars.eventData=data;

					for(var p in instanceVars.ga.trackingvars){
						if(instanceVars.ga.trackingvars.hasOwnProperty(p) && p.substring(0,1)=='d' && typeof instanceVars.ga.trackingvars[p] != 'string'){
							instanceVars.ga.trackingvars[p]=new String( instanceVars.ga.trackingvars[p]);
						}
					}

					Mura.trackingMetadata[trackingID]={};
					Mura.deepExtend(Mura.trackingMetadata[trackingID],response.data);
					track();
				});
			}
		} else {
			track();
		}

		return new Promise(function(resolve, reject) {

			resolve = resolve || function() {};

			function checkComplete() {
				if (trackingComplete) {
					resolve();
					} else {
					setTimeout(checkComplete, 1);
				}
			}

			checkComplete();

			});

		}

	/**
	* renderFilename - Returns "Rendered" JSON object of content
	*
	* @param	{type} filename Mura content filename
	* @param	{type} params Object
	* @return {Promise}
	* @memberof {class} Mura
	*/
	function renderFilename(filename, params) {
		return Mura.getRequestContext().renderFilename(filename, params);
	}

	/**
	 * declareEntity - Declare Entity with in service factory
	 *
	 * @param	{object} entityConfig Entity config object
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function declareEntity(entityConfig) {
		return Mura.getRequestContext().declareEntity(entityConfig);
	}

	/**
	 * undeclareEntity - Deletes entity class from Mura
	 *
	 * @param	{object} entityName
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function undeclareEntity(entityName,deleteSchema) {
		deleteSchema=deleteSchema || false;
		return Mura.getRequestContext().undeclareEntity(entityName,deleteSchema);
	}

	/**
	 * openGate - Open's content gate when using MXP
	 *
	 * @param	{string} contentid Optional: default's to Mura.contentid
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function openGate(contentid) {
		return Mura.getRequestContext().openGate(contentid);
	}

	/**
	 * getEntity - Returns Mura.Entity instance
	 *
	 * @param	{string} entityname Entity Name
	 * @param	{string} siteid		 Siteid
	 * @return {Mura.Entity}
	 * @memberof {class} Mura
	 */
	function getEntity(entityname, siteid) {
		siteid=siteid || Mura.siteid;
		return Mura.getRequestContext().getEntity(entityname, siteid);
	}

	/**
	 * getFeed - Return new instance of Mura.Feed
	 *
	 * @param	{type} entityname Entity name
	 * @return {Mura.Feed}
	 * @memberof {class} Mura
	 */
	function getFeed(entityname,siteid) {
		siteid=siteid || Mura.siteid;
		return Mura.getRequestContext().getFeed(entityname,siteid);
	}

	/**
	 * getCurrentUser - Return Mura.Entity for current user
	 *
	 * @param	{object} params Load parameters, fields:list of fields
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function getCurrentUser(params) {
		return new Promise(function(resolve, reject) {
			if(Mura.currentUser){
				return resolve(Mura.currentUser);
			} else {
				Mura.getRequestContext().getCurrentUser(params).then(
					function(currentUser){
						Mura.currentUser=currentUser;
						resolve(Mura.currentUser);
					},
					function(currentUser){
						Mura.currentUser=currentUser;
						resolve(Mura.currentUser);
					}
				);
			}
		});
	}

	/**
	 * findText - Return Mura.Collection for content with text
	 *
	 * @param	{object} params Load parameters
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function findText(text,params) {
		return Mura.getRequestContext().findText(text,params);
	}

	/**
	 * findQuery - Returns Mura.EntityCollection with properties that match params
	 *
	 * @param	{object} params Object of matching params
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function findQuery(params) {
		return Mura.getRequestContext().findQuery(params);
	}

	function evalScripts(el) {
		if (typeof el == 'string') {
				el = parseHTML(el);
		}

		var scripts = [];
		var ret = el.childNodes;

		for (var i = 0; ret[i]; i++) {
			if (scripts && nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
				if (ret[i].src) {
					scripts.push(ret[i]);
				} else {
					scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);
				}
			} else if (ret[i].nodeType == 1 || ret[i].nodeType == 9 ||
				ret[i].nodeType == 11) {
				evalScripts(ret[i]);
			}
		}

		for (var $script in scripts) {
			evalScript(scripts[$script]);
		}
	}

	function evalScript(el) {
		if (el.src) {
			Mura.loader().load(el.src);
			Mura(el).remove();
		} else {
			var data = (el.text || el.textContent || el.innerHTML || "");

			var head = document.getElementsByTagName("head")[0] ||
				document.documentElement,
				script = document.createElement("script");
			script.type = "text/javascript";
			//script.appendChild( document.createTextNode( data ) );
			script.text = data;
			head.insertBefore(script, head.firstChild);
			head.removeChild(script);

			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
		}
	}

	function nodeName(el, name) {
		return el.nodeName && el.nodeName.toUpperCase() === name.toUpperCase();
	}

	function changeElementType(el, to) {
		var newEl = document.createElement(to);

		// Try to copy attributes across
		for (var i = 0, a = el.attributes, n = a.length; i < n; ++i)
			el.setAttribute(a[i].name, a[i].value);

		// Try to move children across
		while (el.hasChildNodes())
			newEl.appendChild(el.firstChild);

		// Replace the old element with the new one
		el.parentNode.replaceChild(newEl, el);

		// Return the new element, for good measure.
		return newEl;
	}

	/*
	Defaults to holdReady is true so that everything
	is queued up until the DOMContentLoaded is fired
	*/
	var holdingReady = true;
	var holdingReadyAltered = false;
	var holdingQueueReleased = false;
	var holdingQueue = [];
	var holdingPreInitQueue =[];

	/*
	if(typeof jQuery != 'undefined' && typeof jQuery.holdReady != 'undefined'){
			jQuery.holdReady(true);
	}
	*/

	/*
	When DOMContentLoaded is fired check to see it the
	holdingReady has been altered by custom code.
	If it hasn't then fire holding functions.
	*/
	function initReadyQueue() {
		if (!holdingReadyAltered) {
			/*
			if(typeof jQuery != 'undefined' && typeof jQuery.holdReady != 'undefined'){
					jQuery.holdReady(false);
			}
			*/
			releaseReadyQueue();
		}
	};

	function releaseReadyQueue() {
		holdingQueueReleased = true;
		holdingReady = false;

		holdingQueue.forEach(function(fn) {
			readyInternal(fn);
		});

		holdingQueue=[];
	}

	function holdReady(hold) {
		if (!holdingQueueReleased) {
			holdingReady = hold;
			holdingReadyAltered = true;

			/*
			if(typeof jQuery != 'undefined' && typeof jQuery.holdReady != 'undefined'){
					jQuery.holdReady(hold);
			}
			*/

			if (!holdingReady) {
				releaseReadyQueue();
			}
		}
	}

	function ready(fn) {
		if (!holdingQueueReleased) {
			holdingQueue.push(fn);
		} else {
			readyInternal(fn);
		}
	}


	function readyInternal(fn) {
		if(typeof document != 'undefined'){
		if (document.readyState != 'loading') {
			//IE set the readyState to interative too early
			setTimeout(function() {
				fn(Mura);
			}, 1);
		} else {
			document.addEventListener('DOMContentLoaded', function() {
				fn(Mura);
			});
		}
		} else {
			fn(Mura);
		}
	}

	/**
	 * get - Make GET request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function get(url, data, config) {
		return Mura.getRequestContext().get(url, data, config);
	}

	/**
	 * post - Make POST request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function post(url, data, config) {
		return Mura.getRequestContext().post(url, data, config);
	}

	/**
	 * put - Make PUT request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function put(url, data, config) {
		return Mura.getRequestContext().put(url, data, config);
	}

	/**
	 * update - Make UPDATE request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function patch(url, data, config) {
		return Mura.getRequestContext().patch(url, data, config);
	}

	/**
	 * delete - Make Delete request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function deleteReq(url, data, config) {
		return Mura.getRequestContext().delete(url, data, config)
	}

	/**
	 * ajax - Make ajax request
	 *
	 * @param	{object} params
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function ajax(config) {
		return Mura.getRequestContext().request(config);
	}

	/**
	 * normalizeRequesConfig - Standardizes request handler objects
	 *
	 * @param	{object} config
	 * @memberof {object} config
	 */
	function normalizeRequestConfig(config) {
		/* 
			Moving to native fetch whenever possible for beter next support
			At this point we still use axios for file uploads
		*/
		config.progress=config.progress || config.onProgress || config.onUploadProgress || false;
		config.download=config.download || config.onDownload || config.onDownloadProgress || false;
		config.abort=config.abort || config.onAbort|| function(){};
		config.success=config.success || config.onSuccess || function(){};
		config.error=config.error || config.onError || function(){};
		config.headers=config.headers || {};
		config.type=config.type || 'get';
		config.next=config.next || {};
		config.cache=config.cache || 'default';

		const transformedHeaders = {};
	
		Object.entries(config.headers).forEach(([key, value]) => {
			transformedHeaders[key.toLowerCase()] = value;
		});

		config.headers=transformedHeaders;
		
		if(typeof Mura.maxQueryStringLength != 'undefined'){
			config.maxQueryStringLength=config.maxQueryStringLength || Mura.maxQueryStringLength;
		}

		return config;
	}

	/**
	 * getRequestContext - Returns a new Mura.RequestContext;
	 *
	 * @name getRequestContext
	 * @param	{object} request		 Siteid
	 * @param	{object} response Entity name
	 * @return {Mura.RequestContext}	 Mura.RequestContext
	 * @memberof {class} Mura
	 */
	function getRequestContext(request,response, headers, siteid, endpoint, mode, renderMode) {
		//Logic aded to support single config object arg
		if(typeof request==='object' 
			&& typeof response === 'undefined'){
				var config=request;
				request=config.req;
				response=config.res;
				headers=config.headers;
				siteid=config.siteid;
				endpoint=config.endpoint;
				mode=config.mode;
				renderMode=config.renderMode
		} else {
			if(typeof headers=='string'){
				var originalSiteid=siteid;
				siteid=headers;
				if(typeof originalSiteid==='object'){
					headers=originalSiteid;
				} else {
					headers={};
				}	
			}
		}

		if(typeof headers==='object'){
			for( let h in headers){
				if(headers.hasOwnProperty(h)){
					headers[h.toLowerCase()]= headers[h];
				}
			}
		}

		request = request || Mura.request;
		response = response || Mura.response;
		endpoint = endpoint || Mura.getAPIEndpoint();
		mode = mode || Mura.getMode()
		renderMode = (typeof renderMode != 'undefined') ? renderMode : Mura.getRenderMode()
		return new Mura.RequestContext(request,response, headers, siteid, endpoint, mode, renderMode);
	}

	/**
	 * getDefaultRequestContext - Returns the default Mura.RequestContext;
	 *
	 * @name getDefaultRequestContext
	 * @return {Mura.RequestContext}	 Mura.RequestContext
	 * @memberof {class} Mura
	 */
	function getDefaultRequestContext() {
		return	Mura.getRequestContext();
	}

	/**
	 * generateOAuthToken - Generate Outh toke for REST API
	 *
	 * @param	{string} grant_type	Grant type (Use client_credentials)
	 * @param	{type} client_id		 Client ID
	 * @param	{type} client_secret Secret Key
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	function generateOAuthToken(grant_type, client_id, client_secret) {
			return new Promise(function(resolve, reject) {
				get(Mura.getAPIEndpoint().replace('/json/', '/rest/') + 'oauth?grant_type=' +
					encodeURIComponent(grant_type) + '&client_id=' + encodeURIComponent(client_id) + '&client_secret=' +
					encodeURIComponent(client_secret),
					{
						cache: 'no-cache'
					}).then(
					function(resp) {
						if (resp.data != 'undefined') {
							resolve(resp.data);
						} else {
							if (typeof resp.error != 'undefined' && typeof reject == 'function') {
								reject(resp);
							} else {
								resolve(resp);
							}
						}
					}
				)
			});
	}

	function each(selector, fn) {
		select(selector).each(fn);
	}

	function on(el, eventName, fn) {
		if (eventName == 'ready') {
			Mura.ready(fn);
		} else {
			if (typeof el.addEventListener == 'function') {
				el.addEventListener(
					eventName,
					function(event) {
						if(typeof fn.call == 'undefined'){
							fn(event);
						} else {
							fn.call(el, event);
						}
					},
					true
				);
			}
		}
	}

	function trigger(el, eventName, eventDetail) {
		if(typeof document != 'undefined'){
			var bubbles = eventName == "change" ? false : true;
			if (document.createEvent) {
				if(eventDetail && !isEmptyObject(eventDetail)){
					var event = document.createEvent('CustomEvent');
					event.initCustomEvent(eventName, bubbles, true,eventDetail);
				} else {

					var eventClass = "";

					switch (eventName) {
						case "click":
						case "mousedown":
						case "mouseup":
							eventClass = "MouseEvents";
							break;

						case "focus":
						case "change":
						case "blur":
						case "select":
							eventClass = "HTMLEvents";
							break;

						default:
							eventClass = "Event";
							break;
					}

					var event = document.createEvent(eventClass);
					event.initEvent(eventName, bubbles, true);
				}

				event.synthetic = true;
				el.dispatchEvent(event);

			} else {
					try {
							document.fireEvent("on" + eventName);
					} catch (e) {
							console.warn(
									"Event failed to fire due to legacy browser: on" +
									eventName);
					}
			}
		}
	};

	function off(el, eventName, fn) {
		el.removeEventListener(eventName, fn);
	}

	function parseSelection(selector) {
		if (typeof selector == 'object' && Array.isArray(selector)) {
			var selection = selector;
		} else if (typeof selector == 'string') {
			var selection = nodeListToArray(document.querySelectorAll(selector));
		} else {
			if ( (typeof StaticNodeList != 'undefined' && selector instanceof StaticNodeList) ||
				(typeof NodeList != 'undefined' && selector instanceof NodeList) || (typeof HTMLCollection != 'undefined' &&	selector instanceof HTMLCollection)
			) {
				var selection = nodeListToArray(selector);
			} else {
				var selection = [selector];
			}
		}

		if (typeof selection.length == 'undefined') {
			selection = [];
		}

		return selection;
	}

	function isEmptyObject(obj) {
		return (typeof obj != 'object' || Object.keys(obj).length == 0);
	}

	function filter(selector, fn) {
		return select(parseSelection(selector)).filter(fn);
	}

	function nodeListToArray(nodeList) {
		var arr = [];
		for (var i = nodeList.length; i--; arr.unshift(nodeList[i]));
		return arr;
	}

	function select(selector) {
		return new Mura.DOMSelection(parseSelection(selector),selector);
	}

	function escapeHTML(str) {
		if(typeof document != 'undefined'){
			var div = document.createElement('div');
			div.appendChild(document.createTextNode(str));
			return div.innerHTML;
		} else {
			return Mura._escapeHTML(str);
		}
	};

	// UNSAFE with unsafe strings; only use on previously-escaped ones!
	function unescapeHTML(escapedStr) {
		var div = document.createElement('div');
		div.innerHTML = escapedStr;
		var child = div.childNodes[0];
		return child ? child.nodeValue : '';
	};

	function parseHTML(str) {
		var tmp = document.implementation.createHTMLDocument();
		tmp.body.innerHTML = str;
		return tmp.body.children;
	};

	function parseStringAsTemplate(stringValue){
		const errors={};
		let parsedString=stringValue;
		let doLoop=true;

		do {
			const finder=/(\${)(.+?)(})/.exec(parsedString)
			if(finder){
				let template;
				try {
					template=eval('`${' + finder[2] + '}`');
				} catch(e){
					console.log('error parsing string template: ' + '${' + finder[2] + '}',e);
					template='[error]' + finder[2] + '[/error]';
				}
				parsedString=parsedString.replace(finder[0],template);
			} else {
				doLoop=false;
			}
		} while (doLoop)

		parsedString=parsedString.replace('[error]','${');
		parsedString=parsedString.replace('[/error]','}');

		return parsedString;
	}

	function getData(el) {
		var data = {};
		Array.prototype.forEach.call(el.attributes, function(attr) {
			if (/^data-/.test(attr.name)) {
				data[attr.name.substr(5)] = parseString(attr.value);
			}
		});

		return data;
	}

	function getProps(el) {
		return getData(el);
	}


	/**
	 * isNumeric - Returns if the value is numeric
	 *
	 * @name isNumeric
	 * @param	{*} val description
	 * @return {boolean}
	 * @memberof {class} Mura
	 */
	function isNumeric(val) {
			return Number(parseFloat(val)) == val;
	}

	/**
	* buildDisplayRegion - Renders display region data returned from Mura.renderFilename()
	*
	* @param	{any} data Region data to build string from
	* @return {string}
	*/
	function buildDisplayRegion(data){

		if(typeof data == 'undefined'){
			return '';
		}

		var str = "<div class=\"mura-region\" data-regionid=\"" +  escapeHTML(data.regionid) + "\">";

		function buildItemHeader(data){
			var classes=data.class || '';
			var header="<div class=\"mura-object " + escapeHTML(classes) + "\"";
			for(var p in data){
				if(data.hasOwnProperty(p)){
					if(typeof data[p] == 'object'){
						header+=" data-" + p + "=\'" +  escapeHTML(JSON.stringify(data[p]).replace(/'/g,"&#39;")) + "\'";
					} else {
						header+=" data-" + p + "=\"" + escapeHTML(data[p]).replace(/"/g, "&quot;") + "\"";
					}
				}
			}

			header +=">";
			return header;
		}

		function buildRegionSectionHeader(section,name,perm,regionid){
			if(name){ 
				if(section=='inherited'){
					return "<div class=\"mura-region-inherited\"><div class=\"frontEndToolsModal mura\"><span class=\"mura-edit-label mi-lock\">" +  escapeHTML(name.toUpperCase()) + ": Inherited</span></div>";
				} else {
					return "<div class=\"mura-editable mura-inactive\"><div class=\"mura-region-local mura-inactive mura-editable-attribute\" data-loose=\"false\" data-regionid=\"" + escapeHTML(regionid) + "\" data-inited=\"false\" data-perm=\"" + escapeHTML(perm) + "\"><label class=\"mura-editable-label\" style=\"display:none\">" +  escapeHTML(name.toUpperCase()) + "</label>";
				}
			} else {
				return "<div class=\"mura-region-" + escapeHTML(section) + "\">";	
			}
		}

		if(data.inherited.items.length){
			if(data.inherited.header){
				str += data.inherited.header;
			} else {
				str += buildRegionSectionHeader('inherited',data.name,data.inherited.perm,data.regionid);
			}
			
			for(var i in data.inherited.items){
				if(data.inherited.items[i].header){
					str += data.inherited.items[i].header;
				} else {
					str += buildItemHeader(data.inherited.items[i]);
				}
				if(typeof data.inherited.items[i].html != 'undefined' && data.inherited.items[i].html){
					str += data.inherited.items[i].html;
				}
				if(data.inherited.items[i].footer){
					str += data.inherited.items[i].footer;
				} else {
					str += "</div>"
				}
			}
		
			str += "</div>";
			
		}

		if(data.local.header){
			str += data.local.header;
		} else {
			str += buildRegionSectionHeader('local',data.name,data.local.perm,data.regionid);
		}

		if(data.local.items.length){
			for(var i in data.local.items){
				if(data.local.items[i].header){
					str += data.local.items[i].header;
				} else {
					str += buildItemHeader(data.local.items[i]);
				}
				if(typeof data.local.items[i].html != 'undefined' && data.local.items[i].html){
					str += data.local.items[i].html;
				}
				if(data.local.items[i].footer){
					str += data.local.items[i].footer;
				} else {
					str += '</div>'
				}
			}
		}
		//when editing the region header contains two divs
		if(data.name){
			str += "</div></div>";
		} else {
			str += "</div>";
		}

		str += "</div>";

		return str;
	}

	function parseString(val) {
			if (typeof val == 'string') {
				var lcaseVal = val.toLowerCase();

				if (lcaseVal == 'false') {
					return false;
				} else if (lcaseVal == 'true') {
					return true;
				} else {
					if (!(typeof val == 'string' && val.length == 35) &&
						isNumeric(val)) {
						var numVal = parseFloat(val);
						if (numVal == 0 || !isNaN(1 / numVal)) {
							return numVal;
						}
					}
					
					try {
						var testVal = JSON.parse.call(null,val);
						if(typeof testVal != 'string'){
							return testVal;
						} else {
							return val;
						}
					} catch (e) {
						return val;
					}
				}
			} else {
				return val;
			}

	}

	function getAttributes(el) {
			var data = {};
			Array.prototype.forEach.call(el.attributes, function(attr) {
				data[attr.name] = attr.value;
			});

			return data;
	}

	/**
	 * formToObject - Returns if the value is numeric
	 *
	 * @name formToObject
	 * @param	{form} form Form to serialize
	 * @return {object}
	 * @memberof {class} Mura
	 */
	function formToObject(form) {
		var field, s = {};
		if (typeof form == 'object' && form.nodeName == "FORM") {
			var len = form.elements.length;
			for (var i = 0; i < len; i++) {
				field = form.elements[i];
				if (field.name && !field.disabled && field.type !=
					'file' && field.type != 'reset' && field.type !=
					'submit' && field.type != 'button') {
					if (field.type == 'select-multiple') {
						var val=[];
						for (var j = form.elements[i].options.length - 1; j >= 0; j--) {
							if (field.options[j].selected){
								val.push(field.options[j].value);
							}
						}
						s[field.name]=val.join(",");
					} else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
						if (typeof s[field.name] == 'undefined') {
							s[field.name] = field.value;
						} else {
							s[field.name] = s[field.name] + ',' + field.value;
						}

					}
				}
			}
		}
		return s;
	}

	//http://youmightnotneedjquery.com/
	/**
	 * extend - Extends object one level
	 *
	 * @name extend
	 * @return {object}
	 * @memberof {class} Mura
	 */
	function extend(out) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i])
				continue;

			for (var key in arguments[i]) {
				if (key != '__proto__' && typeof arguments[i].hasOwnProperty != 'undefined' && arguments[i].hasOwnProperty(key) )
					out[key] = arguments[i][key];
			}
		}

		return out;
	};

	/**
	 * deepExtend - Extends object to full depth
	 *
	 * @name deepExtend
	 * @return {object}
	 * @memberof {class} Mura
	 */
	function deepExtend(out) {
		out = out || {};

		for (var i = 1; i < arguments.length; i++) {
			var obj = arguments[i];

			if (!obj)
				continue;

			for (var key in obj) {
				if ( key != '__proto__' && typeof arguments[i].hasOwnProperty != 'undefined' && arguments[i].hasOwnProperty(key) ) {
					if (Array.isArray(obj[key])) {
						out[key] = obj[key].slice(0);
					} else if (typeof obj[key] === 'object') {
						out[key] = deepExtend({}, obj[key]);
					} else {
						out[key] = obj[key];
					}
				}
			}
		}

		return out;
	}


	/**
	 * createCookie - Creates cookie
	 *
	 * @name createCookie
	 * @param	{string} name	Name
	 * @param	{*} value Value
	 * @param	{number} days	Days
	 * @return {void}
	 * @memberof {class} Mura
	 */
		function createCookie(name, value, days, domain) {
		if(days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		} else {
			var expires = "";
		}
		if(typeof location != 'undefined' && location.protocol == 'https:'){
			var secure='; secure; samesite=None;';
		} else {
			var secure='';
		}

		if(typeof domain != 'undefined'){
			domain='; domain=' + domain;
		} else {
			domain='';
		}
		document.cookie = name + "=" + value + expires + "; path=/" + secure + domain;
	}

	/**
	 * readCookie - Reads cookie value
	 *
	 * @name readCookie
	 * @param	{string} name Name
	 * @return {*}
	 * @memberof {class} Mura
	 */
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return unescape(c.substring(
				nameEQ.length, c.length));
		}
		return "";
	}

	/**
	 * eraseCookie - Removes cookie value
	 *
	 * @name eraseCookie
	 * @param	{type} name description
	 * @return {type}			description
	 * @memberof {class} Mura
	 */
	function eraseCookie(name) {
		createCookie(name, "", -1);
	}

	function $escape(value) {
		if (typeof encodeURIComponent != 'undefined') {
			return encodeURIComponent(value)
		} else {
			return escape(value).replace(
				new RegExp("\\+", "g"),
				"%2B"
			).replace(/[\x00-\x1F\x7F-\x9F]/g, "");
		}
	}

	function $unescape(value) {
		return unescape(value);
	}

	//deprecated
	function addLoadEvent(func) {
		var oldonload = onload;
		if (typeof onload != 'function') {
			onload = func;
		} else {
			onload = function() {
				oldonload();
				func();
			}
		}
	}

	function noSpam(user, domain) {
		locationstring = "mailto:" + user + "@" + domain;
		location = locationstring;
	}

	/**
	 * isUUID - description
	 *
	 * @name isUUID
	 * @param	{*} value Value
	 * @return {boolean}
	 * @memberof {class} Mura
	 */
	function isUUID(value) {
		if (
			typeof value == 'string' &&
			(
					value.length == 35 && value[8] == '-' && value[13] ==
					'-' && value[18] == '-' || value ==
					'00000000000000000000000000000000001' || value ==
					'00000000000000000000000000000000000' || value ==
					'00000000000000000000000000000000003' || value ==
					'00000000000000000000000000000000005' || value ==
					'00000000000000000000000000000000099'
			)
		) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * createUUID - Create UUID
	 *
	 * @name createUUID
	 * @return {string}
	 * @memberof {class} Mura
	 */
	function createUUID() {
		var s = [], itoh = '0123456789ABCDEF';

		// Make array of random hex digits. The UUID only has 32 digits in it, but we
		// allocate an extra items to make room for the '-'s we'll be inserting.
		for (var i = 0; i < 35; i++) s[i] = Math.floor(Math.random() * 0x10);

		// Conform to RFC-4122, section 4.4
		s[14] = 4; // Set 4 high bits of time_high field to version
		s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence

		// Convert to hex chars
		for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

		// Insert '-'s
		s[8] = s[13] = s[18] = '-';

		return s.join('');
	}

	/**
	 * setHTMLEditor - Set Html Editor
	 *
	 * @name setHTMLEditor
	 * @param	{dom.element} el Dom Element
	 * @return {void}
	 * @memberof {class} Mura
	 */
	function setHTMLEditor(el) {

		function initEditor() {
			var instance = CKEDITOR.instances[el.getAttribute('id')];
			var conf = {
				height: 200,
				width: '70%'
			};

			extend(conf, Mura(el).data());

			if (instance) {
				instance.destroy();
				CKEDITOR.remove(instance);
			}

			CKEDITOR.replace(el.getAttribute('id'), getHTMLEditorConfig(conf), htmlEditorOnComplete);
		}

		function htmlEditorOnComplete(editorInstance) {
			editorInstance.resetDirty();
			var totalIntances = CKEDITOR.instances;
		}

		function getHTMLEditorConfig(customConfig) {
			var attrname = '';
			var htmlEditorConfig = {
				toolbar: 'htmlEditor',
				customConfig: 'config.js.cfm'
			}

			if (typeof(customConfig) == 'object') {
				extend(htmlEditorConfig, customConfig);
			}

			return htmlEditorConfig;
		}

		loader().loadjs(
			Mura.corepath + '/vendor/ckeditor/ckeditor.js',
			function() {
				initEditor();
			}
	);

	}

	var commandKeyActive=false;

	var keyCmdCheck = function(event) {	
		switch(event.which){
			case 17: //ctrl
			case 27: //escape
			case 91: //cmd
				commandKeyActive=event.which;
				break;
			case 69:
				if (commandKeyActive) {
					event.preventDefault();
					Mura.editroute = Mura.editroute || "/";
					var inEditRoute=typeof location.pathname.startsWith !='undefined' && location.pathname.startsWith(Mura.editroute);
					if(inEditRoute && typeof MuraInlineEditor != 'undefined'){
						MuraInlineEditor.init();
					} else {
						var params=getQueryStringParams(location.search);
						if(typeof params.editlayout == 'undefined'){
							Mura.editroute=Mura.editroute || '';
							if(Mura.editroute){
								if(inEditRoute){
									if(typeof params.previewid != 'undefined'){
										location.href=Mura.editroute + location.pathname + "?previewid=" + params.previewid;
									}
								} else {
									if(typeof params.previewid != 'undefined'){
										location.href=Mura.editroute + location.pathname + "?previewid=" + params.previewid;
									} else {
										location.href=Mura.editroute + location.pathname ;
									}
								}
								
								
							}
						}
					}
				}
				break;

			case 76:
				if (commandKeyActive) {
					event.preventDefault();
					var params=getQueryStringParams(location.search);
					if(params.display != 'login'){
						var lu = '';
						var ru = '';
			
						if (typeof(Mura.loginURL) != "undefined") {
							lu = Mura.loginURL;
						} else if (typeof(Mura.loginurl) != "undefined") {
							lu = Mura.loginurl;
						} else {
							lu = "?display=login";
						}
						if (typeof(Mura.returnURL) != "undefined") {
							ru = Mura.returnURL;
						} else if (typeof(Mura.returnurl) != "undefined") {
							ru = Mura.returnurl;
						} else {
							ru = location.href;
						}
						lu = new String(lu);
						if (lu.indexOf('?') != -1) {
							location.href = lu + "&returnUrl=" + encodeURIComponent(ru);
						} else {
							location.href = lu + "?returnUrl=" + encodeURIComponent(ru);
						}
					}
				}
				break;
			default:
				commandKeyActive=false;
				break;
		}
		
	}

	/**
	 * isInteger - Returns if the value is an integer
	 *
	 * @name isInteger
	 * @param	{*} Value to check
	 * @return {boolean}
	 * @memberof {class} Mura
	 */
	function isInteger(s) {
		var i;
		for (i = 0; i < s.length; i++) {
			// Check that current character is number.
			var c = s.charAt(i);
			if (((c < "0") || (c > "9"))) return false;
		}
		// All characters are numbers.
		return true;
	}

	function createDate(str) {

		var valueArray = str.split("/");

		var mon = valueArray[0];
		var dt = valueArray[1];
		var yr = valueArray[2];

		var date = new Date(yr, mon - 1, dt);

		if (!isNaN(date.getMonth())) {
			return date;
		} else {
			return new Date();
		}

	}

	function dateToString(date) {
		var mon = date.getMonth() + 1;
		var dt = date.getDate();
		var yr = date.getFullYear();

		if (mon < 10) {
				mon = "0" + mon;
		}
		if (dt < 10) {
				dt = "0" + dt;
		}


		return mon + "/" + dt + "/20" + new String(yr).substring(2, 4);
	}


	function stripCharsInBag(s, bag) {
		var i;
		var returnString = "";
		// Search through string's characters one by one.
		// If character is not in bag, append to returnString.
		for (i = 0; i < s.length; i++) {
			var c = s.charAt(i);
			if (bag.indexOf(c) == -1) returnString += c;
		}
		return returnString;
	}

	function daysInFebruary(year) {
		// February has 29 days in any year evenly divisible by four,
		// EXCEPT for centurial years which are not also divisible by 400.
		return (((year % 4 == 0) && ((!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28);
	}

	function DaysArray(n) {
		for (var i = 1; i <= n; i++) {
			this[i] = 31
			if (i == 4 || i == 6 || i == 9 || i == 11) {
				this[i] = 30
			}
			if (i == 2) {
				this[i] = 29
			}
		}
		return this
	}

	/**
	 * generateDateFormat - dateformt for input type="date"
	 *
	 * @name generateDateFormat
	 * @return {string}
	 */
		function generateDateFormat(dtStr, fldName) {
			var formatArray=['mm','dd','yyyy'];

			return [
				formatArray[Mura.dtformat[0]],
				formatArray[Mura.dtformat[1]],
				formatArray[Mura.dtformat[2]]
			].join(Mura.dtch);

		}

	/**
	 * isDate - Returns if the value is a data
	 *
	 * @name isDate
	 * @param	{*}	Value to check
	 * @return {boolean}
	 * @memberof {class} Mura
	 */
	function isDate(dtStr, fldName) {
		var daysInMonth = DaysArray(12);
		var dtArray = dtStr.split(Mura.dtch);

		if (dtArray.length != 3) {
			//alert("The date format for the "+fldName+" field should be : short")
			return false
		}
		var strMonth = dtArray[Mura.dtformat[0]];
		var strDay = dtArray[Mura.dtformat[1]];
		var strYear = dtArray[Mura.dtformat[2]];

		/*
		if(strYear.length == 2){
			strYear="20" + strYear;
		}
		*/
		strYr = strYear;

		if (strDay.charAt(0) == "0" && strDay.length > 1) strDay = strDay.substring(1)
		if (strMonth.charAt(0) == "0" && strMonth.length > 1) strMonth = strMonth.substring(1)
		for (var i = 1; i <= 3; i++) {
			if (strYr.charAt(0) == "0" && strYr.length > 1) strYr = strYr.substring(1)
		}

		month = parseInt(strMonth)
		day = parseInt(strDay)
		year = parseInt(strYr)

		if (month < 1 || month > 12) {
			//alert("Please enter a valid month in the "+fldName+" field")
			return false
		}
		if (day < 1 || day > 31 || (month == 2 && day > daysInFebruary(year)) || day > daysInMonth[month]) {
			//alert("Please enter a valid day	in the "+fldName+" field")
			return false
		}
		if (strYear.length != 4 || year == 0 || year < Mura.minYear || year > Mura.maxYear) {
			//alert("Please enter a valid 4 digit year between "+Mura.minYear+" and "+Mura.maxYear +" in the "+fldName+" field")
			return false
		}
		if (isInteger(stripCharsInBag(dtStr, Mura.dtch)) == false) {
			//alert("Please enter a valid date in the "+fldName+" field")
			return false
		}

		return true;
	}

	/**
	 * isEmail - Returns if value is valid email
	 *
	 * @param	{string} str String to parse for email
	 * @return {boolean}
	 * @memberof {class} Mura
	 */
	function isEmail(e) {
		return /^[a-zA-Z_0-9-'\+~]+(\.[a-zA-Z_0-9-'\+~]+)*@([a-zA-Z_0-9-]+\.)+[a-zA-Z]{2,8}$/.test(e);
	}

	function initShadowBox(el) {
		if(typeof window =='undefined' || typeof window.document == 'undefined'){
			return;
		};

		if (Mura(el).find('[data-rel^="shadowbox"],[rel^="shadowbox"]').length) {
			loader().load(
				[
					Mura.context + '/core/modules/v1/core_assets/css/shadowbox.min.css',
					Mura.context + '/core/modules/v1/core_assets/js/shadowbox.js'
				],
				function() {
					Mura('#shadowbox_overlay,#shadowbox_container').remove();
					window.Shadowbox.init();
					}
			);
		}
	}

	/**
	 * validateForm - Validates Mura form
	 *
	 * @name validateForm
	 * @param	{type} frm					Form element to validate
	 * @param	{function} customaction Custom action (optional)
	 * @return {boolean}
	 * @memberof {class} Mura
	 */
	function validateForm(frm, customaction) {

		function getValidationFieldName(theField) {
			if (theField.getAttribute('data-label') != undefined) {
				return theField.getAttribute('data-label');
			} else if (theField.getAttribute('label') != undefined) {
				return theField.getAttribute('label');
			} else {
				return theField.getAttribute('name');
			}
		}

		function getValidationIsRequired(theField) {
			if (theField.getAttribute('data-required') != undefined) {
				return (theField.getAttribute('data-required').toLowerCase() == 'true');
			} else if (theField.getAttribute('required') != undefined) {
				return (theField.getAttribute('required').toLowerCase() == 'true');
			} else {
				return false;
			}
		}

		function getValidationMessage(theField, defaultMessage) {
			if (theField.getAttribute('data-message') != undefined) {
				return theField.getAttribute('data-message');
			} else if (theField.getAttribute('message') != undefined) {
				return theField.getAttribute('message');
			} else {
				return getValidationFieldName(theField).toUpperCase() + defaultMessage;
			}
		}

		function getValidationType(theField) {
			if (theField.getAttribute('data-validate') != undefined) {
				return theField.getAttribute('data-validate').toUpperCase();
			} else if (theField.getAttribute('validate') != undefined) {
				return theField.getAttribute('validate').toUpperCase();
			} else {
				return '';
			}
		}

		function hasValidationMatchField(theField) {
			if (theField.getAttribute('data-matchfield') != undefined &&
				theField.getAttribute('data-matchfield') != '') {
				return true;
			} else if (theField.getAttribute('matchfield') != undefined &&
				theField.getAttribute('matchfield') != '') {
				return true;
			} else {
				return false;
			}
		}

		function getValidationMatchField(theField) {
			if (theField.getAttribute('data-matchfield') != undefined) {
				return theField.getAttribute('data-matchfield');
			} else if (theField.getAttribute('matchfield') != undefined) {
				return theField.getAttribute('matchfield');
			} else {
				return '';
			}
		}

		function hasValidationRegex(theField) {
			if (theField.value != undefined) {
				if (theField.getAttribute('data-regex') != undefined &&
					theField.getAttribute('data-regex') != '') {
					return true;
				} else if (theField.getAttribute('regex') != undefined &&
					theField.getAttribute('regex') != '') {
					return true;
				}
			} else {
				return false;
			}
		}

		function getValidationRegex(theField) {
				if (theField.getAttribute('data-regex') != undefined) {
						return theField.getAttribute('data-regex');
				} else if (theField.getAttribute('regex') != undefined) {
						return theField.getAttribute('regex');
				} else {
						return '';
				}
		}

		var theForm = frm;
		var errors = "";
		var setFocus = 0;
		var started = false;
		var startAt;
		var firstErrorNode;
		var validationType = '';
		var validations = {
				properties: {}
		};
		var frmInputs = theForm.getElementsByTagName("input");
		var rules = new Array();
		var data = {};
		var $customaction = customaction;

		for (var f = 0; f < frmInputs.length; f++) {
			var theField = frmInputs[f];
			validationType = getValidationType(theField).toUpperCase();

			rules = new Array();

			if (theField.style.display == "") {
				if (getValidationIsRequired(theField)) {
					rules.push({
						required: true,
						message: getValidationMessage(theField,
								' is required.')
					});
				}
				if (validationType != '') {
					if (validationType == 'EMAIL' && theField.value != 	'') {
						rules.push({
							dataType: 'EMAIL',
							message: getValidationMessage(
									theField,
									' must be a valid email address.'
							)
						});
					} else if (validationType == 'NUMERIC' && theField.value !=
						'') {
						rules.push({
								dataType: 'NUMERIC',
								message: getValidationMessage(
										theField,
										' must be numeric.')
						});
					} else if (validationType == 'REGEX' && theField.value != '' && hasValidationRegex(theField)) {
						rules.push({
							regex: getValidationRegex(theField),
							message: getValidationMessage(
									theField, ' is not valid.')
						});
					} else if (validationType == 'MATCH' &&
						hasValidationMatchField(theField) && theField.value !=
						theForm[getValidationMatchField(theField)].value
					) {
						rules.push({
							eq: theForm[getValidationMatchField(theField)].value,
							message: getValidationMessage(
								theField, ' must match' +
								getValidationMatchField(
										theField) + '.')
						});
					} else if (validationType == 'DATE' && theField.value != '') {
						rules.push({
							dataType: 'DATE',
							message: getValidationMessage(
								theField,
								' must be a valid date [MM/DD/YYYY].'
							)
						});
					}
				}

				if (rules.length) {
					validations.properties[theField.getAttribute('name')] = rules;

					//if(!Array.isArray(data[theField.getAttribute('name')])){
						data[theField.getAttribute('name')]=[];
					//}

					for (var v = 0; v < frmInputs.length; v++) {
						if(frmInputs[v].getAttribute('name')==theField.getAttribute('name')){
							if(frmInputs[v].getAttribute('type').toLowerCase()=='checkbox'
								|| frmInputs[v].getAttribute('type').toLowerCase()=='radio'
							) {

								if(frmInputs[v].checked){
										data[theField.getAttribute('name')].push(frmInputs[v].value);
								}

							} else if(typeof frmInputs[v].value != 'undefined' && frmInputs[v].value != '') {
								data[theField.getAttribute('name')].push(frmInputs[v].value)
							}
						}
					}
				}
			}
		}

		for(var p in data){
			if(data.hasOwnProperty(p)){
				data[p]=data[p].join();
			}
		}

		var frmTextareas = theForm.getElementsByTagName("textarea");
		for (f = 0; f < frmTextareas.length; f++) {
			theField = frmTextareas[f];
			validationType = getValidationType(theField);

			rules = new Array();

			if (theField.style.display == "" && getValidationIsRequired(theField)) {
				rules.push({
					required: true,
					message: getValidationMessage(theField,' is required.')
				});

			} else if (validationType != '') {
				if (validationType == 'REGEX' && theField.value != '' &&
					hasValidationRegex(theField)) {
					rules.push({
						regex: getValidationRegex(theField),
						message: getValidationMessage(theField,' is not valid.')
					});
				}
			}

			if (rules.length) {
					validations.properties[theField.getAttribute('name')] =
							rules;
					data[theField.getAttribute('name')] = theField.value;
			}
		}

		var frmSelects = theForm.getElementsByTagName("select");
		for (f = 0; f < frmSelects.length; f++) {
			theField = frmSelects[f];
			validationType = getValidationType(theField);

			rules = new Array();

			if (theField.style.display == "" && getValidationIsRequired(theField)) {
				rules.push({
					required: true,
					message: getValidationMessage(theField,' is required.')
				});
			}

			if (rules.length) {
				validations.properties[theField.getAttribute('name')] =	rules;
				data[theField.getAttribute('name')] = theField.value;
			}
		}

		try {
			//alert(JSON.stringify(validations));
			//console.log(data);
			//console.log(validations);
			ajax({
				type: 'post',
				url: Mura.getAPIEndpoint() + '?method=validate',
				data: {
					data: encodeURIComponent(JSON.stringify(data)),
					validations: encodeURIComponent(JSON.stringify(validations)),
					version: 4
				},
				success(resp) {

					data = resp.data;

					if (Object.keys(data).length === 0) {
						if (typeof $customaction ==
							'function') {
							$customaction(theForm);
							return false;
						} else {
							document.createElement('form').submit.call(theForm);
						}
					} else {
							var msg = '';
						for (var e in data) {
							msg = msg + data[e] + '\n';
						}

						alert(msg);
					}
				},
				error(resp) {
					alert(JSON.stringify(resp));
				}

			});
		} catch (err) {
				console.log(err);
		}

		return false;

	}

	function setLowerCaseKeys(obj) {
		for (var key in obj) {
			if (key !== key.toLowerCase()) { // might already be in its lower case version
				obj[key.toLowerCase()] = obj[key] // swap the value to a new lower case key
				delete obj[key] // delete the old key
			}
			if (typeof obj[key.toLowerCase()] == 'object') {
				setLowerCaseKeys(obj[key.toLowerCase()]);
			}
		}

		return (obj);
	}

	function isScrolledIntoView(el) {
		if (typeof window =='undefined' || typeof window.document == 'undefined' || window.innerHeight) {
			true;
		}

		try {
			var elemTop = el.getBoundingClientRect().top;
			var elemBottom = el.getBoundingClientRect().bottom;
		} catch (e) {
			return true;
		}

		var isVisible = elemTop < window.innerHeight && elemBottom >= 0;
		return isVisible;

	}

	/**
	 * loader - Returns Mura.Loader
	 *
	 * @name loader
	 * @return {Mura.Loader}
	 * @memberof {class} Mura
	 */
	function loader() {
		return Mura.ljs;
	}


	var layoutmanagertoolbar =
			'<span class="mura-fetborder mura-fetborder-left"></span><span class="mura-fetborder mura-fetborder-right"></span><span class="mura-fetborder mura-fetborder-top"></span><span class="mura-fetborder mura-fetborder-bottom"></span><div class="frontEndToolsModal mura"><span class="mura-edit-icon"></span><span class="mura-edit-label"></span></div>';

	function processMarkup(scope) {

		return new Promise(function(resolve, reject) {
			if (!(scope instanceof Mura.DOMSelection)) {
				scope = select(scope);
			}

			function find(selector) {
				return scope.find(selector);
			}

			var processors = [

				function(){
					//if layout manager UI exists check for rendered regions and remove them from additional regions
					if(Mura('.mura__layout-manager__display-regions').length){
						find('.mura-region').each(function(el){
							var region=Mura(el);
							if(!region.closest('.mura__layout-manager__display-regions').length){
								Mura('.mura-region__item[data-regionid="' + region.data('regionid') + '"]').remove();
							}
						})

						if(!Mura('.mura__layout-manager__display-regions .mura-region__item').length){
							Mura('#mura-objects-openregions-btn, .mura__layout-manager__display-regions').remove();
						}
					}
				},

				function() {
					find('.mura-object, .mura-async-object')
						.each(function(el) {
							if(scope==document){
								var obj=Mura(el);
								if(!obj.parent().closest('.mura-object').length){
									processDisplayObject(this,
										Mura.queueobjects).then(
										resolve);
								}
							} else {
								processDisplayObject(el,
									Mura.queueobjects).then(
									resolve);
							}
							
						});
				},

				function() {
					find(".htmlEditor").each(function(el) {
						setHTMLEditor(el);
					});
				},

				function() {
					if (find(".cffp_applied,	.cffp_mm, .cffp_kp").length) {
						var fileref = document.createElement('script')
						fileref.setAttribute("type","text/javascript")
						fileref.setAttribute("src", Mura.corepath + '/vendor/cfformprotect/js/cffp.js')

						document.getElementsByTagName("head")[0].appendChild(fileref )
					}
				},

				function() {
					Mura.reCAPTCHALanguage = Mura.reCAPTCHALanguage || 'en';

					if (find(".g-recaptcha-container").length) {
						loader().loadjs("https://www.recaptcha.net/recaptcha/api.js?onload=MuraCheckForReCaptcha&render=explicit&hl=" + Mura.reCAPTCHALanguage,
							function() {
								find(".g-recaptcha-container").each(function(el) {
									var notready=0;;
								
									window.MuraCheckForReCaptcha=function() {
										Mura('.g-recaptcha-container').each(function(){
											var self=this;

											if (
												typeof grecaptcha ==	'object'
												&& typeof grecaptcha.render != 'undefined'
												&&	!self.innerHTML
											) {

												self
													.setAttribute(
														'data-widgetid',
														grecaptcha
														.render(
															self.getAttribute('id'),
															{
																'sitekey': self.getAttribute('data-sitekey'),
																'theme': self.getAttribute('data-theme'),
																'type': self.getAttribute('data-type')
															}
														)
													);
											} else {
												notready++;
											}
										})
											
										if(notready){
											setTimeout(
												function() {
													window.MuraCheckForReCaptcha();
												},
												10
											);
										}
		
									}

									window.MuraCheckForReCaptcha();
								});
							}
						);

					}
				},

				function() {
					if (typeof resizeEditableObject == 'function') {

						scope.closest('.editableObject').each(
						function(el) {
							resizeEditableObject(el);
						});

						find(".editableObject").each(
						function(el) {
							resizeEditableObject(el);
						});

					}
				},

				function() {
					if (Mura.handleObjectClick == 'function') {
						find('.mura-object, .frontEndToolsModal').on('click',Mura.handleObjectClick);
					}
					
					if (typeof window !='undefined' && typeof window.document != 'undefined'	&& window.MuraInlineEditor
							&& window.MuraInlineEditor.checkforImageCroppers) {
							find("img").each(function(el) {
									window.muraInlineEditor.checkforImageCroppers(
										el);
							});

					}

				},

				function() {
					initShadowBox(scope.node);
				}
			];


			for (var h = 0; h < processors.length; h++) {
				processors[h]();
			}

		});

	}

	function addEventHandler(eventName, fn) {
		if (typeof eventName == 'object') {
			for (var h in eventName) {
				if(eventName.hasOwnProperty(h)){
					on(document, h, eventName[h]);
				}
			}
		} else {
			on(document, eventName, fn);
		}
	}


	function submitForm(frm, obj) {
		frm = (frm.node) ? frm.node : frm;

		if (obj) {
			obj = (obj.node) ? obj : Mura(obj);
		} else {
			obj = Mura(frm).closest('.mura-async-object');
		}

		if (!obj.length) {
			Mura(frm).trigger('formSubmit', formToObject(frm));
			frm.submit();
		}

		if (frm.getAttribute('enctype') == 'multipart/form-data') {

			var data = new FormData(frm);
			var checkdata = setLowerCaseKeys(formToObject(frm));
			var keys = filterUnwantedParams(
					deepExtend(
						setLowerCaseKeys(obj.data()),
						urlparams,
						{
						siteid: Mura.siteid,
						contentid: Mura.contentid,
						contenthistid: Mura.contenthistid,
						nocache: 1
						}
					)
			);

			if(obj.data('siteid')){
				keys.siteid=obj.data('siteid');
			}

			for (var k in keys) {
				if (!(k in checkdata)) {
					data.append(k, keys[k]);
				}
			}

			if ('objectparams' in checkdata) {
				data.append('objectparams2', encodeURIComponent(JSON.stringify(obj.data('objectparams'))));
			}

			if ('nocache' in checkdata) {
				data.append('nocache', 1);
			}

			var postconfig = {
				url: Mura.getAPIEndpoint() + '?method=processAsyncObject',
				type: 'POST',
				data: data,
				success(resp) {
					//console.log(data.object,resp)
					setTimeout(function(){handleResponse(obj, resp)},0);
				}
			}

		} else {

			var data = filterUnwantedParams(
				deepExtend(
					setLowerCaseKeys(obj.data()),
					urlparams,
					setLowerCaseKeys(formToObject(frm)),
					{
						siteid: Mura.siteid,
						contentid: Mura.contentid,
						contenthistid: Mura.contenthistid,
						nocache: 1
					}
				));
			
			if(obj.data('siteid')){
				data.siteid=obj.data('siteid');
			}

			if (data.object == 'container' && data.content) {
				delete data.content;
			}

			if (!('g-recaptcha-response' in data)) {
				var reCaptchaCheck = Mura(frm).find("#g-recaptcha-response");

				if (reCaptchaCheck.length && typeof reCaptchaCheck.val() != 'undefined') {
					data['g-recaptcha-response'] = eCaptchaCheck.val();
				}
			}

			if ('objectparams' in data) {
				data['objectparams'] = encodeURIComponent(JSON.stringify(data['objectparams']));
			}

			var postconfig = {
				url: Mura.getAPIEndpoint() + '?method=processAsyncObject',
				type: 'POST',
				data: data,
				success(resp) {
					//console.log(data.object,resp)
					setTimeout(function(){handleResponse(obj, resp)},0);
				}
			}
		}

		var self = obj.node;
		self.prevInnerHTML = self.innerHTML;
		self.prevData = filterUnwantedParams(obj.data());

		if(typeof self.prevData != 'undefined' && typeof self.prevData.preloadermarkup != 'undefined'){
			self.innerHTML = self.prevData.preloadermarkup;
		} else {
			self.innerHTML = Mura.preloadermarkup;
		}

		Mura(frm).trigger('formSubmit', data);

		ajax(postconfig);
	}

	function firstToUpperCase(str) {
		return str.substr(0, 1).toUpperCase() + str.substr(1);
	}

	function firstToLowerCase(str) {
		return str.substr(0, 1).toLowerCase() + str.substr(1);
	}

	function cleanModuleProps(obj){
		if(obj){
			var dataTargets=['runtime','perm','startrow','pagenum','pageidx','nextnid','purgecache','origininstanceid'];
			
			if(typeof obj.removeAttr == 'function'){
				dataTargets.forEach(function(item){
					obj.removeAttr('data-' + item);
				});

				if(obj.hasAttr('data-cachedwithin') && !obj.attr('data-cachedwithin')){
					obj.removeAttr('data-cachedwithin');
				}
			} else {
				dataTargets.forEach(function(item){
					if(typeof obj[item] != 'undefined'){
						delete obj[item];
					}
				});

				delete obj.inited;
			}
		}

		return obj;
	}


	function resetAsyncObject(el,empty) {
		var self = Mura(el);
		
		if(self.data('transient')){
			self.remove();
		} else { 
		
			if(typeof empty =='undefined'){
				empty=true;
			}
			
			cleanModuleProps(self);

			if(empty){
				self.removeAttr('data-inited');
			}
			
			var data=self.data();

			for(var p in data){
				if(data.hasOwnProperty(p) && (typeof p == 'undefined' || data[p] === '')){
					self.removeAttr('data-' + p);
				}
			}
			
			if(typeof Mura.displayObjectInstances[self.data('instanceid')] != 'undefined'){
				Mura.displayObjectInstances[self.data('instanceid')].reset(self,empty);
			}

			if(empty){
				self.html('');
			}
		}
	}

	function processAsyncObject(el,usePreloaderMarkup) {
			var obj = Mura(el);
			if (obj.data('async') === null) {
					obj.data('async', true);
			}

			if(typeof usePreloaderMarkup == 'undefined'){
				usePreloaderMarkup=true;
			}

			return processDisplayObject(obj, false, true,false,usePreloaderMarkup);
	}

	function filterUnwantedParams(params){

		//Strip out unwanted attributes
		var unwanted=['iconclass','objectname','inited','params','stylesupport','cssstyles','metacssstyles','contentcssstyles',
			'cssclass','cssid','metacssclass','metacssid','contentcssclass','contentcssid','transient','draggable','objectspacing','metaspacing',
			'contentspacing'];

		for(var c=0; c<unwanted.length;c++){
			delete params[unwanted[c]];
		}

		return params;
	}

	function destroyDisplayObjects(){
		for (var property in Mura.displayObjectInstances) {
			if (Mura.displayObjectInstances.hasOwnProperty(property)) {
				var obj=Mura.displayObjectInstances[property];
				if(typeof obj.destroy == 'function'){
					obj.destroy();
				}
				delete Mura.displayObjectInstances[property];
			}
		}
	}

	function destroyModules(){
		destroyDisplayObjects();
	}

	function wireUpObject(obj, response, attempt) {

		attempt= attempt || 0;
		attempt++;
		
		obj = (obj.node) ? obj : Mura(obj);
		
		obj.data('inited', true);

		if (response) {
			if (typeof response == 'string') {
				obj.html(trim(response));
			} else if (typeof response.html == 'string' && response.render != 'client') {
				obj.html(trim(response.html));
				if(response.render=='server'){
					obj.data('render','server');
				}
			} else {
				var context = filterUnwantedParams(deepExtend(obj.data(), response));
				var template = obj.data('clienttemplate') || obj.data('object');
				var properNameCheck = firstToUpperCase(template);

				if (typeof Mura.DisplayObject[properNameCheck] != 'undefined') {
					template = properNameCheck;
				}

				if (typeof context.async != 'undefined') {
					obj.data('async', context.async);
				}

				if (typeof context.render != 'undefined') {
					obj.data('render', context.render);
				}

				if (typeof context.rendertemplate != 'undefined') {
					obj.data('rendertemplate', context.rendertemplate);
				}

				if (typeof Mura.DisplayObject[template] != 'undefined') {
					context.html = '';
					if(typeof Mura.displayObjectInstances[obj.data('instanceid')] != 'undefined'){
						Mura.displayObjectInstances[obj.data('instanceid')].destroy();
					}
					obj.html(Mura.templates.content({html:''}));
					obj.prepend(Mura.templates.meta(context));
					context.targetEl = obj.children('.mura-object-content').node;
					Mura.displayObjectInstances[obj.data('instanceid')]=new Mura.DisplayObject[template](context);
					Mura.displayObjectInstances[obj.data('instanceid')].trigger('beforeRender');
					Mura.displayObjectInstances[obj.data('instanceid')].renderClient();
				} else if (typeof Mura.templates[template] !=	'undefined') {
					context.html = '';
					obj.html(Mura.templates.content(context));
					obj.prepend(Mura.templates.meta(context));
					context.targetEl = obj.children('.mura-object-content').node;
					Mura.templates[template](context);
				} else {
					if(attempt < 1000){
						setTimeout(
							function(){
									wireUpObject(obj,response,attempt);
							},
							1
						);
					} else {
						console.log('Missing Client Template for:');
						console.log(obj.data());
					}
				}
			}
		} else {
			var context = filterUnwantedParams(obj.data());
			var template = obj.data('clienttemplate') || obj.data('object');
			var properNameCheck = firstToUpperCase(template);

			if (typeof Mura.DisplayObject[properNameCheck] !=	'undefined') {
				template = properNameCheck;
			}

			if (typeof Mura.DisplayObject[template] == 'function') {
				context.html = '';
				if(typeof Mura.displayObjectInstances[obj.data('instanceid')] != 'undefined'){
					Mura.displayObjectInstances[obj.data('instanceid')].destroy();
				}
				obj.html(Mura.templates.content({html:''}));
				obj.prepend(Mura.templates.meta(context));
				context.targetEl = obj.children('.mura-object-content').node;
				Mura.displayObjectInstances[obj.data('instanceid')]=new Mura.DisplayObject[template](context);
				Mura.displayObjectInstances[obj.data('instanceid')].trigger('beforeRender');
				Mura.displayObjectInstances[obj.data('instanceid')].renderClient();
			} else if (typeof Mura.templates[template] !=	'undefined') {
				context.html = '';
				obj.html(Mura.templates.content(context));
				obj.prepend(Mura.templates.meta(context));
				context.targetEl = obj.children('.mura-object-content').node;
				Mura.templates[template](context);
			} else {
				if(attempt < 1000){
					setTimeout(
						function(){
							wireUpObject(obj,response,attempt);
						},
						1
					);
				} else {
					console.log('Missing Client Template for:');
					console.log(obj.data());
				}
			}
		}

		obj.calculateDisplayObjectStyles();

		obj.hide().show();

		if (Mura.layoutmanager && Mura.editing) {
			if (obj.hasClass('mura-body-object') || obj.is('div.mura-object[data-targetattr]')) {
				obj.children('.frontEndToolsModal').remove();
				obj.prepend(Mura.layoutmanagertoolbar);
				if(obj.data('objectname')){
					obj.children('.frontEndToolsModal').children('.mura-edit-label').html(obj.data('objectname'));
				} else {
					obj.children('.frontEndToolsModal').children('.mura-edit-label').html(Mura.firstToUpperCase(obj.data('object')));
				}
				if(obj.data('objecticonclass')){
					obj.children('.frontEndToolsModal').children('.mura-edit-label').addClass(obj.data('objecticonclass'));
				}

				MuraInlineEditor.setAnchorSaveChecks(obj.node);

				obj.addClass('mura-active')
					.hover(
						Mura.initDraggableObject_hoverin,
						Mura.initDraggableObject_hoverout
					);
			} else {
				//replace this with Mura.initEditableObject.call(obj.node) in future
				function initEditableObject(item){
					var objectParams;
			
					if(item.data('transient')){
						item.remove();
					} else if(
						Mura.type=='Variation'
						&& !(
							item.is('[data-mxpeditable]')
							|| item.closest('.mxp-editable').length
						)
					){
						return;
					}

					item.addClass("mura-active");
			
					if(Mura.type =='Variation'){
						objectParams=item.data();
						item.children('.frontEndToolsModal').remove();
						item.children('.mura-fetborder').remove();
						item.prepend(window.Mura.layoutmanagertoolbar );
						if(item.data('objectname')){
							item.children('.frontEndToolsModal').children('.mura-edit-label').html(item.data('objectname'));
						} else {
							item.children('.frontEndToolsModal').children('.mura-edit-label').html(Mura.firstToUpperCase(item.data('object')));
						}
						if(item.data('objecticonclass')){
							item.children('.frontEndToolsModal').children('.mura-edit-label').addClass(item.data('objecticonclass'));
						}
						item.off("click",Mura.handleObjectClick).on("click",Mura.handleObjectClick);
						item.find("img").each(function(el){MuraInlineEditor.checkforImageCroppers(el);});
						item.find('.mura-object').each(function(el){initEditableObject(Mura(el))});
						Mura.initDraggableObject(item.node);
					} else {
						var lcaseObject=item.data('object');
						if(typeof lcaseObject=='string'){
							lcaseObject=lcaseObject.toLowerCase();
						}
						var region=item.closest('.mura-region-local, div.mura-object[data-object][data-targetattr]');
						if(region.length){              
							if(region.is('.mura-region-local') && region.data('perm') || region.is('div.mura-object[data-object][data-targetattr]')){                 
								objectParams=item.data();
								if(window.MuraInlineEditor.objectHasConfigurator(item) || (!window.Mura.layoutmanager && window.MuraInlineEditor.objectHasEditor(objectParams)) ){
									item.children('.frontEndToolsModal').remove();
									item.children('.mura-fetborder').remove();
									item.prepend(window.Mura.layoutmanagertoolbar);
									if(item.data('objectname')){
										item.children('.frontEndToolsModal').children('.mura-edit-label').html(item.data('objectname'));
									} else {
										item.children('.frontEndToolsModal').children('.mura-edit-label').html(Mura.firstToUpperCase(item.data('object')));
									}
									if(item.data('objecticonclass')){
										item.children('.frontEndToolsModal').children('.mura-edit-label').addClass(item.data('objecticonclass'));
									}
									item.off("click",Mura.handleObjectClick).on("click",Mura.handleObjectClick);
									item.find("img").each(function(el){MuraInlineEditor.checkforImageCroppers(el);});
									item.find('.mura-object').each(function(el){initEditableObject(Mura(el))});
									Mura.initDraggableObject(item.node);

									if(typeof Mura.initPinnedObject =='function'){
										item.find('div.mura-object[data-pinned="true"]').each(function(el){
											Mura.initPinnedObject(el);
										});
									}
								}
							}
			
						} else if (lcaseObject=='form' || lcaseObject=='component'){
							var entity=Mura.getEntity('content');
							var conditionalApply=function(){
								objectParams=item.data();
								if(window.MuraInlineEditor.objectHasConfigurator(item) || (!window.Mura.layoutmanager && window.MuraInlineEditor.objectHasEditor(objectParams)) ){
									item.addClass('mura-active');
									item.hover(
										Mura.initDraggableObject_hoverin,
										Mura.initDraggableObject_hoverout
									);
									item.data('notconfigurable',true);
									item.children('.frontEndToolsModal').remove();
									item.children('.mura-fetborder').remove();
									item.prepend(window.Mura.layoutmanagertoolbar);
									if(item.data('objectname')){
										item.children('.frontEndToolsModal').children('.mura-edit-label').html(item.data('objectname'));
									} else {
										item.children('.frontEndToolsModal').children('.mura-edit-label').html(Mura.firstToUpperCase(item.data('object')));
									}
									if(item.data('objecticonclass')){
										item.children('.frontEndToolsModal').children('.mura-edit-label').addClass(item.data('objecticonclass'));
									}
									item.off("click",Mura.handleObjectClick).on("click",Mura.handleObjectClick);
									item.find("img").each(function(el){MuraInlineEditor.checkforImageCroppers(el);});
									item.find('.mura-object').each(function(el){initEditableObject(Mura(el))});
								}
							}
							
							if(item.data('perm')){
								conditionalApply()
							} else {
								if(Mura.isUUID(item.data('objectid'))){
									entity.loadBy('contentid',item.data('objectid'),{type:lcaseObject}).then(function(bean){
										bean.get('permissions').then(function(permissions){
											if(permissions.get('save')){
												item.data('perm',true);
												conditionalApply()
											}
										});
									});
								} else {
									entity.loadBy('title',item.data('objectid'),{type:lcaseObject}).then(function(bean){
										bean.get('permissions').then(function(permissions){
											if(permissions.get('save')){
												item.data('perm',true);
												conditionalApply()
											}
										});
									});
								}
							}
			
						}
			
					}
				}
				initEditableObject(obj);
			}
		}

		obj.hide().show();
		
		//if(obj.data('object') != 'container' || obj.data('content')){
			processMarkup(obj.node);
		//}

		if(obj.data('object') != 'container'){
			obj.find('a[href="javascript:history.back();"]').each(function(el) {
				Mura(el).off("click").on("click", function(e) {
					if (obj.node.prevInnerHTML) {
						e.preventDefault();
						wireUpObject(obj, obj.node.prevInnerHTML);

						if (obj.node.prevData) {
							for (var p in obj.node.prevData) {
								select('[name="' + p + '"]').val(obj.node.prevData[p]);
							}
						}
						obj.node.prevInnerHTML = false;
						obj.node.prevData = false;
					}
				});
			});
			
			if(obj.data('render') && obj.data('render').toLowerCase() == 'server'){
				obj.find('form').each(function(el) {
					var form = Mura(el);
					if(form.closest('.mura-object').data('instanceid')==obj.data('instanceid')) {		
						if(form.data('async') 
							|| !(
									form.hasData('async') && !form.data('async')
								)
								&& !(form.hasData('autowire') && !form.data('autowire')) 
								&& !form.attr('action') 
								&& !form.attr('onsubmit') 
								&& !form.attr('onSubmit')
						) {
							form.on('submit', function(e) {
								e.preventDefault();
								validateForm(this,
									function(frm) {
										submitForm(frm,obj);
									}
								);

								return false;
							});
						}
					}
				});
			}
		}
		obj.trigger('asyncObjectRendered');

	}

	function handleResponse(obj, resp) {
		obj = (obj.node) ? obj : Mura(obj);

		// handle HTML response
		resp = (!resp.data) ? {
			data: resp
		} : resp;

		if (typeof resp.data.redirect != 'undefined') {
			if (resp.data.redirect && resp.data.redirect != location.href) {
				location.href = resp.data.redirect;
			} else {
				location.reload(true);
			}
		} else if (resp.data.apiEndpoint) {
			ajax({
				type: "POST",
				xhrFields: {
						withCredentials: true
				},
				crossDomain: true,
				url: resp.data.apiEndpoint,
				data: resp.data,
				success(data) {
						if (typeof data == 'string') {
								wireUpObject(obj, data);
						} else if (typeof data == 'object' &&
								'html' in data) {
								wireUpObject(obj, data.html);
						} else if (typeof data == 'object' &&
								'data' in data && 'html' in data.data
						) {
								wireUpObject(obj, data.data.html);
						} else {
								wireUpObject(obj, data.data);
						}
				}
			});
		} else {
			wireUpObject(obj, resp.data);
		}
	}


	function processDisplayObject(el, queue, rerender, resolveFn, usePreloaderMarkup) {

		try{
			var obj = (el.node) ? el : Mura(el);

			if(!obj.data('object')){
				obj.data('inited',true);
				return new Promise(function(resolve, reject) {
					if (typeof resolve == 'function') {
						resolve(obj);
					}
				});
			}

			if (obj.data('queue') != null) {
				queue = obj.data('queue');

				if(typeof queue == 'string'){
					queue=queue.toLowerCase();
					if(queue=='no' || queue=='false'){
						queue=false;
						obj.data('queue',false);
					} else {
						queue=true;
						obj.data('queue',true);
					}
				}
			}

			var rendered = (rerender && !obj.data('async')) ? false : (obj.children('.mura-object-content').length)

			queue = (queue == null || rendered) ? false : queue;
			
			if (document.createEvent && queue && !isScrolledIntoView(obj.node)) {
				if (!resolveFn) {
					return new Promise(function(resolve, reject) {

						resolve = resolve || function() {};

						setTimeout(
							function() {
								processDisplayObject(obj.node, true, false, resolve, usePreloaderMarkup);
							}, 10
						);
					});
				} else {
					setTimeout(
						function() {
							var resp = processDisplayObject(obj.node, true, false, resolveFn, usePreloaderMarkup);
							if (typeof resp == 'object' && typeof resolveFn == 'function') {
								resp.then(resolveFn);
							}
						}, 10
					);

					return;
				}
			}

			if (!obj.node.getAttribute('data-instanceid')) {
				obj.node.setAttribute('data-instanceid', createUUID());
			}

			//if(obj.data('async')){
			obj.addClass("mura-async-object");
			//}

			if (rendered && !obj.data('async')) {
				
				return new Promise(function(resolve, reject) {

					obj.calculateDisplayObjectStyles();

					var template=obj.data('clienttemplate') || obj.data('object');
					var properNameCheck = firstToUpperCase(template);

					if (typeof Mura.Module[properNameCheck] != 'undefined') {
						template = properNameCheck;
					}
					
					if(typeof Mura.Module[template] != 'undefined'){
						//obj.data('render','client')
					}

					if(!rerender && obj.data('render')=='client' && obj.children('.mura-object-content').length){
						
						var context=filterUnwantedParams(obj.data());
						if(typeof context.instanceid != 'undefined' && typeof Mura.hydrationData[context.instanceid] != 'undefined'){
							Mura.extend(context,Mura.hydrationData[context.instanceid]);
						}

						if(typeof Mura.DisplayObject[template] != 'undefined'){
							context.targetEl = obj.children('.mura-object-content').node;
							Mura.displayObjectInstances[obj.data('instanceid')]=new Mura.DisplayObject[template](context);
							Mura.displayObjectInstances[obj.data('instanceid')].trigger('beforeRender');
							Mura.displayObjectInstances[obj.data('instanceid')].hydrate();
						} else {
							console.log('Missing Client Template for:');
							console.log(obj.data());
						}
						obj.data('inited',true);
					}

					if(obj.data('render') && obj.data('render').toLowerCase() == 'server'){
						obj.find('form').each(function(el) {
							var form = Mura(el);
							if(form.closest('.mura-object').data('instanceid')==obj.data('instanceid')) {
								if(form.data('async')
									|| !(
											form.hasData('async') && !form.data('async')
										)
									&& !(form.hasData('autowire')
									&& !form.data('autowire'))
									&& !form.attr('action')
									&& !form.attr('onsubmit')
									&& !form.attr('onSubmit')
							) {
								form.on('submit', function(e) {
									e.preventDefault();
									validateForm(this,
										function(frm) {
											submitForm(frm,obj);
										}
									);

									return false;
								});
								}
							}
						});
					}
		
					if (typeof resolve == 'function') {
						resolve(obj);
					}

				});
			}
		
			return new Promise(function(resolve, reject) {
				
				var data = deepExtend(setLowerCaseKeys(obj.data()),
					urlparams, {
						siteid: Mura.siteid,
						contentid: Mura.contentid,
						contenthistid: Mura.contenthistid
					});
				
				if (obj.data('siteid')) {
					data.siteid = obj.node.getAttribute('data-siteid');
				}

				if (obj.data('contentid')) {
					data.contentid = obj.node.getAttribute('data-contentid');
				}

				if (obj.data('contenthistid')) {
					data.contenthistid = obj.node.getAttribute('data-contenthistid');
				}

				if ('objectparams' in data) {
					data['objectparams'] = encodeURIComponent(JSON.stringify(data['objectparams']));
				}

				if (!obj.data('async') && obj.data('render') == 'client') {
					wireUpObject(obj);
					if (typeof resolve == 'function') {
						if(typeof resolve.call == 'undefined'){
							resolve(obj);
						} else {
							resolve.call(obj.node, obj);
						}
					}
				} else {
					//console.log(data);
					if(usePreloaderMarkup){
						if(typeof data.preloadermarkup != 'undefined'){
							obj.node.innerHTML = data.preloadermarkup;
							delete data.preloadermarkup;
						} else {
							obj.node.innerHTML = Mura.preloadermarkup;
						}
					}

					var requestType='get';
					var requestData=filterUnwantedParams(data);
					var postCheck=new RegExp(/<\/?[a-z][\s\S]*>/i);

					for(var p in requestData){
						if(requestData.hasOwnProperty(p) 
							&& requestData[p]
							&& postCheck.test(requestData[p])
						){
							requestType='post';
							break;
						}
					}
				
					ajax({
						url: Mura.getAPIEndpoint() + '?method=processAsyncObject',
						type: requestType,
						data: requestData,
						maxQueryStringLength: 827,
						success(resp) {
							//console.log(data.object,resp)
							setTimeout(function(){
								handleResponse(obj, resp)
								if (typeof resolve =='function') {
									if(typeof resolve.call == 'undefined'){
										resolve(obj);
									} else {
										resolve.call(obj.node, obj);
									}
								}
							},0)
						}
							
					});
				}

			});
		} catch (e){
			console.error(e);
			if (typeof resolve == 'function') {
				resolve(obj);
			}
		}

	}

	function processModule(el, queue, rerender, resolveFn, usePreloaderMarkup) {
		return processDisplayObject(el, queue, rerender, resolveFn, usePreloaderMarkup);
	}

	var hashparams = {};
	var urlparams = {};

	function handleHashChange() {

		if(typeof location != 'undefined'){
			var hash = location.hash;
		} else {
			var hash = '';
		}

		if (hash) {
			hash = hash.substring(1);
		}

		if (hash) {
			hashparams = getQueryStringParams(hash);
			if (hashparams.nextnid) {
				Mura('.mura-async-object[data-nextnid="' + hashparams.nextnid + '"]')
					.each(function(el) {
						Mura(el).data(hashparams);
						processAsyncObject(el);
				});
			} else if (hashparams.objectid) {
				Mura('.mura-async-object[data-objectid="' + hashparams.objectid + '"]')
				.each(function(el) {
						Mura(el).data(hashparams);
						processAsyncObject(el);
				});
			}
		}
		
	}

	/**
	 * trim - description
	 *
	 * @param	{string} str Trims string
	 * @return {string}		 Trimmed string
	 * @memberof {class} Mura
	 */
	function trim(str) {
		return str.replace(/^\s+|\s+$/gm, '');
	}


	function extendClass(baseClass, subClass) {
		var muraObject = function() {
			this.init.apply(this, arguments);
		}

		muraObject.prototype = Object.create(baseClass.prototype);
		muraObject.prototype.constructor = muraObject;
		muraObject.prototype.handlers = {};

		muraObject.reopen = function(subClass) {
				Mura.extend(muraObject.prototype, subClass);
		};

		muraObject.reopenClass = function(subClass) {
			Mura.extend(muraObject, subClass);
		};

		muraObject.on = function(eventName, fn) {
			eventName = eventName.toLowerCase();

			if (typeof muraObject.prototype.handlers[eventName] == 'undefined') {
				muraObject.prototype.handlers[eventName] = [];
			}

			if (!fn) {
				return muraObject;
			}

			for (var i = 0; i < muraObject.prototype.handlers[eventName].length; i++) {
				if (muraObject.prototype.handlers[eventName][i] == handler) {
					return muraObject;
				}
			}


			muraObject.prototype.handlers[eventName].push(fn);
			return muraObject;
		};

		muraObject.off = function(eventName, fn) {
			eventName = eventName.toLowerCase();

			if (typeof muraObject.prototype.handlers[eventName] =='undefined') {
				muraObject.prototype.handlers[eventName] = [];
			}

			if (!fn) {
				muraObject.prototype.handlers[eventName] = [];
				return muraObject;
			}

			for (var i = 0; i < muraObject.prototype.handlers[
				eventName].length; i++) {
				if (muraObject.prototype.handlers[eventName][i] ==handler) {
					muraObject.prototype.handlers[eventName].splice(i, 1);
				}
			}
			return muraObject;
		}

		Mura.extend(muraObject.prototype, subClass);

		return muraObject;
	}


	/**
	 * getQueryStringParams - Returns object of params in string
	 *
	 * @name getQueryStringParams
	 * @param	{string} queryString Query String
	 * @return {object}
	 * @memberof {class} Mura
	 */
	function getQueryStringParams(queryString) {
		if(typeof queryString === 'undefined'){
			if(typeof location != 'undefined'){
				queryString=location.search;
			} else {
				return {}
			}
		} 
		
		var params = {};
		var e,
			a = /\+/g, // Regex for replacing addition symbol with a space
			r = /([^&;=]+)=?([^&;]*)/g,
			d = function(s) {
					return decodeURIComponent(s.replace(a, " "));
			};

		if (queryString.substring(0, 1) == '?') {
			var q = queryString.substring(1);
		} else {
			var q = queryString;
		}


		while (e = r.exec(q))
			params[d(e[1]).toLowerCase()] = d(e[2]);

		return params;
	}

	/**
	 * getHREFParams - Returns object of params in string
	 *
	 * @name getHREFParams
	 * @param	{string} href
	 * @return {object}
	 * @memberof {class} Mura
	 */
	function getHREFParams(href) {
		var a = href.split('?');

		if (a.length == 2) {
			return getQueryStringParams(a[1]);
		} else {
			return {};
		}
	}

	function inArray(elem, array, i) {
		var len;
		if (array) {
			if (array.indexOf) {
				return array.indexOf.call(array, elem, i);
			}
			len = array.length;
			i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
			for (; i < len; i++) {
				// Skip accessing in sparse arrays
				if (i in array && array[i] === elem) {
					return i;
				}
			}
		}
		return -1;
	}

	/**
	 * getStyleSheet - Returns a stylesheet object;
	 *
	 * @param	{string} id Text string
	 * @return {object}						Self
	 */
	function getStyleSheet(id) {
		if(Mura.isInNode()){
			return getStyleSheetPlaceHolder(id);
		} else {
			var sheet=Mura('#' + id);
			if(sheet.length){
				return sheet.get(0).sheet;
			} else {
				Mura('HEAD').append('<style id="' + id +'" type="text/css"></style>');
				return Mura('#' + id).get(0).sheet;
			}
		}
	}

	/**
	 * applyModuleCustomCSS - Returns a stylesheet object;
	 *
	 * @param	{object} stylesupport Object Containing Module Style configuration
	 * @param	{object} sheet Object StyleSheet object
	 * @param	{string} id Text string
	 * @return {void}	void
	 */
	function applyModuleCustomCSS(stylesupport,sheet, id){
		stylesupport=stylesupport || {};
		if(typeof stylesupport.css != 'undefined' && stylesupport.css){
			var styles=stylesupport.css.split('}');
			if(Array.isArray(styles) && styles.length){
				styles.forEach(function(style){
					var styleParts=style.split("{");
					if(styleParts.length > 1){
						var selectors=styleParts[0].split(',');
						selectors.forEach(function(subSelector){
							try{
								var subStyle='div.mura-object[data-instanceid="' + id + '"] ' + subSelector.replace(/\$self/g,'') + '{' + styleParts[1] + '}';
								sheet.insertRule(
									subStyle,
									sheet.cssRules.length
								);
								if(Mura.editing){
									console.log('Applying dynamic styles:' + subStyle);
								}
							} catch(e){
								if(Mura.editing){
									console.log('Error applying dynamic styles:' + subStyle);
									console.log(e);
								}
							}
						});
					}
				});
			}
		}
	}


	/**
	 * getStyleSheetPlaceHolder - ;
	 *
	 * @return {object}	 object
	 */
	function getStyleSheetPlaceHolder(id){
		return {
			deleteRule(idx){
				this.cssRules.splice(idx, 1);
			},
			insertRule(rule){
				this.cssRules.push(rule);
			},
			cssRules:[],
			id: id,
			targets: {
				object:{
					class:"mura-object"
				},
				meta:{
					class:"mura-object-meta"
				},
				metawrapper:{
					class:"mura-object-meta-wrapper"
				},
				content:{
					class:"mura-object-content"
				}	
			}
		};
	}

	/**
	 * normalizeModuleClassesAndIds - ;
	 *
	 * @param	{object} params Object Containing Module Style configuration
	 * @return {object}	style object
	 */
	function normalizeModuleClassesAndIds(params,sheet){

		if(typeof sheet =='undefined'){
			sheet=getStyleSheetPlaceHolder('mura-styles-' + params.instanceid);
		}

		if(typeof params.class != 'undefined'
			&& params.class != ''){
			sheet.targets.object.class += ' ' + params.class;
		}
		if(typeof params.cssclass != 'undefined'
			&& params.cssclass != ''){
			sheet.targets.object.class += ' ' + params.cssclass;
		}
		if(typeof params.cssid != 'undefined'
			&& params.cssid != ''){
			sheet.targets.object.id = params.cssid;
		}

		if(typeof params.metacssclass != 'undefined'
			&& params.metacssclass != ''){
			sheet.targets.meta.class += ' ' + params.metacssclass;
		}
		if(typeof params.metacssid != 'undefined'
			&& params.metacssid != ''){
			sheet.targets.meta.id = params.metacssid;
		}

		if(typeof params.contentcssclass != 'undefined'
			&& params.contentcssclass != ''){
			sheet.targets.content.class += ' ' + params.contentcssclass;
		}
		if(typeof params.contentcssid != 'undefined'
			&& params.contentcssid != ''){
			sheet.targets.content.id = params.contentcssid;
		}
		
		if(typeof params.objectspacing != 'undefined'
			&& params.objectspacing != ''
			&& params.objectspacing != 'custom'){
			sheet.targets.object.class += ' ' + params.objectspacing;
		}

		if(typeof params.metaspacing != 'undefined'
			&& params.metaspacing != '' 
			&& params.metaspacing != 'custom'){
			sheet.targets.meta.class += ' ' + params.metaspacing;
		}

		if(typeof params.contentspacing != 'undefined'
			&& params.contentspacing != ''
			&& params.contentspacing != 'custom'){
			sheet.targets.content.class += ' ' + params.contentspacing;
		}
		
		if(sheet.targets.content.class.split(' ').find($class => $class === 'container')){
			sheet.targets.metawrapper.class += ' container';
		}

		return sheet;
	}

	/**
	 * recordModuleClassesAndIds - ;
	 *
	 * @param	{object} params Object Containing Module Style configuration
	 * @return {object}	style object
	 */
	function recordModuleClassesAndIds(params){
		params.instanceid=params.instanceid || createUUID();
		params.stylesupport=params.stylesupport || {};

		var sheet=getStyleSheet('mura-styles-' + params.instanceid);

		if(sheet.recorded){
			return sheet;
		}

		normalizeModuleClassesAndIds(params,sheet);

		return sheet;



	}

	/**
	 * recordModuleStyles - ;
	 *
	 * @param	{object} params Object Containing Module Style configuration
	 * @return {object}	style object
	 */
	function recordModuleStyles(params){
		params.instanceid=params.instanceid || createUUID();
		params.stylesupport=params.stylesupport || {};

		var sheet=getStyleSheet('mura-styles-' + params.instanceid);

		if(sheet.recorded){
			return sheet;
		}

		var styleTargets=getModuleStyleTargets(params.instanceid,false);

		applyModuleStyles(params.stylesupport,styleTargets.object,sheet);
		applyModuleCustomCSS(params.stylesupport,sheet,params.instanceid);
		applyModuleStyles(params.stylesupport,styleTargets.meta,sheet);
		applyModuleStyles(params.stylesupport,styleTargets.content,sheet);

		normalizeModuleClassesAndIds(params,sheet);

		return sheet;
	}

	/**
	 * applyModuleStyles - Returns a stylesheet object;
	 *
	 * @param	{object} stylesupport Object Containing Module Style configuration
	 * @param	{object} group Object Containing a group of selectors
	 * @param	{object} sheet StyleSheet object
	 * @param	{object} obj Mura.DomSelection
	 * @return {void}	void
	 */
	function applyModuleStyles(stylesupport,group,sheet,obj){
		var acummulator={};
		//group is for object, content, meta
		group.targets.forEach((target)=>{
			var styles={};
			var dyncss='';
			if(stylesupport && stylesupport[target.name]){
				styles=stylesupport[target.name];
			}
			//console.log(target.name)
			//console.log(styles)
			acummulator=Mura.extend(acummulator,styles);

			handleBackround(acummulator);

			for(var s in acummulator){
				if(acummulator.hasOwnProperty(s)){
					var p=s.toLowerCase()
					if( Mura.styleMap && typeof Mura.styleMap.tojs[p] != 'undefined' && Mura.styleMap.tocss[Mura.styleMap.tojs[p]] != 'undefined'){
						dyncss += Mura.styleMap.tocss[Mura.styleMap.tojs[p]]  + ': ' + acummulator[s] + ' !important;';
					} else if ( typeof obj != 'undefined') {
						obj.css(s,acummulator[s]);
					}		
				}
			}
			//console.log(target.name,acummulator,dyncss)
			if(dyncss){
				try {
					//selector is for edit mode or standard
					target.selectors.forEach((selector)=>{
						//console.log(selector)
						sheet.insertRule(
							selector + ' {' + dyncss+ '}}',
							sheet.cssRules.length
						);
						//console.log(selector + ' {' + dyncss+ '}}')
						handleTextColor(sheet,selector,acummulator);
					});							
				} catch (e){
					console.log(selector + ' {' + dyncss+ '}}')
					console.log(e);
				}
			}
		});

		function handleBackround(styles){
			if(typeof styles.backgroundImage != 'undefined' && styles.backgroundImage){
				var bgArray=styles.backgroundImage.split(',');
				if(bgArray.length){
					styles.backgroundImage=Mura.trim(bgArray[bgArray.length-1]);
				}
			}
			var hasLayeredBg=(styles && typeof styles.backgroundColor != 'undefined' && styles.backgroundColor
			&& typeof styles.backgroundImage != 'undefined' && styles.backgroundImage);	
			
			if(hasLayeredBg){
				styles.backgroundImage='linear-gradient(' + styles.backgroundColor + ', ' + styles.backgroundColor +' ), ' + styles.backgroundImage;
			} else {
				if(typeof styles.backgroundimage != 'undefined' && styles.backgroundimage){
					var bgArray=styles.backgroundimage.split(',');
					if(bgArray.length){
						styles.backgroundimage=Mura.trim(bgArray[bgArray.length-1]);
					}
				}
				hasLayeredBg=(styles && typeof styles.backgroundcolor != 'undefined' && styles.backgroundcolor
				&& typeof styles.backgroundimage != 'undefined' && styles.backgroundimage);	
				
				if(hasLayeredBg){
					styles.backgroundImage='linear-gradient(' + styles.backgroundcolor + ', ' + styles.backgroundcolor +' ), ' + styles.backgroundimage;
				}
			}
		}

		function handleTextColor(sheet,selector,styles){
			try{
				if(styles.color){
					var selectorArray=selector.split('{');
					var style=selectorArray[0] + '{' + selectorArray[1] + ', ' + selectorArray[1] + ' label, ' + selectorArray[1] + ' p, ' + selectorArray[1] + ' h1, ' + selectorArray[1] + ' h2, ' + selectorArray[1] + ' h3, ' + selectorArray[1] + ' h4, ' + selectorArray[1] + ' h5, ' + selectorArray[1] + ' h6, ' + selectorArray[1] + ' a, ' + selectorArray[1] + ' a:link, ' + selectorArray[1] + ' a:visited, '  + selectorArray[1] + ' a:hover, ' + selectorArray[1] + ' .breadcrumb-item + .breadcrumb-item::before, ' + selectorArray[1] + ' a:active { color:' + styles.color + ' !important;}} ';

					sheet.insertRule(
						style,
						sheet.cssRules.length
					);
					//console.log(style)
					sheet.insertRule(
						selector + ' * {color:inherit !important}}',
						sheet.cssRules.length
					);
					//console.log(selector + ' * {color:inherit}')
					sheet.insertRule(
						selector + ' hr { border-color:' + styles.color + ' !important;}}',
						sheet.cssRules.length
					);
				}
			} catch (e){
				console.log("error adding color: " + styles.color);
				console.log(e);
			}
		}
	}

	function getBreakpoint(){
		if(typeof document != 'undefined'){
			var breakpoints=getBreakpoints();
			var width=document.documentElement.clientWidth;
			
			if(Mura.editing){
				width=width-300;
			}
		
			if(width >=breakpoints.xl){
				return 'xl';
			} else if(width >= breakpoints.lg){
				return 'lg';
			} else if(width >= breakpoints.md){
				return 'md';
			} else if(width >= breakpoints.sm){
				return 'sm';
			} else {
				return 'xs';
			}
		} else {
			return '';
		}
	}

	function getBreakpoints(){
		if(typeof Mura.breakpoints != 'undefined'){
			return  Mura.breakpoints;
		} else {
			return {
				xl:1200,
				lg:992,
				md:768,
				sm:576
			};
		}
	}

	function getModuleStyleTargets(id,dynamic){
		var breakpoints=getBreakpoints();
		var sidebar=300;
		var objTargets= {
			object:{
				targets:[
					{
						name:'objectstyles',
						selectors:[
							'@media (min-width: ' + breakpoints.xl +'px) { div[data-instanceid="' + id + '"]',
							'@media (min-width: ' + (breakpoints.xl + sidebar) +'px) { .mura-editing div[data-instanceid="' + id + '"]'
						]
					},
					{
						name:'object_lg_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.lg +'px) and (max-width: '+ (breakpoints.xl -1) +'px) { div[data-instanceid="' + id + '"]',
							'@media (min-width: ' + (breakpoints.lg + sidebar) +'px) and (max-width: '+ (breakpoints.xl + sidebar -1) + 'px) { .mura-editing div[data-instanceid="' + id + '"]'
						]
					},
					{
						name:'object_md_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.md +'px) and (max-width:'+ (breakpoints.lg -1) +'px) { div[data-instanceid="' + id + '"]',
							'@media (min-width: ' + (breakpoints.md + sidebar) +'px) and (max-width: '+ (breakpoints.lg + sidebar -1) + 'px) { .mura-editing div[data-instanceid="' + id + '"]'
						]
					},
					{
						name:'object_sm_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.sm +'px) and (max-width: '+ (breakpoints.md -1) + 'px) { div[data-instanceid="' + id + '"]',
							'@media (min-width: ' + (breakpoints.sm + sidebar) + 'px) and (max-width: '+ (breakpoints.md + sidebar -1) + 'px) { .mura-editing div[data-instanceid="' + id + '"]'
						]
					},
					{
						name:'object_xs_styles',
						selectors:[
							'@media (max-width: ' + (breakpoints.sm -1) + 'px) { div[data-instanceid="' + id + '"]',
							'@media (max-width: ' + (breakpoints.sm + sidebar -1) +'px) { .mura-editing div[data-instanceid="' + id + '"]'
						]
					}
				]
			},
			meta:{
				targets:[
					{
						name:'metastyles',
						selectors:[
							'@media (min-width: ' + breakpoints.xl +'px) { div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta',
							'@media (min-width: ' + (breakpoints.xl + sidebar) +'px) { .mura-editing div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta'
						]
					},
					{
						name:'meta_lg_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.lg +'px) and (max-width: '+ (breakpoints.xl -1) +'px) { div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta',
							'@media (min-width: ' + (breakpoints.lg + sidebar) +'px) and (max-width: ' + (breakpoints.xl + sidebar -1) +'px) { .mura-editing div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta'
						]
					},
					{
						name:'meta_md_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.md +'px) and (max-width: '+ (breakpoints.lg -1) +'px) { div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta',
							'@media (min-width: ' + (breakpoints.md + sidebar) +'px) and (max-width: ' + (breakpoints.lg + sidebar -1) +'px) { .mura-editing div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta'
						]
					},
					{
						name:'meta_sm_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.sm +'px) and (max-width: '+ (breakpoints.md -1) +'px) { div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta',
							'@media (min-width: ' + (breakpoints.sm + sidebar) +'px) and (max-width: ' + (breakpoints.md + sidebar -1) +'px) { .mura-editing div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta'
						]
					},
					{
						name:'meta_xs_styles',
						selectors:[
							'@media (max-width: ' + (breakpoints.sm -1) + 'px) { div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta',
							'@media (max-width: ' + (breakpoints.sm + sidebar -1) +'px) { .mura-editing div[data-instanceid="' + id + '"] > div.mura-object-meta-wrapper > div.mura-object-meta'
						]
					}
				]
			},
			content:{
				targets:[
					{
						name:'contentstyles',
						selectors:[
							'@media (min-width: ' + breakpoints.xl +'px) { div.mura-object[data-instanceid="' + id + '"] > div.mura-object-content',
							'@media (min-width: ' + (breakpoints.xl + sidebar) +'px) { .mura-editing div.mura-object[data-instanceid="' + id + '"] > div.mura-object-content'
						]
					},
					{
						name:'content_lg_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.lg +'px) and (max-width: '+ (breakpoints.xl -1) +'px) { div.mura-object[data-instanceid="' + id + '"] > div.mura-object-content',
							'@media (min-width: ' + (breakpoints.lg + sidebar) +'px) and (max-width: ' + (breakpoints.xl + sidebar -1) +'px) { .mura-editing div.mura-object[data-instanceid="' +id + '"] > div.mura-object-content'
						]
					},
					{
						name:'content_md_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.md +'px) and (max-width: '+ (breakpoints.lg -1) +'px) { div.mura-object[data-instanceid="' + id+ '"] > div.mura-object-content',
							'@media (min-width: ' + (breakpoints.md + sidebar) +'px) and (max-width: ' + (breakpoints.lg + sidebar -1) +'px) { .mura-editing div.mura-object[data-instanceid="' +id + '"] > div.mura-object-content'
						]
					},
					{
						name:'content_sm_styles',
						selectors:[
							'@media (min-width: ' + breakpoints.sm +'px) and (max-width: '+ (breakpoints.md -1) +'px) { div.mura-object[data-instanceid="' + id + '"] > div.mura-object-content',
							'@media (min-width: ' + (breakpoints.sm + sidebar) +'px) and (max-width: ' + (breakpoints.md + sidebar -1) +'px) { .mura-editing div.mura-object[data-instanceid="' + id + '"] > div.mura-object-content'
						]
					},
					{
						name:'content_xs_styles',
						selectors:[
							'@media (max-width: ' + (breakpoints.sm -1) + 'px) { div.mura-object[data-instanceid="' + id + '"] > div.mura-object-content',
							'@media (max-width: ' + (breakpoints.sm + sidebar -1) +'px) { .mura-editing div.mura-object[data-instanceid="' + id + '"] > div.mura-object-content'
						]
					}

				]
			}
		}

		if(!dynamic){
			for(let elTarget in objTargets){
				if(objTargets.hasOwnProperty(elTarget)){
					objTargets[elTarget].targets.forEach((target)=>{
						target.selectors.pop();
					});
				}
			}
		}
		
		return objTargets
	}


	/**
	 * setRequestHeader - Initialiazes feed
	 *
	 * @name setRequestHeader
	 * @param	{string} headerName	Name of header
	 * @param	{string} value Header value
	 * @return {Mura.RequestContext} Self
	 * @memberof {class} Mura
	 */
	function setRequestHeader(headerName,value){
		Mura.requestHeaders[headerName]=value;
		return this;
	}

	/**
	 * getRequestHeader - Returns a request header value
	 *
	 * @name getRequestHeader
	 * @param	{string} headerName	Name of header
	 * @return {string} header Value
	 * @memberof {class} Mura
	 */
		function getRequestHeader(headerName){
			if(typeof Mura.requestHeaders[headerName] != 'undefined'){
				return Mura.requestHeaders[headerName];
			} else {
				return null;
			}
		}

	/**
	 * getRequestHeaders - Returns a request header value
	 *
	 * @name getRequestHeaders
	 * @return {object} All Headers
	 * @memberof {class} Mura
	 */
		function getRequestHeaders(){
			return Mura.requestHeaders;
		}

	//http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/

	/**
	 * hashCode - description
	 *
	 * @name hashCode
	 * @param	{string} s String to hash
	 * @return {string}
	 * @memberof {class} Mura
	 */
	function hashCode(s) {
		var hash = 0,
			strlen = s.length,
			i, c;

		if (strlen === 0) {
			return hash;
		}
		for (i = 0; i < strlen; i++) {
			c = s.charCodeAt(i);
			hash = ((hash << 5) - hash) + c;
			hash = hash & hash; // Convert to 32bit integer
		}
		return (hash >>> 0);
	}

	/**
	 * Returns if the current request s running in Node.js
	**/
	function isInNode(){
		return typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined';
	}

	/**
	 * Global Request Headers
	**/
	var requestHeaders={};

	function throttle (func, interval) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function () {
			timeout = false;
			};
			if (!timeout) {
			func.apply(context, args)
			timeout = true;
			setTimeout(later, interval)
			}
		}
	}

	function debounce (func, interval) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
			timeout = null;
			func.apply(context, args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, interval || 200);
		}
	}

	function getAPIEndpoint(){
		if(Mura.apiendpoint){
			Mura.apiEndpoint=Mura.apiendpoint;
			delete Mura.apiendpoint;
			if(Mura.mode.toLowerCase()=='rest'){
				Mura.apiEndpoint=Mura.apiEndpoint.replace('/json/', '/rest/');
			}
		} 
		return Mura.apiEndpoint;
	}

	function setAPIEndpoint(apiEndpoint){
		Mura.apiEndpoint=apiEndpoint;
	}

	function setMode(mode){
		Mura.mode=mode;
	}

	function getMode(){
		return Mura.mode;
	}

	function getRenderMode(){
		return Mura.renderMode;
	}

	function setRenderMode(renderMode){
		Mura.renderMode=renderMode;
	}

	function startUserStateListener(interval){
		Mura.userStateListenerInterval=interval;
	}

	function stopUserStateListener(){
		Mura.userStateListenerInterval=false;
	}

	function pollUserState(){
		if(typeof window != 'undefined' 
			&& typeof document != 'undefined'
			&& (
				Mura.userStateListenerInterval || Mura.editing
			)
		){
			Mura.getEntity('user').invoke('pollState').then(
				function(state){
					var data=state;
					if(typeof state == 'string'){
						try{
							data=JSON.parse(state);
						} catch(e){
							data=state;
						}
					}
					Mura(document).trigger('muraUserStateMessage',data);
				}
			)
		}
		var interval=(typeof Mura.userStateListenerInterval === 'number' && Mura.userStateListenerInterval) ? Mura.userStateListenerInterval :  60000;
		setTimeout(pollUserState,interval);
	}

	function deInit(){
		//This all needs to be moved to a state object
		delete Mura._requestcontext;
		delete Mura.response;
		delete Mura.request;
		Mura.requestHeaders={};
		Mura.displayObjectInstances={}
		delete Mura.renderMode;
		delete Mura.userStateListenerInterval;
		delete Mura.currentUser;
		Mura.mode="json";
		setAPIEndpoint(getAPIEndpoint().replace('/rest/', '/json/'));
		Mura.trackingMetadata={};
		delete Mura.trackingVars;
		//delete Mura.apiEndpoint;
		//delete Mura.apiendpoint;
		delete Mura.perm;
		delete Mura.formdata;
		delete Mura.windowResponsiveModules;
		delete Mura.windowResizeID;
		delete Mura.Content;
		delete Mura.content;

		return Mura;	
	}

	//Mura.init()
	function init(config) {

		var existingEndpoint='';

		if( Mura.siteid && config.siteid && Mura.siteid != config.siteid){
			delete Mura.apiEndpoint;
			delete Mura.apiendpoint;
		}

		if(typeof Mura.apiEndpoint != 'undefined' && Mura.apiEndpoint){
			existingEndpoint=Mura.apiEndpoint;
		}

		if(typeof config.content != 'undefined'){
			if(typeof config.content.get == 'undefined'){
				config.content=getEntity('content').set(config.content);
			}
			Mura.extend(config,config.content.get('config'));
		}

		if(existingEndpoint){
			config.apiEndpoint=existingEndpoint;
			delete config.apiendpoint;
		}

		if (config.rootpath) {
			config.context = config.rootpath;
		}

		if (config.endpoint) {
			config.context = config.endpoint;
		}

		if (!config.context) {
			config.context = '';
		}

		if (!config.rootpath) {
			config.rootpath = config.context;
		}

		if (!config.assetpath) {
			config.assetpath = config.context + "/sites/" + config.siteid;
		}

		if (!config.siteassetpath) {
			config.siteassetpath = config.assetpath;
		}

		if (!config.fileassetpath) {
			config.fileassetpath = config.assetpath;
		}

		if (config.apiendpoint) {
			config.apiEndpoint = config.apiendpoint;
			delete config.apiendpoint;
		}

		if(typeof config.indexfileinapi == 'undefined'){
			if(typeof Mura.indexfileinapi!='undefined'){
				config.indexfileinapi=Mura.indexfileinapi;
			} else {
				config.indexfileinapi=true;
			}
		}

		if (!config.apiEndpoint) {
			if(config.indexfileinapi){
				config.apiEndpoint = config.context +	'/index.cfm/_api/json/v1/' + config.siteid + '/';
			} else {
				config.apiEndpoint = config.context +	'/_api/json/v1/' + config.siteid + '/';
			}
		}

		if(config.apiEndpoint.indexOf('/_api/') == -1){
			if(config.indexfileinapi){
				config.apiEndpoint = config.apiEndpoint + '/index.cfm/_api/json/v1/' + config.siteid + '/'
			} else {
				config.apiEndpoint = config.apiEndpoint + '/_api/json/v1/' + config.siteid + '/'
			}
		}

		if (!config.pluginspath) {
			config.pluginspath = config.context + '/plugins';
		}

		if (!config.corepath) {
			config.corepath = config.context + '/core';
		}

		if (!config.jslib) {
			config.jslib = 'jquery';
		}

		if (!config.perm) {
			config.perm = 'none';
		}

		if (typeof config.layoutmanager == 'undefined') {
			config.layoutmanager = false;
		}

		if (typeof config.mobileformat == 'undefined') {
			config.mobileformat = false;
		}
		
		if (typeof config.queueObjects != 'undefined') {
			config.queueobjects=config.queueObjects;
			delete config.queueobjects;
		}
		
		if (typeof config.queueobjects == 'undefined') {
			config.queueobjects = true;
		}

		if (typeof config.rootdocumentdomain != 'undefined' && config.rootdocumentdomain != '') {
			document.domain = config.rootdocumentdomain;
		}

		if (typeof config.preloaderMarkup != 'undefined') {
			config.preloadermarkup=config.preloaderMarkup;
			delete config.preloaderMarkup;
		}

		if (typeof config.preloadermarkup == 'undefined') {
			config.preloadermarkup = '';
		}

		if (typeof config.rb == 'undefined') {
			config.rb={};
		}

		if (typeof config.dtExample != 'undefined') {
			config.dtexample=config.dtExample;
			delete config.dtExample;
		}

		if (typeof config.dtexample == 'undefined') {
			config.dtexample="11/10/2024";
		}

		if (typeof config.dtCh != 'undefined') {
			config.dtch=config.dtCh;
			delete config.dtCh;
		}

		if (typeof config.dtch == 'undefined') {
			config.dtch="/";
		}

		if (typeof config.dtFormat != 'undefined') {
			config.dtformat=config.dtFormat;
			delete config.dtFormat;
		}

		if (typeof config.dtformat == 'undefined') {
			config.dtformat=[0,1,2];
		}

		if (typeof config.dtLocale != 'undefined') {
			config.dtlocale=config.dtLocale;
			delete config.dtLocale;
		}

		if (typeof config.dtlocale == 'undefined') {
			config.dtlocale="en-US";
		}

		if (typeof config.useHTML5DateInput != 'undefined') {
			config.usehtml5dateinput=config.useHTML5DateInput;
			delete config.usehtml5dateinput;
		}

		if (typeof config.usehtml5dateinput == 'undefined') {
			config.usehtml5dateinput=false;
		}

		if (typeof config.cookieConsentEnabled != 'undefined') {
			config.cookieconsentenabled=config.cookieConsentEnabled;
			delete config.cookieConsentEnabled;
		}

		if (typeof config.cookieconsentenabled == 'undefined') {
			config.cookieconsentenabled=false;
		}

		if(typeof config.initialProcessMarkupSelector == 'undefined'){
			if(typeof window != 'undefined' && typeof document !='undefined'){
				var initialProcessMarkupSelector='document';
			} else {
				var initialProcessMarkupSelector='';
			}
		} else {
			var initialProcessMarkupSelector=config.initialProcessMarkupSelector;
		}

		config.formdata=(typeof FormData != 'undefined') ? true : false;


		var initForDataOnly=false;
		
		if(typeof config.processMarkup != 'undefined'){
			initForDataOnly=typeof config.processMarkup != 'function' && !config.processMarkup;
			delete config.processMarkup;
		} else if(typeof config.processmarkup != 'undefined'){
			initForDataOnly=typeof config.processmarkup != 'function' && !config.processmarkup;
			delete config.processmarkup;
		}

		extend(Mura, config);

		Mura.trackingMetadata={};
		Mura.hydrationData={}

		if(typeof config.content != 'undefined' && typeof config.content.get != 'undefined'  && config.content.get('displayregions')){
			for(var r in config.content.properties.displayregions){
				if( config.content.properties.displayregions.hasOwnProperty(r)){
					var data=config.content.properties.displayregions[r];
					if(typeof data.inherited != 'undefined' && typeof data.inherited.items != 'undefined'){
						for(var d in data.inherited.items){
							Mura.hydrationData[data.inherited.items[d].instanceid]=data.inherited.items[d];
						}
					}
					if(typeof data.local != 'undefined' && typeof data.local.items != 'undefined'){
						for(var d in data.local.items){
							Mura.hydrationData[data.local.items[d].instanceid]=data.local.items[d];
						}
					}
				}
			}
		}

		Mura.dateformat=generateDateFormat();

		if(Mura.mode.toLowerCase()=='rest'){
			Mura.apiEndpoint=Mura.apiEndpoint.replace('/json/', '/rest/');
		}

		if(typeof window !='undefined' &&typeof window.document != 'undefined'){
			if(Array.isArray(window.queuedMuraCmds) && window.queuedMuraCmds.length){
				holdingQueue=window.queuedMuraCmds.concat(holdingQueue);
				window.queuedMuraCmds=[];
			}

			if(Array.isArray(window.queuedMuraPreInitCmds) && window.queuedMuraPreInitCmds.length){
				holdingPreInitQueue=window.queuedMuraPreInitCmds.concat(holdingPreInitQueue);
				window.queuedMuraPreInitCmds=[];
			}
		}
		
		if(!initForDataOnly){

			destroyDisplayObjects();
			stopUserStateListener()

			Mura(function() {

				for(var cmd in holdingPreInitQueue){
					if(typeof holdingPreInitQueue[cmd] == 'function'){
						holdingPreInitQueue[cmd](Mura);
					} 
				}

				if(typeof window !='undefined' && typeof window.document != 'undefined'){
				
					var hash = location.hash;

					if (hash) {
						hash = hash.substring(1);
					}

					urlparams = setLowerCaseKeys(getQueryStringParams(location.search));
					
					if (hashparams.nextnid) {
						Mura('.mura-async-object[data-nextnid="' +
							hashparams.nextnid + '"]').each(
							function(el) {
								Mura(el).data(hashparams);
							});
					} else if (hashparams.objectid) {
						Mura('.mura-async-object[data-nextnid="' +hashparams.objectid + '"]').each(
						function(el) {
							Mura(el).data(hashparams);
						});
					}

					Mura(window).on('hashchange', handleHashChange);
					
					Mura(document).on('click','div.mura-object .mura-next-n a,div.mura-object .mura-search-results div.moreResults a,div.mura-object div.mura-pagination a',function(e){
						e.preventDefault();
						var href=Mura(e.target).attr('href');
						if(href!='#'){
							var hArray=href.split('?');
							var source=Mura(e.target);
							var data=setLowerCaseKeys(getQueryStringParams(hArray[hArray.length-1]));
							var obj=source.closest('div.mura-object');
							obj.data(data);
							processAsyncObject(obj.node).then(function(){
								try {
									if(typeof window != 'undefined' && typeof document != 'undefined'){
										var rect=obj.node.getBoundingClientRect();
										var elemTop = rect.top;
										if(elemTop < 0){
											window.scrollTo(0, Mura(document).scrollTop() + elemTop);
										}
									}
								} catch (e) {
									console.log(e)
								}							
							});	
						}
					})

					if(!Mura.inAdmin && initialProcessMarkupSelector){
						if(initialProcessMarkupSelector=='document'){
							processMarkup(document);
						} else {
							processMarkup(initialProcessMarkupSelector);
						}
					}
					
					Mura.markupInitted=true;

					if(Mura.cookieconsentenabled){Mura(function(){Mura('body').appendDisplayObject({object:'cookie_consent',queue:false,statsid:'cookie_consent'});});}

					Mura(document).on("keydown", function(event) {
						keyCmdCheck(event);
					});
					
					Mura.breakpoint=getBreakpoint();
					Mura.windowResponsiveModules={};

					window.addEventListener("resize", function(){
					clearTimeout(Mura.windowResizeID);
					Mura.windowResizeID = setTimeout(doneResizing, 250);

						function doneResizing(){
							var breakpoint=getBreakpoint();
							if(breakpoint!=Mura.breakpoint){
								Mura.breakpoint=breakpoint;
								Mura('.mura-object').each(function(el){
									var obj=Mura(el);
									var instanceid=obj.data('instanceid');
									if(typeof Mura.windowResponsiveModules[instanceid] == 'undefined' || Mura.windowResponsiveModules[instanceid]){
										obj.calculateDisplayObjectStyles(true);
									}
								});
							}
							delete Mura.windowResizeID;
						}
					});

					Mura(document).trigger('muraReady');
					
					pollUserState();
				}
			});

			readyInternal(initReadyQueue);
		}

		return Mura
	}


	Mura=extend(
		function(selector, context) {
			if (typeof selector == 'function') {
				Mura.ready(selector);
				return this;
			} else {
				if (typeof context == 'undefined') {
					return select(selector);
				} else {
					return select(context).find(selector);
				}
			}
		}, {
			preInit(fn){if(holdingReady){holdingPreInitQueue.push(fn)}else{Mura(fn)}},
			generateOAuthToken: generateOAuthToken,
			entities: {},
			feeds: {},
			submitForm: submitForm,
			escapeHTML: escapeHTML,
			unescapeHTML: unescapeHTML,
			processDisplayObject: processDisplayObject,
			processModule:processModule,
			processAsyncObject: processAsyncObject,
			resetAsyncObject: resetAsyncObject,
			setLowerCaseKeys: setLowerCaseKeys,
			throttle:throttle,
			debounce:debounce,
			noSpam: noSpam,
			addLoadEvent: addLoadEvent,
			loader: loader,
			addEventHandler: addEventHandler,
			trigger: trigger,
			ready: ready,
			on: on,
			off: off,
			extend: extend,
			inArray: inArray,
			isNumeric: isNumeric,
			post: post,
			get: get,
			delete: deleteReq,
			put: put,
			patch: patch,
			deepExtend: deepExtend,
			ajax: ajax,
			request: ajax,
			changeElementType: changeElementType,
			setHTMLEditor: setHTMLEditor,
			each: each,
			parseHTML: parseHTML,
			getData: getData,
			cleanModuleProps:cleanModuleProps,
			getProps: getProps,
			isEmptyObject: isEmptyObject,
			isScrolledIntoView: isScrolledIntoView,
			evalScripts: evalScripts,
			validateForm: validateForm,
			escape: $escape,
			unescape: $unescape,
			getBean: getEntity,
			getEntity: getEntity,
			getCurrentUser: getCurrentUser,
			renderFilename: renderFilename,
			startUserStateListener:startUserStateListener,
			stopUserStateListener:stopUserStateListener,
			findQuery: findQuery,
			getFeed: getFeed,
			login: login,
			logout: logout,
			extendClass: extendClass,
			init: init,
			formToObject: formToObject,
			createUUID: createUUID,
			isUUID: isUUID,
			processMarkup: processMarkup,
			getQueryStringParams: getQueryStringParams,
			layoutmanagertoolbar: layoutmanagertoolbar,
			parseString: parseString,
			createCookie: createCookie,
			readCookie: readCookie,
			eraseCookie: eraseCookie,
			trim: trim,
			hashCode: hashCode,
			DisplayObject: {},
			displayObjectInstances: {},
			destroyDisplayObjects: destroyDisplayObjects,
			destroyModules: destroyModules,
			holdReady: holdReady,
			trackEvent: trackEvent,
			recordEvent: trackEvent,
			isInNode: isInNode,
			getRequestContext: getRequestContext,
			getDefaultRequestContext: getDefaultRequestContext,
			requestHeaders:requestHeaders,
			setRequestHeader:setRequestHeader,
			getRequestHeader:getRequestHeaders,
			getRequestHeaders:getRequestHeaders,
			mode: 'json',
			declareEntity:declareEntity,
			undeclareEntity:undeclareEntity,
			buildDisplayRegion:buildDisplayRegion,
			openGate:openGate,
			firstToUpperCase:firstToUpperCase,
			firstToLowerCase:firstToLowerCase,
			normalizeRequestConfig:normalizeRequestConfig,
			getStyleSheet:getStyleSheet,
			getStyleSheetPlaceHolder:getStyleSheetPlaceHolder,
			applyModuleStyles:applyModuleStyles,
			applyModuleCustomCSS:applyModuleCustomCSS,
			recordModuleStyles:recordModuleStyles,
			recordModuleClassesAndIds:recordModuleClassesAndIds,
			getModuleStyleTargets:getModuleStyleTargets,
			getBreakpoint:getBreakpoint,
			getAPIEndpoint:getAPIEndpoint,
			setAPIEndpoint:setAPIEndpoint,
			getMode:getMode,
			setMode:setMode,
			getRenderMode: getRenderMode,
			setRenderMode: setRenderMode,
			parseStringAsTemplate:parseStringAsTemplate,
			findText:findText,
			deInit:deInit,
			inAdmin:false,
			lmv:2,
			homeid: '00000000000000000000000000000000001',
			cloning:false
		}
	);

	Mura.Module=Mura.DisplayObject;

	return Mura;
}

module.exports=attach;
