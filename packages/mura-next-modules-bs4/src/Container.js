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
    Mura.displayObjectInstances=Mura.displayObjectInstances || {};
    if(typeof Mura.displayObjectInstances[instanceid]=='undefined'){
      Mura.displayObjectInstances[instanceid]= new Mura.DisplayObject.Container(props);
    }
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
          obj.regionContext =  props.regionContext;
          obj.content = content;
          return (<Decorator {...obj}> {getComponent(obj)} </Decorator>)
      })
   
  );
}

export default Container;
