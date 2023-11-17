import React from 'react';

const Hr = function(props) {
    return (
      <hr />
    );
  
}

export default Hr;

export const ModuleConfig={
  key: 'Hr',
  name: 'Hr',
  component: Hr,
  getDynamicProps:  function(){},
  excludeFromClient: false,
  isCollectionLayout: false,
  contentypes:"*",
  external: false
}
