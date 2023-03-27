const React=require('react')
const ReactDOM=require('react-dom')
var Mura=require('mura.js');
const ReactDOMServer = require('react-dom/server');

require('./ui.react')
require('./ui.serverutils')

Mura.UI.ReactServer=Mura.UI.React.extend(

{
	renderServer(){
		return ReactDOMServer.renderToString(React.createElement(this.component, this.context))
	},

	hydrate(){
		this.context.suppressHydrationWarning=true
		ReactDOM.hydrate(
			React.createElement(this.component, this.context),
			this.context.targetEl,
			()=>{this.trigger('afterRender')}
		)
	}
});
