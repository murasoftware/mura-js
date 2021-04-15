import React, {useEffect} from 'react';
import Mura from 'mura.js/src/core/core';

// eslint-disable-next-line
import { getComponent } from '@murasoftware/next-core';
import { Decorator } from '@murasoftware/next-core';

export const Container = function(props) {
  const { items,content,instanceid } = props;
  // console.log('Container -> items', items);
  // console.log('Container -> props', props);
  if (!items) return '';

  useEffect(() => {
    if(typeof Mura.displayObjectInstances[props.instanceid]=='undefined'){
      Mura.displayObjectInstances[props.instanceid]= new Mura.DisplayObject.Container(props);
    }
    
    Mura(function(){    
        const obj=Mura('div[data-instanceid="' + instanceid + '"]');
        if(obj.data('inited')){
          obj.children('.mura-object-content').each(function(){
            const modules=Mura(this).children('.mura-object');
            modules.each(function(){
                const module=Mura(this);
                const content=module.children('.mura-object-content');
                if(!content.length || content.length && !content.children().length){
                module.processDisplayObject();
                } 
            })
          })
        }
        if(obj.data('stylesupport')){
          obj.calculateDisplayObjectStyles();
        }  
        obj.find('.mura-object').each(function(){
          const item=Mura(this);
          if(item.data('stylesupport')){
            item.calculateDisplayObjectStyles();
          }
        });
    });
  }, []);

  let $items=items;

  if(!Array.isArray($items)){
    try{
      $items=JSON.parse($items);
    } catch(e){
      $items=[];
    }
  }

  const resetInstanceIds=(_items)=>{
    _items.forEach((item)=>{
      item.instanceid=Mura.createUUID();
      if(item.object=='container' && item.items){
        let $items=item.items;
       if(!Array.isArray($items)){
          try{
            $items=JSON.parse($items);
          } catch(e){
            $items=[];
          }
        }
        item.items=resetInstanceIds($items);
      }
    })
    return _items;
  }

  if(Mura.cloning){
    $items=$items.map(function(i){return i;});
    resetInstanceIds($items);
  }

  return ($items.map(item => {
          const obj=Object.assign({},item);
          obj.key=obj.instanceid;
          obj.moduleStyleData=props.moduleStyleData;
          obj.content = content;
          return (<Decorator {...obj}> {getComponent(obj)} </Decorator>)
      })
   
  );
}

export default Container;
