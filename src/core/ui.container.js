var Mura=require('./core');

/**
 * Creates a new Mura.UI.Text
 * @name  Mura.UI.Container
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Container=Mura.UI.extend(
/** @lends Mura.DisplayObject.Container.prototype */
{
	renderClient(){		
        var target=Mura(this.context.targetEl);	 
        if(typeof this.context.items != 'undefined' && !Array.isArray(this.context.items)){
            try{
                this.context.items=JSON.parse(this.context.items);
            } catch{
                console.log(this.context.items)
                delete this.context.items;
            }
        }
        if(!Array.isArray(this.context.items)){
            this.context.content=this.context.content || '';
            target.html(this.context.content);
        } else {
            this.context.items=this.context.items || [];
            this.context.items.forEach(function(data){
                //console.log(data)
                data.transient=false;
                if(!Mura.cloning){
                    data.preserveid=true;
                }
                target.appendDisplayObject(data);
                delete data.preserveid;
            })
        }
		this.trigger('afterRender');
    },
    reset(self,empty){ 
        self.find('.mura-object:not([data-object="container"])').html('');
        self.find('.frontEndToolsModal').remove();
        self.find('.mura-object-meta').html('');
        var content = self.children('div.mura-object-content');

        if (content.length) {
            var nestedObjects=[];
            content.children('.mura-object').each(
                function() {
                    Mura.resetAsyncObject(this,empty);	
                    //console.log(Mura(this).data())
                    nestedObjects.push(Mura(this).data());
                }
            );
            self.data('items', JSON.stringify(nestedObjects));
            self.removeAttr('data-content');
        }
    }
});

Mura.DisplayObject.Container=Mura.UI.Container;