/**
 * Creates a new Mura.EntityCollection
 * @name	Mura.EntityCollection
 * @class
 * @extends Mura.Entity
 * @memberof	Mura
 * @param	{object} properties Object containing values to set into object
 * @return {Mura.EntityCollection} Self
 */

function attach(Mura){

	Mura.EntityCollection=Mura.Entity.extend(
		/** @lends Mura.EntityCollection.prototype */
		{

		init(properties,requestcontext){
			properties=properties || {};
			this.set(properties);
			this._requestcontext=requestcontext || Mura._requestcontext;
			var self=this;
			if(Array.isArray(self.get('items'))){
				self.set('items',self.get('items').map(function(obj){
					var entityname=obj.entityname.substr(0, 1).toUpperCase() + obj.entityname.substr(1);
					if(Mura.entities[entityname]){
						return new Mura.entities[entityname](obj,self._requestcontext);
					} else {
						return new Mura.Entity(obj,self._requestcontext);
					}
				}));
			}

			return this;
		},

		/**
		 * length - Returns length entity collection
		 *
		 * @return {number}		 integer
		 */
		length(){
			return this.properties.items.length;
		},

		/**
		 * item - Return entity in collection at index
		 *
		 * @param	{nuymber} idx Index
		 * @return {object}		 Mura.Entity
		 */
		item(idx){
			return this.properties.items[idx];
		},

		/**
		 * index - Returns index of item in collection
		 *
		 * @param	{object} item Entity instance
		 * @return {number}			Index of entity
		 */
		index(item){
			return this.properties.items.indexOf(item);
		},

		/**
		 * indexOf - Returns index of item in collection
		 *
		 * @param	{object} item Entity instance
		 * @return {number}			Index of entity
		 */
		indexOf(item){
			return this.properties.items.indexOf(item);
		},

		/**
		 * getAll - Returns object with of all entities and properties
		 *
		 * @return {object}
		 */
		getAll(){
			var self=this;
			if(typeof self.properties.items != 'undefined'){
				return Mura.extend(
					{},
					self.properties,
					{
						items:self.properties.items.map(function(obj){
							return obj.getAll();
						})
					}
				);
			} else if(typeof self.properties.properties != 'undefined'){
				return Mura.extend(
					{},
					self.properties,
					{
						properties:self.properties.properties.map(function(obj){
							return obj.getAll();
						})
					}
				);
			}
		},

		/**
		 * each - Passes each entity in collection through function
		 *
		 * @param	{function} fn Function
		 * @return {object}	Self
		 */
		each(fn){
			this.properties.items.forEach( function(item,idx){
				if(typeof fn.call == 'undefined'){
					fn(item,idx);
				} else {
					fn.call(item,item,idx);
				}
			});
			return this;
		},

				/**
		 * each - Passes each entity in collection through function
		 *
		 * @param	{function} fn Function
		 * @return {object}	Self
		 */
		forEach(fn){
			return this.each(fn);
		},

		/**
		 * sort - Sorts collection
		 *
		 * @param	{function} fn Sorting function
		 * @return {object}	 Self
		 */
		sort(fn){
			this.properties.items.sort(fn);
			return this;
		},

		/**
		 * filter - Returns new Mura.EntityCollection of entities in collection that pass filter
		 *
		 * @param	{function} fn Filter function
		 * @return {Mura.EntityCollection}
		 */
		filter(fn){
			var newProps={};
			for(var p in this.properties){
				if(this.properties.hasOwnProperty(p) && p != 'items' && p != 'links'){
					newProps[p]=this.properties[p];
				}
			}
			var collection=new Mura.EntityCollection(newProps,this._requestcontext);
			return collection.set('items',this.properties.items.filter( function(item,idx){
				if(typeof fn.call == 'undefined'){
					return fn(item,idx);
				} else {
					return fn.call(item,item,idx);
				}
			}));
		},

		/**
		 * map - Returns new Array returned from map function
		 *
		 * @param	{function} fn Filter function
		 * @return {Array}
		 */
		map(fn){
			return this.properties.items.map( function(item,idx){
				if(typeof fn.call == 'undefined'){
					return fn(item,idx);
				} else {
					return fn.call(item,item,idx);
				}
			});
		},

		/**
		 * reverse - Returns new Array returned from map function
		 *
		 * @param	{function} fn Sorting function
		 * @return {object}	 collection
		 */
		reverse(fn){
			var newProps={};
			for(var p in this.properties){
				if(this.properties.hasOwnProperty(p) && p != 'items' && p != 'links'){
					newProps[p]=this.properties[p];
				}
			}
			var collection=new Mura.EntityCollection(newProps,this._requestcontext);
			collection.set('items',this.properties.items.reverse());
			return collection;
		},

		/**
		 * reduce - Returns value from	reduce function
		 *
		 * @param	{function} fn Reduce function
		 * @param	{any} initialValue Starting accumulator value
		 * @return {accumulator}
		 */
		reduce(fn,initialValue){
			initialValue=initialValue||0;
			return this.properties.items.reduce(
				function(accumulator,item,idx,array){
					if(typeof fn.call == 'undefined'){
						return fn(accumulator,item,idx,array);
					} else {
						return fn.call(item,accumulator,item,idx,array);
					}
				},
				initialValue
			);
		}
	});
}

module.exports=attach;