var Mura=require('./core');
/**
 * Creates a new Mura.UI.Text
 * @name  Mura.UI.Text
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Text=Mura.UI.extend(
/** @lends Mura.DisplayObject.Text.prototype */
{
	renderClient:function(){
		Mura(this.context.targetEl).html(Mura.templates['text'](this.context));
		this.trigger('afterRender');
	},

	renderServer:function(){
		this.context.sourcetype=this.context.sourcetype || 'custom';

		if(this.context.sourcetype=='custom' || this.context.sourcetype=='html'){
			return Mura.templates['text'](this.context);
		} else if(this.context.sourcetype=='markdown'){
			return Mura.templates['text'](this.deserializeMarkdown(this.context));
		} else {
			return '';
		}
	},

	deserializeMarkdown:function(markdown){
		//add deserialization
		return markdown;
	}

});

Mura.DisplayObject.Text=Mura.UI.Text;
