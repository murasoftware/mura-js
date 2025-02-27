if(!(typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined')){
	require("./core/polyfill-browser");
}

require('cross-fetch/polyfill')

/** @namespace */

const Mura=require("./core/factory")();

Mura.indexfileinapi=false;
Mura.package='@murasoftware/mura.js';

module.exports=Mura;
	
	