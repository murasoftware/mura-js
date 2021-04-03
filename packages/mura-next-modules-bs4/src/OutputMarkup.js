import React from 'react';
import ReactMarkdown from 'react-markdown';
import { getMura, getMuraConfig  } from '@murasoftware/next-core';
import gfm from 'remark-gfm';
import slug from 'remark-slug';
import directive from 'remark-directive';
import visit from 'unist-util-visit';
import h from 'hastscript';


// This plugin is just an example! You can handle directives however you please!
function htmlDirectives() {
    return transform
  
    function transform(tree) {
      visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], ondirective)
    }
  
    function ondirective(node) {
      var data = node.data || (node.data = {})
      var hast = h(node.name, node.attributes)
  
      data.hName = hast.tagName
      data.hProperties = hast.properties
    }
  }

function renderDirective(elem){
    if(elem.children.length){
        return React.createElement(elem.node.data.hName, elem.node.data.hProperties, elem.children);
    } else {
        return React.createElement(elem.node.data.hName, elem.node.data.hProperties);
    }
}

const renderers = {
    textDirective:renderDirective,
    leafDirective:renderDirective,
    containerDirective:renderDirective,
    heading:function (elem){
        return React.createElement('h' + elem.level, elem.node.data.hProperties, elem.children);
    }
    
}

function OutputMarkup({source,className}){
    const parsedSource=getMura().parseStringAsTemplate(source);
  
    if(getMuraConfig().ConnectorConfig.htmleditortype == 'markdown'){
        return(
            <ReactMarkdown plugins={[gfm,slug,directive,htmlDirectives]} renderers={renderers} children={parsedSource} className={className} />
        )
    }

    return(
        <div dangerouslySetInnerHTML={{__html:parsedSource}} className={className} />
    )
    
}

export default OutputMarkup;