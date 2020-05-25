var Mura=require('./core');

if (typeof document != 'undefined'){
    var tocss={}

    var CSSStyleDeclaration=document.createElement('div').style;

    for(var s in CSSStyleDeclaration){
        tocss[s]=s.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
    }

    var styleMap={
        tocss:tocss,
        tojs:{}
    }

    for(var s in tocss){ 
        styleMap.tojs[s.toLowerCase()]=s;
        styleMap.tojs[s]=s;
        styleMap.tocss[s.toLowerCase()]=styleMap.tocss[s];   
    }

    Mura.styleMap=styleMap;

}