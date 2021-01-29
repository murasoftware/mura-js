/* eslint-disable */
import Mura from 'mura.js';
import {ComponentRegistry,ConnectorConfig,ExternalModules} from 'mura.config';

require('mura.js/src/core/stylemap-static');

let connectorConfig=Object.assign({},ConnectorConfig);

export const MuraJSRefPlaceholder = '"undefined"!=typeof window&&function(u){u.queuedMuraCmds=[],u.queuedMuraPreInitCmds=[],"function"!=typeof u.Mura&&(u.Mura=u.mura=u.Mura=function(e){u.queuedMuraCmds.push(e)},u.Mura.preInit=function(e){u.queuedMuraPreInitCmds.push(e)})}(window);';

export const useAsync=function(asyncFn, onSuccess) {
  useEffect(() => {
    let isMounted = true;
    asyncFn().then(data => {
      if (isMounted) onSuccess(data);
    });
    return () => { isMounted = false };
  }, [asyncFn, onSuccess]);
}

export const getHref = (filename) => {
  let path=filename.split('/').filter(item => item.length);
  
  if(connectorConfig.siteidinurls){
    return '/' + Mura.siteid + '/' + path.join('/');
  } else {
    return '/' + path.join('/');
  }
}

export const getComponent = item => {
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

export const getMuraPaths = async () => {
  
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

export const getMuraExternalModules = ()=>{
  return ExternalModules;
}

export const getMura = context => {

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

  const clearMuraAPICache = ()=>{
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
    console.log('initing', connectorConfig.siteid)
    Mura.init(connectorConfig);
  } else if (startingsiteid != connectorConfig.siteid) {
    console.log('changing siteid',startingsiteid,connectorConfig.siteid)
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
  const Mura=getMura(context);
  
  Mura.renderMode='dynamic';

  if(!isEditMode){
    Mura.renderMode='static';
  }

  const muraObject = await renderContent(context,isEditMode,params);
  const content = muraObject.getAll();
  const moduleStyleData = await getRegionProps(content,isEditMode);
  const codeblocks={
    header:[],
    bodystart:[],
    footer:[]
  };

  try {
    if(connectorConfig.codeblocks){
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
  } catch(e){console.log(e)}

  delete Mura._request;
  delete Mura.response;
  delete Mura.request;
  delete Mura.renderMode;

  const props = {
    content: content,
    moduleStyleData: moduleStyleData,
    externalModules: ExternalModules,
    codeblocks: codeblocks
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
      if (!rendered) {
        return Mura.getEntity('Content').set({
          title: '404',
          menutitle: '404',
          body: 'The content that you requested can not be found',
          contentid: Mura.createUUID(),
          isnew: 1,
          siteid: Mura.siteid,
          type: 'Page',
          subtype: 'Default',
          contentid: Mura.createUUID(),
          contenthistid: Mura.createUUID(),
          filename: '404',
          displayregions:{
            primarycontent:{
              local:{
                items:[]
              }
            }
          }
        });
      } else {
        return rendered;
      }
    },
  );
}



async function getRegionProps(content,isEditMode) {
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
          content
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
        content
      );
    }

  }

  return moduleStyleData;
}

async function getModuleProps(item,moduleStyleData,isEditMode,content) {
  getMura();

  try{

    let objectkey = item.object;
   
    if (typeof ComponentRegistry[objectkey] == 'undefined'){
       objectkey = Mura.firstToUpperCase(item.object);
    }

    if (typeof ComponentRegistry[objectkey] != 'undefined') {
     
      if(ComponentRegistry[objectkey].SSR){
        item.dynamicProps = await ComponentRegistry[objectkey].getDynamicProps({...item,content});
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
            content
          );
        }
      }
    }
  } catch(e){
    console.log(e);
  }

  const styleData = Mura.recordModuleStyles(item);
 
  return {
    isEditMode:isEditMode,
    cssRules: styleData.cssRules,
    targets: styleData.targets,
    id: 'mura-styles' + item.instanceid,
    stylesupport: item.stylesupport || {},
    };

}
