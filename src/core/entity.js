/**
* Creates a new Mura.Entity
* @name	Mura.Entity
* @example
* const content= Mura.getEntity('content')
* 
* await content.loadBy('contentid','1234');
* 
* await content.set({
* 		summary:'This is my summary',
* 		approved:1
* ).save();
* 
* const kids= await content.get('kids');
* 
* kids.forEach(function(kid){
*  console.log(kid.getAll());
* });

* @class
* @extends Mura.Core
* @memberof Mura
* @param	{object} properties Object containing values to set into object
* @return {Mura.Entity}
*/

function attach(Mura){

	Mura.Entity = Mura.Core.extend(
	/** @lends Mura.Entity.prototype */
	{
		init(properties,requestcontext) {
			properties = properties || {};
			properties.entityname = properties.entityname || 'content';
			properties.siteid = properties.siteid || Mura.siteid;
			this.set(properties);

			if (typeof this.properties.isnew == 'undefined') {
				this.properties.isnew = 1;
			}

			if (this.properties.isnew) {
				this.set('isdirty', true);
			} else {
				this.set('isdirty', false);
			}

			if (typeof this.properties.isdeleted ==	'undefined') {
				this.properties.isdeleted = false;
			}

			this._requestcontext=requestcontext || Mura.getRequestContext();

			this.cachePut();

			return this;
		},

		/**
		 * updateFromDom - Updates editable data from what's in the DOM.
		 *
		 * @return {string}
		 */
		updateFromDom(){
			return this;
		},

		/**
		 * setRequestContext - Sets the RequestContext
		 *
		 * @RequestContext	{Mura.RequestContext} Mura.RequestContext List of fields
		 * @return {Mura.Entity}				Self
		 */
		setRequestContext(requestcontext) {
			this._requestcontext=requestcontext;
			return this;
		},

		/**
		 * getEnpoint - Returns API endpoint for entity type
		 *
		 * @return {string} All Headers
		 */
		getAPIEndpoint(){
			return	this._requestcontext.getAPIEndpoint() + this.get('entityname') + '/';
		},

		/**
		 * invoke - Invokes a method
		 * @example
		 * const myservice= Mura.getEntity('myservice');
		 * const result= await myservice.invoke('myMethod',{foo:'bar'},'get');
		 * 
		 * @param	{string} name Method to call
		 * @param	{object} params Arguments to submit to method
		 * @param	{string} method GET or POST
		 * @return {any}
		 */
		invoke(name,params,method,config){
			if(typeof name == 'object'){
				params=name.params || name.data || {};
				method=name.method || name.type || 'get';
				config=name;
				name=name.name;
			} else {
				config=config || {};
			}

			Mura.normalizeRequestConfig(config);

			var self = this;

			if(typeof method=='undefined' && typeof params=='string'){
				method=params;
				params={};
			}

			params=params || {};
			method=method || "post";

			if(this[name]=='function'){
				return this[name].apply(this,params);
			}

			return new Promise(function(resolve,reject) {

				if(typeof resolve == 'function'){
					config.success=resolve;
				}

				if(typeof reject == 'function'){
					config.error=reject;
				}

				method=method.toLowerCase();
				
				self._requestcontext.request({
					type: method,
					url: self.getAPIEndpoint() + name,
					cache: method=='get' ? config.cache : 'default',
					next: config.next,
					data: params,
					success(resp) {
						if (typeof resp.error == 'undefined') {
							if (typeof 	config.success ==	'function') {
								if(typeof resp.data != 'undefined'){
									config.success(resp.data);
								} else {
									config.success(resp);
								}
							}
						} else {
							if (typeof config.error == 'function') {
								config.error(resp);
							}
						}
					},
					error(resp) {
						if (typeof config.error == 'function'){
							config.error(resp);
						}
					},
					progress:config.progress,
					abort: config.abort
				});
			});
		},

		/**
		 * invokeWithCSRF - Proxies method call to remote api, but first generates CSRF tokens based on name
		* @example
		 * const myservice= Mura.getEntity('myservice');
		 * const result= await myservice.invokeWithCSRF('myMethod',{foo:'bar'},'get');
		 * 
		 * @param	{string} name Method to call
		 * @param	{object} params Arguments to submit to method
		 * @param	{string} method GET or POST
		 * @return {Promise} All Headers
		 */
		invokeWithCSRF(name,params,method,config){
			if(typeof name == 'object'){
				params=name.params || {};
				method=name.method || 'get';
				config=name;
				name=name.name;
			} else {
				config=config || {};
			}

			var self = this;

			Mura.normalizeRequestConfig(config);

			if(self._requestcontext.getMode().toLowerCase() == 'rest'){
				return new Promise(function(resolve,reject) {
					return self.invoke(
						name,
						params,
						method,
						config
					).then(resolve,reject);
				});
			} else {
				
				return new Promise(function(resolve,reject) {
					if(typeof resolve == 'function'){
						config.success=resolve;
					}

					if(typeof reject == 'function'){
						config.error=reject;
					}
					self._requestcontext.request({
						type: 'post',
						url: self._requestcontext.getAPIEndpoint() + '?method=generateCSRFTokens',
						data: {
							siteid: self.get('siteid'),
							context: name
						},
						success(resp) {

							if(params instanceof FormData){
								params.append('csrf_token',resp.data.csrf_token);
								params.append('csrf_token_expires',resp.data.csrf_token_expires);
							} else {
								params=Mura.extend(params,resp.data);
							}

							if (resp.data != 'undefined'	) {
								self.invoke(
									name,
									params,
									method,
									config
								).then(resolve,reject);
							} else {
								if (typeof config.error == 'function'){
									config.error(resp);
								}
							}
						},
						error(resp) {
							if (typeof config.error == 'function'){
								config.error(resp);
							}
						}
					});
				});
			}
		},

		/**
		 * exists - Returns if the entity was previously saved
		 *
		 * @return {boolean}
		 */
		exists() {
			return this.has('isnew') && !this.get('isnew');
		},

		/**
		 * get - Retrieves property value from entity
		 *
		 * @param	{string} propertyName Property Name
		 * @param	{*} defaultValue Default Value
		 * @return {*}							Property Value
		 */
		get(propertyName, defaultValue) {
			if(typeof propertyName=='undefined'){
				return this.getAll();
			}
			if (typeof this.properties.links != 'undefined' &&
				typeof this.properties.links[propertyName] != 'undefined') {
				var self = this;
				if (typeof this.properties[propertyName] == 'object') {
					return new Promise(function(resolve,reject) {
						if ('items' in self.properties[propertyName]) {
							var returnObj = new Mura.EntityCollection(self.properties[propertyName],self._requestcontext);
						} else {
							if (Mura.entities[self.properties[propertyName].entityname]) {
								var returnObj = new Mura.entities[self.properties[propertyName ].entityname](self.properties[propertyName],self._requestcontext);
							} else {
								var returnObj = new Mura.Entity(self.properties[propertyName],self._requestcontext);
							}
						}
						if (typeof resolve == 'function') {
							resolve(returnObj);
						}
					});
				} else {
					if (typeof defaultValue == 'object') {
						var params = defaultValue;
					} else {
						var params = {};
					}
					return new Promise(function(resolve,reject) {
						self._requestcontext.request({
							type: 'get',
							url: self.properties.links[propertyName],
							params: params,
							success(resp) {
								if (
									'items' in resp.data
								) {
									var returnObj = new Mura.EntityCollection(resp.data,self._requestcontext);
								} else {
									if (Mura.entities[self.entityname]) {
										var returnObj = new Mura.entities[self.entityname](resp.data,self._requestcontext);
									} else {
										var returnObj = new Mura.Entity(resp.data,self._requestcontext);
									}
								}
								//Dont cache if there are custom params
								if (Mura.isEmptyObject(params)) {
									self.set(propertyName,resp.data);
								}
								if (typeof resolve == 'function') {
									resolve(returnObj);
								}
							},
							error(resp){
								if (typeof reject == 'function'){
									reject(resp);
								}
							}
						});
					});
				}
			} else if (typeof this.properties[propertyName] != 'undefined') {
				return this.properties[propertyName];
			} else if (typeof defaultValue != 'undefined') {
				this.properties[propertyName] = defaultValue;
				return this.properties[propertyName];
			} else {
				return '';
			}
		},

		/**
		 * set - Sets property value
		 *
		 * @param	{string} propertyName	Property Name
		 * @param	{*} propertyValue Property Value
		 * @return {Mura.Entity} Self
		 */
		set(propertyName, propertyValue) {
			if (typeof propertyName == 'object') {
				this.properties = Mura.deepExtend(this.properties,propertyName);
				this.set('isdirty', true);
			} else if (typeof this.properties[propertyName] == 'undefined' || this.properties[propertyName] != propertyValue) {
				this.properties[propertyName] = propertyValue;
				this.set('isdirty', true);
			}

			return this;
		},


		/**
		 * has - Returns is the entity has a certain property within it
		 *
		 * @param	{string} propertyName Property Name
		 * @return {type}
		 */
		has(propertyName) {
			return typeof this.properties[propertyName] !=
				'undefined' || (typeof this.properties.links !=
				'undefined' && typeof this.properties.links[propertyName] != 'undefined');
		},


		/**
		 * getAll - Returns all of the entities properties
		 *
		 * @return {object}
		 */
		getAll() {
			return this.properties;
		},


		/**
		 * load - Loads entity from JSON API
		 *
		 * @return {Promise}
		 */
		load() {
			return this.loadBy('id', this.get('id'));
		},


		/**
		 * new - Loads properties of a new instance from JSON API
		 *
		 * @param	{type} params Property values that you would like your new entity to have
		 * @return {Promise}
		 */
		'new'(params) {
			var self = this;
			return new Promise(function(resolve, reject) {
				params = Mura.extend({
					entityname: self.get('entityname'),
					method: 'findNew',
					siteid: self.get('siteid')
				},
					params
				);
				self._requestcontext.get(
					self._requestcontext.getAPIEndpoint(), 
					params,
					{
						cache: 'no-cache'
					}).then(
					function(resp) {
						self.set(resp.data);
						if (typeof resolve == 'function') {
							resolve(self);
						}
				});
			});
		},

		/**
		 * checkSchema - Checks the schema for Mura ORM entities
		 *
		 * @return {Promise}
		 */
		'checkSchema'() {
			var self = this;
			return new Promise(function(resolve, reject) {
				if(self._requestcontext.getMode().toLowerCase() == 'rest'){
					self._requestcontext.request({
						type: 'post',
						url: self._requestcontext.getAPIEndpoint(),
						data:{
							entityname: self.get('entityname'),
							method: 'checkSchema',
							siteid: self.get('siteid')
						},
						success(resp) {
							if (resp.data != 'undefined'	) {
								if (typeof resolve ==	'function') {
									resolve(self);
								}
							} else {
								console.log(resp);
								if (typeof reject == 'function') {
									reject(self);
								}
							}
						},
						error(resp){
							self.set('errors',resp.error);
							if (typeof reject == 'function') {
								reject(self);
							}
						}
					});
				} else {
					self._requestcontext.request({
						type: 'post',
						url: self._requestcontext.getAPIEndpoint() + '?method=generateCSRFTokens',
						data: {
							siteid: self.get('siteid'),
							context: ''
						},
						success(resp) {
							self._requestcontext.request({
								type: 'post',
								url: self._requestcontext.getAPIEndpoint(),
								data: Mura
								.extend(
								{
									entityname: self.get('entityname'),
									method: 'checkSchema',
									siteid: self.get('siteid')
								}, {
									'csrf_token': resp.data.csrf_token,
									'csrf_token_expires': resp.data.csrf_token_expires
								}),
								success(	resp) {
									if (resp.data != 'undefined'	) {
										if (typeof resolve ==	'function') {
											resolve(self);
										}
									} else {
										console.log(resp)
										self.set('errors',resp.error);
										if (typeof reject == 'function') {
											reject(self);
										}
									}
								},
								error(resp) {
									this.success(resp);
								}
							});
						},
						error(resp) {
							this.success(resp);
						}
					});
				}
			});

		},

		/**
		 * undeclareEntity - Undeclares an Mura ORM entity with service factory
		 *
		 * @return {Promise}
		 */
		'undeclareEntity'(deleteSchema) {
			deleteSchema=deleteSchema || false;
			var self = this;
			return new Promise(function(resolve, reject) {
				if(self._requestcontext.getMode().toLowerCase() == 'rest'){
					self._requestcontext.request({
						type: 'post',
						url: self._requestcontext.getAPIEndpoint(),
						data: {
							entityname: self.get('entityname'),
							deleteSchema: deleteSchema,
							method: 'undeclareEntity',
							siteid: self.get('siteid')
						},
						success(	resp) {
							if (resp.data != 'undefined'	) {
								if (typeof resolve ==	'function') {
									resolve(self);
								}
							} else {
								console.log(resp)
								self.set('errors',resp.error);
								if (typeof reject == 'function') {
									reject(self);
								}
							}
						},
						error(resp){
							this.success(resp);
						}
					});
				} else {
					return self._requestcontext.request({
						type: 'post',
						url: self._requestcontext.getAPIEndpoint() + '?method=generateCSRFTokens',
						data: {
							siteid: self.get('siteid'),
							context: ''
						},
						success(resp) {
							self._requestcontext.request({
								type: 'post',
								url: self._requestcontext.getAPIEndpoint(),
								data: Mura.extend(	{
									entityname: self.get('entityname'),
									method: 'undeclareEntity',
									siteid: self.get('siteid')
								}, {
									'csrf_token': resp.data.csrf_token,
									'csrf_token_expires': resp.data.csrf_token_expires
								}),
								success(resp) {
									if (resp.data != 'undefined'	) {
										if (typeof resolve ==	'function') {
											resolve(self);
										}
									} else {
										self.set('errors',resp.error);
										if (typeof reject == 'function') {
											reject(self);
										}
									}
								}
							});
						},
						error(resp) {
							this.success(resp);
						}
					});
				}
			});

		},


		/**
		 * loadBy - Loads entity by property and value
		 *
		 * @param	{string} propertyName	The primary load property to filter against
		 * @param	{string|number} propertyValue The value to match the propert against
		 * @param	{object} params				Addition parameters
		 * @return {Promise}
		 */
		loadBy(propertyName, propertyValue, params) {
			propertyName = propertyName || 'id';
			propertyValue = propertyValue || this.get(propertyName) || 'null';
			var self = this;
			if (propertyName == 'id') {
				var cachedValue = Mura.datacache.get(propertyValue);
				if (typeof cachedValue != 'undefined') {
					this.set(cachedValue);
					return new Promise(function(resolve,reject) {
						resolve(self);
					});
				}
			}
			return new Promise(function(resolve, reject) {
				params = Mura.extend({
					entityname: self.get('entityname').toLowerCase(),
					method: 'findQuery',
					siteid: self.get( 'siteid')
				},
					params
				);
				if (params.entityname == 'content' ||	params.entityname ==	'contentnav') {
					params.includeHomePage = 1;
					params.showNavOnly = 0;
					params.showExcludeSearch = 1;
				}

				const cache=params.cache || 'default';
				delete params.cache;

				const next=params.next || {};
				delete params.next;

				params[propertyName] = propertyValue;
				self._requestcontext.findQuery(
					params,
					{	
						cache: cache,
						next: next
					}).then(
					function(collection) {
						if (collection.get('items').length) {
							self.set(collection.get('items')[0].getAll());
						}
						if (typeof resolve == 'function') {
							resolve(self);
						}
				},function(resp){
					if (typeof reject == 'function'){
						reject(resp);
					}
				});
			});
		},

		/**
		 * validate - Validates instance
		 *
		 * @param	{string} fields List of properties to validate, defaults to all
		 * @return {Promise}
		 */
		validate(fields) {
			fields = fields || '';
			var self = this;
			var data = Mura.deepExtend({}, self.getAll());
			data.fields = fields;
			return new Promise(function(resolve, reject) {
				self._requestcontext.request({
					type: 'post',
					url: self._requestcontext.getAPIEndpoint() + '?method=validate',
					data: {
						data: JSON.stringify(data),
						validations: '{}',
						version: 4
					},
					success(resp) {
						if (resp.data !=	'undefined') {
							self.set('errors',resp.data)
						} else {
							self.set('errors',resp.error);
						}
						if (typeof resolve ==	'function') {
							resolve(self);
						}
					},
					error(resp) {
						self.set('errors',resp.error);
						resolve(self);
					}
				});
			});
		},


		/**
		 * hasErrors - Returns if the entity has any errors
		 *
		 * @return {boolean}
		 */
		hasErrors() {
			var errors = this.get('errors', {});
			return (typeof errors == 'string' && errors !='') || (typeof errors == 'object' && !Mura.isEmptyObject(errors));
		},


		/**
		 * getErrors - Returns entites errors property
		 *
		 * @return {object}
		 */
		getErrors() {
			return this.get('errors', {});
		},


		/**
		 * save - Saves entity to JSON API
		 *
		 * @return {Promise}
		 */
		save(config) {
			config=config || {};

			Mura.normalizeRequestConfig(config);

			var self = this;

			if (!this.get('isdirty')) {
				return new Promise(function(resolve, reject) {
					if(typeof resolve == 'function'){
						config.success=resolve;
					}
					if (typeof config.success =='function') {
						config.success(self);
					}
				});
			}
			if (!this.get('id')) {
				return new Promise(function(resolve, reject) {
					var temp = Mura.deepExtend({},self.getAll());
					self._requestcontext.request({
						type: 'get',
						url: self._requestcontext.getAPIEndpoint() + self.get('entityname') + '/new',
						success(resp) {
							self.set(resp.data);
							self.set(temp);
							self.set('id',resp.data.id);
							self.set('isdirty',true);
							self.cachePut();
							self.save(config).then(
								resolve,
								reject
							);
						},
						error: config.error,
						abort: config.abort
					});
				});
			} else {
				return new Promise(function(resolve, reject) {

					if(typeof resolve == 'function'){
						config.success=resolve;
					}

					if(typeof reject == 'function'){
						config.error=reject;
					}

					var context = self.get('id');
					if(self._requestcontext.getMode().toLowerCase() == 'rest'){
						self._requestcontext.request({
							type: 'post',
							url: self._requestcontext.getAPIEndpoint() + '?method=save',
							data:	self.getAll(),
							success(resp) {
								if (resp.data != 'undefined') {
									self.set(resp.data)
									self.set('isdirty',false );
									if (self.get('saveerrors') ||
										Mura.isEmptyObject(self.getErrors())
									) {
										if (typeof config.success ==	'function') {
											config.success(self);
										}
									} else {
										if (typeof config.error == 'function') {
											config.error(self);
										}
									}
								} else {
									self.set('errors',resp.error);
									if (typeof config.error == 'function') {
										config.error(self);
									}
								}
							},
							error(resp) {
								self.set('errors',resp.error);
								if (typeof config.error == 'function') {
									config.error(self);
								}
							},
							progress:config.progress,
							abort: config.abort
						});
					} else {
						self._requestcontext.request({
							type: 'post',
							url: self._requestcontext.getAPIEndpoint() + '?method=generateCSRFTokens',
							data: {
								siteid: self.get('siteid'),
								context: context
							},
							success(resp) {
								self._requestcontext.request({
									type: 'post',
									url: self._requestcontext.getAPIEndpoint() + '?method=save',
									data: Mura
									.extend( self.getAll(), {
											'csrf_token': resp.data.csrf_token,
											'csrf_token_expires': resp.data.csrf_token_expires
										}
									),
									success(resp) {
										if (resp.data != 'undefined'	) {
											self.set(resp.data)
											self.set('isdirty',false );
											if (self.get('saveerrors') ||
												Mura.isEmptyObject(self.getErrors())
											) {
												if (typeof config.success ==	'function') {
													config.success(self);
												}
											} else {
												if (typeof config.error == 'function') {
													config.error(self);
												}
											}
										} else {
											self.set('errors',resp.error);
											if (typeof config.error == 'function') {
												config.error(self);
											}
										}
									},
									error(resp) {
										self.set('errors',resp.error);
										if (typeof config.error == 'function') {
											config.error(self);
										}
									},
									progress:config.progress,
									abort: config.abort
								});
							},
							error(resp) {
								this.error(resp);
							},
							abort: config.abort
						});
					}
				});
			}
		},

		/**
		 * delete - Deletes entity
		 *
		 * @return {Promise}
		 */
		'delete'(config) {
			config=config || {};

			Mura.normalizeRequestConfig(config);

			var self = this;
			if(self._requestcontext.getMode().toLowerCase() == 'rest'){
				return new Promise(function(resolve, reject) {

					if(typeof resolve == 'function'){
						config.success=resolve;
					}

					if(typeof reject == 'function'){
						config.error=reject;
					}

					self._requestcontext.request({
						type: 'post',
						url: self._requestcontext.getAPIEndpoint() + '?method=delete',
						data: {
							siteid: self.get('siteid'),
							id: self.get('id'),
							entityname: self.get('entityname')
						},
						success() {
							self.set('isdeleted',true);
							self.cachePurge();
							if (typeof config.success == 'function') {
								config.success(self);
							}
						},
						error: config.error,
						progress:config.progress,
						abort: config.abort
					});
				});
			} else {
				return new Promise(function(resolve, reject) {
					if(typeof resolve == 'function'){
						config.success=resolve;
					}

					if(typeof reject == 'function'){
						config.error=reject;
					}

					self._requestcontext.request({
						type: 'post',
						url: self._requestcontext.getAPIEndpoint() + '?method=generateCSRFTokens',
						data: {
							siteid: self.get('siteid'),
							context: self.get('id')
						},
						success(resp) {
							self._requestcontext.request({
								type: 'post',
								url: self._requestcontext.getAPIEndpoint() + '?method=delete',
								data: {
									siteid: self.get('siteid'),
									id: self.get('id'),
									entityname: self.get('entityname'),
									'csrf_token': resp.data.csrf_token,
									'csrf_token_expires': resp.data.csrf_token_expires
								},
								success() {
									self.set('isdeleted',true);
									self.cachePurge();
									if (typeof config.success == 'function') {
										config.success(self);
									}
								},
								error: config.error,
								progress:config.progress,
								abort: config.abort
							});
						},
						error: config.error,
						abort: config.abort
					});
				});
			}
		},

		/**
		 * getFeed - Returns a Mura.Feed instance of this current entitie's type and siteid
		 *
		 * @return {object}
		 */
		getFeed() {
			return this._requestcontext.getFeed(this.get('entityName'));
		},

		/**
		 * cachePurge - Purges this entity from client cache
		 *
		 * @return {object}	Self
		 */
		cachePurge() {
			Mura.datacache.purge(this.get('id'));
			return this;
		},

		/**
		 * cachePut - Places this entity into client cache
		 *
		 * @return {object}	Self
		 */
		cachePut() {
			if (!this.get('isnew')) {
				Mura.datacache.set(this.get('id'), this);
			}
			return this;
		}

	});
}

module.exports=attach;