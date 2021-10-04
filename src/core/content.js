
var Mura=require('./core');

/**
* Creates a new Mura.entities.Content
* @name Mura.entities.Content
* @class
* @extends Mura.Entity
* @memberof Mura
* @param	{object} properties Object containing values to set into object
* @return {Mura.entities.Content}
*/

Mura.entities.Content = Mura.Entity.extend(
/** @lends Mura.entities.Content.prototype */
{
	/**
	 * hasParent - Returns true if content has a parent.
	 *
	 * @return {boolean}
	 */
	hasParent(){
		var parentid=this.get('parentid');
		return !(!parentid || ['00000000000000000000000000000000END','00000000000000000000000000000000003','00000000000000000000000000000000004','00000000000000000000000000000000099'].find(function(value){return value===parentid}));
	},

	/**
	 * updateFromDom - Updates editable data from what's in the DOM.
	 *
	 * @return {string}
	 */
	updateFromDom(){
		var regions = this.get('displayregions');
		
		if(regions && typeof regions === 'object'){
			Object.keys(regions).forEach(key => {
				var region = regions[key];
			
				if(region){
					var items=[];

					Mura('.mura-region-local[data-regionid="' + region.regionid +'"]').forEach(function(){
						Mura(this).children('.mura-object[data-object]').forEach(function(){
							var obj=Mura(this);
							
							if(typeof Mura.displayObjectInstances[obj.data('instanceid')] != 'undefined'){
								Mura.displayObjectInstances[obj.data('instanceid')].reset(obj,false);
							}
							
							items.push(Mura.cleanModuleProps(obj.data()));
						})
					});

					region.local.items=items;
				}
			});
		}

		var self=this;

		Mura('div.mura-object[data-targetattr]').each(function(){
			var obj=Mura(this);
			
			if(typeof Mura.displayObjectInstances[obj.data('instanceid')] != 'undefined'){
				Mura.displayObjectInstances[obj.data('instanceid')].reset(obj,false);
			}

			self.set(obj.data('targetattr'),Mura.cleanModuleProps(Mura(this).data()));
		});

		Mura('.mura-editable-attribute.inline').forEach(function(){
			var editable=Mura(this);
			var attributeName=editable.data('attribute');
			self.set(attributeName,editable.html());
		})

		return this;
	},

	/**
	 * renderDisplayRegion - Returns a string with display region markup.
	 *
	 * @return {string}
	 */
	renderDisplayRegion(region){
		return Mura.buildDisplayRegion(this.get('displayregions')[region])
	},

	/**
	 * dspRegion - Appends a display region to a element.
	 *
	 * @return {self}
	 */
	dspRegion(selector,region,label){
		if(Mura.isNumeric(region) && region <= this.get('displayregionnames').length){
			region=this.get('displayregionnames')[region-1];
		}
		Mura(selector).processDisplayRegion(this.get('displayregions')[region],label);
		return this;
	},

	/**
	 * getRelatedContent - Gets related content sets by name
	 *
	 * @param	{string} relatedContentSetName
	 * @param	{object} params
	 * @return {Mura.EntityCollection}
	 */
	getRelatedContent(relatedContentSetName,params){
		var self=this;

		relatedContentSetName=relatedContentSetName || '';

		return new Promise(function(resolve,reject) {
			var query = [];
			params = params || {};
			params.siteid = self.get('siteid') || Mura.siteid;
			if(self.has('contenthistid') && self.get('contenthistid')){
				params.contenthistid=self.get('contenthistid');
			}
			for (var key in params) {
				if (key != 'entityname' && key != 'filename' && key != 'siteid' && key != 'method') {
					query.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
				}
			}
			self._requestcontext.request({
				type: 'get',
				url: Mura.getAPIEndpoint() +
					'/content/' + self.get('contentid') + '/relatedcontent/' + relatedContentSetName + '?' +
					query.join('&'),
				params: params,
				success(resp) {
					if(typeof resp.data.items != 'undefined'){
						var returnObj = new Mura.EntityCollection(resp.data,self._requestcontext);
					} else {
						var returnObj = new Mura.Entity({siteid:Mura.siteid},self._requestcontext);
						for(var p in resp.data){
							if(resp.data.hasOwnProperty(p)){
								returnObj.set(p,new Mura.EntityCollection(resp.data[p],self._requestcontext));
							}
						}
					}
					if (typeof resolve == 'function') {
						resolve(returnObj);
					}
				},
				error: reject
			});
		});
	}
});
