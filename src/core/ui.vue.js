import Vue from 'vue'
var Mura=require('mura.js');

/**
 * Creates a new Mura.UI.Vue
 * @name  Mura.UI.Vue
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Vue=Mura.UI.extend(
/** @lends Mura.UI.Vue.prototype */
{
	vm:'',

	$vm(){
		if(!this.vm){
			this.vm=new Vue(
				Mura.extend({},
					this.component,
					{
						propsData:{ context: this.context }
					})
			);
		}
		return this.vm;
	},

	renderClient(){
		const container=Mura(this.context.targetEl)
		if(!container.node.firstChild){
			container.node.appendChild(document.createElement('DIV'));
		}
		container.node.firstChild.setAttribute('id','mc' + this.context.instanceid)
		this.$vm().$mount('#mc' + this.context.instanceid)
		this.trigger('afterRender');
	},

	destroy(){
		const container=Mura(this.context.targetEl)
		if(container.length && container.node.innerHTML){
			container.node.firstChild.setAttribute('id','mc' + this.context.instanceid)
			this.$vm().$destroy();
		}
	}

});
