import React from 'react';

function Embed(props) {
  let objectparams=Object.assign({},props);
  objectparams.source=objectparams.source || '';

  return (
    <div dangerouslySetInnerHTML={{ __html: objectparams.source }}/>
  );
  
}

export default Embed;
