import React from 'react';

function Styles(props) {
  const { moduleStyleData } = props;

  if (typeof moduleStyleData !== 'undefined') {
    return (
      <>
        {Object.keys(moduleStyleData).map(instanceid => {
          const rules = moduleStyleData[instanceid];
          if(!rules.isEditMode){
          return (
            <style
              id={rules.id}
              key={rules.id}
              dangerouslySetInnerHTML={{ __html: rules.cssRules.join('\n') }}
             />
          );
          } else {
            return '';
          }
        })}
      </>
    );
  } 
  // console.log("DYN IS NOT ARRAY: ");
  return <></>;
  
}

export default Styles;
