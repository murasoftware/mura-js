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
		* @param	{object} config
		* @return {Promise}
		*/
		execute(config) {
			
			if (!('type' in config)) {
				config.type = 'GET';
			}
			if (!('success' in config)) {
				config.success = function() {};
			}
			if (!('data' in config)) {
				config.data = {};
			}
			if (!('headers' in config)) {
				config.headers = {};
			}
			if (('method' in config)) {
				config.type = config.method;
			}
			if (!('dataType' in config)) {
				config.dataType = 'default';
			}
			if(config.dataType=='json'){
				config.headers['content-type']='application/json; charset=UTF-8';
			}

			config.type=config.type.toLowerCase();

			try{
				//if is in node not a FormData obj
				if(!Mura.formdata || !(config.data instanceof FormData)){
					if(config.type === 'get' 
						&& !(typeof config.url === 'string' && config.url.toLowerCase().indexOf('purgecache') > -1)
						&& typeof config.data.purgeCache === 'undefined' 
						&& typeof config.data.purgecache === 'undefined'){
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
							config.data.purgeCache=sourceParams.purgeCache;
						} else if(typeof sourceParams.purgecache != 'undefined'){
							config.data.purgecache=sourceParams.purgecache;
						}
						
					}
				}
			} catch(e){
				console.log(e)
			}

			if(typeof config.data.httpmethod != 'undefined'){
				config.type=config.data.httpmethod;
				delete config.data.httpmethod;
			}
			
			config.progress=config.progress || config.onProgress || config.onUploadProgress || function(){};
			config.download=config.download || config.onDownload || config.onDownloadProgress || function(){};
			config.abort=config.abort || config.onAbort|| function(){};
			config.success=config.success || config.onSuccess || function(){};
			config.error=config.error || config.onError || function(){};

			if(typeof XMLHttpRequest === 'undefined'){
				this.nodeRequest(config);
			} else {
				this.xhrRequest(config);
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
			headerName=headerName.toLowerCase();
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
			headerName=headerName.toLowerCase();
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
		nodeRequest(config){

			if(typeof Mura.renderMode != 'undefined'){
				config.renderMode=Mura.renderMode;
			}
		
			var self=this;
			if(typeof this.requestObject != 'undefined'){
				['Cookie','X-Client_id','X-Client_secret','X-Access_token','Access_Token','Authorization','User-Agent','Referer','X-Forwarded-For','X-Forwarded-Host','X-Forwarded-Proto'].forEach((item)=>{
					if(typeof this.requestObject.headers[item] != 'undefined'){
						config.headers[item.toLowerCase()]=this.requestObject.headers[item];
					} else {
						var lcaseItem=item.toLowerCase();
						if(typeof this.requestObject.headers[lcaseItem] != 'undefined'){
							config.headers[lcaseItem]=this.requestObject.headers[lcaseItem];
						}
					}
				})
			}	
			
			for(var h in Mura.requestHeaders){
					if(Mura.requestHeaders.hasOwnProperty(h)){
						config.headers[h.toLowerCase()]= config.requestHeaders[h];
					}
			}
			for(var h in this.requestHeaders){
					if(this.requestHeaders.hasOwnProperty(h)){
						config.headers[h.toLowerCase()]= this.requestHeaders[h];
					}
			}
			//console.log('pre:',config.headers)
			const nodeProxyHeaders = (response)=>{
				if(typeof self.responseObject != 'undefined'){
					self.responseObject.proxiedResponse=response;
					if(!self.responseObject.headersSent){
						if(response.statusCode > 300 && response.status < 400){
							const header=response.headers['location'];
							if(header){
								try{
										//match casing of mura-next connector
									self.responseObject.setHeader('location',header);
									self.responseObject.statusCode=httpResponse.statusCode;
								} catch (e){
									console.log('Error setting location header');
								}
							}
						}
						let header='';
						header=response.headers['cache-control'];
						if(header){
							try{
								//match casing of mura-next connector
								self.responseObject.setHeader('cache-control',header);
							} catch (e){
								console.log(e)
								console.log('Error setting Cache-Control header');
							}
						}
						header=response.headers['pragma'];
						if(header){
							try{
								//match casing of mura-next connector
								self.responseObject.setHeader('pragma',header);
							} catch (e){
								console.log('Error setting Pragma header');
							}
						}
					}
				}
			}

			const nodeProxyCookies = (response)=>{
				var debug=typeof Mura.debug != 'undefined' && Mura.debug;
				
				if(typeof self.responseObject != 'undefined'){
					var existingCookies=(typeof self.requestObject.headers['cookie'] != 'undefined') ? self.requestObject.headers['cookie'] : '';
					var newSetCookies=response.headers['set-cookie'];
					
					if(Array.isArray(existingCookies)){
						if(existingCookies.length){
							existingCookies=existingCookies[0];
						} else {
							existingCookies='';
						}
					}
					
					existingCookies=existingCookies.split("; ");

					if(!Array.isArray(newSetCookies)){
						newSetCookies=[];
					}

					if(debug){
						console.log('response cookies:');
						console.log(newSetCookies);
					}

					try{
						self.responseObject.setHeader('set-cookie',newSetCookies);
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

			require('axios').default.request(
				this.MuraToAxiosConfig(config)
			).then(function(response){
				nodeProxyCookies(response);
				nodeProxyHeaders(response);
				if(typeof config.success == 'function'){
					try {
						var data = JSON.parse.call(null,response.data);
					} catch (e) {
						var data = response.data;
					}
					config.success(data);
				}
			})
			.catch(function(response){
				nodeProxyCookies(response);
				nodeProxyHeaders(response);
				if(typeof config.error == 'function'){
					try {
						var data = JSON.parse.call(null,response.data);
					} catch (e) {
						var data = response.data;
					}
					config.error(data);	
				} else {
					throw e;
				}
			});
		},
		xhrRequest(config){	
			for(var h in Mura.requestHeaders){
				if(Mura.requestHeaders.hasOwnProperty(h)){
					config.headers[h.toLowerCase()]= Mura.requestHeaders[h];
				}
			}
			for(var h in this.requestHeaders){
				if(this.requestHeaders.hasOwnProperty(h)){
					config.headers[h.toLowerCase()]= this.requestHeaders[h];
				}
			}
			if (!(Mura.formdata && config.data instanceof FormData)) {
				config.data = Mura.deepExtend({}, config.data);
				for (var p in config.data) {
					if (typeof config.data[p] == 'object') {
						config.data[p] = JSON.stringify(config.data[p]);
					}
				}
			}
			if (!('xhrFields' in config)) {
				config.xhrFields = {
					withCredentials: true
				};
			}
			if (!('crossDomain' in config)) {
				config.crossDomain = true;
			}
			if (!('async' in config)) {
				config.async = true;
			}

			require('axios').default.request(
				this.MuraToAxiosConfig(config)
			).then(function(response){
				try {	
					var data=JSON.parse.call(null,response.data);
					data=data.ta;
				} catch (e) {
					var data = response.data;
				}
				config.success(data);
			}).catch(function(response){
				if(typeof config.error == 'function'){
					try {
						var data = JSON.parse.call(null,response.error);
					} catch (e) {
						var data = response.error;
					}
					config.error(data);	
				} else {
					throw e;
				}
			});
				
		},
		MuraToAxiosConfig(config){
			const parsedConfig={
				responseType:'text',
				method: config.type,
				headers:config.headers,
				url:config.url,
				onUploadProgress: config.progress,
				onDownloadProgress: config.download,
				withCredentials: true
			};

			if(config.type==='get'){
				parsedConfig.params=config.data;

				if(typeof parsedConfig.params['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
					parsedConfig.params['muraPointInTime']=Mura.pointInTime;
				}

			} else {
				parsedConfig.data=config.data;
			}
			
			if(parsedConfig.method !='get'){
				 if (config.dataType=='json') {
					parsedConfig.headers['content-type']='application/json; charset=UTF-8';
				} else if (Mura.formdata && parsedConfig.data instanceof FormData){
					parsedConfig.headers['content-type']='multipart/form-data; charset=UTF-8';
				} else {
					parsedConfig.headers['content-type']='application/x-www-form-urlencoded; charset=UTF-8';

					if(typeof parsedConfig.data['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
						parsedConfig.data['muraPointInTime']=Mura.pointInTime;
					}
					//Use formData when in the browser
					if(typeof XMLHttpRequest !== 'undefined' && parsedConfig.method !=='get' && config.dataType!=='json'){
						let formData=false;

						if(Mura.formdata){
							formData=new FormData();
						} else if (Mura.isInNode()){
							formData=new Mura._formData();
						}	

						if(formData){
							Object.keys(parsedConfig.data).forEach((key)=>{
								if(typeof parsedConfig.data[key]==='boolean'){
									//boolean values seem to throw error in node-fetch
									if(parsedConfig.data[key]){
										formData.append(key, 'true');
									} else {
										formData.append(key, 'false');
									}
								} else  {
									formData.append(key, parsedConfig.data[key]);
								}
							})

							parsedConfig.data=formData;
						}
					}
				}
			}
		
			return parsedConfig;
			
		}
	}
);