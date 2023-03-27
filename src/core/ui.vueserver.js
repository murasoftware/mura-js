import Vue from 'vue'
var Mura=require('mura.js');

require('mura.js/src/core/ui.vue')
require('mura.js/src/core/ui.serverutils')



Mura.UI.VueServer=Mura.UI.Vue.extend(

{
	renderServer(){
		return this.renderer.renderToString(this.$vm())
	},

	hydrate(){
		const container=Mura(this.context.targetEl)
		if(container.length && container.node.innerHTML){
			container.node.firstChild.setAttribute('id','mc' + this.context.instanceid)
			this.$vm().$mount('#mc' + this.context.instanceid,true)
			this.trigger('afterRender');
		}
	},

	registerHelpers(){
		if(Mura.isInNode()){
			this.renderer = eval("require('vue-server-renderer')").createRenderer(this.rendererOptions)
		}
	},

	renderer:null,

	rendererOptions:{}

});
