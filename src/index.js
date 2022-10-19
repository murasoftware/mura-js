if(!(typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined')){
	require("./core/polyfill");
}


const Mura=require("./core/factory")();


module.exports=Mura;
	
	