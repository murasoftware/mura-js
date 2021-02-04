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

  return (items.map(item => {
          const obj=Object.assign({},item);
          if(Mura.cloning){
            obj.instanceid=Mura.createUUID();
          }
          obj.key=obj.instanceid;
          obj.moduleStyleData=props.moduleStyleData;
          obj.content = content;
          obj.inited = true;
          return (<Decorator {...obj}> {getComponent(obj)} </Decorator>)
      })
   
  );
}

export default Container;
