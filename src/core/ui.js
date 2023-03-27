
/**
 * Creates a new Mura.UI instance
 * @name Mura.UI
 * @class
 * @extends  Mura.Core
 * @memberof Mura
 */

function attach(Mura){

	Mura.UI=Mura.Core.extend(
	/** @lends Mura.UI.prototype */
	{
		rb:{},
		context:{},

		/**
		 * onAfterRender - function that fires after render
		 */
		onAfterRender(){},

		/**
		 * onBeforeRender - function that fires before render
		 */
		onBeforeRender(){},

		/**
		 * trigger -Trigger an event on the UI object
		 * @param {string} eventName - The name of the event to trigger
		 */
		trigger(eventName){
			var $eventName=eventName.toLowerCase();
			if(typeof this.context.targetEl != 'undefined'){
				var obj=Mura(this.context.targetEl).closest('.mura-object');
				if(obj.length && typeof obj.node != 'undefined'){
					if(typeof this.handlers[$eventName] != 'undefined'){
						var $handlers=this.handlers[$eventName];
						for(var i=0;i < $handlers.length;i++){
							if(typeof $handlers[i].call == 'undefined'){
								$handlers[i](this);
							} else {
								$handlers[i].call(this,this);
							}
						}
					}
					if(typeof this[eventName] == 'function'){
						if(typeof this[eventName].call == 'undefined'){
							this[eventName](this);
						} else {
							this[eventName].call(this,this);
						}
					}
					var fnName='on' + eventName.substring(0,1).toUpperCase() + eventName.substring(1,eventName.length);
					if(typeof this[fnName] == 'function'){
						if(typeof this[fnName].call == 'undefined'){
							this[fnName](this);
						} else {
							this[fnName].call(this,this);
						}
					}
				}
			}
			return this;
		},

		/**
		 * render - Renders the UI object on the client and server
		 */
		render(){
			Mura(this.context.targetEl).html(Mura.templates[context.object](this.context));
			this.trigger('afterRender');
			return this;
		},

		/**
		 * renderClient - Renders the UI object on the client
		 * @example
		 * function(){
		 *   Mura(this.context.targetEl).html(Mura.templates[context.object](this.context));
		 *   this.trigger('afterRender');
		 * }
		 */
		renderClient(){
			return this.render();
		},

		/**
		 * renderServer - Renders the UI object on the server
		  * @example
		 * function(){
		 *  return `Hello: ${this.context.name}`;
		 * }
		 */
		renderServer(){
			return '';
		},

		/**
		 * hydrate
		 */
		hydrate(){

		},

		/**
		 * destroy - Clean up the UI object when detroyed
		 */
		destroy(){
			
		},

		/**
		 * reset - Clean up the UI object when reset
		 */
		reset(self,empty){
			
		},

		/**
		 * init - Initializes the UI object
		 * @param {object} args - The arguments to initialize the object with
		 */
		init(args){
			this.context=args;
			this.registerHelpers();
			return this;
		},

		/**
		 * registerHelpers
		 */
		registerHelpers(){

		}
	});
}

module.exports=attach;
