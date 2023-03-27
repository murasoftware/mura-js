/**
* Creates a new Mura.RequestContext
* @name	Mura.RequestContext
* @class
* @extends Mura.Core
* @memberof Mura
* @param	{object} request		 Siteid
* @param	{object} response Entity name
* @param	{object} requestHeaders Optional
* @return {Mura.RequestContext} Self
*/

function attach(Mura){

Mura.RequestContext=Mura.Core.extend(
/** @lends Mura.RequestContext.prototype */
{
	init(request, response, headers, siteid, endpoint ,mode) {
		//Logic aded to support single config object arg
		if(typeof request==='object' 
			&& typeof response === 'undefined'){
				var config=request;
				request=config.req || config.request;
				response=config.res || config.response;
				headers=config.headers;
				siteid=config.siteid;
				endpoint=config.endpoint;
				mode=config.mode;
				renderMode=config.renderMode;
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

		this.siteid=siteid || Mura.siteid;
		this.apiEndpoint=endpoint || Mura.getAPIEndpoint();
		this.mode=mode || Mura.getMode();
		this.renderMode=(typeof renderMode != 'undefined') ? renderMode : Mura.getRenderMode();
		this.requestObject=request;
		this.responseObject=response;
		this._request=new Mura.Request(request, response, headers, this.renderMode);

		if(this.mode=='rest'){
			this.apiEndpoint=this.apiEndpoint.replace('/json/', '/rest/');
		}

		return this;
	},

	/**
	 * setRequestHeader - Initialiazes feed
	 *
	 * @param	{string} headerName	Name of header
	 * @param	{string} value Header value
	 * @return {Mura.RequestContext}	Self
	 */
	setRequestHeader(headerName,value){
		this._request.setRequestHeader(headerName,value);
		return this;
	},

	/**
	 * getRequestHeader - Returns a request header value
	 *
	 * @param	{string} headerName	Name of header
	 * @return {string} header Value
	 */
	getRequestHeader(headerName){
		return this._request.getRequestHeader(headerName);
	},

	/**
	 * getAPIEndpoint() - Returns api endpoint
	 *
	 * @return {string} api endpoint
	 */
	 getAPIEndpoint(){
		return this.apiEndpoint;
	},

	/**
	 * setAPIEndpoint() - sets api endpoint
	 * 
	 * @param	{string} apiEndpoint apiEndpoint
	 * @return {object} self
	 */
	 setAPIEndpoint(apiEndpoint){
		this.apiEndpoint=apiEndpoint;
		return this;
	},

	/**
	 * getMode() - Returns context's mode either rest or json
	 *
	 * @return {string} mode
	 */
	 getMode(){
		return this.mode;
	},

	/**
	 * setAPIEndpoint() - sets context's mode either rest or json
	 * 
	 * @param	{string} mode mode
	 * @return {object} self
	 */
	 setMode(mode){
		this.mode=mode;
		if(this.mode=='rest'){
			this.apiEndpoint=this.apiEndpoint.replace('/json/', '/rest/');
		} else {
			this.apiEndpoint=this.apiEndpoint.replace('/rest/', '/json/');
		}
		return this;
	},

	/**
	 * getRequestHeaders - Returns a request header value
	 *
	 * @return {object} All Headers
	 */
	getRequestHeaders(){
		return this._request.getRequestHeaders();
	},

	/**
	 * request - Executes a request
	 *
	 * @param	{object} params		 Object
	 * @return {Promise}						Self
	 */
	request(config){
		return this._request.execute(config);
	},

	/**
	 * renderFilename - Returns "Rendered" JSON object of content
	 *
	 * @param	{type} filename Mura content filename
	 * @param	{type} params Object
	 * @return {Promise}
	 */
	renderFilename(filename, params) {
		var query = [];
		var self=this;
		params = params || {};
		params.filename = params.filename || '';
		params.siteid = params.siteid || this.siteid;

		const cache=params.cache || 'default';
		delete params.cache;

		const next=params.next || {};
		delete params.next;

		for (var key in params) {
			if (key != 'entityname' && key != 'filename' && key !=
				'siteid' && key != 'method') {
				query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
			}
		}

		return new Promise(function(resolve, reject) {
			self.request({
				async: true,
				type: 'get',
				cache: cache,
				next: next,
				url: self.apiEndpoint + '/content/_path/' + filename + '?' + query.join('&'),
				success(resp) {
					if (resp != null && typeof location != 'undefined' && typeof resp.data != 'undefined' && typeof resp.data.redirect != 'undefined' && typeof resp.data.contentid == 'undefined') {
						if (resp.data.redirect && resp.data.redirect != location.href) {
							location.href = resp.data.redirect;
						} else {
							location.reload(true);
						}
					} else {
						var item = new Mura.entities.Content({},self);
						item.set(resp.data);
						resolve(item);
					}
				},
				error(resp) {
					if (resp != null && typeof resp.data != 'undefined' && typeof resp.data != 'undefined' && typeof resolve == 'function') {
						var item = new Mura.entities.Content({},self);
						item.set(resp.data);
						resolve(item);
					} else if (typeof reject == 'function') {
						reject(resp);
					}
				}
			});
		});
	},

	/**
	 * findText - Returns content associated with text
	 *
	 * @param	{type} text 
	 * @param	{type} params Object
	 * @return {Promise}
	 */
	findText(text, params) {
		var self=this;
		params = params || {};
		params.text = text || params.text || '';
		params.siteid = params.siteid || this.siteid;
		params.method = "findtext";
		
		const cache=params.cache || 'default';
		delete params.cache;

		const next=params.next || {};
		delete params.next;

		return new Promise(function(resolve, reject) {
			self.request({
				type: 'get',
				url: self.apiEndpoint,
				cache: cache,
				next: next,
				data: params,
				success(resp) {
					var collection = new Mura.EntityCollection(resp.data,self)
					if (typeof resolve == 'function') {
						resolve(collection);
					}
				},
				error(resp){
					console.log(resp);
				}
			});
		});
	},

	/**
	 * getEntity - Returns Mura.Entity instance
	 *
	 * @param	{string} entityname Entity Name
	 * @param	{string} siteid		 Siteid
	 * @return {Mura.Entity}
	 */
	getEntity(entityname, siteid) {
		if (typeof entityname == 'string') {
			var properties = {
				entityname: entityname.substr(0, 1).toUpperCase() + entityname.substr(1)
			};
			properties.siteid = siteid || this.siteid;
		} else {
			properties = entityname;
			properties.entityname = properties.entityname || 'Content';
			properties.siteid = properties.siteid || this.siteid;
		}

		properties.links={
			permissions:this.apiEndpoint + properties.entityname + "/permissions"
		}

		if (Mura.entities[properties.entityname]) {
			var entity=new Mura.entities[properties.entityname](properties,this);
			return entity;
		} else {
			var entity=new Mura.Entity(properties,this);
			return entity;
		}
	},

	/**
	 * getBean - Returns Mura.Entity instance
	 *
	 * @param	{string} entityname Entity Name
	 * @param	{string} siteid		 Siteid
	 * @return {Mura.Entity}
	 */
	 getBean(entityname, siteid) {
		return this.getEntity(entityname, siteid);
	},

	/**
	 * declareEntity - Declare Entity with in service factory
	 *
	 * @param	{object} entityConfig Entity config object
	 * @return {Promise}
	 */
	declareEntity(entityConfig) {
		var self=this;
		if(this.getMode().toLowerCase() == 'rest'){
			return new Promise(function(resolve, reject) {
				self.request({
					async: true,
					type: 'POST',
					url: self.apiEndpoint,
					data:{
						method: 'declareEntity',
						entityConfig: encodeURIComponent(JSON.stringify(entityConfig))
					},
					success(resp) {
						if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
							resolve(resp.data);
						} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
							resolve(resp);
						} else if (typeof resolve =='function'){
							resolve(resp);
						}
					}
				});
			});
		} else {
			return new Promise(function(resolve, reject) {
				self.request({
					type: 'POST',
					url: self.apiEndpoint + '?method=generateCSRFTokens',
					data: {context: ''},
					success(resp) {
						self.request({
							async: true,
							type: 'POST',
							url: self.apiEndpoint,
							data:{
								method: 'declareEntity',
								entityConfig: encodeURIComponent(JSON.stringify(entityConfig)),
								'csrf_token': resp.data.csrf_token,
								'csrf_token_expires': resp.data.csrf_token_expires
							},
							success(resp) {
								if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
									resolve(resp.data);
								} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
									resolve(resp);
								} else if (typeof resolve =='function'){
									resolve(resp);
								}
							}
						});
					}
				});
			});
		}
	},

	/**
	 * undeclareEntity - Delete entity class from Mura
	 *
	 * @param	{object} entityName
	 * @return {Promise}
	 */
	undeclareEntity(entityName,deleteSchema) {
		var self=this;
		deleteSchema=deleteSchema || false;
		if(this.getMode().toLowerCase() == 'rest'){
			return new Promise(function(resolve, reject) {
				self.request({
					async: true,
					type: 'POST',
					url: self.apiEndpoint,
					data:{
						method: 'undeclareEntity',
						entityName: entityName,
						deleteSchema : deleteSchema
					},
					success(resp) {
						if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
							resolve(resp.data);
						} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
							resolve(resp);
						} else if (typeof resolve =='function'){
							resolve(resp);
						}
					}
				});
			});
		} else {
			return new Promise(function(resolve, reject) {
				self.request({
					type: 'POST',
					url: self.apiEndpoint + '?method=generateCSRFTokens',
					data: {context: ''},
					success(resp) {
						self.request({
							async: true,
							type: 'POST',
							url: self.apiEndpoint,
							data:{
								method: 'undeclareEntity',
								entityName: entityName,
								deleteSchema : deleteSchema,
								'csrf_token': resp.data.csrf_token,
								'csrf_token_expires': resp.data.csrf_token_expires
							},
							success(resp) {
								if (typeof resolve =='function' && resp != null && typeof resp.data != 'undefined') {
									resolve(resp.data);
								} else if (typeof reject =='function' && resp != null && typeof resp.error != 'undefined') {
									resolve(resp);
								} else if (typeof resolve =='function'){
									resolve(resp);
								}
							}
						});
					}
				});
			});
		}
	},

	/**
	 * getFeed - Return new instance of Mura.Feed
	 *
	 * @param	{type} entityname Entity name
	 * @return {Mura.Feed}
	 */
	getFeed(entityname,siteid) {
			Mura.feeds=Mura.feeds || {};
			siteid=siteid || this.siteid;
			if(typeof entityname==='string'){
				entityname=entityname.substr(0, 1).toUpperCase() + entityname.substr(1);
				if(Mura.feeds[entityname]){
					var feed=new Mura.feeds[entityname](siteid, entityname, this);
					return feed;
				}
			} 

			var feed=new Mura.Feed(siteid, entityname, this);
			return feed;
	},

	/**
	 * getCurrentUser - Return Mura.Entity for current user
	 *
	 * @param	{object} params Load parameters, fields:listoffields
	 * @return {Promise}
	 */
	getCurrentUser(params) {
			var self=this;
			params=params || {};
			params.fields=params.fields || '';
			return new Promise(function(resolve, reject) {
				if (self.currentUser) {
					resolve(self.currentUser);
				} else {
					self.request({
						async: true,
						type: 'get',
						url: self.apiEndpoint +
							'findCurrentUser?fields=' + params.fields,
						cache: 'no-cache',
						success(resp) {
							if (typeof resolve =='function') {
								self.currentUser = self.getEntity('user');
								self.currentUser.set(resp.data);
								resolve(self.currentUser);
							}
						},
						error(resp) {
							if (typeof resolve =='function') {
								self.self=self.getEntity('user')
								self.currentUser.set( resp.data);
								resolve(self.currentUser);
							}
						}
					});
				}
			});
	},

	/**
	 * findQuery - Returns Mura.EntityCollection with properties that match params
	 *
	 * @param	{object} params Object of matching params
	 * @return {Promise}
	 */
	findQuery(params) {
			var self=this;
			params = params || {};
			params.entityname = params.entityname || 'content';
			params.siteid = params.siteid || this.siteid;
			params.method = params.method || 'findQuery';

			const cache=params.cache || 'default';
			delete params.cache;
	
			const next=params.next || {};
			delete params.next;

			return new Promise(function(resolve, reject) {
				self.request({
					type: 'get',
					url: self.apiEndpoint,
					cache: cache,
					next: next,
					data: params,
					success(resp) {
						var collection = new Mura.EntityCollection(resp.data,self)
						if (typeof resolve == 'function') {
							resolve(collection);
						}
					},
					error(resp){
						console.log(resp);
					}
				});
			});
	},

	/**
	 * login - Logs user into Mura
	 *
	 * @param	{string} username Username
	 * @param	{string} password Password
	 * @param	{string} siteid	 Siteid
	 * @return {Promise}
	 */
	login(username, password, siteid) {
		siteid = siteid || this.siteid;
		var self=this;
		return new Promise(function(resolve, reject) {
			self.request({
				type: 'post',
				url: self.apiEndpoint +
						'?method=generateCSRFTokens',
				data: {
						siteid: siteid,
						context: 'login'
				},
				success(resp) {
					self.request({
						async: true,
						type: 'post',
						url: self.apiEndpoint,
						data: {
							siteid: siteid,
							username: username,
							password: password,
							method: 'login',
							'csrf_token': resp.data.csrf_token,
							'csrf_token_expires': resp.data.csrf_token_expires
						},
						success(resp) {
							resolve(resp.data);
						}
					});
				}
			});
		});
	},

	/**
	* openGate - Open's content gate when using MXP
	*
	* @param	{string} contentid Optional: default's to Mura.contentid
	* @return {Promise}
	* @memberof {class
	*/
	openGate(contentid) {
		var self=this;
		contentid=contentid || Mura.contentid;
		if(contentid){
			if(this.getMode().toLowerCase() == 'rest'){
				return new Promise(function(resolve, reject) {
					self.request({
						async: true,
						type: 'POST',
						url: self.apiEndpoint + '/gatedasset/open',
						data:{
							contentid: contentid
						},
						success(resp) {
							if (typeof resolve =='function' && typeof resp.data != 'undefined') {
								resolve(resp.data);
							} else if (typeof reject =='function' && typeof resp.error != 'undefined') {
								resolve(resp);
							} else if (typeof resolve =='function'){
								resolve(resp);
							}
						}
					});
				});
			} else {
				return new Promise(function(resolve, reject) {
					self.request({
						type: 'POST',
						url: self.apiEndpoint + '?method=generateCSRFTokens',
						data: {context: contentid},
						success(resp) {
							self.request({
								async: true,
								type: 'POST',
								url: self.apiEndpoint + '/gatedasset/open',
								data:{
									contentid: contentid
								},
								success(resp) {
									if (typeof resolve =='function' && typeof resp.data != 'undefined') {
										resolve(resp.data);
									} else if (typeof reject =='function' && typeof resp.error != 'undefined') {
										resolve(resp);
									} else if (typeof resolve =='function'){
										resolve(resp);
									}
								}
							});
						}
					});
				});
			}
		}
	},

	/**
	 * logout - Logs user out
	 *
	 * @param	{type} siteid Siteid
	 * @return {Promise}
	 */
	logout(siteid) {
		siteid = siteid || this.siteid;
		var self=this;
		return new Promise(function(resolve, reject) {
			self.request({
				async: true,
				type: 'post',
				url: self.apiEndpoint,
				data: {
					siteid: siteid,
					method: 'logout'
				},
				success(resp) {
					resolve(resp.data);
				}
			});
		});
	},

	/**
	 * normalizeRequest - I normalize protocol requests
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @return {Promise}
	 */
	 normalizeRequest(type,url,data,config){
		
		if(typeof url == 'object'){
			data=url.body || url.data || {};
			config=url;
			url=url.url;
		} else {
			data=data || {};
			config=config || {};
		}
		
		config.type=type;
		config.url=url || this.getAPIEndpoint();
		config.data=data || {};
		
		if(config.url.substr(0,1) === '/' || config.url.toLowerCase().substr(0,4) !== 'http'){
			config.url= this.getAPIEndpoint() + config.url;
		}

		if(config.body){
			config.data=config.body;
			delete config.body;	
		}

		config.isfetch=config.isfetch || false;

		Mura.normalizeRequestConfig(config);
	
		var self=this;
		data = data || {};
		
		if(config.isfetch){
			return self.request(config);
		} else {
			return new Promise(function(resolve, reject) {
	
				if(typeof resolve == 'function'){
					config.success=resolve;
				}
		
				if(typeof reject == 'function'){
					config.error=reject;
				}
				
				var normalizedConfig=Mura.extend({},config);
	
				return self.request(normalizedConfig);
			});
		}
		
	},

	/**
	 * fetch - Make fetch request's that maintian Mura's state management and cookie proxying
	 * @param	{string} resource
	 * @param	{object} options
	 * @return {Promise}
	 * @memberof {class} Mura
	 */
	fetch(resource,options) {
		if(typeof resource=='object'){
			resource.method=resource.method || 'GET';
			resource.isfetch=true;
			return this.normalizeRequest(resource.method,resource);
		} else {
			options=options || {};
			options.method=options.method || 'GET';
			options.url=resource;
			options.isfetch=true;
			return this.normalizeRequest(options.method,options);
		}
	},

	/**
	 * get - Make GET request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @param	{object} config request config 
	 * @return {Promise}
	 */
	get(url, data, config) {
		return this.normalizeRequest('get',url, data, config);
	},

	/**
	 * post - Make POST request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @param	{object} config request config 
	 * @return {Promise}
	 */
	post(url, data, config) {
		return this.normalizeRequest('post',url, data, config);
	},

	/**
	 * put - Make PUT request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @param	{object} config request config 
	 * @return {Promise}
	 */
	put(url, data, config) {
		return this.normalizeRequest('put',url, data, config);
	},

	/**
	 * update - Make UPDATE request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @param	{object} config request config 
	 * @return {Promise}
	 */
	patch(url, data, config) {
		return this.normalizeRequest('patch',url, data, config);
	},

	/**
	 * delete - Make DELETE request
	 *
	 * @param	{url} url	URL
	 * @param	{object} data Data to send to url
	 * @param	{object} config request config 
	 * @return {Promise}
	 */
	delete(url, data, config) {
		return this.normalizeRequest('delete',url, data, config);	
	},

	/**
	 * Request Headers
	**/
	requestHeaders:{}

});

}

module.exports=attach;