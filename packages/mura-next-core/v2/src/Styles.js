import React from 'react';

function Styles(props) {
  const { moduleStyleData, Mura } = props;

  if (Mura.renderMode==='static' && typeof moduleStyleData !== 'undefined') {
    return (
      <>
        {Object.keys(moduleStyleData).map(instanceid => {
          const rules = moduleStyleData[instanceid];
          const id=`mura-styles-${instanceid}`;
          return (
            <style
              id={id}
              key={id}
              dangerouslySetInnerHTML={{ __html: rules.cssRules.join('\n') }}
             />
          );
        })}
      </>
    );
  } 
  // console.log("DYN IS NOT ARRAY: ");
  return <></>;
  
}

export default Styles;
