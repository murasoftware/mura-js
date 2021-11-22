
var Mura=require('./core');

/**
* Creates a new Mura.Request
* @name	Mura.Request
* @class
* @extends Mura.Core
* @memberof Mura
* @param	{object} request		 Siteid
* @param	{object} response Entity name
* @param	{object} requestHeaders Optional
* @return {Mura.Request}	Self
*/

Mura.Request=Mura.Core.extend(
	/** @lends Mura.Request.prototype */
	{
		init(request, response, headers) {
			this.requestObject=request;
			this.responseObject=response;
			this.requestHeaders=headers || {};
			return this;
		},

		/**
		* execute - Make ajax request
		*
		* @param	{object} params
		* @return {Promise}
		*/
		execute(params) {
			
			if (!('type' in params)) {
				params.type = 'GET';
			}
			if (!('success' in params)) {
				params.success = function() {};
			}
			if (!('data' in params)) {
				params.data = {};
			}
			if (!('headers' in params)) {
				params.headers = {};
			}

			if (('method' in params)) {
				params.type = params.method;
			}

			try{
				//if is in node not a FormData obj
				if(!Mura.formdata || !(params.data instanceof FormData)){
					if(params.type.toLowerCase() === 'get' 
						&& !(typeof params.url === 'string' && params.url.toLowerCase().indexOf('purgecache') > -1)
						&& typeof params.data.purgeCache === 'undefined' 
						&& typeof params.data.purgecache === 'undefined'){
						var sourceParams={};

						if(typeof XMLHttpRequest != 'undefined' 
							&& typeof location != 'undefined' 
							&& location.search
						){
							sourceParams=Mura.getQueryStringParams(location.search);
						} else if( typeof this.requestObject != 'undefined' 
							&& typeof this.requestObject.url === 'string' 
							&&  this.requestObject.url
						) {
							var qa=this.requestObject.url.split("?");
							if(qa.length){
								var qs=qa[qa.length-1] || '';
								qs=qs.toString();
								sourceParams=Mura.getQueryStringParams(qs);
							}
						}

						if(typeof sourceParams.purgeCache != 'undefined'){
							params.data.purgeCache=sourceParams.purgeCache;
						} else if(typeof sourceParams.purgecache != 'undefined'){
							params.data.purgecache=sourceParams.purgecache;
						}
						
					}
				}
			} catch(e){
				console.log(e)
			}

	//console.log(params);

			if(typeof XMLHttpRequest === 'undefined'){
				this.nodeRequest(params);
			} else {
				this.xhrRequest(params);
			}
		},
		/**
		 * setRequestHeader - Initialiazes feed
		 *
		 * @param	{string} headerName	Name of header
		 * @param	{string} value Header value
		 * @return {Mura.RequestContext}						Self
		 */
		setRequestHeader(headerName,value){
			this.requestHeaders[headerName]=value;
			return this;
		},
		/**
		 * getRequestHeader - Returns a request header value
		 *
		 * @param	{string} headerName	Name of header
		 * @return {string} header Value
		 */
		getRequestHeader(headerName){
			 if(typeof this.requestHeaders[headerName] != 'undefined'){
				 return this.requestHeaders[headerName];
			 } else {
				 return null;
			 }
		},
		/**
		 * getRequestHeaders - Returns a request header value
		 *
		 * @return {object} All Headers
		 */
		getRequestHeaders(){
			return this.requestHeaders;
		},
		nodeRequest(params){

			if(typeof Mura.renderMode != 'undefined'){
				params.renderMode=Mura.renderMode;
			}
			var debug=typeof Mura.debug != 'undefined' && Mura.debug;
			var self=this;
			if(typeof this.requestObject != 'undefined'){
				['Cookie','X-client_id','X-client_secret','X-access_token','Authorization','User-Agent','Referer'].forEach((item)=>{
					if(typeof this.requestObject.headers[item] != 'undefined'){
						params.headers[item]=this.requestObject.headers[item];
					} else {
						var lcaseItem=item.toLowerCase();
						if(typeof this.requestObject.headers[lcaseItem] != 'undefined'){
							params.headers[item]=this.requestObject.headers[lcaseItem];
						}
					}
				})
			}	
			
			for(var h in Mura.requestHeaders){
					if(Mura.requestHeaders.hasOwnProperty(h)){
							params.headers[h]= Mura.requestHeaders[h];
					}
			}
			for(var h in this.requestHeaders){
					if(this.requestHeaders.hasOwnProperty(h)){
							params.headers[h]= this.requestHeaders[h];
					}
			}
			//console.log('pre:',params.headers)
			const nodeProxyHeaders = (httpResponse)=>{
				if(typeof self.responseObject != 'undefined'){
					self.responseObject.proxiedResponse=httpResponse;
					if(!self.responseObject.headersSent){
						if(httpResponse.statusCode > 300 && httpResponse.statusCode < 400){
							const header=httpResponse.headers.raw()['location'] || httpResponse.headers.raw()['Location'];
							if(header){
								try{
										//match casing of mura-next connector
									self.responseObject.setHeader('Location',header);
									self.responseObject.statusCode=httpResponse.statusCode;
								} catch (e){
									console.log('Error setting location header');
								}
							}
						}
						let header='';
						header=httpResponse.headers.raw()['cache-control'] || httpResponse.headers.raw()['Cache-Control'];
						if(header){
							try{
								//match casing of mura-next connector
								self.responseObject.setHeader('Cache-Control',header);
							} catch (e){
								console.log(e)
								console.log('Error setting Cache-Control header');
							}
						}
						header=httpResponse.headers.raw()['pragma'] || httpResponse.headers.raw()['Pragma'];
						if(header){
							try{
								//match casing of mura-next connector
								self.responseObject.setHeader('Pragma',header);
							} catch (e){
								console.log('Error setting Pragma header');
							}
						}
					}
				}
			}

			const nodeProxyCookies = (httpResponse)=>{
				var debug=typeof Mura.debug != 'undefined' && Mura.debug;
				
				if(typeof self.responseObject != 'undefined'){
					var existingCookies=((typeof self.requestObject.headers['cookie'] != 'undefined') ? self.requestObject.headers['cookie'] : '').split("; ");
					var newSetCookies=httpResponse.headers.raw()['set-cookie'];
				
					if(!Array.isArray(newSetCookies)){
						newSetCookies=[];
					}

					if(debug){
						console.log('response cookies:');
						console.log(newSetCookies);
					}

					try{
						self.responseObject.setHeader('Set-Cookie',newSetCookies);
					} catch (e){
						//console.log('Header already sent');
					}
					var cookieMap={};
					var setMap={};
					// pull out existing cookies
					if(existingCookies.length){
						for(var c in existingCookies){
							var tempCookie=existingCookies[c];
							if(typeof tempCookie != 'undefined'){
								tempCookie=existingCookies[c].split(" ")[0].split("=");
								if(tempCookie.length > 1){
									cookieMap[tempCookie[0]]=tempCookie[1].split(';')[0];
								}
							}
						}
					}
					if(debug){
						console.log('existing 1:');
						console.log(cookieMap);
					}
					// pull out new cookies
					if(newSetCookies.length){
						for(var c in newSetCookies){
							var tempCookie=newSetCookies[c];
							if(typeof tempCookie != 'undefined'){
								tempCookie=tempCookie.split(" ")[0].split("=");
								if(tempCookie.length > 1){
									cookieMap[tempCookie[0]]=tempCookie[1].split(';')[0];
								}
							}
						}
					}
					if(debug){
						console.log('existing 2:');
						console.log(cookieMap);
					}
					var cookie='';
					// put cookies back in in the same order that they came out
					if(existingCookies.length){
						for(var c in existingCookies){
							var tempCookie=existingCookies[c];
							if(typeof tempCookie != 'undefined'){
								tempCookie=tempCookie.split(" ")[0].split("=");
								if(tempCookie.length > 1){
									if(cookie != ''){
										cookie=cookie + "; ";
									}
									setMap[tempCookie[0]]=true;
									cookie=cookie + tempCookie[0] + "=" + cookieMap[tempCookie[0]];
								}
							}
						}
					}
					if(newSetCookies.length){
						for(var c in newSetCookies){
							var tempCookie=newSetCookies[c];
							if(typeof tempCookie != 'undefined'){
								var tempCookie=tempCookie.split(" ")[0].split("=");
								if(typeof setMap[tempCookie[0]] == 'undefined' && tempCookie.length > 1){
									if(cookie != ''){
										cookie=cookie + "; ";
									}
									setMap[tempCookie[0]]=true;
									cookie=cookie + tempCookie[0] + "=" + cookieMap[tempCookie[0]];
								}
							}
						}
					}
					self.requestObject.headers['cookie']=cookie;
					if(debug){
						console.log('merged cookies:');
						console.log(self.requestObject.headers['cookie']);
					}
				}
			}

			const nodeResponseHandler = async (httpResponse, body) => {
				if (typeof httpResponse != 'undefined' && httpResponse.ok) {
					try {
						var data = JSON.parse.call(null,body);
					} catch (e) {
						var data = body;
					}
					params.success(data, httpResponse);
				} else {
					try {
						var data = JSON.parse.call(null,body);
					} catch (e) {
						var data = body;
					}
					if(typeof params.error == 'function'){
						params.error(data,httpResponse);
					} else {
						throw data;
					}
				}
			}

			const routeNodeResponse=async (res)=>{
				const body= await res.text();
				nodeProxyCookies(res);
				nodeProxyHeaders(res);
				nodeResponseHandler(res,body);
			}
				
			if (params.type.toLowerCase() != 'get') {
					const formData=new Mura._formData();

					Object.keys(params.data).forEach((key)=>{
						if(typeof params.data[key]==='boolean'){
							//boolean values seem to throw error in node-fetch
							if(params.data[key]){
								formData.append(key, 'true');
							} else {
								formData.append(key, 'false');
							}
						} else  {
							formData.append(key, params.data[key]);
						}
					})

					Mura._fetch(
						params.url,
						{
							method:params.type.toUpperCase(),
							body:formData,
							headers: params.headers
						}
					).then(routeNodeResponse)
					.catch((e)=>{
						console.log(e)
					})
			} else {
				if (params.url.indexOf('?') === -1) {
						params.url += '?';
				}
				var query = [];
				for (var key in params.data) {
					if(params.data.hasOwnProperty(key)){
						query.push(Mura.escape(key) + '=' + Mura.escape(params.data[key]));
					}
				}
				if(typeof params.data['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
						query.push('muraPointInTime=' + Mura.escape(Mura.pointInTime));
				}
				query = query.join('&');
				
				
				Mura._fetch(
					params.url + "&" + query,
					{
						method:"GET",
						headers: params.headers
					}
				).then(routeNodeResponse)
				.catch((e)=>{
					console.log(e)
				})
			}

		},
		xhrRequest(params){
			var debug=typeof Mura.debug != 'undefined' && Mura.debug;
			for(var h in Mura.requestHeaders){
				if(Mura.requestHeaders.hasOwnProperty(h)){
					params.headers[h]= Mura.requestHeaders[h];
				}
			}
			for(var h in this.requestHeaders){
				if(this.requestHeaders.hasOwnProperty(h)){
					params.headers[h]= this.requestHeaders[h];
				}
			}
			if (!(Mura.formdata && params.data instanceof FormData)) {
				params.data = Mura.deepExtend({}, params.data);
				for (var p in params.data) {
					if (typeof params.data[p] == 'object') {
						params.data[p] = JSON.stringify(params.data[p]);
					}
				}
			}
			if (!('xhrFields' in params)) {
				params.xhrFields = {
					withCredentials: true
				};
			}
			if (!('crossDomain' in params)) {
				params.crossDomain = true;
			}
			if (!('async' in params)) {
				params.async = true;
			}
			var req = new XMLHttpRequest();

			if (params.crossDomain) {
				if (!("withCredentials" in req) && typeof XDomainRequest !=
					"undefined" && this.isXDomainRequest(params.url)) {
					// Check if the XMLHttpRequest object has a "withCredentials" property.
					// "withCredentials" only exists on XMLHTTPRequest2 objects.
					// Otherwise, check if XDomainRequest.
					// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
					req = new XDomainRequest();
				}
			}

			if(typeof params.data != 'undefined' && typeof params.data.httpmethod != 'undefined'){
				params.type=params.data.httpmethod;
				delete params.data.httpmethod;
			}
			
			params.progress=params.progress || params.onProgress || params.onUploadProgress || function(){};
			params.abort=params.abort || params.onAbort|| function(){};
			params.success=params.success || params.onSuccess || function(){};
			params.error=params.error || params.onError || function(){};
			
			if(typeof req.addEventListener != 'undefined'){
				if(typeof params.progress == 'function'){
					req.addEventListener("progress", params.progress);
				}

				if(typeof params.abort == 'function'){
					req.addEventListener("abort", params.abort);
				}
			}			
			
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					//IE9 doesn't appear to return the request status
					if (typeof req.status == 'undefined' || (req.status >= 200 && req.status < 400)) {
						try {	
							var data=JSON.parse.call(null,req.responseText);
						} catch (e) {
							var data = req.response;
						}
						
						params.success(data, req);
					} else {
						if(debug && typeof req.responseText != 'undefined'){
							console.log(req.responseText);
						}
						if(typeof params.error == 'function'){
							try {
								var data = JSON.parse.call(null,req.responseText);
							} catch (e) {
								var data = req.responseText;
							}
							params.error(data);
						} else {
							throw req;
						}
					}
				}
			}
		
			if (params.type.toLowerCase() != 'get') {
				
				req.open(params.type.toUpperCase(), params.url, params.async);
				for (var p in params.xhrFields) {
					if (p in req) {
						req[p] = params.xhrFields[p];
					}
				}
				for (var h in params.headers) {
					if(params.headers.hasOwnProperty(h)){
						req.setRequestHeader(h, params.headers[h]);
					}
				}
				if (Mura.formdata && params.data instanceof FormData) {
					try{
						req.send(params.data);
					} catch(e){
						if(typeof params.error == 'function'){
							try {
								var data = JSON.parse.call(null,req.responseText);
							} catch (e) {
								var data = req.responseText;
							}
							params.error(data,e);
						} else {
							throw e;
						}
					}
				} else {
					req.setRequestHeader('Content-Type',
							'application/x-www-form-urlencoded; charset=UTF-8'
					);
					var query = [];
					for (var key in params.data) {
							query.push(Mura.escape(key) + '=' + Mura.escape(params.data[
									key]));
					}
					if(typeof params.data['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
							query.push('muraPointInTime=' + Mura.escape(Mura.pointInTime));
					}
					query = query.join('&');
					setTimeout(function() {
						try{
							req.send(query);
						} catch(e){
							if(typeof params.error == 'function'){
								try {
									var data = JSON.parse.call(null,req.responseText);
								} catch (e) {
									var data = req.responseText;
								}
								params.error(data,e);
							} else {
								throw e;
							}
						}
					}, 0);
				}
			} else {
				
				if (params.url.indexOf('?') == -1) {
					params.url += '?';
				}
				var query = [];
				for (var key in params.data) {
					query.push(Mura.escape(key) + '=' + Mura.escape(params.data[key]));
				}
				if(typeof params.data['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
					query.push('muraPointInTime=' + Mura.escape(Mura.pointInTime));
				}
				query = query.join('&');
				
				req.open(params.type.toUpperCase(), params.url + '&' + query, params.async);
				for (var p in params.xhrFields) {
					if (p in req) {
						req[p] = params.xhrFields[p];
					}
				}
				for (var h in params.headers) {
					if(params.headers.hasOwnProperty(h)){
						req.setRequestHeader(h, params.headers[h]);
					}
				}
				
				setTimeout(function() {
					try{
						req.send();
					} catch(e){
						if(typeof params.error == 'function'){
							if(typeof req.responseText != 'undefined'){
								try {
									var data = JSON.parse.call(null,req.responseText);
								} catch (e) {
									var data = req.responseText;
								}
								params.error(data,e);
							} else {
								params.error(req,e);
							}
						} else {
							throw e;
						}
					}
				}, 0);
			}
		},

		isXDomainRequest(url) {
			function getHostName(url) {
				var match = url.match(/:\/\/([0-9]?\.)?(.[^/:]+)/i);
				if (match != null && match.length > 2 && typeof match[2] ===
					'string' && match[2].length > 0) {
					return match[2];
				} else {
					return null;
				}
			}

			function getDomain(url) {
				var hostName = getHostName(url);
				var domain = hostName;
				if (hostName != null) {
					var parts = hostName.split('.').reverse();
					if (parts != null && parts.length > 1) {
						domain = parts[1] + '.' + parts[0];
						if (hostName.toLowerCase().indexOf('.co.uk') != -1 &&
							parts.length > 2) {
							domain = parts[2] + '.' + domain;
						}
					}
				}
				return domain;
			}
			var requestDomain = getDomain(url);
			return (requestDomain && requestDomain != location.host);
		}
	}
);