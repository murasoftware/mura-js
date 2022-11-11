function attach(Mura){

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
			init(request, response, headers, renderMode) {
				this.requestObject=request;
				this.responseObject=response;
				this.requestHeaders=headers || {};
				this.inNode=Mura.isInNode();
				this.renderMode=(typeof renderMode != 'undefined') ? renderMode : Mura.getRenderMode();
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
				
				Mura.normalizeRequestConfig(config);
	
				config.type=config.type.toLowerCase();
	
				try{
					//if is in node not a FormData obj
					if(this.inNode || !(config.data instanceof FormData)){
						if(config.type === 'get' 
							&& !(typeof config.url === 'string' && config.url.toLowerCase().indexOf('purgecache') > -1)
							&& typeof config.data.purgeCache === 'undefined' 
							&& typeof config.data.purgecache === 'undefined'){
							var sourceParams={};
	
							if(!this.inNode
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
			
				if(this.inNode){
					this.nodeRequest(config);
				} else {
					this.browserRequest(config);
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
				if(typeof this.renderMode != 'undefined'){
					config.renderMode=this.renderMode;
				} 
			
				const self=this;
				if(typeof this.requestObject != 'undefined' && typeof this.requestObject.headers != 'undefined'){
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
				
				let h;
	
				for( h in Mura.requestHeaders){
						if(Mura.requestHeaders.hasOwnProperty(h)){
							config.headers[h.toLowerCase()]= Mura.requestHeaders[h];
						}
				}
				for( h in this.requestHeaders){
						if(this.requestHeaders.hasOwnProperty(h)){
							config.headers[h.toLowerCase()]= this.requestHeaders[h];
						}
				}
		
				const nodeProxyHeaders = (response)=>{
					if(typeof self.responseObject != 'undefined'){
						self.responseObject.proxiedResponse=response;
						if(!self.responseObject.headersSent){
							let incomingHeaders={};
	
							response.headers.forEach((value,key)=>{
								incomingHeaders[key.toLowerCase()]=value;
							})
							if(response.statusCode > 300 && response.status < 400){
								const header=incomingHeaders['location'];
								if(header){
									try{
											//match casing of mura-next connector
										self.responseObject.setHeader('location',header);
										self.responseObject.statusCode=response.statusCode;
									} catch (e){
										console.log('Error setting location header');
									}
								}
							}
							let header='';
							header=incomingHeaders['cache-control'];
							if(header){
								try{
									//match casing of mura-next connector
									self.responseObject.setHeader('cache-control',header);
								} catch (e){
									console.log(e)
									console.log('Error setting Cache-Control header');
								}
							}
							header=incomingHeaders['pragma'];
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
					let debug=typeof Mura.debug != 'undefined' && Mura.debug;
					
					if(typeof self.responseObject != 'undefined' && typeof self.requestObject != 'undefined' && typeof self.requestObject.headers !='undefined'){
						let existingCookies=(typeof self.requestObject.headers['cookie'] != 'undefined') ? self.requestObject.headers['cookie'] : '';
						let incomingHeaders={};
	
						response.headers.forEach((value,key)=>{
							incomingHeaders[key.toLowerCase()]=value;
						})
						
						let newSetCookies=incomingHeaders['set-cookie'];
	
						if(Array.isArray(existingCookies)){
							if(existingCookies.length){
								existingCookies=existingCookies[0];
							} else {
								existingCookies='';
							}
						}
						
						existingCookies=existingCookies.split("; ");
	
						if(!Array.isArray(newSetCookies)){
							if(typeof newSetCookies==='string'){
								newSetCookies=newSetCookies.split("; ");
							} else {
								newSetCookies=[];
							}
						}
	
						if(debug){
							console.log('response cookies:');
							console.log(newSetCookies);
						}
						
						if(newSetCookies.length){
							try{
								let setCookieAccumulator=[];
								let existingSetCookie = self.responseObject.getHeader('set-cookie');
						
								if(!Array.isArray(existingSetCookie)){
									if(!existingSetCookie){
										existingSetCookie=[];
									} else if(typeof existingSetCookie=='string'){
										existingSetCookie=[existingSetCookie];
									} else {
										existingSetCookie=[];
									}
								}
								for (let i = 0; i < existingSetCookie.length; i++) {
									setCookieAccumulator[i] = existingSetCookie[i];
								}
								for (let i = 0; i < newSetCookies.length; i++) {
									setCookieAccumulator[i] = newSetCookies[i];
								}
	
								self.responseObject.setHeader('set-cookie',setCookieAccumulator);
							} catch (e){
								console.log(e);
							}
						}
	
						let cookieMap={};
						let setMap={};
						let c;
						let tempCookie;
						// pull out existing cookies
						if(existingCookies.length){
							for( c in existingCookies){
								tempCookie=existingCookies[c];
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
							for( c in newSetCookies){
								tempCookie=newSetCookies[c];
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
						let cookie='';
						// put cookies back in in the same order that they came out
						if(existingCookies.length){
							for(c in existingCookies){
								tempCookie=existingCookies[c];
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
							for( c in newSetCookies){
								tempCookie=newSetCookies[c];
								if(typeof tempCookie != 'undefined'){
									tempCookie=tempCookie.split(" ")[0].split("=");
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
				
				const parsedConfig=this.parseRequestConfig(config);
	
				fetch(parsedConfig.url,parsedConfig).then(
					function(response){
						nodeProxyCookies(response);
						nodeProxyHeaders(response);
						response.text().then((body)=>{
							let result='';
							try{
								result=JSON.parse.call(null,body);
							} catch(e){
								result=body;
							}
							config.success(result,response);
						}).catch((error)=>{
							if (response.status >= 500) {
								console.log(error)
								config.error(error);
							} else {
								config.success('',response);
							}
						})
					},
					function(response){
						console.log(response)
						throw new Error(response.statusText)
					}
				);
	
			},
			browserRequest(config){	
				let h;
	
				for( h in Mura.requestHeaders){
					if(Mura.requestHeaders.hasOwnProperty(h)){
						config.headers[h.toLowerCase()]= Mura.requestHeaders[h];
					}
				}
				for( h in this.requestHeaders){
					if(this.requestHeaders.hasOwnProperty(h)){
						config.headers[h.toLowerCase()]= this.requestHeaders[h];
					}
				}
				const parsedConfig=this.parseRequestConfig(config);
				
				if(
					typeof parsedConfig.onUploadProgress == 'function'
					|| typeof parsedConfig.onDownloadProgress == 'function'
				){
					//Fetch doesn't support progress events
					this.xhrRequest(config);
				} else {
					fetch(parsedConfig.url,parsedConfig).then(
						function(response){
							response.text().then((body)=>{
								let result='';
								try{
									result=JSON.parse.call(null,body);
								} catch(e){
									result=body;
								}
								config.success(result,response);
							}).catch((error)=>{
								if (response.status >= 500) {
									console.log(error)
									config.error(error);
								} else {
									config.success('',response);
								}
							})
						},
						function(response){
							console.log(response)
							throw new Error(response.statusText)
						}
					);
				}
			},
			xhrRequest(config){
				var debug=typeof Mura.debug != 'undefined' && Mura.debug;
				for(var h in Mura.requestHeaders){
					if(Mura.requestHeaders.hasOwnProperty(h)){
						config.headers[h]= Mura.requestHeaders[h];
					}
				}
				for(var h in this.requestHeaders){
					if(this.requestHeaders.hasOwnProperty(h)){
						config.headers[h]= this.requestHeaders[h];
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
				var req = new XMLHttpRequest();
	
				if(typeof config.data != 'undefined' && typeof config.data.httpmethod != 'undefined'){
					config.method=params.data.httpmethod;
					delete config.data.httpmethod;
				}
		
				if(typeof req.addEventListener != 'undefined'){
					if(typeof params.progress == 'function'){
						req.addEventListener("progress", config.progress);
					}
	
					if(typeof params.abort == 'function'){
						req.addEventListener("abort", config.abort);
					}
				}			
				
				req.onreadystatechange = function() {
					if (req.readyState == 4) {
						if(debug && typeof req.responseText != 'undefined'){
							console.log(req.responseText);
						}
						if(typeof config.error == 'function'){
							try {
								var data = JSON.parse.call(null,req.responseText);
							} catch (e) {
								var data = req.responseText;
							}
							config.error(data);
						} else {
							throw req;
						}
					}
				}
			
				if (config.method.toLowerCase() != 'get') {
					
					req.open(config.method.toUpperCase(), config.url, config.async);
					for (var p in config.xhrFields) {
						if (p in req) {
							req[p] = config.xhrFields[p];
						}
					}
					for (var h in config.headers) {
						if(config.headers.hasOwnProperty(h)){
							req.setRequestHeader(h, config.headers[h]);
						}
					}
					if (config.data instanceof FormData) {
						try{
							req.send(config.data);
						} catch(e){
							if(typeof config.error == 'function'){
								try {
									var data = JSON.parse.call(null,req.responseText);
								} catch (e) {
									var data = req.responseText;
								}
								config.error(data,e);
							} else {
								throw e;
							}
						}
					} else {
						req.setRequestHeader('Content-Type',
							'application/x-www-form-urlencoded; charset=UTF-8'
						);
	
						setTimeout(()=>{
							try{
								req.send(this.serializeParams(config.data));
							} catch(e){
								if(typeof config.error == 'function'){
									try {
										var data = JSON.parse.call(null,req.responseText);
									} catch (e) {
										var data = req.responseText;
									}
									config.error(data,e);
								} else {
									throw e;
								}
							}
						}, 0);
					}
				} else {
					req.open(config.method.toUpperCase(), config.url, config.async);
					for (var p in config.xhrFields) {
						if (p in req) {
							req[p] = config.xhrFields[p];
						}
					}
					for (var h in config.headers) {
						if(config.headers.hasOwnProperty(h)){
							req.setRequestHeader(h, config.headers[h]);
						}
					}
					
					setTimeout(function() {
						try{
							req.send();
						} catch(e){
							if(typeof config.error == 'function'){
								if(typeof req.responseText != 'undefined'){
									try {
										var data = JSON.parse.call(null,req.responseText);
									} catch (e) {
										var data = req.responseText;
									}
									config.error(data,e);
								} else {
									config.error(req,e);
								}
							} else {
								throw e;
							}
						}
					}, 0);
				}
			},
			serializeParams(params){
				const query = [];
				for (let key in params) {
					if(params.hasOwnProperty(key)){
						let val=params[key];
						if (typeof val == 'object') {
							val = JSON.stringify(val);
						}
						query.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
					}
				}	
				return query.join('&');
			},
			parseRequestConfig(config){
				const parsedConfig={
					method: config.type,
					headers:config.headers,
					url:config.url,
					onUploadProgress: config.progress,
					onDownloadProgress: config.download,
					credentials: "include",
					mode: "cors"
				};
				
				if(parsedConfig.method.toLowerCase() != 'get'){
					delete parsedConfig['cache-control'];
				}

				const sendJSON=(parsedConfig.headers['content-type'] && parsedConfig.headers['content-type'].indexOf('json') >-1);
				const sendFormData=!this.inNode && config.data instanceof FormData;
				
				if(parsedConfig.method.toLowerCase()=='get'){
					//GET send params and not data
					const params=Mura.deepExtend({}, config.data)
					
					if(typeof params['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
						params['muraPointInTime']=Mura.pointInTime;
					}
	
					const queryString = this.serializeParams(params);
	
					if(config.maxQueryStringLength){
						if(config.maxQueryStringLength && (queryString.length > config.maxQueryStringLength)){
							parsedConfig.headers['content-type']='application/x-www-form-urlencoded; charset=UTF-8';
							parsedConfig.data = queryString;
							parsedConfig.method='post';
						} else {
							if(parsedConfig.url.indexOf('?') > -1){
								parsedConfig.url += ('&' + queryString);
							} else {
								parsedConfig.url += ('?' + queryString);
							}
						}
					} else {
						if(parsedConfig.url.indexOf('?') > -1){
							parsedConfig.url += ('&' + queryString);
						} else {
							parsedConfig.url += ('?' + queryString);
						}
					}
				
					return parsedConfig;
				} 
	
				if(sendJSON){
					parsedConfig.body=JSON.stringify.call(null.Mura.extend({},config.data));
				} else {
					if (sendFormData){
						parsedConfig.body=config.data;
					} else {
						parsedConfig.data=Mura.extend({}, config.data);
						if(typeof parsedConfig.data['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
							parsedConfig.data['muraPointInTime']=Mura.pointInTime;
						}
					}
			
					if (sendFormData){
						//We use xhr to send form data when progress handlers are present
						if(!parsedConfig.progress && !parsedConfig.download){
							delete parsedConfig.headers['content-type'];
						} else {
							parsedConfig.headers['content-type']='multipart/form-data; charset=UTF-8';
						}
					
					} else {
						parsedConfig.headers['content-type']='application/x-www-form-urlencoded; charset=UTF-8';
						parsedConfig.data=Mura.extend({},config.data);
					
						if(typeof parsedConfig.data['muraPointInTime'] == 'undefined' && typeof Mura.pointInTime != 'undefined'){
							parsedConfig.data['muraPointInTime']=Mura.pointInTime;
						}
	
						parsedConfig.body = this.serializeParams(parsedConfig.data);
					
					}
				}	
	
				return parsedConfig;
				
			}
		}
	);
	
	}
	
	module.exports=attach;