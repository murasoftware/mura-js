import React from 'react';
import Mura from 'mura.js/src/core/core';

// eslint-disable-next-line
import { getComponent } from '@murasoftware/next-core';
import { Decorator } from '@murasoftware/next-core';

export const Container = function(props) {
  const { items,content } = props;
  // console.log('Container -> items', items);
  // console.log('Container -> props', props);
  if (!items) return '';

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
          obj.inited = true;
          return (<Decorator {...obj}> {getComponent(obj)} </Decorator>)
      })
   
  );
}

export default Container;
