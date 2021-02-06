import react , { useContext} from 'react';
import ReactMarkdown from "react-markdown";
import { getMuraConfig  } from '@murasoftware/next-core';

function OutputMarkup({source,className}){
    const muraConfig = getMuraConfig();
    const { ConnectorConfig } = muraConfig;
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