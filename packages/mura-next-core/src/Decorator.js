import React, { useEffect,useState } from 'react';
import { getMura ,getIsEditMode, getMuraConfig } from './Connector';

function Decorator(props) {
  const Mura= getMura();
  const muraConfig = getMuraConfig();
  const { ComponentRegistry, ExternalModules } = muraConfig;
  const { label, instanceid, labeltag, children } = props;
 
  let isEditMode = getIsEditMode();
  const [mounted,setMounted]=useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

    /*
      The idea here is to write the style object of the default XL view to the target objects.
      The helps the initial paint to browser. 
      However, since it's not responsive it needs to be taken out.
    */

  let objectStyles={};
  let metaStyles={};
  let contentStyles={};

  if(!mounted && isEditMode && typeof props.stylesupport == 'object' && Object.keys(props.stylesupport).length){
    const getModuleTargetStyles = (incoming)=>{
      const styles={};
      const invalid={
        backgroundimage:true
      };
  
      Object.keys(incoming).forEach((key)=>{
        if(!invalid[key]){
          if(Mura.styleMap.tojs[key]){
            styles[Mura.styleMap.tojs[key]]=incoming[key];
          } else {
            styles[key]=incoming[key];
          }
        }
      })
  
      return styles;
    };
  
    objectStyles=(props.stylesupport.objectstyles) ? getModuleTargetStyles(props.stylesupport.objectstyles) : {};
    metaStyles=(props.stylesupport.metastyles) ? getModuleTargetStyles(props.stylesupport.metastyles) : {};
    contentStyles=(props.stylesupport.contentstyles) ? getModuleTargetStyles(props.stylesupport.contentstyles) : {};
  
    if(typeof document != 'undefined'){  

      const params=Object.assign(
        {},{
          stylesupport:props.stylesupport,
          instanceid:props.instanceid
        }
      );

      const sheet=Mura.getStyleSheet('mura-styles-' + params.instanceid)
      const styleTargets=Mura.getModuleStyleTargets(params.instanceid,false);

      while (sheet.cssRules.length) {
        sheet.deleteRule(0);
      }

      Mura.applyModuleStyles(params.stylesupport,styleTargets.object,sheet);
      Mura.applyModuleCustomCSS(params.stylesupport,sheet,params.instanceid);
      Mura.applyModuleStyles(params.stylesupport,styleTargets.meta,sheet);
      Mura.applyModuleStyles(params.stylesupport,styleTargets.content,sheet);
      
    }
  } 

  const domObject = {
    className: 'mura-object mura-async-object',
    'data-inited':true
  };

  const domContent = {
    className: 'mura-object-content'
  };

  const domMeta={
    className:"mura-object-meta"
  }

  const domMetaWrapper={
    className:"mura-object-meta-wrapper"
  }

  //Proxied module are modules that will always be server side rendered
  const isExternalModule=ExternalModules[props.object];

  let objectKey = props.object;

  if (typeof ComponentRegistry[objectKey] == 'undefined'){
    objectKey = Mura.firstToUpperCase(props.object);
  }

  let isSSR=ComponentRegistry[objectKey] && (ComponentRegistry[objectKey].SSR || ComponentRegistry[objectKey].ssr);

  if(typeof props.ssr != "undefined" && !props.ssr || typeof props.SSR != "undefined" && !props.SSR){
    isSSR=false;
  }

  if (isEditMode || isExternalModule || !isSSR) {
    Object.keys(props).forEach(key => {
      if (
        !['Router', 'Link','html', 'content', 'children', 'isEditMode', 'dynamicProps', 'moduleStyleData', 'regionContext'].find(
          restrictedkey => restrictedkey === key,
        )
      ) {
        if (typeof props[key] === 'object') {
          domObject[`data-${key}`] = JSON.stringify(props[key]);
        } else if (
          typeof props[key] !== 'undefined' &&
          !(typeof props[key] === 'string' && props[key] === '')
        ) {
          domObject[`data-${key}`] = props[key];
        }
      }
      if(typeof props[key] != 'undefined' && props[key]){
        if (key === 'class') {
          domObject.className += (domObject.className) ? ` ${props[key]}` : props[key];;
        } else if (key === 'cssclass') {
          domObject.className += (domObject.className) ? ` ${props[key]}` : props[key];
        } else if (key === 'cssid') {
          domObject.id = props[key];
        } else if (key === 'contentcssclass') {
          domContent.className +=  (domContent.className) ? ` ${props[key]}` : props[key];
        } else if (key === 'contentcssid') {
          domContent.id = props[key];
        } else if (key === 'metacssclass') {
          domMeta.className += (domMeta.className) ? ` ${props[key]}` : props[key];
        } else if (key === 'metacssid') {
          domMeta.id = props[key];
        }
      }
    });
    
    if(domObject.className.split(' ').find($class => $class === 'constrain')){
      domMetaWrapper.className += ' container';
    }
  } else {
    domObject['data-instanceid'] = instanceid;
    
    domObject.className = `mura-object-${props.object}`;

    if(typeof props.moduleStyleData != 'undefined' && typeof props.moduleStyleData[instanceid] != 'undefined'){
      domObject.className +=
        ` ${props.moduleStyleData[instanceid].targets.object.class}`;
      domObject.id = props.moduleStyleData[props.instanceid].targets.object.id;
      domContent.className =
        props.moduleStyleData[props.instanceid].targets.content.class;
      domContent.id = props.moduleStyleData[props.instanceid].targets.content.id;
      domMetaWrapper.className =
        props.moduleStyleData[props.instanceid].targets.metawrapper.class;
      domMeta.className =
        props.moduleStyleData[props.instanceid].targets.meta.class;
      domMeta.id =
        props.moduleStyleData[props.instanceid].targets.meta.id;
    } else {
      domObject.id = '';
      domContent.id = '';
      domMetaWrapper.className = '';
      domMeta.className = '';
      domMeta.id =';'
    }

    ['objectspacing','contentspacing','metaspacing'].forEach((key)=>{
      if(typeof props[key] != 'undefined' && props[key] && props[key] != 'custom'){
        domObject['data-' + key] = props[key];
      }
    });

  }
  
  if(isExternalModule || !isSSR){
    if(isExternalModule && props.html){
      <div style={objectStyles} {...domObject}>
        {label ? <eta styles={metaStyles} label={label} labeltag={labeltag} dommeta={domMeta} dommetawrapper={domMetaWrapper}/> : null}
        {label ? <div className="mura-flex-break" /> : null}
        <div style={contentStyles} {...domContent} dangerouslySetInnerHTML={{__html:props.html}}></div>
      </div>
    } else {
      return (
        <div style={objectStyles} {...domObject}></div>
      );
    }
  } else {
    return (
      <div style={objectStyles} {...domObject}>
        {label ? <Meta styles={metaStyles} label={label} labeltag={labeltag} dommeta={domMeta} dommetawrapper={domMetaWrapper}/> : null}
        {label ? <div className="mura-flex-break" /> : null}
        <div style={contentStyles} {...domContent}>{children}</div>
      </div>
    );
  }
  
}

const Meta = ({ label, labeltag, dommeta, dommetawrapper, styles }) => {
  const LabelHeader = labeltag ? `${labeltag}` : 'h2';
  return (
    <div {...dommetawrapper}>
      <div style={styles} {...dommeta}>
        <LabelHeader>{label}</LabelHeader>
      </div>
    </div>
  );
};

export default Decorator;