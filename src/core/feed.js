/**
 * Creates a new Mura.Feed
 * @name  Mura.Feed
 * @example
 * const collection= await Mura
 * 	.getFeed('content')
 * 	.where()
 * 	.prop('title').containsValue('test')
 * 	.orOpenGrouping()
 *  	.prop('title').isEQ('about')
 *  	.orProp('title').isEQ('contact')
 * 	.closeGrouping()
 * 	.sort('title','asc')
 * 	.maxItems(10)
 * 	.itemPerPage(5)
 * 	.cacheKey('mycachekey')
 * 	.cacheWithin(60)
 * 	.expand('kids')
 * 	.fields('title,summary,url')
 * 	.getQuery({	
 * 		headers:{
 *			'X-My-Header':'123'
 *		},
 *		cache:'cache',
 *		next:  { revalidate: 10 } 
 * 	}
 * );
 * 
 * collection.forEach(function(item){	
 * 	console.log(item.get('title'));
 * });
 * 
 * @class
 * @extends Mura.Core
 * @memberof Mura
 * @param  {string} siteid     Siteid
 * @param  {string} entityname Entity name
 * @return {Mura.Feed}            Self
 */

function attach(Mura){

 /**
  * @ignore
  */

Mura.Feed = Mura.Core.extend(
	/** @lends Mura.Feed.prototype */
	{
		init(siteid, entityname, requestcontext) {
			this.queryString = entityname + '/?';
			this.propIndex = 0;
			this.cache='default';
			this.next={};
			this._requestcontext=requestcontext || Mura.getRequestContext();

			return this;
		},

		/**
		 * cache - Sets the cache policy for the  feed to use
		 *
		 * @param  {string} name Name of feed as defined in admin
		 * @return {Mura.Feed}              Self
		 */
		 cache(cache) {
			this.cache=cache;
			return this;
		},

		/**
		 * next - Sets the next config for the  feed to use
		 *
		 * @param  {object} next next config for the  feed to use
		 * @return {Mura.Feed}              Self
		 */
		 next(next) {
			this.next=next;
			return next;
		},

		/**
		 * fields - List fields to retrieve from API
		 *
		 * @param  {string} fields List of fields
		 * @return {Mura.Feed}        Self
		 */
		fields(fields) {
			if(typeof fields != 'undefined' && fields){
				this.queryString += '&fields=' + encodeURIComponent(fields);
			}
			return this;
		},

		/**
		 * setRequestContext - Sets the RequestContext
		 *
		 * @RequestContext  {Mura.RequestContext} Mura.RequestContext List of fields
		 * @return {Mura.Feed}        Self
		 */
		setRequestContext(RequestContext) {
			this._requestcontext=RequestContext;
			return this;
		},

		/**
		 * contentPoolID - Sets items per page
		 *
		 * @param  {string} contentPoolID Items per page
		 * @return {Mura.Feed}              Self
		 */
		contentPoolID(contentPoolID) {
			this.queryString += '&contentpoolid=' + encodeURIComponent(
				contentPoolID);
			return this;
		},

		/**
		 * name - Sets the name of the content feed to use
		 *
		 * @param  {string} name Name of feed as defined in admin
		 * @return {Mura.Feed}              Self
		 */
		name(name) {
			this.queryString += '&feedname=' + encodeURIComponent(
				name);
			return this;
		},

		/**
		 * cacheKey - Set unique key in cache
		 *
		 * @param  {string} cacheKey Unique key in cache
		 * @return {Mura.Feed}              Self
		 */
		 cacheKey(cacheKey) {
			this.queryString += '&cacheKey=' + encodeURIComponent(
				cacheKey);
			return this;
		},

		/**
		 * cachedWithin - Sets maximum number of seconds to remain in cache
		 *
		 * @param  {number} cachedWithin Maximum number of seconds to remain in cache
		 * @return {Mura.Feed}              Self
		 */
		 cachedWithin(cachedWithin) {
			this.queryString += '&cachedWithin=' + encodeURIComponent(
				cachedWithin);
			return this;
		},

		/**
		 * purgeCache - Sets whether to purge any existing cached values
		 *
		 * @param  {boolean} purgeCache Whether to purge any existing cached values
		 * @return {Mura.Feed}              Self
		 */
		 purgeCache(purgeCache) {
			this.queryString += '&purgeCache=' + encodeURIComponent(
				purgeCache);
			return this;
		},

		/**
		 * contentPoolID - Sets items per page
		 *
		 * @param  {string} feedID Items per page
		 * @return {Mura.Feed}              Self
		 */
		feedID(feedID) {
			this.queryString += '&feedid=' + encodeURIComponent(
				feedID);
			return this;
		},

		/**
		 * where - Optional method for starting query chain
		 *
		 * @param  {string} property Property name
		 * @return {Mura.Feed}          Self
		 */
		where(property) {
			if (property) {
				return this.andProp(property);
			}
			return this;
		},

		/**
		 * prop - Add new property value
		 *
		 * @param  {string} property Property name
		 * @return {Mura.Feed}          Self
		 */
		prop(property) {
			return this.andProp(property);
		},

		/**
		 * andProp - Add new AND property value
		 *
		 * @param  {string} property Property name
		 * @return {Mura.Feed}          Self
		 */
		andProp(property) {
			this.queryString += '&' + encodeURIComponent(property + '[' + this.propIndex + ']') +
				'=';
			this.propIndex++;
			return this;
		},

		/**
		 * orProp - Add new OR property value
		 *
		 * @param  {string} property Property name
		 * @return {Mura.Feed}          Self
		 */
		orProp(property) {
			this.queryString += '&or' + encodeURIComponent('[' + this.propIndex + ']') + '&';
			this.propIndex++;
			this.queryString += encodeURIComponent(property +'[' + this.propIndex + ']') +
				'=';
			this.propIndex++;
			return this;
		},

		/**
		 * isEQ - Checks if preceding property value is EQ to criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		isEQ(criteria) {
			if (typeof criteria== 'undefined' || criteria === '' || criteria ==	null) {
				criteria = 'null';
			}
			this.queryString += encodeURIComponent(criteria);
			return this;
		},

		/**
		 * isNEQ - Checks if preceding property value is NEQ to criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		isNEQ(criteria) {
			if (typeof criteria == 'undefined' || criteria === '' || criteria == null) {
				criteria = 'null';
			}
			this.queryString += encodeURIComponent('neq^' + criteria);
			return this;
		},

		/**
		 * isLT - Checks if preceding property value is LT to criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		isLT(criteria) {
			if (typeof criteria == 'undefined' || criteria === '' || criteria == null) {
				criteria = 'null';
			}
			this.queryString += encodeURIComponent('lt^' + criteria);
			return this;
		},

		/**
		 * isLTE - Checks if preceding property value is LTE to criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		isLTE(criteria) {
			if (typeof criteria == 'undefined' || criteria === '' || criteria ==
				null) {
				criteria = 'null';
			}
			this.queryString += encodeURIComponent('lte^' + criteria);
			return this;
		},

		/**
		 * isGT - Checks if preceding property value is GT to criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		isGT(criteria) {
			if (typeof criteria == 'undefined' || criteria === '' || criteria == null) {
				criteria = 'null';
			}
			this.queryString += encodeURIComponent('gt^' + criteria);
			return this;
		},

		/**
		 * isGTE - Checks if preceding property value is GTE to criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		isGTE(criteria) {
			if (typeof criteria == 'undefined' || criteria === '' || criteria ==
				null) {
				criteria = 'null';
			}
			this.queryString += encodeURIComponent('gte^' + criteria);
			return this;
		},

		/**
		 * isIn - Checks if preceding property value is IN to list of criterias
		 *
		 * @param  {*} criteria Criteria List
		 * @return {Mura.Feed}          Self
		 */
		isIn(criteria) {
			if(Array.isArray(criteria)){
				criteria=criteria.join();
			}
			this.queryString += encodeURIComponent('in^' + criteria);
			return this;
		},

		/**
		 * isNotIn - Checks if preceding property value is NOT IN to list of criterias
		 *
		 * @param  {*} criteria Criteria List
		 * @return {Mura.Feed}          Self
		 */
		isNotIn(criteria) {
			if(Array.isArray(criteria)){
				criteria=criteria.join();
			}
			this.queryString += encodeURIComponent('notIn^' + criteria);
			return this;
		},

		/**
		 * All - Checks if preceding property value ALL to list of criterias
		 *
		 * @param  {*} criteria Criteria List
		 * @return {Mura.Feed}          Self
		 */
		hasAll(criteria) {
			if(Array.isArray(criteria)){
				criteria=criteria.join();
			}
			this.queryString += encodeURIComponent('hasAll^' + criteria);
			return this;
		},

		/**
		 * Any - Checks if preceding property value has ANY on list of criterias
		 *
		 * @param  {*} criteria Criteria List
		 * @return {Mura.Feed}          Self
		 */
		hasAny(criteria) {
			if(Array.isArray(criteria)){
				criteria=criteria.join();
			}
			this.queryString += encodeURIComponent('hasAny^' + criteria);
			return this;
		},

		/**
		 * containsValue - Checks if preceding property value is CONTAINS the value of criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		containsValue(criteria) {
			this.queryString += encodeURIComponent('containsValue^' + criteria);
			return this;
		},
		contains(criteria) {
			this.queryString += encodeURIComponent('containsValue^' + criteria);
			return this;
		},

		/**
		 * beginsWith - Checks if preceding property value BEGINS WITH criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		beginsWith(criteria) {
			this.queryString += encodeURIComponent('begins^' + criteria);
			return this;
		},

		/**
		 * endsWith - Checks if preceding property value ENDS WITH criteria
		 *
		 * @param  {*} criteria Criteria
		 * @return {Mura.Feed}          Self
		 */
		endsWith(criteria) {
			this.queryString += encodeURIComponent('ends^' + criteria);
			return this;
		},


		/**
		 * openGrouping - Start new logical condition grouping
		 *
		 * @return {Mura.Feed}          Self
		 */
		openGrouping() {
			this.queryString += '&openGrouping' + encodeURIComponent('[' + this.propIndex + ']');
			this.propIndex++;
			return this;
		},

		/**
		 * openGrouping - Starts new logical condition grouping
		 *
		 * @return {Mura.Feed}          Self
		 */
		andOpenGrouping() {
			this.queryString += '&andOpenGrouping' + encodeURIComponent('[' + this.propIndex + ']');
			this.propIndex++;
			return this;
		},

		/**
		 * orOpenGrouping - Starts new logical condition grouping
		 *
		 * @return {Mura.Feed}          Self
		 */
		orOpenGrouping() {
			this.queryString += '&orOpenGrouping' + encodeURIComponent('[' + this.propIndex + ']');
			this.propIndex++;
			return this;
		},

		/**
		 * openGrouping - Closes logical condition grouping
		 *
		 * @return {Mura.Feed}          Self
		 */
		closeGrouping() {
			this.queryString += '&closeGrouping' + encodeURIComponent('[' + this.propIndex + ']');
			this.propIndex++;
			return this;
		},

		/**
		 * sort - Set desired sort or return collection
		 *
		 * @param  {string} property  Property
		 * @param  {string} direction Sort direction
		 * @return {Mura.Feed}           Self
		 */
		sort(property, direction) {
			direction = direction || 'asc';
			if (direction == 'desc') {
				this.queryString += '&sort' + encodeURIComponent('[' + this.propIndex + ']') + '=' + encodeURIComponent('-' + property);
			} else {
				this.queryString += '&sort' +encodeURIComponent('[' + this.propIndex + ']') + '=' + encodeURIComponent(property);
			}
			this.propIndex++;
			return this;
		},

		/**
		 * itemsPerPage - Sets items per page
		 *
		 * @param  {number} itemsPerPage Items per page
		 * @return {Mura.Feed}              Self
		 */
		itemsPerPage(itemsPerPage) {
			this.queryString += '&itemsPerPage=' + encodeURIComponent(itemsPerPage);
			return this;
		},

		/**
		 * pageIndex - Sets items per page
		 *
		 * @param  {number} pageIndex page to start at
		 */
		pageIndex(pageIndex) {
			this.queryString += '&pageIndex=' + encodeURIComponent(pageIndex);
			return this;
		},

		/**
		 * maxItems - Sets max items to return
		 *
		 * @param  {number} maxItems Items to return
		 * @return {Mura.Feed}              Self
		 */
		maxItems(maxItems) {
			this.queryString += '&maxItems=' + encodeURIComponent(maxItems);
			return this;
		},

		/**
		 * distinct - Sets to select distinct values of select fields
		 *
		 * @param  {boolean} distinct Whether to to select distinct values
		 * @return {Mura.Feed}              Self
		 */
		distinct(distinct) {
			if(typeof distinct=='undefined'){
				distinct=true;
			}
			this.queryString += '&distinct=' + encodeURIComponent(distinct);
			return this;
		},

		/**
		 * aggregate - Define aggregate values that you would like (sum,max,min,cout,avg,groupby)
		 *
		 * @param  {string} type Type of aggregation (sum,max,min,cout,avg,groupby)
		 * @param  {string} property property
		 * @return {Mura.Feed}	Self
		 */
		aggregate(type,property) {
			if(type == 'count' && typeof property=='undefined'){
				property='*';
			}

			if(typeof type != 'undefined' && typeof property!='undefined'){
				this.queryString += '&' + encodeURIComponent( type + '[' + this.propIndex + ']') + '=' + property;
				this.propIndex++;
			}
			return this;
		},

		/**
		 * liveOnly - Set whether to return all content or only content that is currently live.
		 * This only works if the user has module level access to the current site's content
		 *
		 * @param  {number} liveOnly 0 or 1
		 * @return {Mura.Feed}              Self
		 */
		liveOnly(liveOnly) {
			this.queryString += '&liveOnly=' + encodeURIComponent(liveOnly);
			return this;
		},

		/**
		 * groupBy - Sets property or properties to group by
		 *
		 * @param  {string} groupBy
		 * @return {Mura.Feed}              Self
		 */
		 groupBy(property) {
 			if(typeof property!='undefined'){
 				this.queryString += '&' + encodeURIComponent('groupBy[' + this.propIndex + ']') + '=' + property;
 				this.propIndex++;
 			}
 			return this;
 		},

		/**
		 * maxItems - Sets max items to return
		 *
		 * @param  {number} maxItems Items to return
		 * @return {Mura.Feed}              Self
		 */
		maxItems(maxItems) {
			this.queryString += '&maxItems=' + encodeURIComponent(maxItems);
			return this;
		},
		

		/**
		 * showNavOnly - Sets to include the homepage
		 *
		 * @param  {boolean} showNavOnly Whether to return items that have been excluded from search
		 * @return {Mura.Feed}              Self
		 */
		showNavOnly(showNavOnly) {
			this.queryString += '&showNavOnly=' + encodeURIComponent(showNavOnly);
			return this;
		},

		/**
		 * expand - Sets which linked properties to return expanded values
		 *
		 * @param  {string} expand List of properties to expand, use 'all' for all.
		 * @return {Mura.Feed}              Self
		 */
		expand(expand) {
			if(typeof expand == 'undefined'){
				expand = 'all';
			}
			if(expand){
				this.queryString += '&expand=' + encodeURIComponent(expand);
			}
			return this;
		},

		/**
		 * expandDepth - Set the depth that expanded links are expanded
		 *
		 * @param  {number} expandDepth Number of levels to expand, defaults to 1
		 * @return {Mura.Feed}              Self
		 */
		expandDepth(expandDepth) {
			expandDepth = expandDepth || 1;
			if(Mura.isNumeric(expandDepth) && Number(parseFloat(expandDepth)) > 1){
				this.queryString += '&expandDepth=' + encodeURIComponent(expandDepth);
			}
			return this;
		},

		/**
		 * finMany - Sets a list of ids that you would like to fetch in the order
		 *
		 * @param  {array} ids Comma separated list of ids
		 * @return {Mura.Feed}              Self
		 */
		findMany(ids) {
			if(!Array.isArray(ids)){
				ids=ids.split(",");
			}
			if(!ids.length){
				ids=[Mura.createUUID()];
			}
			if(ids.length === 1){
				this.andProp('id').isEQ(ids[0]);
			} else {
				this.queryString += '&id=' + encodeURIComponent(ids.join(","));
			}
		
			return this;
		},

		/**
		 * no - Sets to include the homepage
		 *
		 * @param  {date} pointInTime What time historical Mura ORM entities should think it is
		 * @return {Mura.Feed}              Self
		 */
		pointInTime(pointInTime) {
			this.queryString += '&pointInTime=' + encodeURIComponent(pointInTime);
			return this;
		},

		/**
		 * no - Sets to include the homepage
		 *
		 * @param  {boolean} showExcludeSearch Whether to return items that have been excluded from search
		 * @return {Mura.Feed}              Self
		 */
		showExcludeSearch(showExcludeSearch) {
			this.queryString += '&showExcludeSearch=' + encodeURIComponent(showExcludeSearch);
			return this;
		},

		/**
		 * no - Sets to include the homepage
		 *
		 * @param  {boolean} applyPermFilter Whether to return filter items based on permissions
		 * @return {Mura.Feed}              Self
		 */
		applyPermFilter(applyPermFilter) {
			this.queryString += '&applyPermFilter=' + encodeURIComponent(applyPermFilter);
			return this;
		},

		/**
		 * no - Sets to include the homepage
		 *
		 * @param  {string} imageSizes A list of images sizes to return when image is in the fields list
		 * @return {Mura.Feed}              Self
		 */
		imageSizes(imageSizes) {
			this.queryString += '&imageSizes=' + encodeURIComponent(imageSizes);
			return this;
		},

		/**
		 * no - Sets to whether to require all categoryids in list of just one.
		 *
		 * @param  {boolean} useCategoryIntersect Whether require a match for all categories
		 * @return {Mura.Feed}              Self
		 */
		useCategoryIntersect(useCategoryIntersect) {
			this.queryString += '&useCategoryIntersect=' + encodeURIComponent(useCategoryIntersect);
			return this;
		},

		/**
		 * includeHomepage - Sets to include the home page
		 *
		 * @param  {boolean} showExcludeSearch Whether to return the homepage
		 * @return {Mura.Feed}              Self
		 */
		includeHomepage(includeHomepage) {
			this.queryString += '&includehomepage=' + encodeURIComponent(includeHomepage);
			return this;
		},

		/**
		 * innerJoin - Sets entity to INNER JOIN
		 *
		 * @param  {string} relatedEntity Related entity
		 * @return {Mura.Feed}              Self
		 */
		innerJoin(relatedEntity) {
			this.queryString += '&innerJoin' + encodeURIComponent('[' + this.propIndex + ']') + '=' +	encodeURIComponent(relatedEntity);
			this.propIndex++;
			return this;
		},

		/**
		 * leftJoin - Sets entity to LEFT JOIN
		 *
		 * @param  {string} relatedEntity Related entity
		 * @return {Mura.Feed}              Self
		 */
		leftJoin(relatedEntity) {
			this.queryString += '&leftJoin' + encodeURIComponent('[' + this.propIndex + ']') + '=' + encodeURIComponent(relatedEntity);
			this.propIndex++;
			return this;
		},

		/**
		 * Interator - Return Mura.EntityCollection fetched from JSON API
		 * @return {Promise}
		 */
		getIterator(params) {
			return this.getQuery(params);
		},

		/**
		 * Query - Return Mura.EntityCollection fetched from JSON API
		 * @return {Promise}
		 */
		getQuery(params) {
			var self = this;

			if(typeof params != 'undefined'){
				for(var p in params){
					if(params.hasOwnProperty(p)){
						if(typeof self[p] == 'function'){
							self[p](params[p]);
						} else {
							self.andProp(p).isEQ(params[p]);
						}
					}
				}
			}

			return new Promise(function(resolve, reject) {
				var rcEndpoint=self._requestcontext.getAPIEndpoint();
				if (rcEndpoint.charAt(rcEndpoint.length - 1) == "/") {
					var apiEndpoint = rcEndpoint;
				} else {
					var apiEndpoint = rcEndpoint + '/';
				}
				self._requestcontext.request({
					type: 'get',
					cache: self.cache,
					next: self.next,
					url: apiEndpoint + self.queryString,
					success(resp) {
						if (resp.data != 'undefined'  ) {
							var returnObj = new Mura.EntityCollection(resp.data,self._requestcontext);

							if (typeof resolve == 'function') {
								resolve(returnObj);
							}
						} else if (typeof reject == 'function') {
							reject(resp);
						}
					},
					error(resp) {
						if (typeof reject == 'function'){
							reject(resp);
						}
					}
				});
			});
		}
	});

}

module.exports=attach;