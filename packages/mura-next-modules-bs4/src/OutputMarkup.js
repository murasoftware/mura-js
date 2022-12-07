import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { getMura, getMuraConfig, Decorator  } from '@murasoftware/next-core';
import gfm from 'remark-gfm';
import slug from 'remark-slug';
import directive from 'remark-directive';
import visit from 'unist-util-visit';
import h from 'hastscript';

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

    //console.log(elem)

    let tag=elem.node.data.hName;
    let props= Object.assign({},elem.node.data.hProperties);
    
    try{
        switch(elem.node.data.hName.toLowerCase()){
            case 'module':
                tag=Decorator;
                props['data-render']="client";
                props.ssr=false;
             break;

            case 'content':


                break;

            case 'content':


                break;
        } 
        if(elem.children.length){
            return React.createElement(tag, props, elem.children);
        } else {
            return React.createElement(tag, props);
        }
    } catch(e){
        console.error("error rendering html directive",e);
        return '';
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

function parseStringAsTemplate(stringValue){
    const errors={};
    let parsedString=stringValue;
    let doLoop=true;

    do {
        const finder=/(\${)(.+?)(})/.exec(parsedString)
        if(finder){
            let template;
            try {
                template=eval('`${' + finder[2] + '}`');
            } catch(e){
                console.log('error parsing string template: ' + '${' + finder[2] + '}',e);
                template='[error]' + finder[2] + '[/error]';
            }
            parsedString=parsedString.replace(finder[0],template);
        } else {
            doLoop=false;
        }
    } while (doLoop)

    parsedString=parsedString.replace('[error]','${');
    parsedString=parsedString.replace('[/error]','}');

    return parsedString;
}

function OutputMarkup({source,className}){
    const parsedSource=parseStringAsTemplate(source);
  
    if(parsedSource && (!parsedSource.startsWith('<') || parsedSource.startsWith('<span') || parsedSource.startsWith('<br'))){
        return(
            <ReactMarkdown plugins={[gfm,slug,directive,htmlDirectives]} allowDangerousHtml renderers={renderers} children={parsedSource} className={className} />
        )
    }

    return(
        <div dangerouslySetInnerHTML={{__html:parsedSource}} className={className} />
    )
    
}

export default OutputMarkup;