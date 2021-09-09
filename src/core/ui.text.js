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
	renderClient(){
		this.context.sourcetype=this.context.sourcetype || 'custom';

		if(this.context.sourcetype=='component' && this.context.source){
			if(Mura.isUUID(this.context.source)){
				var loadbykey='contentid';
			} else {
				var loadbykey='tile';
			}
			Mura.getEntity('content')
				.loadBy(loadbykey,this.context.source,{fields:'body',type: 'component',})
				.then((content)=>{
					if(content.get('body')){
						Mura(this.context.targetEl).html(this.deserialize(content.get('body')));
					} else if (this.context.label){
						Mura(this.context.targetEl).html('');
					} else {
						Mura(this.context.targetEl).html('<p></p>');
					}
					this.trigger('afterRender');
				});
		} else {
			Mura(this.context.targetEl).html(Mura.templates['text'](this.context));
			this.trigger('afterRender');
		}
	},

	renderServer(){
		this.context.sourcetype=this.context.sourcetype || 'custom';
		if(this.context.sourcetype=='custom' ){
			return this.deserialize(this.context.source);
		} else {
			return '<p></p>';
		}
	},
	deserialize(source){
		return source;
	}
});

Mura.DisplayObject.Text=Mura.UI.Text;
