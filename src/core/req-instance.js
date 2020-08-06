
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
			
			var debug=typeof Mura.debug != 'undefined' && Mura.debug;
			var self=this;
			if(typeof this.requestObject != 'undefined'){
				params.headers['User-Agent']='MuraJS';
				if(typeof this.requestObject.headers['cookie'] != 'undefined'){
					if(debug){
						console.log('pre cookies:');
						console.log(this.requestObject.headers['cookie']);
					}
					params.headers['Cookie']=this.requestObject.headers['cookie'];
				}
				if(typeof this.requestObject.headers['x-client_id'] != 'undefined'){
					params.headers['X-client_id']=this.requestObject.headers['x-client_id'];
				}
				if(typeof this.requestObject.headers['x-client_id'] != 'undefined'){
					params.headers['X-client_id']=this.requestObject.headers['x-client_id'];
				}
				if(typeof this.requestObject.headers['X-client_secret'] != 'undefined'){
					params.headers['X-client_secret']=this.requestObject.headers['X-client_secret'];
				}
				if(typeof this.requestObject.headers['x-client_secret'] != 'undefined'){
					params.headers['X-client_secret']=this.requestObject.headers['x-client_secret'];
				}
				if(typeof this.requestObject.headers['X-access_token'] != 'undefined'){
					params.headers['X-access_token']=this.requestObject.headers['X-access_token'];
				}
				if(typeof this.requestObject.headers['x-access_token'] != 'undefined'){
					params.headers['X-access_token']=this.requestObject.headers['x-access_token'];
				}
				if(typeof this.requestObject.headers['x-client-id'] != 'undefined'){
					params.headers['X-client-id']=this.requestObject.headers['x-client-id'];
				}
				if(typeof this.requestObject.headers['x-clien-id'] != 'undefined'){
					params.headers['X-client-id']=this.requestObject.headers['x-client-id'];
				}
				if(typeof this.requestObject.headers['X-client_secret'] != 'undefined'){
					params.headers['X-client-secret']=this.requestObject.headers['X-client-secret'];
				}
				if(typeof this.requestObject.headers['x-client-secret'] != 'undefined'){
					params.headers['X-client-secret']=this.requestObject.headers['x-client-secret'];
				}
				if(typeof this.requestObject.headers['X-access-token'] != 'undefined'){
					params.headers['X-access-token']=this.requestObject.headers['X-access-token'];
				}
				if(typeof this.requestObject.headers['x-access-token'] != 'undefined'){
					params.headers['X-access-token']=this.requestObject.headers['x-access-token'];
				}
				if(typeof this.requestObject.headers['Authorization'] != 'undefined'){
					params.headers['Authorization']=this.requestObject.headers['Authorization'];
				}
				if(typeof this.requestObject.headers['authorization'] != 'undefined'){
					params.headers['Authorization']=this.requestObject.headers['authorization'];
				}
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

			const nodeProxyCookies = (httpResponse)=>{
				var debug=typeof Mura.debug != 'undefined' && Mura.debug;
				
				if(typeof self.responseObject != 'undefined'){
					var existingCookies=((typeof self.requestObject.headers['cookie'] != 'undefined') ? self.requestObject.headers['cookie'] : '').split("; ");
					var newSetCookies=httpResponse.headers.get('set-cookie');
					
					if(newSetCookies){
						newSetCookies=newSetCookies.split(",");
					} else {
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
				nodeResponseHandler(res,body);
			}
				
			if (params.type.toLowerCase() === 'post') {
					const formData=new Mura._formData();

					Object.keys(params.data).forEach((key)=>{
						formData.append(key, params.data[key]);
					})

					Mura._fetch(
						params.url,
						{
							method:"POST",
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
					params.url + query,
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
		
			if (params.type.toLowerCase() == 'post') {
				
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
