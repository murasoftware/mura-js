var Mura=require('./core');
/**
 * Creates a new Mura.UI.Text
 * @name  Mura.UI.Hr
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Hr=Mura.UI.extend(
/** @lends Mura.DisplayObject.Hr.prototype */
{
	renderClient(){
		Mura(this.context.targetEl).html("<hr>");
		this.trigger('afterRender');
	},

	renderServer(){
        return "<hr>";
	
	}
});

Mura.DisplayObject.Hr=Mura.UI.Hr;
