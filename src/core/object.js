/**
* Creates a new Mura.Core
* @name Mura.Core
* @class
* @memberof Mura
* @param  {object} properties Object containing values to set into object
* @return {Mura.Core}
*/

function attach(Mura){

	function Core(){
		this.init.apply(this,arguments);
		return this;
	}

	/** @lends Mura.Core.prototype */
	Core.prototype=
		{
		init(){},
		/**
		 * invoke - Invokes a method
		 *
		 * @param  {string} funcName Method to call
		 * @param  {object} params Arguments to submit to method
		 * @return {any}
		 */
		invoke(funcName,params){
			params=params || {};

			if(this[funcName]=='function'){
				return this[funcName].apply(this,params);
			}
		},

		/**
		 * trigger - Triggers custom event on Mura objects
		 *
		 * @name Mura.Core.trigger
		 * @function
		 * @param  {string} eventName  Name of header
		 * @return {object}  Self
		 */
		trigger(eventName){
			eventName=eventName.toLowerCase();
			if(typeof this.prototype.handlers[eventName] != 'undefined'){
				var handlers=this.prototype.handlers[eventName];
				for(var handler in handlers){
					if(typeof handler.call == 'undefined'){
						handler(this);
					} else {
						handler.call(this,this);
					}

				}
			}

			return this;
		},
	};

	/** @lends Mura.Core.prototype */

	/**
	 * Extend - Allow the creation of new Mura core classes
	 *
	 * @name Mura.Core.extend
	 * @function
	 * @param  {object} properties  Properties to add to new class prototype
	 * @return {class}  Self
	 */
	Core.extend=function(properties){
		var self=this;
		return Mura.extend(Mura.extendClass(self,properties),{extend:self.extend,handlers:[]});
	};

	Mura.Core=Core;
}

module.exports=attach;

