import Mura from 'mura.js';
import React,{ useEffect } from 'react';

const Embed = function(props) {
  let objectparams=Object.assign({},props);
  objectparams.source=objectparams.source || '';
  const containerid='source-contianer-' + objectparams.instanceid;

  if(!Mura.isInNode()){
    useEffect(() => {
      Mura('#'  + containerid).html(objectparams.source);
    }, []);
  }

  return (
    <div id={containerid}/>
  )
}

export default Embed;
