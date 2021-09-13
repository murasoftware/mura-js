/* eslint-disable */
import React, {useEffect} from 'react';
import Mura from 'mura.js';

require('mura.js/src/core/stylemap-static');

let muraConfig, connectorConfig, ComponentRegistry, ConnectorConfig, ExternalModules;
let isEditMode=false;

export const MuraJSRefPlaceholder = '"undefined"!=typeof window&&function(u){u.queuedMuraCmds=[],u.queuedMuraPreInitCmds=[],"function"!=typeof u.Mura&&(u.Mura=u.mura=u.Mura=function(e){u.queuedMuraCmds.push(e)},u.Mura.preInit=function(e){u.queuedMuraPreInitCmds.push(e)})}(window);';

export const setIsEditMode = function (value) {
  isEditMode=value;
}

export const getIsEditMode = function() {
  return isEditMode;
}

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

export const getHref = function(filename) {
  let path=filename.split('/').filter(item => item.length);
  
  if(connectorConfig.siteidinurls){
    return '/' + Mura.siteid + '/' + path.join('/');
  } else {
    return '/' + path.join('/');
  }
}

export const getComponent = function(item) {
  getMura();

  let objectkey = item.object;
  
  if (typeof ComponentRegistry[objectkey] == 'undefined'){
      objectkey = Mura.firstToUpperCase(item.object);
  }

  if (typeof ComponentRegistry[objectkey] != 'undefined') {
    const ComponentVariable = ComponentRegistry[objectkey].component;
    return <ComponentVariable key={item.instanceid} {...item} />;
  }

  return <p key={item.instanceid}>DisplayRegion: {item.objectname}</p>;
};

export const getMuraPaths = async function() {
  
  let siteids=ConnectorConfig.siteid;
  let pathList=[];

  if(!Array.isArray(siteids)){
    siteids=siteids.split();
  }

  for (let index = 0; index < siteids.length; index++) {
    getMura(siteids[index]);
    const items=await Mura.getFeed('content')
    .maxItems(0)
    .itemsPerPage(0)
    .sort('orderno')
    .getQuery({renderMode:'static'});
    pathList=pathList.concat(items.getAll().items);
    pathList.push({ 
      siteid:siteids[index],
      filename: "" 
    });
  }

  const paths = pathList
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

  return paths;
};

export const getMuraExternalModules = function() {
  return ExternalModules;
}

export const getMura = function(context){
  const startingsiteid=Mura.siteid;
  
  if(typeof context == 'string'
    && ConnectorConfig.siteid.find((item)=>{
      return (item===context)
      })
  ){
   
    connectorConfig.siteid=context;
  
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
  
    if(Array.isArray(ConnectorConfig.siteid)){
      if(ishomepage){
        connectorConfig.siteid=ConnectorConfig.siteid[0];
      } else {
        let page=[];
        if(context && context.params && context.params.page){
          page=[...context.params.page];
          page=page.filter(item => item.length);
        } else if (typeof location != 'undefined'){
          page=location.pathname.split("/");
          page=page.filter(item => item.length);
          if(page.length 
            && ConnectorConfig.editroute
            && page[0]===ConnectorConfig.editroute.split("/")[1]
          ){
            page.shift();
          }
        } 
      
        if(page.length){
          if(ConnectorConfig.siteid.find((item)=>{
            return (item===page[0])
            })
          ){
            connectorConfig.siteid=page[0];
            connectorConfig.siteidinurls=true;
          } else {
            connectorConfig.siteid=ConnectorConfig.siteid[0];
          }
        } 
      }
    }
   
  }

  const clearMuraAPICache = function(){
    delete connectorConfig.apiEndpoint;
    delete connectorConfig.apiendpoint;
    delete Mura.apiEndpoint;
    delete Mura.apiendpoint;
  };

  if (context && context.res) {
    Object.assign(connectorConfig,
      { 
        response: context.res,
        request: context.req
      }
    );
    clearMuraAPICache();
    //console.log('initing', connectorConfig.siteid)
    Mura.init(connectorConfig);
  } else if (startingsiteid != connectorConfig.siteid) {
    //console.log('changing siteid',startingsiteid,connectorConfig.siteid)
    clearMuraAPICache();
    Mura.init(connectorConfig);
  }
 
  Mura.holdReady(true);

  return Mura;
};

