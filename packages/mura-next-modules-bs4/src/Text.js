import React,{useState,useEffect} from 'react';
import Mura from 'mura.js';
import OutputMarkup from "./OutputMarkup";

function Text(props) {
  const objectparams = Object.assign({}, props);

  if(!objectparams.dynamicProps && (objectparams.sourcetype==='component' || objectparams.sourcetype==='boundattribute' )){
    const [source, setSource]=useState('');

    useEffect(() => {
        getDynamicProps(objectparams).then((dynamicProps)=>{
          setSource(dynamicProps.source);
        });
    },[]);

    if(source){
      return (
        <OutputMarkup source={source} />
      );
    } else {
      return (
        <div></div>
        );
    }
  } else {
    let source='';
    if(objectparams.dynamicProps && (objectparams.sourcetype==='component' || objectparams.sourcetype==='boundattribute')){
      source=objectparams.dynamicProps.source;
    } else {
      source=objectparams.source;
    }
    if(source && source !== 'unconfigured'){
      return (
        <OutputMarkup source={source} />
      );
    } else {
      return (
        <div></div>
        );
    }
  }
}

export const getDynamicProps = async props => {
  const data = {};
  if (
    typeof props.sourcetype !== 'undefined'
    && (props.sourcetype === 'component' || props.sourcetype === 'boundattribute')
  ) {
    if(props.sourcetype === 'component'){
      if(Mura.isUUID(props.source)){
        const entity= await Mura.getEntity('content')
          .loadBy('contentid', props.source, { type: 'component', fields: 'body' });
          data.source=entity.get('body');
      } else {
        const entity= await Mura.getEntity('content')
        .loadBy('title', props.source, { type: 'component', fields: 'body' });
        data.source=entity.get('body');
      } 
    } else if(props.sourcetype === 'boundattribute'){
      if(typeof props.content.get =='function'){
        data.source=props.content.get(props.source);
      } else {
        data.source=props.content[props.source] || '';
      }
    }
  }

  return data;
};

export default Text;
