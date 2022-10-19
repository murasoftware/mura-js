function attach(Mura){

	/**
	 * Creates a new Mura.UI.Text
	 * @name  Mura.UI.Image
	 * @class
	 * @extends Mura.UI
	 * @memberof  Mura
	 */

	Mura.UI.Image=Mura.UI.extend(
	/** @lends Mura.DisplayObject.Image.prototype */
	{
		renderClient(){
			Mura(this.context.targetEl).html(Mura.templates['image'](this.context));
			this.trigger('afterRender');
		},

		renderServer(){
			return Mura.templates['image'](this.context);
		
		}
	});

	Mura.DisplayObject.Image=Mura.UI.Image;

}

module.exports=attach;
