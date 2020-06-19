var Mura=require('./core');

if (typeof document != 'undefined'){
    var tocss={}

    var CSSStyleDeclaration=document.createElement('div').style;

    var fromArray;
    var toArray;
    for(var s in CSSStyleDeclaration){
        fromArray= s.split(/(?=[A-Z])/);
        toArray=[];
        for(var i in fromArray){
            toArray.push(fromArray[i].toLowerCase());
        }
        tocss[s]=toArray.join("-")
    }

    var styleMap={
        tocss:tocss,
        tojs:{}
    }

    for(var s in tocss){ 
        styleMap.tojs[s.toLowerCase()]=s;
        styleMap.tocss[s.toLowerCase()]=styleMap.tocss[s];   
    }

    Mura.styleMap=styleMap;
}
