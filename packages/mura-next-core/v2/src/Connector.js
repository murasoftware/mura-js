/* eslint-disable */
import React, {useEffect} from 'react';
import GlobalMura from './GlobalMura.js'
import MuraFactory from 'mura.js/src/core/factory.js'

let muraConfig, connectorConfig, ComponentRegistry, ConnectorConfig, ExternalModules;

export const MuraJSRefPlaceholder = '"undefined"!=typeof window&&function(u){u.queuedMuraCmds=[],u.queuedMuraPreInitCmds=[],"function"!=typeof u.Mura&&(u.Mura=u.mura=u.Mura=function(e){u.queuedMuraCmds.push(e)},u.Mura.preInit=function(e){u.queuedMuraPreInitCmds.push(e)})}(window);';

export const setMuraConfig = function(config) {
  muraConfig = config;
  ComponentRegistry = config.ComponentRegistry;
  ConnectorConfig = config.ConnectorConfig;
  ExternalModules = config.ExternalModules;
  connectorConfig=Object.assign({processMarkup:false},ConnectorConfig);
}

export const getMuraConfig = function() {
  return muraConfig;
}

export const useAsync =  (asyncFn, onSuccess) => {
  useEffect(() => {
    let isMounted = true;
    asyncFn().then(data => {
      if (isMounted) onSuccess(data);
    });
    return () => { isMounted = false };
  }, [asyncFn, onSuccess]);
}

//Needs to account for thread safe Mura instance
export const getHref = function(filename) {
  let path=filename.split('/').filter(item => item.length);
  
  //This shouldn't happen
  if(connectorConfig.siteidinurls){
    if(path.length){
      return '/' + Mura.siteid + '/' + path.join('/') + '/';
    } else {
      return '/' + Mura.siteid + '/';
    }
  } else {
    if(path.length){
      return '/' + path.join('/') + '/';
    } else {
      return '/';
    }
  }
}

export const getComponent = function(props) {
  const  { Mura } = props;
  let objectkey = props.object;
  
  if (typeof ComponentRegistry[objectkey] == 'undefined'){
      objectkey = Mura.firstToUpperCase(props.object);
  }

  if (typeof ComponentRegistry[objectkey] != 'undefined') {
    const ComponentVariable = ComponentRegistry[objectkey].component;
    return <ComponentVariable key={props.instanceid} {...props} />;
  }

  return <p key={props.instanceid}>DisplayRegion: {props.objectname}</p>;
};

export const getMuraPaths = async function() {
  
  if(ConnectorConfig.multitenant){
    return [];
  }

  let siteids=ConnectorConfig.siteid;
  let pathList=[];

  if(!Array.isArray(siteids)){
    siteids=siteids.split();
  }

  for (const siteid of siteids) {
    const Mura=getMuraInstance(siteid);
    const items=await Mura.getFeed('content')
    .maxItems(0)
    .itemsPerPage(0)
    .sort('orderno')
    .where().prop('type').isNotIn('File,Link,Calendar')
    .getQuery({renderMode:'static'});
    pathList=pathList.concat(items.getAll().items);
    pathList.push({ 
      siteid:siteid,
      filename: "" 
    });
  }

  return  pathList
    .map(item => {
      let page=[];
      if(item.filename){
        page=item.filename.split('/');
      }
      page.unshift(item.siteid);
      console.log(item.filename,page)
      return { params: { page: page } };
    })
    .filter(function(item) {
      return (item.params.page.length || item.params.page[0]);
    });

};

export const getMuraExternalModules = function() {
  return ExternalModules;
}

