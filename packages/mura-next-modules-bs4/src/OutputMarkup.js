import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { getMura, getMuraConfig  } from '@murasoftware/next-core';
import gfm from 'remark-gfm';

function OutputMarkup({source,className}){
    const parsedSource=getMura().parseStringAsTemplate(source);
  
    if(getMuraConfig().ConnectorConfig.htmleditortype == 'markdown'){
        return(
            <ReactMarkdown plugins={[gfm]} allowDangerousHtml children={parsedSource} className={className} />
        )
    }

    return(
        <div dangerouslySetInnerHTML={{__html:parsedSource}} className={className} />
    )
    
}

export default OutputMarkup;