export const getRootPath = () => {
  return getMura().rootpath;
};

export const getSiteName = () => {
  return getMura().sitename;
};

export const getMuraProps = async (context,isEditMode,params) => {
  getMura(context);
  setIsEditMode(isEditMode);
  
  Mura.renderMode='dynamic';

  if(!isEditMode){
    Mura.renderMode='static';
    if(Mura.isInNode()
      && process 
      && process.env
      && process.env.MURA_SSR_BASICTOKEN){
        Mura.setRequestHeader("Authorization","Basic " + process.env.MURA_SSR_BASICTOKEN);
        Mura.setMode("rest");
        Mura.setAPIEndpoint(Mura.getAPIEndpoint().replace('/json/', '/rest/'));
    }
  }

  let content={
    title: "We're sorry, an error occurred",
    menutitle: "We're sorry, an error occurred",
    body: "",
    contentid: Mura.createUUID(),
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
    const muraObject = await renderContent(context,isEditMode,params);
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

  if (typeof content.isondisplay != 'undefined' && !content.isondisplay){
    context.res.statusCode = 404;
  } else {
    if(content.redirect){
      //match casing of nodeProxyRedirectCasing in mura.js
      context.res.setHeader('Location',content.redirect);
      if(content.statuscode){
        context.res.statusCode = content.statuscode;
      } else {
        context.res.statusCode = 301;
      }
    }
  }

  let queryParams={};

  if (context.browser) {
    queryParams = Mura.getQueryStringParams();
  } else if (context.query) {
    queryParams = {...context.query};
  }

  const moduleStyleData = await getRegionProps(content,queryParams,isEditMode);

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

  if(Mura.isInNode()){
    Mura.deInit();
  }

  const props = {
    content: content,
    moduleStyleData: moduleStyleData,
    externalModules: ExternalModules,
    codeblocks: codeblocks,
    queryParams : queryParams
  };

  if(isEditMode){
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

async function renderContent(context,isEditMode,params) {

  let query = {};

  if (context.browser) {
    query = Mura.getQueryStringParams();
  } else if (context.query) {
    query = {...context.query};
  }

  if(isEditMode){
    query.isEditRoute=isEditMode;
  }

  let filename = '';

  if (context.params && context.params.page) {
    filename = [...context.params.page];
  }

  if(Array.isArray(filename)){
    if(filename.length && filename[0]==connectorConfig.siteid){
      filename.shift();
    }
    filename=filename.join("/");
  }
  
  //console.log(filename,query,isEditMode)
  query=Object.assign(query,params);

  return await Mura.renderFilename(filename, query).then(
    async rendered => {
      return rendered;
    },
    async rendered => {
        return rendered;
    }
  );
}



async function getRegionProps(content,queryParams,isEditMode) {
  getMura();
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
          isEditMode,
          content,
          queryParams
        );
      }
    }
   
    for(const itemIdx in region.local.items){
      const item=region.local.items[itemIdx];
      item.instanceid = item.instanceid || Mura.createUUID();
      moduleStyleData[item.instanceid] = await getModuleProps(
        item,
        moduleStyleData,
        isEditMode,
        content,
        queryParams
      );
    }

  }

  return moduleStyleData;
}

async function getModuleProps(item,moduleStyleData,isEditMode,content,queryParams) {
  getMura();

  try{

    let objectkey = item.object;
   
    if (typeof ComponentRegistry[objectkey] == 'undefined'){
       objectkey = Mura.firstToUpperCase(item.object);
    }

    if (typeof ComponentRegistry[objectkey] != 'undefined') {
     
      if(ComponentRegistry[objectkey].SSR){
        try {
          item.dynamicProps = await ComponentRegistry[objectkey].getDynamicProps({...item,content,queryParams});
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
            isEditMode,
            content,
            queryParams
          );
        }
      }
    }
  } catch(e){
    console.error(e);
  }

  if(isEditMode || !Mura.isInNode()){
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