//Create thread safe Mura instances for node
export const getMuraInstance = function(context){

  //If not in node, just return the global instance;
  const isNotInNode=!(typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined');
  
  if(isNotInNode){
    return getMura(context);
  }

  const startingsiteid='';
  let Mura=MuraFactory();
  
  Mura.styleMap=GlobalMura.styleMap;

  if(typeof Mura.deInit=='function'){
    try{
      Mura.deInit();
    }catch(e){}
  }

  const instanceConfig=Object.assign({},ConnectorConfig);
  
  if(instanceConfig.multitenant){
    
    if(typeof context == 'string'){

      instanceConfig.siteid=context;
    
    } else if(context?.siteid) {
      
      instanceConfig.siteid=context.siteid;
    
    } else if(context?.params?.page?.length){
      
      instanceConfig.siteid=context.params.page[0];
    
    } else {
      instanceConfig.siteid='default';
    } 

  } else {
    
    if (!Array.isArray(instanceConfig.siteid)) {
      instanceConfig.siteid = instanceConfig.siteid.split();
    }

    if(typeof context == 'string'
      && instanceConfig.siteid.find((item)=>{
        return (item===context)
        })
    ){
    
      instanceConfig.siteid=context;
    
    } else {
  
      const ishomepage=(
        (context && !(context.params && context.params.page)) 
        || (typeof location != 'undefined' 
          && (
            location.pathname=="/"
            || location.pathname==(instanceConfig.editroute + "/")
          )
        )
      );

      if(ishomepage){
        instanceConfig.siteid=instanceConfig.siteid[0];
      } else {
        let page=[];
        if(context && context.params && context.params.page){
          page=[...context.params.page];
          page=page.filter(item => item.length);
        } else if (typeof location != 'undefined'){
          page=location.pathname.split("/");
          page=page.filter(item => item.length);
          if(page.length 
            && instanceConfig.editroute
            && page[0]===instanceConfig.editroute.split("/")[1]
          ){
            page.shift();
          }
        } 
      
        if(page.length){
          if(instanceConfig.siteid.find((item)=>{
            return (item===page[0])
            })
          ){
            instanceConfig.siteid=page[0];
            instanceConfig.siteidinurls=true;
          } else {
            instanceConfig.siteid=instanceConfig.siteid[0];
          }
        } else {
          instanceConfig.siteid=instanceConfig.siteid[0];
        }
      }
    
    }
  }

  if (context && context.res) {
    Object.assign(instanceConfig,
      { 
        response: context.res,
        request: context.req
      }
    );

    Mura.init(instanceConfig);
  } else if (startingsiteid != instanceConfig.siteid) {
    
    Mura.init(instanceConfig);
  }
 
  Mura.holdReady(true);

  return Mura;
};

//get global Mura instances for browser
export const getMura = function(context){

  if(typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined'){
    return getMuraInstance(context);
  }
  const Mura=GlobalMura;
  const startingsiteid=Mura.siteid;
  const instanceConfig=Object.assign({},ConnectorConfig);

  if(instanceConfig.multitenant){
    
    if(typeof context == 'string'){

      instanceConfig.siteid=context;
    
    } else {
      if(context?.siteid){
        
        instanceConfig.siteid=context.siteid;
      
      } else if(context?.params?.page?.length){
        
        instanceConfig.siteid=context.params.page[0];
      
      } else {

        if(typeof Mura != 'undefined'){
          instanceConfig.siteid=Mura.siteid;
        } else {
          instanceConfig.siteid='default';
        }
        
      }

    }

  } else {
    if (!Array.isArray(instanceConfig.siteid)) {
      instanceConfig.siteid = instanceConfig.siteid.split();
    }

    if(typeof context == 'string'
      && instanceConfig.siteid.find((item)=>{
        return (item===context)
        })
    ){
    
      instanceConfig.siteid=context;
    
    } else {
      
      const ishomepage=(
        (context && !(context.params && context.params.page)) 
        || (typeof location != 'undefined' 
          && (
            location.pathname=="/"
            || location.pathname==(ConnectorConfig.editroute + "/")
          )
        )
      );

      if(ishomepage){
        instanceConfig.siteid=instanceConfig.siteid[0];
      } else {
        let page=[];
        if(context && context.params && context.params.page){
          page=[...context.params.page];
          page=page.filter(item => item.length);
        } else if (typeof location != 'undefined'){
          page=location.pathname.split("/");
          page=page.filter(item => item.length);
          if(page.length 
            && instanceConfig.editroute
            && page[0]===instanceConfig.editroute.split("/")[1]
          ){
            page.shift();
          }
        } 
      
        if(page.length){
          if(instanceConfig.siteid.find((item)=>{
            return (item===page[0])
            })
          ){
            instanceConfig.siteid=page[0];
            instanceConfig.siteidinurls=true;
          } else {
            instanceConfig.siteid=instanceConfig.siteid[0];
          }
        } else {
          instanceConfig.siteid=instanceConfig.siteid[0];
        }
      }
    
    }
  }

  const clearMuraAPICache = function(){
    delete instanceConfig.apiEndpoint;
    delete instanceConfig.apiendpoint;
    delete Mura.apiEndpoint;
    delete Mura.apiendpoint;
  };

  if (context && context.res) {
    Object.assign(instanceConfig,
      { 
        response: context.res,
        request: context.req
      }
    );
    clearMuraAPICache();
   
    Mura.init(instanceConfig);
  } else if (startingsiteid != instanceConfig.siteid) {

    clearMuraAPICache();
    Mura.init(instanceConfig);
  }
 
  Mura.holdReady(true);

  return Mura;
};

//Deprecated
export const getRootPath = () => {
  return getMura().rootpath;
};

//Deprecated
export const getSiteName = () => {
  return getMura().sitename;
};

export const getMuraProps = async function(params) {
  let Mura;
  let renderMode=(typeof params.renderMode == 'undefined') ? 'dynamic' : params.renderMode;
  const context=params.context;

  if(typeof params.Mura != 'undefined'){
    Mura=params.Mura;
  } else {
    Mura=getMura(params.context);
  }

  Mura.renderMode=renderMode;

  params.params = params.params || {};

  if( Mura.renderMode==='static' && Mura.isInNode()
      && process 
      && process.env
      && process.env.MURA_SSR_BASICTOKEN){
        Mura.setRequestHeader("Authorization","Basic " + process.env.MURA_SSR_BASICTOKEN);
        Mura.setMode("rest");
        Mura.setAPIEndpoint(Mura.getAPIEndpoint().replace('/json/', '/rest/'));
  }

  if(typeof onBefore == 'function'){
    try{ 
      await onBefore(Mura);
    } catch(e){
      console.log('Error running onBefore event in getMuraProps:',e);
    }
  }

  let content={
    title: "We're sorry, an error occurred",
    menutitle: "We're sorry, an error occurred",
    body: "",
    isnew: 1,
    siteid: Mura.siteid,
    type: 'Page',
    subtype: 'Default',
    contentid: Mura.createUUID(),
    contenthistid: Mura.createUUID(),
    filename: "500",
    statusCode:500,
    errors:[],
    displayregions:{
      primarycontent:{
        local:{
          items:[]
        }
      }
    }
  };

  try {
    const muraObject = await renderContent(context,renderMode,params.params,Mura);
    if(typeof muraObject != 'undefined' 
      && typeof muraObject.getAll != 'undefined'){
      content = muraObject.getAll();
    } else {
      console.error('Error rendering content',muraObject);
      if(typeof context.res != 'undefined'){
        if(typeof muraObject != 'undefined' && typeof muraObject.statusCode != 'undefined'){
          context.res.statusCode=muraObject.statusCode;
        } else {
          context.res.statusCode=500;
        }
      }
    }
  } catch (e){
    console.error(e);
  }

  if(content.filename == '404'){
    if(typeof context.params != 'undefined'){
      console.error('404 rendering content',context.params);
    }
    if(typeof context.res != 'undefined'){
      context.res.statusCode=404;
    }
  }

  if(typeof context.res != 'undefined'){
    if (typeof content.isondisplay != 'undefined' && !content.isondisplay){
      context.res.statusCode = 404;
    } else {
      if(content.redirect){
        const hasResponseHeaders = (typeof context.res.getHeaders != 'undefined');
        //match casing of nodeProxyRedirectCasing in mura.js
        //Don't set status code is cookies are coming. 30X will cause them to be ignored
        //The browser will handle the redirect
        const hasSetCookie=hasResponseHeaders && (Object.keys(context.res.getHeaders()).findIndex((key)=>{
          return key.toLowerCase()=='set-cookie';
        })>-1);
        if(!hasSetCookie){
          if(hasResponseHeaders){
            context.res.setHeader('Location',content.redirect);
          }
          if(content.statuscode){
            context.res.statusCode = content.statuscode;
          } else {
            context.res.statusCode = 301;
          }
        }
        if(hasResponseHeaders && content.statuscode!=301){
          context.res.setHeader('Cache-Control','no-cache, no-store');
          context.res.setHeader('Expires','Mon, 01 Jan 1990 00:00:00 GMT');
        }
      }
    }
  }

  let queryParams={};

  if (context.browser) {
    queryParams = Mura.getQueryStringParams();
  } else if (context.query) {
    queryParams = {...context.query};
  }

  const moduleStyleData = await getRegionProps(content,queryParams,renderMode,Mura);

  const codeblocks={
    header:[],
    bodystart:[],
    footer:[]
  };

  try {
    if(connectorConfig.codeblocks 
      && (context.res || context.browser)
      && !(queryParams.codeblocks && queryParams.codeblocks==="false")  
    ){
      const codeCollection=await Mura.getFeed('codeblock')
        .where().prop('active').isEQ(1).getQuery();
      
      codeCollection.forEach((item)=>{
        const placement=item.get('placement').toLowerCase();
      
        if(placement=='header'){
          codeblocks.header.push(item.get('code'));
        } else if (placement=='footer'){
          codeblocks.footer.push(item.get('code'));
        } else if (placement=='bodystart'){
          codeblocks.bodystart.push(item.get('code'));
        }
      });
    }
  } catch(e){console.error(e)}

  const props = {
    content: content,
    moduleStyleData: moduleStyleData,
    externalModules: ExternalModules,
    codeblocks: codeblocks,
    queryParams : queryParams,
    renderMode : renderMode
  };

  
  if(typeof onAfter == 'function'){
    try{ 
      await onAfter(props,Mura);
    } catch(e){
      console.log('Error running onAfter event in getMuraProps:',e);
    }
  }

  if(renderMode=='dynamic'){
    return {
      props
    };

  } else {
    return {
      props,
      revalidate:1
    };
  }
};

async function renderContent(context,renderMode,params,Mura) {

  let query = {};

  if (context.browser) {
    query = Mura.getQueryStringParams();
  } else if (context.query) {
    query = {...context.query};
  }

  query.renderMode=renderMode;
 
  let filename = '';

  if (query.page) {
    if(Array.isArray(query.page)){
      if(query.page[query.page.length-1].indexOf('/') == -1){
        filename=query.page[query.page.length-1].split("/");
      } else {
        filename=query.page;
      }
    } else {
      filename=query.page.split("/");
    }
  }
  
  if (context.params && context.params.page) {
    filename = [...context.params.page]; 
  }

  if(!Array.isArray(filename)){
    filename=filename.split("/")
  }
  
  if(filename.length && (filename[0]==Mura.siteid)){
    filename.shift();
  }
  filename=filename.join("/");

  
  if(params){
    query=Object.assign(query,params);
  }
  
  //console.log('filename',filename);
  
  return Mura.renderFilename(filename, query).then(
    async rendered => {
      return rendered;
    },
    async rendered => {
        return rendered;
    }
  );

}


async function getRegionProps(content,queryParams,renderMode,Mura) {
  let moduleStyleData = {};
  
  content.displayregions=content.displayregions || {};
  
  const regions=Object.values(content.displayregions);

  for(const regionIdx in regions){
   const region=regions[regionIdx]; 
    if (
      typeof region.inherited != 'undefined' &&
      Array.isArray(region.inherited.items)
    ) {
      for(const itemdIx in region.inherited.items){
        const item=region.inherited.items[itemdIx];
        item.instanceid = item.instanceid || Mura.createUUID();
        moduleStyleData[item.instanceid] = await getModuleProps(
          item,
          moduleStyleData,
          renderMode,
          content,
          queryParams,
          Mura
        );
      }
    }
   
    for(const itemIdx in region.local.items){
      const item=region.local.items[itemIdx];
      item.instanceid = item.instanceid || Mura.createUUID();
      moduleStyleData[item.instanceid] = await getModuleProps(
        item,
        moduleStyleData,
        renderMode,
        content,
        queryParams,
        Mura
      );
    }

  }

  return moduleStyleData;
}

async function getModuleProps(item,moduleStyleData,renderMode,content,queryParams,Mura) {
  //This is so that the getDynamicProps call has a new getMura()
  //Important for server side thread safety

  try{

    let objectkey = item.object;
    
    if (typeof ComponentRegistry[objectkey] == 'undefined'){
       objectkey = Mura.firstToUpperCase(item.object);
    }

    if (typeof ComponentRegistry[objectkey] != 'undefined') {
     
      if(ComponentRegistry[objectkey].SSR){
        try { 
          item.dynamicProps = await ComponentRegistry[objectkey].getDynamicProps({...item,content,queryParams,Mura});
        } catch(e){
          console.error('Error getting dynamicProps',e);
          item.dynamicProps={};
        }
      }

      if (item.object == 'container') {
        if (
          typeof item.items != 'undefined' &&
          !Array.isArray(item.items)
        ) {
          try {
            item.items = JSON.parse(item.items);
          } catch (e) {
            item.items = [];
          }
        }
        for(const containerIdx in item.items){
          const containerItem=item.items[containerIdx];
          containerItem.instanceid = containerItem.instanceid || Mura.createUUID();
          moduleStyleData[containerItem.instanceid] = await getModuleProps(
            containerItem,
            moduleStyleData,
            renderMode,
            content,
            queryParams,
            Mura
          );
        }
      }
    }
  } catch(e){
    console.error(e);
  }

  if(renderMode=='dynamic' || !Mura.isInNode()){
    return {
      cssRules:[]
    };
  } else {
    const styleData=Mura.recordModuleStyles(item);
    delete styleData.deleteRule;
    delete styleData.insertRule;
    
    return  styleData;
      
  }
   
}
