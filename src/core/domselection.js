
var Mura=require('./core');

'use strict'

/**
 * Creates a new Mura.DOMSelection
 * @name	Mura.DOMSelection
 * @class
 * @param	{object} properties Object containing values to set into object
 * @return {Mura.DOMSelection}
 * @extends Mura.Core
 * @memberof Mura
 */

 /**
	* @ignore
	*/

Mura.DOMSelection = Mura.Core.extend(
	/** @lends Mura.DOMSelection.prototype */
	{

		init(selection, origSelector) {
			this.selection = selection;
			this.origSelector = origSelector;

			if (this.selection.length && this.selection[0]) {
				this.parentNode = this.selection[0].parentNode;
				this.childNodes = this.selection[0].childNodes;
				this.node = selection[0];
				this.length = this.selection.length;
			} else {
				this.parentNode = null;
				this.childNodes = null;
				this.node = null;
				this.length = 0;
			}

			if(typeof Mura.supportPassive == 'undefined'){
				Mura.supportsPassive = false;
				try {
					var opts = Object.defineProperty({}, 'passive', {
						get() {
						  Mura.supportsPassive = true;
						}
					});
					window.addEventListener("testPassive", null, opts);
					window.removeEventListener("testPassive", null, opts);
				} catch (e) {}
			}
		},

	/**
	 * get - Deprecated: Returns element at index of selection, use item()
	 *
	 * @param	{number} index Index of selection
	 * @return {*}
	 */
	get(index) {
		if(typeof index != 'undefined'){
			return this.selection[index];
		} else {
			return this.selection;
		}
	},

	/**
	 * select - Returns new Mura.DomSelection
	 *
	 * @param	{string} selector Selector
	 * @return {object}
	 */
	select(selector) {
		return Mura(selector);
	},

	/**
	 * each - Runs function against each item in selection
	 *
	 * @param	{function} fn Method
	 * @return {Mura.DOMSelection} Self
	 */
	each(fn) {
		this.selection.forEach(function(el, idx, array) {
			if(typeof fn.call == 'undefined'){
				fn(el, idx, array);
			} else {
				fn.call(el, el, idx, array);
			}
		});
		return this;
	},

	/**
	 * each - Runs function against each item in selection
	 *
	 * @param	{function} fn Method
	 * @return {Mura.DOMSelection} Self
	 */
	forEach(fn) {
		this.selection.forEach(function(el, idx, array) {
			if(typeof fn.call == 'undefined'){
				fn(el, idx, array);
			} else {
				fn.call(el, el, idx, array);
			}
		});
		return this;
	},

	/**
	 * filter - Creates a new Mura.DomSelection instance contains selection values that pass filter function by returning true
	 *
	 * @param	{function} fn Filter function
	 * @return {object}		New Mura.DOMSelection
	 */
	filter(fn) {
		return Mura(this.selection.filter(function(el,idx, array) {
			if(typeof fn.call == 'undefined'){
				return fn(el, idx,array);
			} else {
				return fn.call(el, el, idx,array);
			}
		}));
	},

	/**
	 * map - Creates a new Mura.DomSelection instance contains selection values that are returned by Map function
	 *
	 * @param	{function} fn Map function
	 * @return {object}		New Mura.DOMSelection
	 */
	map(fn) {
		return Mura(this.selection.map(function(el, idx, array) {
			if(typeof fn.call == 'undefined'){
				return fn(el, idx, array);
			} else {
				return fn.call(el, el, idx, array);
			}
		}));
	},

	/**
	 * reduce - Returns value from	reduce function
	 *
	 * @param	{function} fn Reduce function
	 * @param	{any} initialValue Starting accumulator value
	 * @return {accumulator}
	 */
	reduce(fn, initialValue) {
		initialValue = initialValue || 0;
		return this.selection.reduce(
			function(accumulator, item, idx, array) {
				if(typeof fn.call == 'undefined'){
					return fn(accumulator,item, idx, array);
				} else {
					return fn.call(item, accumulator,item, idx, array);
				}
			},
			initialValue
		);
	},

	/**
	 * isNumeric - Returns if value is numeric
	 *
	 * @param	{*} val Value
	 * @return {type}		 description
	 */
	isNumeric(val) {
		if (typeof val != 'undefined') {
			return isNumeric(val);
		}
		return isNumeric(this.selection[0]);
	},

	/**
	 * processMarkup - Process Markup of selected dom elements
	 *
	 * @return {Promise}
	 */
	processMarkup() {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.each(function(el) {
				Mura.processMarkup(el);
			});
		});
	},

	/**
	 * addEventHandler - Add event event handling object
	 *
	 * @param	{string} selector	Selector (optional: for use with delegated events)
	 * @param	{object} handler				description
	 * @return {Mura.DOMSelection} Self
	 */
	addEventHandler(selector, handler){
		if (typeof handler == 'undefined') {
			handler = selector;
			selector = '';
		}
		for (var h in handler) {
			if(eventName.hasOwnProperty(h)){
				if(typeof selector == 'string' && selector){
					on(h, selector, handler[h]);
				} else {
					on(h,handler[h]);
				}
			}
		}
		return this;
	},

	/**
	 * on - Add event handling method
	 *
	 * @param	{string} eventName Event name
	 * @param	{string} selector	Selector (optional: for use with delegated events)
	 * @param	{function} fn				description
	 * @return {Mura.DOMSelection} Self
	 */
	on(eventName, selector, fn, EventListenerOptions) {
		if(typeof EventListenerOptions == 'undefined'){
			if(typeof fn != 'undefined' && typeof fn != 'function'){
				EventListenerOptions=fn;
			} else {
				EventListenerOptions=true;
			}
		}

		if(eventName=='touchstart' || eventName=='end'){
			EventListenerOptions= Mura.supportsPassive ? { passive: true } : false;
		}

		if (typeof selector == 'function') {
			fn = selector;
			selector = '';
		}
		if (eventName == 'ready') {
			if (document.readyState != 'loading') {
				var self = this;
				setTimeout(
					function() {
						self.each(function(target) {
							if (selector) {
								Mura(target).find(
									selector
								).each(
									function(target) {
										if(typeof fn.call =='undefined'){
											fn(target);
										} else {
											fn.call(target,target);
										}
								});
							} else {
								if(typeof fn.call =='undefined'){
									fn(target);
								} else {
									fn.call(target,target);
								}
							}
						});
					},
					1
				);
				return this;
			} else {
				eventName = 'DOMContentLoaded';
			}
		}

		this.each(function(el) {
				if (typeof this.addEventListener ==
						'function') {
						var self = el;
						this.addEventListener(
								eventName,
								function(event) {
									if (selector) {
										if (Mura(event.target).is(selector)) {
											if(typeof fn.call == 'undefined'){
												return fn(event);
											} else {
												return fn.call(event.target,event);
											}
										}
									} else {
										if(typeof fn.call == 'undefined'){
											return fn(event);
										} else {
											return fn.call(self,event);
										}
									}
								},
								EventListenerOptions
						);
				}
		});
		return this;
	},

	/**
	 * hover - Adds hovering events to selected dom elements
	 *
	 * @param	{function} handlerIn	In method
	 * @param	{function} handlerOut Out method
	 * @return {object}						Self
	 */
	hover(handlerIn, handlerOut, EventListenerOptions) {
		if(typeof EventListenerOptions =='undefined' || EventListenerOptions == null){
			EventListenerOptions= Mura.supportsPassive ? { passive: true } : false;
		}
		this.on('mouseover', handlerIn, EventListenerOptions);
		this.on('mouseout', handlerOut, EventListenerOptions);
		this.on('touchstart', handlerIn, EventListenerOptions);
		this.on('touchend', handlerOut, EventListenerOptions);
		return this;
	},

	/**
	 * click - Adds onClick event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	click(fn) {
		this.on('click', fn);
		return this;
	},

	/**
	 * change - Adds onChange event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	change(fn) {
		this.on('change', fn);
		return this;
	},

	/**
	 * submit - Adds onSubmit event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	submit(fn) {
		if (fn) {
			this.on('submit', fn);
		} else {
			this.each(function(el) {
				if (typeof el.submit == 'function') {
					Mura.submitForm(el);
				}
			});
		}
		return this;
	},

	/**
	 * ready - Adds onReady event handler to selection
	 *
	 * @param	{function} fn Handler function
	 * @return {Mura.DOMSelection} Self
	 */
	ready(fn) {
		this.on('ready', fn);
		return this;
	},

	/**
	 * off - Removes event handler from selection
	 *
	 * @param	{string} eventName Event name
	 * @param	{function} fn			Function to remove	(optional)
	 * @return {Mura.DOMSelection} Self
	 */
	off(eventName, fn) {
		this.each(function(el, idx, array) {
			if (typeof eventName != 'undefined') {
				if (typeof fn != 'undefined') {
					el.removeEventListener(eventName, fn);
				} else {
					el[eventName] = null;
				}
			} else {
				if (typeof el.parentElement !=
					'undefined' && el.parentElement &&
					typeof el.parentElement.replaceChild !=
					'undefined') {
					var elClone = el.cloneNode(true);
					el.parentElement.replaceChild(elClone, el);
					array[idx] = elClone;
				} else {
					console.log("Mura: Can not remove all handlers from element without a parent node")
				}
			}
		});
		return this;
	},

	/**
	 * unbind - Removes event handler from selection
	 *
	 * @param	{string} eventName Event name
	 * @param	{function} fn			Function to remove	(optional)
	 * @return {Mura.DOMSelection} Self
	 */
	unbind(eventName, fn) {
		this.off(eventName, fn);
		return this;
	},

	/**
	 * bind - Add event handling method
	 *
	 * @param	{string} eventName Event name
	 * @param	{string} selector	Selector (optional: for use with delegated events)
	 * @param	{function} fn				description
	 * @return {Mura.DOMSelection}					 Self
	 */
	bind(eventName, fn) {
		this.on(eventName, fn);
		return this;
	},

	/**
	 * trigger - Triggers event on selection
	 *
	 * @param	{string} eventName	 Event name
	 * @param	{object} eventDetail Event properties
	 * @return {Mura.DOMSelection}						 Self
	 */
	trigger(eventName, eventDetail) {
		eventDetail = eventDetail || {};
		this.each(function(el) {
			Mura.trigger(el, eventName,eventDetail);
		});
		return this;
	},

	/**
	 * parent - Return new Mura.DOMSelection of the first elements parent
	 *
	 * @return {Mura.DOMSelection}
	 */
	parent() {
		if (!this.selection.length) {
			return this;
		}
		return Mura(this.selection[0].parentNode);
	},

	/**
	 * children - Returns new Mura.DOMSelection or the first elements children
	 *
	 * @param	{string} selector Filter (optional)
	 * @return {Mura.DOMSelection}
	 */
	children(selector) {
		if (!this.selection.length) {
			return this;
		}
		if (this.selection[0].hasChildNodes()) {
			var children = Mura(this.selection[0].childNodes);
			if (typeof selector == 'string') {
				var filterFn = function(el) {
					return (el.nodeType === 1 || el.nodeType === 11 || el.nodeType === 9) && el.matchesSelector(selector);
				};
			} else {
				var filterFn = function() {
					return el.nodeType === 1 || el.nodeType === 11 ||	el.nodeType === 9;
				};
			}
			return children.filter(filterFn);
		} else {
			return Mura([]);
		}
	},


	/**
	 * find - Returns new Mura.DOMSelection matching items under the first selection
	 *
	 * @param	{string} selector Selector
	 * @return {Mura.DOMSelection}
	 */
	find(selector) {
		if (this.selection.length && this.selection[0]) {
			var removeId = false;
			if (this.selection[0].nodeType == '1' ||
				this.selection[0].nodeType == '11') {
				var result = this.selection[0].querySelectorAll(selector);
			} else if (this.selection[0].nodeType =='9') {
				var result = document.querySelectorAll(selector);
			} else {
				var result = [];
			}
			return Mura(result);
		} else {
				return Mura([]);
		}
	},

	/**
	 * first - Returns first item in selection
	 *
	 * @return {*}
	 */
	first() {
		if (this.selection.length) {
			return Mura(this.selection[0]);
		} else {
			return Mura([]);
		}
	},

	/**
	 * last - Returns last item in selection
	 *
	 * @return {*}
	 */
	last() {
		if (this.selection.length) {
			return Mura(this.selection[this.selection.length - 1]);
		} else {
			return Mura([]);
		}
	},

	/**
	 * selector - Returns css selector for first item in selection
	 *
	 * @return {string}
	 */
	selector() {
		var pathes = [];
		var path, node = Mura(this.selection[0]);
		while (node.length) {
			var realNode = node.get(0),
				name = realNode.localName;
			if (!name) {
				break;
			}
			if (!node.data('hastempid') && node.attr('id') && node.attr('id') != 'mura-variation-el') {
				name = '#' + node.attr('id');
				path = name + (path ? ' > ' + path : '');
				break;
			} else if (node.data('instanceid')) {
				name = '[data-instanceid="' + node.data('instanceid') + '"]';
				path = name + (path ? ' > ' + path : '');
				break;
			} else {
				name = name.toLowerCase();
				var parent = node.parent();
				var sameTagSiblings = parent.children(name);
				if (sameTagSiblings.length > 1) {
					var allSiblings = parent.children();
					var index = allSiblings.index(realNode) + 1;
					if (index > 0) {name += ':nth-child(' + index + ')';}
				}
				path = name + (path ? ' > ' + path : '');
				node = parent;
			}
		}
		pathes.push(path);
		return pathes.join(',');
	},

	/**
	 * siblings - Returns new Mura.DOMSelection of first item's siblings
	 *
	 * @param	{string} selector Selector to filter siblings (optional)
	 * @return {Mura.DOMSelection}
	 */
	siblings(selector) {
		if (!this.selection.length) {
			return this;
		}
		var el = this.selection[0];
		if (el.hasChildNodes()) {
			var silbings = Mura(this.selection[0].childNodes);
			if (typeof selector == 'string') {
				var filterFn = function(el) {
					return (el.nodeType === 1 || el.nodeType === 11 || el.nodeType === 9) && el.matchesSelector(selector);
				};
			} else {
				var filterFn = function(el) {
					return el.nodeType === 1 ||	el.nodeType === 11 || el.nodeType === 9;
				};
			}
			return silbings.filter(filterFn);
		} else {
			return Mura([]);
		}
	},

	/**
	 * item - Returns item at selected index
	 *
	 * @param	{number} idx Index to return
	 * @return {*}
	 */
	item(idx) {
		return this.selection[idx];
	},

	/**
	 * index - Returns the index of element
	 *
	 * @param	{*} el Element to return index of
	 * @return {*}
	 */
	index(el) {
		return this.selection.indexOf(el);
	},

	/**
	 * indexOf - Returns the index of element
	 *
	 * @param	{*} el Element to return index of
	 * @return {*}
	 */
	indexOf(el) {
		return this.selection.indexOf(el);
	},

	/**
	 * closest - Returns new Mura.DOMSelection of closest parent matching selector
	 *
	 * @param	{string} selector Selector
	 * @return {Mura.DOMSelection}
	 */
	closest(selector) {
		if (!this.selection.length) {
			return null;
		}
		var el = this.selection[0];
		for (var parent = el; parent !== null && parent.matchesSelector && !parent.matchesSelector(selector); parent = el.parentElement) {
			el = parent;
		};
		if (parent) {
			return Mura(parent)
		} else {
			return Mura([]);
		}
	},

	/**
	 * append - Appends element to items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	append(el) {
		this.each(function(target) {
			try {
				if (typeof el == 'string') {
					target.insertAdjacentHTML('beforeend', el);
				} else {
					target.appendChild(el);
				}
			} catch(e){
				console.log(e);
			}
		});
		return this;
	},

	/**
	 * appendDisplayObject - Appends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	appendDisplayObject(data) {
		var self = this;
		delete data.method;
		if(typeof data.transient == 'undefined'){
			data.transient=true;
		}
		return new Promise(function(resolve, reject) {
			self.each(function(target) {
				var el = document.createElement('div');
				el.setAttribute('class','mura-object');
				var preserveid=false;
				for (var a in data) {
					if(typeof data[a]=='object'){
						el.setAttribute('data-' + a,JSON.stringify(data[a]));
					} else if (a != 'preserveid'){
						el.setAttribute('data-' + a,data[a]);
					} else {
						preserveid=data[a];
					}
				}
				if (typeof data.async == 'undefined') {
					el.setAttribute('data-async',true);
				}
				if (typeof data.render == 'undefined') {
					el.setAttribute('data-render','server');
				}
				if(preserveid && Mura.isUUID(data.instanceid)){
					el.setAttribute('data-instanceid',data.instanceid);
				} else {
					el.setAttribute('data-instanceid',Mura.createUUID());
				}	
				var self=target;
				function watcher(){
					if(Mura.markupInitted){
						Mura(self).append(el);
						Mura.processDisplayObject(el,true,true).then(resolve, reject);
					} else {
						setTimeout(watcher);
					}
				}
				watcher();
			});
		});
	},

	/**
	 * appendModule - Appends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	appendModule(data) {
		return this.appendDisplayObject(data);
	},

	/**
	 * insertDisplayObjectAfter - Inserts display object after selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	insertDisplayObjectAfter(data) {
		var self = this;
		delete data.method;
		if(typeof data.transient == 'undefined'){
			data.transient=true;
		}
		return new Promise(function(resolve, reject) {
			self.each(function(target) {
				var el = document.createElement('div');
				el.setAttribute('class','mura-object');
				var preserveid=false;
				for (var a in data) {
					if(typeof data[a]=='object'){
						el.setAttribute('data-' + a,JSON.stringify(data[a]));
					} else if (a != 'preserveid'){
						el.setAttribute('data-' + a,data[a]);
					} else {
						preserveid=data[a];
					}
				}
				if (typeof data.async == 'undefined') {
					el.setAttribute('data-async',true);
				}
				if (typeof data.render == 'undefined') {
					el.setAttribute('data-render','server');
				}
				if(preserveid && Mura.isUUID(data.instanceid)){
					el.setAttribute('data-instanceid',data.instanceid);
				} else {
					el.setAttribute('data-instanceid',Mura.createUUID());
				}	
				var self=target;
				function watcher(){
					if(Mura.markupInitted){
						Mura(self).after(el);
						Mura.processDisplayObject(el,true,true).then(resolve, reject);
					} else {
						setTimeout(watcher);
					}
				}
				watcher();
			});
		});
	},

	/**
	 * insertModuleAfter - Appends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	insertModuleAfter(data) {
		return this.insertDisplayObjectAfter(data);
	},

	/**
	 * insertDisplayObjectBefore - Inserts display object after selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	insertDisplayObjectBefore(data) {
		var self = this;
		delete data.method;
		if(typeof data.transient == 'undefined'){
			data.transient=true;
		}
		return new Promise(function(resolve, reject) {
			self.each(function(target) {
				var el = document.createElement('div');
				el.setAttribute('class','mura-object');
				var preserveid=false;
				for (var a in data) {
					if(typeof data[a]=='object'){
						el.setAttribute('data-' + a,JSON.stringify(data[a]));
					} else if (a != 'preserveid'){
						el.setAttribute('data-' + a,data[a]);
					} else {
						preserveid=data[a];
					}
				}
				if (typeof data.async == 'undefined') {
					el.setAttribute('data-async',true);
				}
				if (typeof data.render == 'undefined') {
					el.setAttribute('data-render','server');
				}
				if(preserveid && Mura.isUUID(data.instanceid)){
					el.setAttribute('data-instanceid',data.instanceid);
				} else {
					el.setAttribute('data-instanceid',Mura.createUUID());
				}	
				var self=target;
				function watcher(){
					if(Mura.markupInitted){
						Mura(self).before(el);
						Mura.processDisplayObject(el,true,true).then(resolve, reject);
					} else {
						setTimeout(watcher);
					}
				}
				watcher();
			});
		});
	},

	/**
	 * insertModuleBefore - Appends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	insertModuleBefore(data) {
		return this.insertDisplayObjectBefore(data);
	},

	/**
	 * prependDisplayObject - Prepends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	prependDisplayObject(data) {
		var self = this;
		delete data.method;
		if(typeof data.transient == 'undefined'){
			data.transient=true;
		}
		return new Promise(function(resolve, reject) {
			self.each(function(target) {
				var el = document.createElement('div');
				el.setAttribute('class','mura-object');
				var preserveid=false;
				for (var a in data) {
					if(typeof data[a]=='object'){
						el.setAttribute('data-' + a,JSON.stringify(data[a]));
					} else if (a != 'preserveid'){
						el.setAttribute('data-' + a,data[a]);
					} else {
						preserveid=data[a];
					}
				}
				if (typeof data.async == 'undefined') {
					el.setAttribute('data-async',true);
				}
				if (typeof data.render == 'undefined') {
					el.setAttribute('data-render','server');
				}
				if(preserveid && Mura.isUUID(data.instanceid)){
					el.setAttribute('data-instanceid',data.instanceid);
				} else {
					el.setAttribute('data-instanceid',Mura.createUUID());
				}	
				var self=target;
				function watcher(){
					if(Mura.markupInitted){
						Mura(self).prepend(el);
						Mura.processDisplayObject(el,true,true).then(resolve, reject);
					} else {
						setTimeout(watcher);
					}
				}
				watcher();
			});
		});
	},

	/**
	 * prependModule - Prepends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	prependModule(data) {
		return this.prependDisplayObject(data);
	},

	/**
	 * processDisplayObject - Handles processing of display object params to selection
	 *
	 * @return {Promise}
	 */
	processDisplayObject() {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.each(function(target) {
				Mura.processDisplayObject(
					target,true,true).then(
					resolve, reject
				);
			});
		});
	},

	/**
	 * processModule - Prepends display object to selected items
	 *
	 * @return {Promise}
	 */
	processModule() {
		return this.processDisplayObject();
	},

	/**
	 * prepend - Prepends element to items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	prepend(el) {
		this.each(function(target) {
			try {
				if (typeof el == 'string') {
					target.insertAdjacentHTML('afterbegin', el);
				} else {
					target.insertBefore(el, target.firstChild);
				}
			} catch(e){
				console.log(e);
			}
		});
		return this;
	},

	/**
	 * before - Inserts element before items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	before(el) {
		this.each(function(target) {
			try {
				if (typeof el == 'string') {
					target.insertAdjacentHTML('beforebegin', el);
				} else {
					target.parentNode.insertBefore(el,target);
				}
			} catch(e){
				console.log(e);
			}
		});
		return this;
	},

	/**
	 * after - Inserts element after items in selection
	 *
	 * @param	{*} el Element to append
	 * @return {Mura.DOMSelection} Self
	 */
	after(el) {
		this.each(function(target) {
			try {
				if (typeof el == 'string') {
					target.insertAdjacentHTML('afterend', el);
				} else {
					if(target.nextSibling){
						target.parentNode.insertBefore(el, target.nextSibling);
					} else {
						target.parentNode.appendChild(el);
					}
					
				}
			} catch(e){
				console.log(e);
			}
		});
		return this;
	},

	/**
	 * hide - Hides elements in selection
	 *
	 * @return {object}	Self
	 */
	hide() {
		this.each(function(el) {
			el.style.display = 'none';
		});
		return this;
	},

	/**
	 * show - Shows elements in selection
	 *
	 * @return {object}	Self
	 */
	show() {
		this.each(function(el) {
			el.style.display = '';
		});
		return this;
	},

	/**
	 * repaint - repaints elements in selection
	 *
	 * @return {object}	Self
	 */
	redraw() {
		this.each(function(el) {
			var elm = Mura(el);
			setTimeout(
				function() {
					elm.show();
				},
				1
			);
		});
		return this;
	},

	/**
	 * remove - Removes elements in selection
	 *
	 * @return {object}	Self
	 */
	remove() {
		this.each(function(el) {
			el.parentNode && el.parentNode.removeChild(el);
		});
		return this;
	},

	/**
	 * detach - Detaches elements in selection
	 *
	 * @return {object}	Self
	 */
	 detach() {
		var detached=[];
		this.each(function(el) {
			el.parentNode && detached.push(el.parentNode.removeChild(el));
		});
		return Mura(detached);
	},

	/**
	 * addClass - Adds class to elements in selection
	 *
	 * @param	{string} className Name of class
	 * @return {Mura.DOMSelection} Self
	 */
	addClass(className) {
		if (className.length) {
			this.each(function(el) {
				if (el.classList) {
					el.classList.add(className);
				} else {
					el.className += ' ' + className;
				}
			});
		}
		return this;
	},

	/**
	 * hasClass - Returns if the first element in selection has class
	 *
	 * @param	{string} className Class name
	 * @return {Mura.DOMSelection} Self
	 */
	hasClass(className) {
			return this.is("." + className);
	},

	/**
	 * removeClass - Removes class from elements in selection
	 *
	 * @param	{string} className Class name
	 * @return {Mura.DOMSelection} Self
	 */
	removeClass(className) {
		this.each(function(el) {
			if (el.classList) {
				el.classList.remove(className);
			} else if (el.className) {
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		});
		return this;
	},

	/**
	 * toggleClass - Toggles class on elements in selection
	 *
	 * @param	{string} className Class name
	 * @return {Mura.DOMSelection} Self
	 */
	toggleClass(className) {
		this.each(function(el) {
			if (el.classList) {
				el.classList.toggle(className);
			} else {
				var classes = el.className.split(' ');
				var existingIndex = classes.indexOf(className);

				if (existingIndex >= 0)
					classes.splice(existingIndex, 1);
				else
					classes.push(className);

				el.className = classes.join(' ');
			}
		});
		return this;
	},

	/**
	 * empty - Removes content from elements in selection
	 *
	 * @return {object}	Self
	 */
	empty() {
		this.each(function(el) {
			el.innerHTML = '';
		});
		return this;
	},

	/**
	 * evalScripts - Evaluates script tags in selection elements
	 *
	 * @return {object}	Self
	 */
	evalScripts() {
		if (!this.selection.length) {
			return this;
		}
		this.each(function(el) {
			Mura.evalScripts(el);
		});
		return this;
	},

	/**
	 * html - Returns or sets HTML of elements in selection
	 *
	 * @param	{string} htmlString description
	 * @return {object}						Self
	 */
	html(htmlString) {
		if (typeof htmlString != 'undefined') {
			this.each(function(el) {
				el.innerHTML = htmlString;
				Mura.evalScripts(el);
			});
			return this;
		} else {
			if (!this.selection.length) {
				return '';
			}
			return this.selection[0].innerHTML;
		}
	},

	/**
	 * css - Sets css value for elements in selection
	 *
	 * @param	{string} ruleName Css rule name
	 * @param	{string} value		Rule value
	 * @return {object}					Self
	 */
	css(ruleName, value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof ruleName == 'undefined' && typeof value == 'undefined') {
			try {
				return getComputedStyle(this.selection[0]);
			} catch (e) {
				console.log(e)
				return {};
			}
		} else if (typeof ruleName == 'object') {
			this.each(function(el) {
				try {
					for (var p in ruleName) {
						el.style[Mura.styleMap.tojs[p.toLowerCase()]] = ruleName[p];
					}
				} catch (e) {console.log(e)}
			});
		} else if (typeof value != 'undefined') {
			this.each(function(el) {
				try {
					el.style[Mura.styleMap.tojs[ruleName.toLowerCase()]] = value;
				} catch (e) {console.log(e)}
			});
			return this;
		} else {
			try {
				return getComputedStyle(this.selection[	0])[Mura.styleMap.tojs[ruleName.toLowerCase()]];
			} catch (e) {console.log(e)}
		}

		return this;
	},

	/**
	 * calculateDisplayObjectStyles - Looks at data attrs and sets appropriate styles
	 *
	 * @return {object}	Self
	 */
	 calculateDisplayObjectStyles(windowResponse) {
		
 		this.each(function(el) {
			var breakpoints=['mura-xs','mura-sm','mura-md','mura-lg','mura-xl'];
			var objBreakpoint='mura-sm';
			var obj=Mura(el);

			for(var b=0;b<breakpoints.length;b++){
				if(obj.is('.' + breakpoints[b])){
					objBreakpoint=breakpoints[b];
					break;
				}
			}
		
			var styleTargets=Mura.getModuleStyleTargets(obj.data('instanceid'),true);

			var fullsize=breakpoints.indexOf('mura-' + Mura.getBreakpoint()) >= breakpoints.indexOf(objBreakpoint);
			
			Mura.windowResponsiveModules=Mura.windowResponsiveModules||{};
			Mura.windowResponsiveModules[obj.data('instanceid')]=false;

 			obj = (obj.node) ? obj : Mura(obj);
			
			if(!windowResponse){
				applyObjectClassesAndId(obj);
			}

			var styleSupport=obj.data('stylesupport') || {};
			
			if(typeof styleSupport == 'string'){
				try{
					styleSupport=JSON.parse.call(null,styleSupport)
				} catch(e){
					styleSupport={};
				}
				if(typeof styleSupport == 'string'){
					styleSupport={};
				}
			}
			
			obj.removeAttr('style');
			
			if(!fullsize){

				if(styleSupport && typeof styleSupport.objectstyles == 'object'){
					var objectstyles=styleSupport.objectstyles;
					delete objectstyles.margin;
					delete objectstyles.marginLeft;
					delete objectstyles.marginRight;
					delete objectstyles.marginTop;
					delete objectstyles.marginBottom;
				}  
			}

			if(!fullsize || (fullsize && !(
				obj.css('marginTop')=='0px'
				&& obj.css('marginBottom')=='0px'
				&& obj.css('marginLeft')=='0px'
				&& obj.css('marginRight')=='0px'
			))){
				Mura.windowResponsiveModules[obj.data('instanceid')]=true;
			}

			if(!windowResponse){
				var sheet=Mura.getStyleSheet('mura-styles-' + obj.data('instanceid'));

				while (sheet.cssRules.length) {
					sheet.deleteRule(0);
				}
				
				Mura.applyModuleStyles(styleSupport,styleTargets.object,sheet,obj);
				Mura.applyModuleCustomCSS(styleSupport,sheet,obj.data('instanceid'));
			}
 			
			var metaWrapper=obj.children('.mura-object-meta-wrapper');
			if(metaWrapper.length){
				styleSupport.metastyles=styleSupport.metastyles || {}; 
				var meta=metaWrapper.children('.mura-object-meta');
				if(meta.length){

					meta.removeAttr('style');

					if(!windowResponse){
						applyMetaClassesAndId(obj,meta,metaWrapper);
						Mura.applyModuleStyles(styleSupport,styleTargets.meta,sheet,obj);
					}
				
				}
			}

			var content=obj.children('.mura-object-content').first();

			content.removeAttr('style');

			if(!windowResponse){
				applyContentClassesAndId(obj,content,metaWrapper);
				Mura.applyModuleStyles(styleSupport,styleTargets.content,sheet,obj);
			}

			applyMarginWidthOffset(obj);

			pinUIToolsToTopLeft(obj);

			function applyObjectClassesAndId(obj){
				if (obj.data('class')) {
					var classes = obj.data('class');
					if (typeof classes != 'Array') {
						var classes = classes.split(' ');
					}
					for (var c = 0; c < classes.length; c++) {
						if (!obj.hasClass(classes[c])) {
							obj.addClass(classes[c]);
						}
					}
				}
				if (obj.data('cssclass')) {
					var classes = obj.data('cssclass');
					if (typeof classes != 'array') {
						var classes = classes.split(' ');
					}
					for (var c = 0; c < classes.length; c++) {
						if (!obj.hasClass(classes[c])) {
							obj.addClass(classes[c]);
						}
					}
				}

				if (obj.data('objectspacing')) {
					var classes = obj.data('objectspacing');
					if (typeof classes != 'array') {
						var classes = classes.split(' ');
					}
					for (var c = 0; c < classes.length; c++) {
						if (c != 'custom' && !obj.hasClass(classes[c])) {
							obj.addClass(classes[c]);
						}
					}
				}

				if(obj.data('cssid')){
					obj.attr('id',obj.data('cssid'));
				} else {
					obj.removeAttr('id');
				}

			}

			function applyMetaClassesAndId(obj,meta,metawrapper){
				if(obj.data('metacssid')){
					meta.attr('id',obj.data('metacssid'));
				} else {
					meta.removeAttr('id');
				}
				if(obj.data('metacssclass')){
					obj.data('metacssclass').split(' ').forEach(function(c){
						if (!meta.hasClass(c)) {
							meta.addClass(c);
						}
					})
				}

				if (obj.data('metaspacing')) {
					var classes = obj.data('metaspacing');
					if (typeof classes != 'array') {
						var classes = classes.split(' ');
					}
					for (var c = 0; c < classes.length; c++) {
						if (c != 'custom' && !meta.hasClass(classes[c])) {
							meta.addClass(classes[c]);
						}
					}
				}

				if(obj.is('.mura-object-label-left, .mura-object-label-right')){
					var left=meta.css('marginLeft');
					var right=meta.css('marginRight')
					if(!(left=='0px' && right=='0px') && left.charAt(0) != "-" && right.charAt(0) != "-"){
						meta.css('width','calc(50% - (' + left + ' + ' + right + '))');
					}
				}
			}

			function applyContentClassesAndId(obj,content,metaWrapper){
				if(obj.data('contentcssid')){
					content.attr('id',obj.data('contentcssid'));
				} else {
					content.removeAttr('id');
				}
				if(obj.data('contentcssclass')){
					obj.data('contentcssclass').split(' ').forEach(function(c){
						if (!content.hasClass(c)) {
							content.addClass(c);
						}
					})
				}
				
				if (obj.data('contentspacing')) {
					var classes = obj.data('contentspacing');
					if (typeof classes != 'array') {
						var classes = classes.split(' ');
					}
					for (var c = 0; c < classes.length; c++) {
						if (c != 'custom' && !content.hasClass(classes[c])) {
							content.addClass(classes[c]);
						}
					}
				}

				if(content.hasClass('container')){
					metaWrapper.addClass('container');
				} else {
					metaWrapper.removeClass('container');
				}
	
				if(obj.is('.mura-object-label-left, .mura-object-label-right')){
					var left=content.css('marginLeft');
					var right=content.css('marginRight')
					if(!(left=='0px' && right=='0px') && left.charAt(0) != "-" && right.charAt(0) != "-"){
						if(fullsize){
							content.css('width','calc(50% - (' + left + ' + ' + right + '))');
						}
						Mura.windowResponsiveModules[obj.data('instanceid')]=true;
					}
				}
			}

			function applyMarginWidthOffset(obj){
				var left=obj.css('marginLeft');
				var right=obj.css('marginRight')
				
				if(!obj.is('.mura-center') && !(left=='0px' && right=='0px') && !(left=='auto' || right=='auto') && left.charAt(0) != "-" && right.charAt(0) != "-"){
					if(fullsize){
						var width='100%';

						if(obj.is('.mura-one')){
							width='8.33%';
						} else if(obj.is('.mura-two')){
							width='16.66%';
						} else if(obj.is('.mura-three')){
							width='25%';
						} else if(obj.is('.mura-four')){
							width='33.33%';
						} else if(obj.is('.mura-five')){
							width='41.66%';
						} else if(obj.is('.mura-six')){
							width='50%';
						} else if(obj.is('.mura-seven')){
							width='58.33';
						} else if(obj.is('.mura-eight')){
							width='66.66%';
						} else if(obj.is('.mura-nine')){
							width='75%';
						} else if(obj.is('.mura-ten')){
							width='83.33%';
						} else if(obj.is('.mura-eleven')){
							width='91.66%';
						} else if(obj.is('.mura-twelve')){
							width='100%';
						} else if(obj.is('.mura-one-third')){
							width='33.33%';
						} else if(obj.is('.mura-two-thirds')){
							width='66.66%';
						} else if(obj.is('.mura-one-half')){
							width='50%';
						} else {
							width='100%';
						}
						obj.css('width','calc(' + width + ' - (' + left + ' + ' + right + '))');
					}
					Mura.windowResponsiveModules[obj.data('instanceid')]=true;
				}
			}
			
			function pinUIToolsToTopLeft(obj){
				if(obj.css('paddingTop').replace(/[^0-9]/g,'') != '0' || obj.css('paddingLeft').replace(/[^0-9]/g,'') != '0'){
					obj.addClass('mura-object-pin-tools');
				} else {
					obj.removeClass('mura-object-pin-tools');
				}
			}

 		});

 		return this;
 	},

	/**
	 * text - Gets or sets the text content of each element in the selection
	 *
	 * @param	{string} textString Text string
	 * @return {object}						Self
	 */
	text(textString) {
		if (typeof textString != 'undefined') {
			this.each(function(el) {
				el.textContent = textString;
			});
			return this;
		} else {
			return this.selection[0].textContent;
		}
	},

	/**
	 * is - Returns if the first element in the select matches the selector
	 *
	 * @param	{string} selector description
	 * @return {boolean}
	 */
	is(selector) {
		if (!this.selection.length) {
			return false;
		}
		try {
			if (typeof this.selection[0] !== "undefined") {
			 	return this.selection[0].matchesSelector && this.selection[0].matchesSelector(selector);
			} else {
				return false;
			}
		} catch(e){
			return false;
		}
	},

	/**
	 * hasAttr - Returns is the first element in the selection has an attribute
	 *
	 * @param	{string} attributeName description
	 * @return {boolean}
	 */
	hasAttr(attributeName) {
		if (!this.selection.length) {
			return false;
		}
		return typeof this.selection[0].hasAttribute ==
			'function' && this.selection[0].hasAttribute(
					attributeName);
	},

	/**
	 * hasData - Returns if the first element in the selection has data attribute
	 *
	 * @param	{sting} attributeName Data atttribute name
	 * @return {boolean}
	 */
	hasData(attributeName) {
		if (!this.selection.length) {
			return false;
		}
		return this.hasAttr('data-' + attributeName);
	},


	/**
	 * offsetParent - Returns first element in selection's offsetParent
	 *
	 * @return {object}	offsetParent
	 */
	offsetParent() {
		if (!this.selection.length) {
			return this;
		}
		var el = this.selection[0];
		return el.offsetParent || el;
	},

	/**
	 * outerHeight - Returns first element in selection's outerHeight
	 *
	 * @param	{boolean} withMargin Whether to include margin
	 * @return {number}
	 */
	outerHeight(withMargin) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof withMargin == 'undefined') {
			function outerHeight(el) {
				var height = el.offsetHeight;
				var style = getComputedStyle(el);
				height += parseInt(style.marginTop) + parseInt(style.marginBottom);
				return height;
			}
			return outerHeight(this.selection[0]);
		} else {
			return this.selection[0].offsetHeight;
		}
	},

	/**
	 * height - Returns height of first element in selection or set height for elements in selection
	 *
	 * @param	{number} height	Height (option)
	 * @return {object}				Self
	 */
	height(height) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof width != 'undefined') {
			if (!isNaN(height)) {
					height += 'px';
			}
			this.css('height', height);
			return this;
		}
		var el = this.selection[0];
		//var type=el.constructor.name.toLowerCase();
		if (typeof window !='undefined' && typeof window.document != 'undefined' && el === window) {
			return innerHeight
		} else if (el === document) {
			var body = document.body;
			var html = document.documentElement;
			return Math.max(body.scrollHeight, body.offsetHeight,
				html.clientHeight, html.scrollHeight,
				html.offsetHeight)
		}
		var styles = getComputedStyle(el);
		var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
		return Math.ceil(el.offsetHeight + margin);
	},

	/**
	 * width - Returns width of first element in selection or set width for elements in selection
	 *
	 * @param	{number} width Width (optional)
	 * @return {object}			 Self
	 */
	width(width) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof width != 'undefined') {
			if (!isNaN(width)) {
				width += 'px';
			}
			this.css('width', width);
			return this;
		}
		var el = this.selection[0];
		//var type=el.constructor.name.toLowerCase();
		if (typeof window !='undefined' && typeof window.document != 'undefined' && el === window) {
			return innerWidth
		} else if (el === document) {
			var body = document.body;
			var html = document.documentElement;
		return Math.max(body.scrollWidth, body.offsetWidth,
				html.clientWidth, html.scrolWidth,
				html.offsetWidth)
		}
		return getComputedStyle(el).width;
	},

	/**
	 * width - Returns outerWidth of first element in selection
	 *
	 * @return {number}
	 */
	outerWidth() {
		if (!this.selection.length) {
			return 0;
		}
		var el = this.selection[0];
		var width = el.offsetWidth;
		var style = getComputedStyle(el);

		width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	},

	/**
	 * scrollTop - Returns the scrollTop of the current document
	 *
	 * @return {object}
	 */
	scrollTop() {
		if (!this.selection.length) {
			return 0;
		}
		var el = this.selection[0];
		if(typeof el.scrollTop != 'undefined'){
			return el.scrollTop;
		} else {
			return	window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
		}
	},

	/**
	 * offset - Returns offset of first element in selection
	 *
	 * @return {object}
	 */
	offset() {
		if (!this.selection.length) {
			return this;
		}
		var box = this.selection[0].getBoundingClientRect();
		return {
			top: box.top + (pageYOffset || document.scrollTop) -
					(document.clientTop || 0),
			left: box.left + (pageXOffset || document.scrollLeft) -
					(document.clientLeft || 0)
		};
	},

	/**
	 * removeAttr - Removes attribute from elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @return {object}							 Self
	 */
	removeAttr(attributeName) {
		if (!this.selection.length) {
				return this;
		}
		this.each(function(el) {
			if (el && typeof el.removeAttribute == 'function') {
				el.removeAttribute(attributeName);
			}
		});
		return this;
	},

	/**
	 * changeElementType - Changes element type of elements in selection
	 *
	 * @param	{string} type Element type to change to
	 * @return {Mura.DOMSelection} Self
	 */
	changeElementType(type) {
		if (!this.selection.length) {
			return this;
		}
		this.each(function(el) {
			Mura.changeElementType(el, type)
		});
		return this;
	},

	/**
	 * val - Set the value of elements in selection
	 *
	 * @param	{*} value Value
	 * @return {Mura.DOMSelection} Self
	 */
	val(value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof value != 'undefined') {
			this.each(function(el) {
				if (el.tagName == 'radio') {
					if (el.value == value) {
						el.checked = true;
					} else {
						el.checked = false;
					}
				} else {
					el.value = value;
				}
			});
			return this;
		} else if (this.selection[0].tagName=='SELECT'){
			var val=[];
			for (var j = this.selection[0].options.length - 1; j >= 0; j--) {
				if (this.selection[0].options[j].selected){
					val.push(this.selection[0].options[j].value);
				}
			}
			return val.join(",");
		} else {
			if (Object.prototype.hasOwnProperty.call(this.selection[0], 'value') ||
				typeof this.selection[0].value != 'undefined') {
				return this.selection[0].value;
			} else {
				return '';
			}
		}
	},

	/**
	 * attr - Returns attribute value of first element in selection or set attribute value for elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @param	{*} value				 Value (optional)
	 * @return {Mura.DOMSelection} Self
	 */
	attr(attributeName, value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof value == 'undefined' && typeof attributeName =='undefined') {
			return Mura.getAttributes(this.selection[0]);
		} else if (typeof attributeName == 'object') {
			this.each(function(el) {
				if (el.setAttribute) {
					for (var p in attributeName) {
						el.setAttribute(p,attributeName[p]);
					}
				}
			});
			return this;
		} else if (typeof value != 'undefined') {
			this.each(function(el) {
				if (el.setAttribute) {
					el.setAttribute(attributeName,value);
				}
			});
			return this;
		} else {
			if (this.selection[0] && this.selection[0].getAttribute) {
				return this.selection[0].getAttribute(attributeName);
			} else {
				return undefined;
			}

		}
	},

	/**
	 * data - Returns data attribute value of first element in selection or set data attribute value for elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @param	{*} value				 Value (optional)
	 * @return {Mura.DOMSelection} Self
	 */
	data(attributeName, value) {
		if (!this.selection.length) {
			return this;
		}
		if (typeof value == 'undefined' && typeof attributeName == 'undefined') {
			return Mura.getData(this.selection[0]);
		} else if (typeof attributeName == 'object') {
			this.each(function(el) {
				for (var p in attributeName) {
					el.setAttribute("data-" + p,attributeName[p]);
				}
			});
			return this;
		} else if (typeof value != 'undefined') {
			this.each(function(el) {
				el.setAttribute("data-" + attributeName, value);
			});
			return this;
		} else if (this.selection[0] && this.selection[	0].getAttribute) {
			return Mura.parseString(this.selection[0].getAttribute("data-" + attributeName));
		} else {
			return undefined;
		}
	},

	/**
	 * prop - Returns attribute value of first element in selection or set attribute value for elements in selection
	 *
	 * @param	{string} attributeName Attribute name
	 * @param	{*} value				 Value (optional)
	 * @return {Mura.DOMSelection} Self
	 */
	prop(attributeName, value) {
			if (!this.selection.length) {
				return this;
			}
			if (typeof value == 'undefined' && typeof attributeName == 'undefined') {
				return Mura.getProps(this.selection[0]);
			} else if (typeof attributeName == 'object') {
				this.each(function(el) {
					for (var p in attributeName) {
						el.setAttribute(p,attributeName[p]);
					}
				});
				return this;
			} else if (typeof value != 'undefined') {
				this.each(function(el) {
					el.setAttribute(attributeName,value);
				});
				return this;
			} else {
				return Mura.parseString(this.selection[0].getAttribute(attributeName));
			}
	},

	/**
	 * fadeOut - Fades out elements in selection
	 *
	 * @return {Mura.DOMSelection} Self
	 */
	fadeOut() {
		this.each(function(el) {
			el.style.opacity = 1;
			(function fade() {
				if ((el.style.opacity -= .1) < 	0) {
					el.style.opacity=0;
					el.style.display = "none";
				} else {
					requestAnimationFrame(fade);
				}
			})();
		});
		return this;
	},

	/**
	 * fadeIn - Fade in elements in selection
	 *
	 * @param	{string} display Display value
	 * @return {Mura.DOMSelection} Self
	 */
	fadeIn(display) {
			this.each(function(el) {
				el.style.opacity = 0;
				el.style.display = display ||	"block";
				(function fade() {
					var val = parseFloat(el.style.opacity);
					if (!((val += .1) > 1)) {
						el.style.opacity = val;
						requestAnimationFrame(fade);
					}
				})();
			});
			return this;
	},

	/**
	 * toggle - Toggles display object elements in selection
	 *
	 * @return {Mura.DOMSelection} Self
	 */
	toggle() {
		this.each(function(el) {
			if (typeof el.style.display ==
				'undefined' || el.style.display ==
				'') {
				el.style.display = 'none';
			} else {
				el.style.display = '';
			}
		});
		return this;
	},
	/**
	 * slideToggle - Place holder
	 *
	 * @return {Mura.DOMSelection} Self
	 */
	slideToggle() {
		this.each(function(el) {
			if (typeof el.style.display ==
				'undefined' || el.style.display ==
				'') {
				el.style.display = 'none';
			} else {
				el.style.display = '';
			}
		});
		return this;
	},

	/**
	 * focus - sets focus of the first select element
	 *
	 * @return {self}
	 */
	focus() {
		if (!this.selection.length) {
			return this;
		}
		this.selection[0].focus();
		return this;
	},

	/**
	 * renderEditableAttr- Returns a string with editable attriute markup markup.
	 *
	 * @param	{object} params Keys: name, type, required, validation, message, label
	 * @return {self}
	 */
	makeEditableAttr(params){
		if (!this.selection.length) {
			return this;
		}
		var value=this.selection[0].innerHTML;
		params=params || {};
		if(!params.name){
			return this;
		}
		params.type=params.type || "text";
		if(typeof params.required == 'undefined'){
			params.required=false;
		}
		if(typeof params.validation == 'undefined'){
			params.validation='';
		}
		if(typeof params.message == 'undefined'){
			params.message='';
		}
		if(typeof params.label == 'undefined'){
			params.label=params.name;
		}
		var outerClass="mura-editable mura-inactive";
		var innerClass="mura-inactive mura-editable-attribute";
		if(params.type=="htmlEditor"){
			outerClass += " mura-region mura-region-loose";
			innerClass += " mura-region-local";
		} else {
			outerClass += " inline";
			innerClass += " inline";
		}
		var innerClass="mura-inactive mura-editable-attribute";
		/*
		<div class="mura-editable mura-inactive inline">
		<label class="mura-editable-label" style="">TITLE</label>
		<div contenteditable="false" id="mura-editable-attribute-title" class="mura-inactive mura-editable-attribute inline" data-attribute="title" data-type="text" data-required="false" data-message="" data-label="title">About</div>
		</div>

		<div class="mura-region mura-region-loose mura-editable mura-inactive">
		<label class="mura-editable-label" style="">BODY</label>
		<div contenteditable="false" id="mura-editable-attribute-body" class="mura-region-local mura-inactive mura-editable-attribute" data-attribute="body" data-type="htmlEditor" data-required="false" data-message="" data-label="body" data-loose="true" data-perm="true" data-inited="false"></div>
		</div>
		*/
		var markup='<div class="' + outerClass + '">';
		markup +='<div contenteditable="false" id="mura-editable-attribute-' + params.name +' class="' + innerClass + '" ';
		markup += ' data-attribute="' + params.name + '" ';
		markup += ' data-type="' + params.type + '" ';
		markup += ' data-required="' + params.required + '" ';
		markup += ' data-message="' + params.message + '" ';
		markup += ' data-label="' + params.label + '"';
		if(params.type == 'htmlEditor'){
			markup += ' data-loose="true" data-perm="true" data-inited="false"';
		}
		markup += '>' + value + '</div>';
		markup += '<label class="mura-editable-label" style="display:none">' + params.label.toUpperCase() + '</label>';
		markup +=	'</div>';
		this.selection[0].innerHTML=markup;
		Mura.evalScripts(this.selection[0]);
		return this;
	},

	/**
	* processDisplayRegion - Renders and processes the display region data returned from Mura.renderFilename()
	*
	* @param	{any} data Region data to render
	* @return {Promise}
	*/
	processDisplayRegion(data,label){
		if (typeof data == 'undefined' || !this.selection.length) {
				return this.processMarkup();
		}
		this.html(Mura.buildDisplayRegion(data));
		if(label != 'undefined'){
			this.find('label.mura-editable-label').html('DISPLAY REGION : ' + data.label);
		}
		return this.processMarkup();
	},

	/**
	 * appendDisplayObject - Appends display object to selected items
	 *
	 * @param	{object} data Display objectparams (including object='objectkey')
	 * @return {Promise}
	 */
	dspObject(data){
		return this.appendDisplayObject(data);
	}
});