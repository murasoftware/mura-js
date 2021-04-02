import React from 'react';
import ReactMarkdown from 'react-markdown';
import { getMura, getMuraConfig  } from '@murasoftware/next-core';
import gfm from 'remark-gfm';

function OutputMarkup({source,className}){
    const parsedSource=getMura().parseStringAsTemplate(source);
  
    if(getMuraConfig().ConnectorConfig.htmleditortype == 'markdown'){
        return(
            <ReactMarkdown plugins={[gfm]} children={parsedSource} className={className} />
        )
    }

    return(
        <div dangerouslySetInnerHTML={{__html:parsedSource}} className={className} />
    )
    
}

export default OutputMarkup;