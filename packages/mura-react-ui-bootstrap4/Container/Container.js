import React from 'react';
import Mura from 'mura.js/src/core/core';

// eslint-disable-next-line
import { getComponent } from '@mura/react/MuraConnector';
import MuraDecorator from '@mura/react/MuraDecorator';

function Container(props) {
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
          return (<MuraDecorator {...obj}> {getComponent(obj)} </MuraDecorator>)
      })
   
  );
}

export default Container;
