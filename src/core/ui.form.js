function attach(Mura){

	/**
	 * Creates a new Mura.UI.Form
	 * @name	Mura.UI.Form
	 * @class
	 * @extends Mura.UI
	 * @memberof	Mura
	 */

	Mura.UI.Form=Mura.UI.extend(
	/** @lends Mura.DisplayObject.Form.prototype */
	{
		context:{},
		ormform: false,
		formJSON:{},
		data:{},
		columns:[],
		currentpage: 0,
		entity: {},
		fields:{},
		filters: {},
		datasets: [],
		sortfield: '',
		sortdir: '',
		inlineerrors: true,
		properties: {},
		rendered: {},
		renderqueue: 0,
		//templateList: ['file','error','textblock','checkbox','checkbox_static','dropdown','dropdown_static','radio','radio_static','nested','textarea','textfield','form','paging','list','table','view','hidden','section'],
		formInit: false,
		responsemessage: "",
		rb: {
			generalwrapperclass:"well",
			generalwrapperbodyclass:"",
			formwrapperclass: "well",
			formwrapperbodyclass: "",
			formfieldwrapperclass: "control-group",
			formfieldlabelclass:"control-label",
			formerrorwrapperclass: "",
			formresponsewrapperclass: "",
			formgeneralcontrolclass:"form-control",
			forminputclass:"form-control",
			formselectclass:"form-control",
			formtextareaclass:"form-control",
			formfileclass:"form-control",
			formtextblockclass:"form-control",
			formcheckboxclass:"",
			formcheckboxlabelclass:"checkbox",
			formcheckboxwrapperclass:"",
			formradioclass:"",
			formradiowrapperclass:"",
			formradiolabelclass:"radio",
			formbuttonwrapperclass:"btn-group",
			formbuttoninnerclass:"",
			formbuttonclass:"btn btn-default",
			formrequiredwrapperclass:"",
			formbuttonsubmitclass :"form-submit",
			formbuttonsubmitlabel : "Submit",
			formbuttonsubmitwaitlabel : "Please Wait...",
			formbuttonnextclass:"form-nav",
			formbuttonnextlabel : "Next",
			formbuttonbackclass:"form-nav",
			formbuttonbacklabel : "Back",
			formbuttoncancelclass:"btn-primary pull-right",
			formbuttoncancellabel :"Cancel",
			formrequiredlabel:"Required",
			formfileplaceholder : "Select File"
		},
		renderClient(){

			if(this.context.mode == undefined){
				this.context.mode = 'form';
			}

			var ident = "mura-form-" + this.context.instanceid;

			this.context.formEl = "#" + ident;

			this.context.html = "<div id='"+ident+"'></div>";

			Mura(this.context.targetEl).html( this.context.html );

			if (this.context.view == 'form') {
				this.getForm();
			}
			else {
				this.getList();
			}

			return this;
		},

		getTemplates() {

			var self = this;

			if (self.context.view == 'form') {
				self.loadForm();
			} else {
				self.loadList();
			}

			/*
			if(Mura.templatesLoaded.length){
				var temp = Mura.templateList.pop();

				Mura.ajax(
					{
						url:Mura.assetpath + '/includes/display_objects/form/templates/' + temp + '.hb',
						type:'get',
						xhrFields:{ withCredentials: false },
						success(data) {
							Mura.templates[temp] = Mura.Handlebars.compile(data);
							if(!Mura.templateList.length) {
								if (self.context.view == 'form') {
									self.loadForm();
								} else {
									self.loadList();
								}
							} else {
								self.getTemplates();
							}
						}
					}
				);

			}
			*/
		},

		getPageFieldList(){

			var page=this.currentpage;
			var fields = this.formJSON.form.pages[page];
			var result=[];

			for(var f=0;f < fields.length;f++){
				//console.log("add: " + self.formJSON.form.fields[fields[f]].name);
				result.push(this.formJSON.form.fields[fields[f]].name);
			}

			//console.log(result);

			return result.join(',');
		},

		renderField(fieldtype,field) {
			var self = this;
			var templates = Mura.templates;
			var template = fieldtype;

			if( field.datasetid != "" && self.isormform)
				field.options = self.formJSON.datasets[field.datasetid].options;
			else if(field.datasetid != "") {
				field.dataset = self.formJSON.datasets[field.datasetid];
			}

			self.setDefault( fieldtype,field );

			if (fieldtype == "nested") {
				var nested_context = {};
				nested_context.objectid = field.formid;
				nested_context.paging = 'single';
				nested_context.mode = 'nested';
				nested_context.prefix = field.name + '_';
				nested_context.master = this;

				var data={};
				data.objectid=nested_context.objectid;
				data.formid=nested_context.objectid;
				data.object='form';
				data.siteid=self.context.siteid || Mura.siteid;
				data.contentid=Mura.contentid;
				data.contenthistid=Mura.contenthistid;

				Mura.get(
					Mura.getAPIEndpoint() + '?method=processAsyncObject',
					data)
					.then(function(resp){
						var tempContext=Mura.extend({},nested_context);

						delete tempContext.targetEl;

						var context=Mura.deepExtend({},tempContext,resp.data)

						context.targetEl=self.context.targetEl;

						Mura(".field-container-" + self.context.objectid,self.context.formEl).append('<div id="nested-'+field.formid+'"></div>');

						var nestedForm = new Mura.UI.Form( context );
						context.formEl = document.getElementById('nested-'+field.formid);

						nestedForm.getForm();

						// var html = Mura.templates[template](field);
						// Mura(".field-container-" + self.context.objectid,self.context.formEl).append(html);

					});

			}
			else {
				if(fieldtype == "checkbox") {
					if(self.ormform) {
						field.selected = [];

						var ds = self.formJSON.datasets[field.datasetid];

						for (var i in ds.datarecords) {
							if(ds.datarecords[i].selected && ds.datarecords[i].selected == 1)
								field.selected.push(i);
						}

						field.selected = field.selected.join(",");
					}
					else {
						template = template + "_static";
					}
				}
				else if(fieldtype == "dropdown") {
					if(!self.ormform) {
						template = template + "_static";
					}
				}
				else if(fieldtype == "radio") {
					if(!self.ormform) {
						template = template + "_static";
					}
				}

				var html = Mura.templates[template](field);

				Mura(".field-container-" + self.context.objectid,self.context.formEl).append(html);
			}

		},

		setDefault(fieldtype,field) {
			var self = this;

			switch( fieldtype ) {
				case "textfield":
				case "textarea":
					if(self.data[self.context.prefix + field.name]){
						field.value = self.data[self.context.prefix + field.name];
					}
				break;
				case "checkbox":
				var ds = self.formJSON.datasets[field.datasetid];
					for(var i=0;i<ds.datarecords.length;i++) {
						if (self.ormform) {
							var sourceid = ds.source + "id";
							ds.datarecords[i].selected = 0;
							ds.datarecords[i].isselected = 0;

							if(self.data[self.context.prefix + field.name].items && self.data[self.context.prefix + field.name].items.length) {
								for(var x = 0;x < self.data[self.context.prefix + field.name].items.length;x++) {
									if (ds.datarecords[i].id == self.data[self.context.prefix + field.name].items[x][sourceid]) {
										ds.datarecords[i].isselected = 1;
										ds.datarecords[i].selected = 1;
									}
								}
							}
						}
						else {
							if (self.data[self.context.prefix + field.name] && ds.datarecords[i].value && self.data[self.context.prefix + field.name].indexOf(ds.datarecords[i].value) > -1) {
								ds.datarecords[i].isselected = 1;
								ds.datarecords[i].selected = 1;
							}
							else {
								ds.datarecords[i].selected = 0;
								ds.datarecords[i].isselected = 0;
							}
						}
					}
				break;
				case "radio":
				case "dropdown":
					var ds = self.formJSON.datasets[field.datasetid];
					for(var i=0;i<ds.datarecords.length;i++) {
						if(self.ormform) {
							if(ds.datarecords[i].id == self.data[field.name+'id']) {
								ds.datarecords[i].isselected = 1;
								field.selected = self.data[field.name+'id'];
							}
							else {
								ds.datarecords[i].selected = 0;
								ds.datarecords[i].isselected = 0;
							}
						}
						else {
							if(ds.datarecords[i].value == self.data[self.context.prefix + field.name]) {
								ds.datarecords[i].isselected = 1;
								field.selected = self.data[self.context.prefix + field.name];
							}
							else {
								ds.datarecords[i].isselected = 0;
							}
						}
					}
				break;
			}
		},

		renderData() {
			var self = this;

			if(self.datasets.length == 0){
				if (self.renderqueue == 0) {
					self.renderForm();
				}
				return;
			}

			var dataset = self.formJSON.datasets[self.datasets.pop()];

			if(dataset.sourcetype && dataset.sourcetype != 'muraorm'){
				self.renderData();
				return;
			}

			if(dataset.sourcetype=='muraorm'){
				dataset.options = [];
				self.renderqueue++;

				Mura.getFeed( dataset.source )
					.getQuery()
					.then( function(collection) {
						collection.each(function(item) {
							var itemid = item.get('id');
							dataset.datarecordorder.push( itemid );
							dataset.datarecords[itemid] = item.getAll();
							dataset.datarecords[itemid]['value'] = itemid;
							dataset.datarecords[itemid]['datarecordid'] = itemid;
							dataset.datarecords[itemid]['datasetid'] = dataset.datasetid;
							dataset.datarecords[itemid]['isselected'] = 0;
							dataset.options.push( dataset.datarecords[itemid] );
						});
					})
					.then(function() {
						self.renderqueue--;
						self.renderData();
						if (self.renderqueue == 0) {
							self.renderForm();
						}
					});
			} else {
				if (self.renderqueue == 0) {
					self.renderForm();
				}
			}
		},

		renderForm( ) {
			var self = this;

			//console.log("render form: " + self.currentpage);
			if(typeof self.context.prefix =='undefined'){
				self.context.prefix='';
			}

			Mura(".field-container-" + self.context.objectid,self.context.formEl).empty();

			if(!self.formInit) {
				self.initForm();
			}

			var fields = self.formJSON.form.pages[self.currentpage];

			for(var i = 0;i < fields.length;i++) {
				var field =	self.formJSON.form.fields[fields[i]];
				//try {
					if( field.fieldtype.fieldtype != undefined && field.fieldtype.fieldtype != "") {
						self.renderField(field.fieldtype.fieldtype,field);
					}
				//} catch(e){
					//console.log('Error rendering form field:');
					//console.log(field);
				//}
			}

			if(self.ishuman && self.currentpage==(self.formJSON.form.pages.length-1)){
				Mura(".field-container-" + self.context.objectid,self.context.formEl).append(self.ishuman);
			}

			if (self.context.mode == 'form') {
				self.renderPaging();
			}

			Mura.processMarkup(".field-container-" + self.context.objectid,self.context.formEl);

			self.trigger('afterRender');

		},

		renderPaging() {

			var self = this;
			var submitlabel=(typeof self.formJSON.form.formattributes != 'undefined' && typeof self.formJSON.form.formattributes.submitlabel != 'undefined' && self.formJSON.form.formattributes.submitlabel) ? self.formJSON.form.formattributes.submitlabel : self.rb.formbuttonsubmitlabel;

			Mura(".error-container-" + self.context.objectid,self.context.formEl).empty();
			Mura(".paging-container-" + self.context.objectid,self.context.formEl).empty();

			if(self.formJSON.form.pages.length == 1) {
				Mura(".paging-container-" + self.context.objectid,self.context.formEl).append(Mura.templates['paging']({page:self.currentpage+1,label:submitlabel,"class":Mura.trim("mura-form-submit " + self.rb.formbuttonsubmitclass)}));
			}
			else {
				if(self.currentpage == 0) {
					Mura(".paging-container-" + self.context.objectid,self.context.formEl).append(Mura.templates['paging']({page:1,label:self.rb.formbuttonnextlabel,"class":Mura.trim("mura-form-nav mura-form-next " + self.rb.formbuttonnextclass)}));
				} else {
					Mura(".paging-container-" + self.context.objectid,self.context.formEl).append(Mura.templates['paging']({page:self.currentpage-1,label:self.rb.formbuttonbacklabel,"class":Mura.trim("mura-form-nav mura-form-back " + self.rb.formbuttonbackclass)}));

					if(self.currentpage+1 < self.formJSON.form.pages.length) {
						Mura(".paging-container-" + self.context.objectid,self.context.formEl).append(Mura.templates['paging']({page:self.currentpage+1,label:self.rb.formbuttonnextlabel,"class":Mura.trim("mura-form-nav mura-form-next " + self.rb.formbuttonnextclass)}));
					}
					else {
						Mura(".paging-container-" + self.context.objectid,self.context.formEl).append(Mura.templates['paging']({page:self.currentpage+1,label:submitlabel,"class":Mura.trim("mura-form-submit " + self.rb.formbuttonsubmitclass)}));
					}
				}

				if(self.backlink != undefined && self.backlink.length)
					Mura(".paging-container-" + self.context.objectid,self.context.formEl).append(Mura.templates['paging']({page:self.currentpage+1,label:self.rb.formbuttoncancellabel,"class":Mura.trim("mura-form-nav mura-form-cancel " + self.rb.formbuttoncancelclass)}));
			}

			var submitHandler=function() {
				self.submitForm();
			};

			Mura(".mura-form-submit",self.context.formEl).off('click',submitHandler).on('click',submitHandler);

			Mura(".mura-form-cancel",self.context.formEl).click( function() {
				self.getTableData( self.backlink );
			});


			var formNavHandler=function(e) {

				if(Mura(e.target).is('.mura-form-submit')){
					return;
				}

				self.setDataValues();

				var keepGoing=self.onPageSubmit.call(self.context.targetEl);
				if(typeof keepGoing != 'undefined' && !keepGoing){
					return;
				}

				var button = this;

				if(self.ormform) {
					Mura.getEntity(self.entity)
					.set(
						self.data
					)
					.validate(self.getPageFieldList())
					.then(
						function( entity ) {
							if(entity.hasErrors()){
								self.showErrors( entity.properties.errors );
							} else {
								self.currentpage = Mura(button).data('page');
								self.renderForm();
							}
						}
					);
				} else {
					var data=Mura.extend({}, self.data, self.context);
					data.validateform=true;
					data.formid=data.objectid;
					data.siteid=data.siteid || Mura.siteid;
					data.fields=self.getPageFieldList();

					delete data.filename;
					delete data.def;
					delete data.ishuman;
					delete data.targetEl;
					delete data.html;


					Mura.ajax({
						type: 'post',
						url: Mura.getAPIEndpoint() +
							'?method=generateCSRFTokens',
						data: {
							siteid: data.siteid,
							context: data.formid
						},
						success(resp) {
							data['csrf_token_expires']=resp.data['csrf_token_expires'];
							data['csrf_token']=resp.data['csrf_token'];

							Mura.post(
								Mura.getAPIEndpoint() + '?method=processAsyncObject',
								data
							).then(function(resp){
								if(typeof resp.data.errors == 'object' && !Mura.isEmptyObject(resp.data.errors)){
									self.showErrors( resp.data.errors );
								} else if(typeof resp.data.redirect != 'undefined') {
									if(resp.data.redirect && resp.data.redirect != location.href){
										location.href=resp.data.redirect;
									} else {
										location.reload(true);
									}
								} else {
									self.currentpage = Mura(button).data('page');
									if(self.currentpage >= self.formJSON.form.pages.length){
										self.currentpage=self.formJSON.form.pages.length-1;
									}
									self.renderForm();
								}
							});
						}
					});
				}

				/*
				}
				else {
					console.log('oops!');
				}
				*/
			};

			Mura(".mura-form-nav",self.context.formEl).off('click',formNavHandler).on('click',formNavHandler);

			var fileSelectorHandler=function(e){
				Mura(this).closest('.mura-form-file-container').find('input[type="file"]').trigger('click');
			}

			var fileChangeHandler=function(e){
				var inputEl = Mura(this); 
				var fn = inputEl.val().replace(/\\/g, '/').replace(/.*\//, '');
				var fnEl = Mura('.mura-newfile-filename[data-filename="' + inputEl.attr("name") + '"]').val(fn);
				var f = Mura('input[type="file"][data-filename="' + inputEl.attr("name") + '"]').node.files[0];
				var fImg = Mura('img#mura-form-preview-' + inputEl.attr("name") );
				var fUrl = '';
				// file upload
				if (typeof f !== 'undefined'){
					fUrl = window.URL.createObjectURL(f);
					fnEl.val(fn);
					fImg.hide();
					if(f.type.indexOf('image') == 0 && fUrl.length){
						fImg.attr('src',fUrl).show();	
					}
				} else {
					fImg.attr('src',fUrl).hide();
				}
			}

			Mura(self.context.formEl).find('input[type="file"]').off('change',fileChangeHandler).on('change',fileChangeHandler);
			
			Mura(self.context.formEl).find('.mura-form-preview img, .mura-newfile-filename').off('click',fileSelectorHandler).on('click',fileSelectorHandler);

		},

		setDataValues() {
			var self = this;
			var multi = {};
			var item = {};
			var valid = [];
			var currentPage = {};

			Mura(".field-container-" + self.context.objectid + " input, .field-container-" + self.context.objectid + " select, .field-container-" + self.context.objectid + " textarea").each( function() {

				currentPage[Mura(this).attr('name')]=true;

				if( Mura(this).is('[type="checkbox"]')) {
					if ( multi[Mura(this).attr('name')] == undefined )
						multi[Mura(this).attr('name')] = [];

					if( this.checked ) {
						if (self.ormform) {
							item = {};
							item['id'] = Mura.createUUID();
							item[self.entity + 'id'] = self.data.id;
							item[Mura(this).attr('source') + 'id'] = Mura(this).val();
							item['key'] = Mura(this).val();

							multi[Mura(this).attr('name')].push(item);
						}
						else {
							multi[Mura(this).attr('name')].push(Mura(this).val());
						}
					}
				}
				else if( Mura(this).is('[type="radio"]')) {
					if( this.checked ) {
						self.data[ Mura(this).attr('name') ] = Mura(this).val();
						valid[ Mura(this).attr('name') ] = self.data[name];
					}
				}
				else {
					self.data[ Mura(this).attr('name') ] = Mura(this).val();
					valid[ Mura(this).attr('name') ] = self.data[Mura(this).attr('name')];
				}
			});

			for(var i in multi) {
				if(self.ormform) {
					self.data[ i ].cascade = "replace";
					self.data[ i ].items = multi[ i ];
					valid[ i ] = self.data[i];
				}
				else {
					self.data[ i ] = multi[i].join(",");
					valid[ i ] = multi[i].join(",");
				}
			}

			var frm=document.getElementById('frm' + self.context.objectid);
			for(var p in currentPage){
				if(currentPage.hasOwnProperty(p) && typeof self.data[p] != 'undefined'){
					if(p.indexOf("_attachment") > -1 && typeof frm[p] != 'undefined'){
						self.attachments[p]=frm[p].files[0];
					}
				}
			}

			return valid;

		},

		validate( entity,fields ) {
			return true;
		},

		getForm( entityid,backlink ) {
			var self = this;

			if(entityid != undefined){
				self.entityid = entityid;
			} else {
				delete self.entityid;
			}

			if(backlink != undefined){
				self.backlink = backlink;
			} else {
				delete self.backlink;
			}

			self.loadForm();

		},

		loadForm( data ) {
			var self = this;

			var formJSON = JSON.parse(self.context.def);

			// old forms
			if(!formJSON.form.pages) {
				formJSON.form.pages = [];
				formJSON.form.pages[0] = formJSON.form.fieldorder;
				formJSON.form.fieldorder = [];
			}


			if(typeof formJSON.datasets != 'undefined'){
				for(var d in formJSON.datasets){
					if(typeof formJSON.datasets[d].DATARECORDS != 'undefined'){
						formJSON.datasets[d].datarecords=formJSON.datasets[d].DATARECORDS;
						delete formJSON.datasets[d].DATARECORDS;
					}
					if(typeof formJSON.datasets[d].DATARECORDORDER != 'undefined'){
						formJSON.datasets[d].datarecordorder=formJSON.datasets[d].DATARECORDORDER;
						delete formJSON.datasets[d].DATARECORDORDER;
					}
				}
			}

			entityName = self.context.filename.replace(/\W+/g, "");
			self.entity = entityName;
			self.formJSON = formJSON;
			self.fields = formJSON.form.fields;
			self.responsemessage = self.context.responsemessage;
			self.ishuman=self.context.ishuman;

			if (formJSON.form.formattributes && formJSON.form.formattributes.Muraormentities == 1) {
				self.ormform = true;
			}

			for(var i=0;i < self.formJSON.datasets;i++){
				self.datasets.push(i);
			}

			if(self.ormform) {
				self.entity = entityName;

				if(self.entityid == undefined) {
					Mura.get(
						Mura.getAPIEndpoint() +'/'+ entityName + '/new?expand=all&ishuman=true'
					).then(function(resp) {
						self.data = resp.data;
						self.renderData();
					});
				}
				else {
					Mura.get(
						Mura.getAPIEndpoint()	+ '/'+ entityName + '/' + self.entityid + '?expand=all&ishuman=true'
					).then(function(resp) {
						self.data = resp.data;
						self.renderData();
					});
				}
			}
			else {
				self.renderData();
			}
			
		},

		initForm() {
			var self = this;
			Mura(self.context.formEl).empty();

			if(self.context.mode != undefined && self.context.mode == 'nested') {
				var html = Mura.templates['nested'](self.context);
			}
			else {
				var html = Mura.templates['form'](self.context);
			}

			Mura(self.context.formEl).append(html);

			self.currentpage = 0;
			self.attachments={};
			self.formInit=true;
			Mura.trackEvent({category:'Form',action:'Impression',label:self.context.name,objectid:self.context.objectid,nonInteraction:true});
		},

		onSubmit(){
			return true;
		},

		onPageSubmit(){
			return true;
		},

		submitForm() {

			var self = this;
			var valid = self.setDataValues();
			Mura(".error-container-" + self.context.objectid,self.context.formEl).empty();

			var keepGoing=this.onSubmit.call(this.context.targetEl);
			if(typeof keepGoing != 'undefined' && !keepGoing){
				return;
			}

			delete self.data.isNew;

			var frm=Mura(self.context.formEl).find('form');

			frm.find('.mura-form-submit').html(self.rb.formbuttonsubmitwaitlabel);
			frm.trigger('formSubmit');

			//console.log('b!');
			var rawdata=Mura.extend({},self.context,self.data);
			rawdata.saveform=true;
			rawdata.formid=rawdata.objectid;
			rawdata.siteid=self.context.siteid || rawdata.siteid || Mura.siteid;
			rawdata.contentid=Mura.contentid || '';
			rawdata.contenthistid=Mura.contenthistid || '';

			delete rawdata.filename;
			delete rawdata.def;
			delete rawdata.ishuman;
			delete rawdata.targetEl;
			delete rawdata.html;

			var tokenArgs={
				siteid: rawdata.siteid,
				context: rawdata.formid
			}

			if(rawdata.responsechart){
				var frm=Mura(self.context.targetEl);
				var polllist=new Array();
				frm.find("input[type='radio']").each(function(){
					polllist.push(Mura(this).val());
				});
				if(polllist.length > 0) {rawdata.polllist=polllist.toString();}
			}

			var data=new FormData();

			for(var p in rawdata){
				if(rawdata.hasOwnProperty(p)){
					if(typeof self.attachments[p] != 'undefined'){
						data.append(p,self.attachments[p]);
					} else {
						data.append(p,rawdata[p]);
					}
				}
			}

			Mura.ajax({
				type: 'post',
				url: Mura.getAPIEndpoint() +
					'?method=generateCSRFTokens',
				data: tokenArgs,
				success(resp) {

					data.append('csrf_token_expires',resp.data['csrf_token_expires']);
					data.append('csrf_token',resp.data['csrf_token']);
					
					Mura.post(
						Mura.getAPIEndpoint() + '?method=processAsyncObject',
						data)
						.then(function(resp){
							if(typeof resp.data.errors == 'object' && !Mura.isEmptyObject(resp.data.errors )){
								self.showErrors( resp.data.errors );
								self.trigger('afterErrorRender');
							} else {

								Mura(self.context.formEl)
									.find('form')
									.trigger('formSubmitSuccess');

								Mura.trackEvent({
									category:'Form',
									action:'Conversion',
									label:self.context.name,
									objectid:self.context.objectid}
								).then(function(){
									if(typeof resp.data.redirect != 'undefined'){
										if(resp.data.redirect && resp.data.redirect != location.href){
											location.href=resp.data.redirect;
										} else {
											location.reload(true);
										}
									} else {
										Mura(self.context.formEl).html( Mura.templates['success'](resp.data) );
										self.trigger('afterResponseRender');
									}
								});
							}
						},
						function(resp){
							self.showErrors( {"systemerror":"We're sorry, a system error has occurred. Please try again later."} );
							self.trigger('afterErrorRender');
						});
				}
			});

		},

		showErrors( errors ) {
			var self = this;
			var frm=Mura(this.context.formEl);
			var frmErrors=frm.find(".error-container-" + self.context.objectid);

			frm.find('.mura-form-submit').html(self.rb.formbuttonsubmitlabel);
			frm.find('.mura-response-error').remove();
			frm.find('[aria-invalid]').forEach(function(){
				this.removeAttribute('aria-invalid');
				this.removeAttribute('aria-describedby');
			});	

			var fieldKeys=Object.keys(self.fields);
			
			for(var e in errors) {
			
				var fieldKey=fieldKeys.find(function(key){
					return (self.fields[key].name===e);
				});

				if( fieldKey ) {
					var field = self.fields[fieldKey];
					var error = {};
				
					error.message = errors[e];
					error.selector='#field-' + field.name
					error.field = 'field-' + field.name;
					error.label = '';
					error.id= 'e' + Mura.createUUID();

					if(field.cssid){
						error.selector= '#' + field.cssid;
					} 

				} else {
					var error = {};
					error.message = errors[e];
					error.selector='#field-' + e
					error.field = 'field-' + e;
					error.label = '';
					error.id= 'e' + Mura.createUUID();
				}

				if(this.inlineerrors){
					var field=Mura(this.context.formEl).find(error.selector);
					var errorTarget=field;
					var check;
					if(!field.length){
						field=Mura('label[for="'+ e + '"]');
						check=field.parent().find('input');
						if(check.length){
							field=check;
						}
						errorTarget=field;
						check=field.parent().find('label');
						if(check.length){
							errorTarget=check;
						}
					}

					if(field.length){
						field.attr('aria-invalid',true);
						field.attr('aria-describedby',error.id);
						errorTarget.node.insertAdjacentHTML('afterend',Mura.templates['error'](error));
					} else {
						frmErrors.append(Mura.templates['error'](error));
					}
				} else {
					frmErrors.append(Mura.templates['error'](error));
				}
			}

			Mura(self.context.formEl).find('.g-recaptcha-container').each(function(el){
				grecaptcha.reset(el.getAttribute('data-widgetid'));
			});

			var errorsSel=Mura(this.context.formEl).find('.mura-response-error');

			if(errorsSel.length){
				var error=errorsSel.first();
				var check=Mura('[aria-describedby="' + error.attr('id') + '"]');

				if(check.length){
					check.focus();
				} else {
					error.focus();
				}
			}
		},
		
		cleanProps( props ) {
			var propsOrdered = {};
			var propsRet = {};
			var ct = 100000;

			delete props.isnew;
			delete props.created;
			delete props.lastUpdate;
			delete props.errors;
			delete props.saveErrors;
			delete props.instance;
			delete props.instanceid;
			delete props.frommuracache;
			delete props[self.entity + "id"];

			for(var i in props) {
				if( props[i].orderno != undefined) {
					propsOrdered[props[i].orderno] = props[i];
				}
				else {
					propsOrdered[ct++] = props[i];
				}
			}

			Object.keys(propsOrdered)
				.sort()
					.forEach(function(v, i) {
					propsRet[v] = propsOrdered[v];
			});

			return propsRet;
		},

		registerHelpers() {
			var self = this;
			
			Mura.extend(self.rb,Mura.rb);

			Mura.Handlebars.registerHelper('eachColRow',function(row, columns, options) {
				var ret = "";
				for(var i = 0;i < columns.length;i++) {
					ret = ret + options.fn(row[columns[i].column]);
				}
				return ret;
			});

			Mura.Handlebars.registerHelper('eachProp',function(data, options) {
				var ret = "";
				var obj = {};

				for(var i in self.properties) {
					obj.displayName = self.properties[i].displayName;
					if( self.properties[i].fieldtype == "one-to-one" ) {
						obj.displayValue = data[ self.properties[i].cfc ].val;
					}
					else
						obj.displayValue = data[ self.properties[i].column ];

					ret = ret + options.fn(obj);
				}
				return ret;
			});

			Mura.Handlebars.registerHelper('eachKey',function(properties, by, options) {
				var ret = "";
				var item = "";
				for(var i in properties) {
					item = properties[i];

					if(item.column == by)
						item.selected = "Selected";

					if(item.rendertype == 'textfield')
						ret = ret + options.fn(item);
				}

				return ret;
			});

			Mura.Handlebars.registerHelper('eachHour',function(hour, options) {
				var ret = "";
				var h = 0;
				var val = "";

				for(var i = 0;i < 24;i++) {

					if(i == 0 ) {
						val = {label:"12 AM",num:i};
					}
					else if(i <12 ) {
						h = i;
						val = {label:h + " AM",num:i};
					}
					else if(i == 12 ) {
						h = i;
						val = {label:h + " PM",num:i};
					}
					else {
						h = i-12;
						val = {label:h + " PM",num:i};
					}

					if(hour == i)
						val.selected = "selected";

					ret = ret + options.fn(val);
				}
				return ret;
			});

			Mura.Handlebars.registerHelper('eachColButton',function(row, options) {
				var ret = "";

				row.label='View';
				row.type='data-view';

				// only do view if there are more properties than columns
				if( Object.keys(self.properties).length > self.columns.length) {
					ret = ret + options.fn(row);
				}

				if( self.context.view == 'edit') {
					row.label='Edit';
					row.type='data-edit';

					ret = ret + options.fn(row);
				}

				return ret;
			});

			Mura.Handlebars.registerHelper('eachCheck',function(checks, selected, options) {
				var ret = "";

				for(var i = 0;i < checks.length;i++) {
					if( selected.indexOf( checks[i].id ) > -1 )
						checks[i].isselected = 1;
					else
						checks[i].isselected = 0;

					ret = ret + options.fn(checks[i]);
				}
				return ret;
			});

			Mura.Handlebars.registerHelper('eachStatic',function(dataset, options) {
				var ret = "";

				for(var i = 0;i < dataset.datarecordorder.length;i++) {
					ret = ret + options.fn(dataset.datarecords[dataset.datarecordorder[i]]);
				}
				return ret;
			});

			Mura.Handlebars.registerHelper('inputWrapperClass',function() {
				var escapeExpression=Mura.Handlebars.escapeExpression;
				var returnString='mura-control-group';

				if(self.rb.formfieldwrapperclass){
					returnString += ' ' + self.rb.formfieldwrapperclass;
				}

				if(this.wrappercssclass){
					returnString += ' ' + escapeExpression(this.wrappercssclass);
				}

				if(this.isrequired){
					returnString += ' req';

					if(self.rb.formrequiredwrapperclass){
						returnString += ' ' + self.rb.formrequiredwrapperclass;
					}
				}

				return returnString;
			});

			Mura.Handlebars.registerHelper('radioLabelClass',function() {
				return self.rb.formradiolabelclass;
			});

			Mura.Handlebars.registerHelper('formErrorWrapperClass',function() {
				if(self.rb.formerrorwrapperclass){
					return 'mura-response-error' + ' ' + self.rb.formerrorwrapperclass;
				} else {
					return 'mura-response-error';
				}
			});

			Mura.Handlebars.registerHelper('formSuccessWrapperClass',function() {
				if(self.rb.formresponsewrapperclass){
					return 'mura-response-success' + ' ' + self.rb.formresponsewrapperclass;
				} else {
					return 'mura-response-success';
				}
			});

			Mura.Handlebars.registerHelper('formResponseWrapperClass',function() {
				if(self.rb.formresponsewrapperclass){
					return 'mura-response-success' + ' ' + self.rb.formresponsewrapperclass;
				} else {
					return 'mura-response-success';
				}
			});

			Mura.Handlebars.registerHelper('radioClass',function() {
				return self.rb.formradioclass;
			});

			Mura.Handlebars.registerHelper('radioWrapperClass',function() {
				return self.rb.formradiowrapperclass;
			});

			Mura.Handlebars.registerHelper('checkboxLabelClass',function() {
				return self.rb.formcheckboxlabelclass;
			});

			Mura.Handlebars.registerHelper('checkboxClass',function() {
				return self.rb.formcheckboxclass;
			});

			Mura.Handlebars.registerHelper('checkboxWrapperClass',function() {
				return self.rb.formcheckboxwrapperclass;
			});

			Mura.Handlebars.registerHelper('formRequiredLabel',function() {
				return self.rb.formrequiredlabel;
			});

			Mura.Handlebars.registerHelper('filePlaceholder',function() {
				var escapeExpression=Mura.Handlebars.escapeExpression;

				if(this.placeholder){
					return escapeExpression(this.placeholder);
				} else {
					return  self.rb.formfileplaceholder;
				}
			});

			Mura.Handlebars.registerHelper('formClass',function() {
				var escapeExpression=Mura.Handlebars.escapeExpression;
				var returnString='mura-form';

				if(self.formJSON && self.formJSON.form && self.formJSON.form.formattributes && self.formJSON.form.formattributes.class){
					returnString += ' ' + escapeExpression(self.formJSON.form.formattributes.class);
				}

				return returnString;
			});

			Mura.Handlebars.registerHelper('textInputTypeValue',function() {
				if(typeof Mura.usehtml5dateinput != 'undefined' && Mura.usehtml5dateinput && typeof this.validatetype != 'undefined' && this.validatetype.toLowerCase()=='date'){
					return 'date';
				} else {
					return 'text';
				}
			});

			Mura.Handlebars.registerHelper('labelForValue',function() {
				//id, class, title, size
				var escapeExpression=Mura.Handlebars.escapeExpression;

				if(this.cssid){
					return escapeExpression(this.cssid);
				} else {
					return "field-" + escapeExpression(this.name) ;
				}

				return returnString;
			});

			Mura.Handlebars.registerHelper('commonInputAttributes',function() {
				//id, class, title, size
				var escapeExpression=Mura.Handlebars.escapeExpression;

				if(typeof this.fieldtype != 'undefined' && this.fieldtype.fieldtype=='file'){
					var returnString='name="' + escapeExpression(self.context.prefix + this.name) + '_attachment"';
				} else {
					var returnString='name="' + escapeExpression(self.context.prefix + this.name) + '"';
				}

				if(this.cssid){
					returnString += ' id="' + escapeExpression(this.cssid) + '"';
				} else {
					returnString += ' id="field-' + escapeExpression(self.context.prefix + this.name) + '"';
				}

				returnString += ' class="';

				if(this.cssclass){
					returnString += escapeExpression(this.cssclass) + ' ';
				}

				if(this.fieldtype=='radio' || this.fieldtype=='radio_static'){
					returnString += self.rb.formradioclass;
				} else if(this.fieldtype=='checkbox' || this.fieldtype=='checkbox_static'){
					returnString += self.rb.formcheckboxclass;
				} else if(this.fieldtype=='file'){
					returnString += self.rb.formfileclass;
				} else if(this.fieldtype=='textarea'){
					returnString += self.rb.formtextareaclass;
				} else if(this.fieldtype=='dropdown' || this.fieldtype=='dropdown_static'){
					returnString += self.rb.formselectclass;
				} else if(this.fieldtype=='textblock'){
					returnString += self.rb.formtextblockclass;
				} else {
					returnString += self.rb.forminputclass;
				}

				returnString += '"';

				if(this.tooltip){
					returnString += ' title="' + escapeExpression(this.tooltip) + '"';
				}

				if(this.size){
					returnString += ' size="' + escapeExpression(this.size) + '"';
				}

				if(this.multiple){
					returnString += ' multiple';
				}

				if(typeof Mura.usehtml5dateinput != 'undefined' && Mura.usehtml5dateinput && typeof this.validatetype != 'undefined' && this.validatetype.toLowerCase()=='date'){
					returnString += ' data-date-format="' + Mura.dateformat + '"';
				}

				return returnString;
			});
			

			Mura.Handlebars.registerHelper('fileAttributes',function() {
				//id, class, title, size
				var escapeExpression=Mura.Handlebars.escapeExpression;
				var returnString='';

				if(this.cssid){
					returnString += ' id="' + escapeExpression(this.cssid) + '"';
				} else {
					returnString += ' id="field-' + escapeExpression(self.context.prefix + this.name) + '"';
				}

				returnString += ' class="mura-newfile-filename ';

				if(this.cssclass){
					returnString += escapeExpression(this.cssclass) + ' ';
				}

				returnString += self.rb.forminputclass;

				returnString += '"';

				if(this.tooltip){
					returnString += ' title="' + escapeExpression(this.tooltip) + '"';
				}

				return returnString;
			});
		}
	});

	//Legacy for early adopter backwords support
	Mura.DisplayObject.Form=Mura.UI.Form;

}

module.exports=attach;