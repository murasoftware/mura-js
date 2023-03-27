if(!(typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined')){
	require("./core/polyfill-browser");
}

require('cross-fetch/polyfill')

/** @namespace */

const Mura=require("./core/factory")();


module.exports=Mura;
	
	