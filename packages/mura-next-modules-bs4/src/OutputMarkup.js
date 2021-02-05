import react , { useContext} from 'react';
import ReactMarkdown from "react-markdown";
import { MuraContext  } from '@murasoftware/next-core/GlobalContext';

function OutputMarkup({source,className}){
    const MuraConfig = useContext(MuraContext);
    const { ConnectorConfig } = MuraConfig;
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