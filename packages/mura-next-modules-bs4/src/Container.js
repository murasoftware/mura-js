import React, {useEffect} from 'react';

// eslint-disable-next-line
import { getComponent } from '@murasoftware/next-core';
import { Decorator, getMura } from '@murasoftware/next-core';

export const Container = function(props) {
  const { items,content,instanceid } = props;
  const Mura = props.Mura || getMura();

  if (!items) return '';

  useEffect(() => {
    Mura.displayObjectInstances=Mura.displayObjectInstances || {};
    if(typeof Mura.displayObjectInstances[instanceid]=='undefined'){
      Mura.displayObjectInstances[instanceid]= new Mura.DisplayObject.Container(props);
    }
    if(Mura.editing || Mura.cloning){
        const item=Mura(`[data-instanceid="${props.instanceid}"]`);
        if(item.is('.mura-active')){
          item.find('div.mura-object')
          .each(function(){
          Mura.initEditableObject.call(this);
          Mura.initDraggableObject(this);
         })
        } 
      }
  });

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

  if(Mura.editing || Mura.cloning){
    $items=$items.map(function(i){return i;});
    resetInstanceIds($items);
  }

  return ($items.map(item => {
          const obj=Object.assign({},item);
          obj.key=obj.instanceid;
          obj.moduleStyleData=props.moduleStyleData;
          obj.regionContext =  props.regionContext;
          obj.queryParams =  props.queryParams;
          obj.content = content;
          obj.Mura = Mura;
          return (<Decorator {...obj}> {getComponent(obj)} </Decorator>)
      })
   
  );
}

export default Container;

export const ModuleConfig={
  key: 'Container',
  name: 'Container',
  component: Container,
  getDynamicProps:  function(){},
  contentypes:"*",
  excludeFromClient: false,
  isCollectionLayout: false,
  external:false
}