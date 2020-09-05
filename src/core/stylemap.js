var Mura=require('./core');

if (typeof document != 'undefined' && typeof Mura.styleMap == 'undefined'){
    var tocss={}

    var CSSStyleDeclaration=document.createElement('div').style;

    var fromArray;
    var toArray;
    var hasError=false;

    for(var s in CSSStyleDeclaration){
        fromArray= s.split(/(?=[A-Z])/);
        toArray=[];
        for(var i in fromArray){
           try{
                if(typeof fromArray[i] == 'string'){
                    toArray.push(fromArray[i].toLowerCase());
                }
            } catch (e){
                console.log("error setting style from array",JSON.stringify(fromArray[i]));
            }
        }
        tocss[s]=toArray.join("-")
    }

    var styleMap={
        tocss:tocss,
        tojs:{}
    }

    for(var s in tocss){ 
        try{
            if(typeof s == 'string'){
                styleMap.tojs[s.toLowerCase()]=s;
                styleMap.tocss[s.toLowerCase()]=styleMap.tocss[s];  
            } 
        } catch(e) {
            console.log("error setting style to array",JSON.stringify(s));
        }
    }

    Mura.styleMap=styleMap;
}
