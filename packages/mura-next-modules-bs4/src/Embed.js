import { getMura } from '@murasoftware/next-core';
import React,{ useEffect } from 'react';

const Embed = function(props) {
  const Mura=getMura();
  let objectparams=Object.assign({},props);
  objectparams.source=objectparams.source || '';
  const containerid='source-contianer-' + objectparams.instanceid;

  useEffect(() => {
    Mura('#'  + containerid).html(objectparams.source);
  }, []);

  return (
    <div id={containerid}/>
  )
}

export default Embed;
