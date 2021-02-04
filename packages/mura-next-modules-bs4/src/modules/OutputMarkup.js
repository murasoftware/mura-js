import react from 'react';
import ReactMarkdown from "react-markdown";
import { ConnectorConfig } from 'mura.config';

function OutputMarkup({source,className}){
    let connectorConfig=Object.assign({},ConnectorConfig);

    if(connectorConfig.htmleditortype == 'markdown'){
        return(
            <ReactMarkdown source={source} className={className} />
        )
    }

    return(
        <div dangerouslySetInnerHTML={{__html:source}} className={className} />
    )
    
}

export default OutputMarkup;