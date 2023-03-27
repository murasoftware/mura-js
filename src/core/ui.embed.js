/**
 * Creates a new Mura.UI.Embed
 * @name  Mura.UI.Embed
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

function attach(Mura){

	Mura.UI.Embed=Mura.UI.extend(
	/** @lends Mura.DisplayObject.Embed.prototype */
	{
		renderClient(){
			Mura(this.context.targetEl).html(Mura.templates['embed'](this.context));
			this.trigger('afterRender');
		},

		renderServer(){
			return Mura.templates['embed'](this.context);
		}
	});

	Mura.DisplayObject.Embed=Mura.UI.Embed;

}

module.exports=attach;
