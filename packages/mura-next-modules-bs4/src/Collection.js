import React,{ useState,useEffect } from 'react';
import Link from "next/link";
import { getMura, getMuraConfig, getHref } from '@murasoftware/next-core';

export const getLayout=function(layout) {
  const muraConfig =getMuraConfig();
  const { ComponentRegistry } = muraConfig;
  const uselayout = (!layout || layout == 'default') ? "List" : layout;

  if(typeof ComponentRegistry[uselayout] != 'undefined') {
    return ComponentRegistry[uselayout];
  } else {
    console.log("Layout not registered: ",layout);
    return ComponentRegistry['List'];
  }
}


function getDefaultQueryPropsFromLayout(layout,item){
  if(layout){
    return layout.getQueryProps ? layout.getQueryProps(item) : {fields:''};
  } else {
    return  {fields:''};
  }
}

function Collection(props) {
   /* 
    In new development you should use this. 
    const { Mura } = props; 

    This pattern is for legacy support 
    const Mura = props.Mura || getMura();
  */
  const Mura=props.Mura || getMura();
  const objectparams = Object.assign({}, props);
  const DynamicCollectionLayout = getLayout(objectparams.layout).component;

  objectparams.fields= getDefaultQueryPropsFromLayout(DynamicCollectionLayout,objectparams).fields || objectparams.fields || 'Image,Date,Title,Summary,Credits,Tags';
  objectparams.dynamicProps=objectparams.dynamicProps ||  {};

  const _collection=objectparams.dynamicProps.collection ? new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura.getRequestContext()) : false;

  if(!_collection){
    const [collection,setCollection]=useState(_collection);

    useEffect(() => {
      let isMounted = true;
      if(isMounted){
        getDynamicProps(objectparams).then((_dynamicProps)=>{
          if(isMounted){
            setCollection(new Mura.EntityCollection(_dynamicProps.collection,Mura.getRequestContext()));
          }
        });   
      }
      return () => { isMounted = false };
    }, []);

    if(collection) {
      return (
        <DynamicCollectionLayout setCollection={setCollection} collection={collection} props={objectparams} link={RouterlessLink}/>
      )
    }
    else {
      return (
       <div></div>
      )
    }
  } else {
    const [collection,setCollection]=useState(_collection);

    return (
        <DynamicCollectionLayout setCollection={setCollection} collection={collection} props={props} link={RouterLink}/>
      )
  }
}

export const RouterlessLink = function({href,children,className}) {
  return (
    <a href={getHref(href)} className={className}>
      {children}
    </a>
  );
}

export const RouterLink = function({href,children,className}) {
  return (
    <Link legacyBehavior href={getHref(href)}>
      <a className={className}>{children}</a>
    </Link>
  );
}

export const getDynamicProps = async function(props){
   /* 
    In new development you should use this. 
    const { Mura } = props; 

    This pattern is for legacy support 
    const Mura = props.Mura || getMura();
  */
  const Mura=props.Mura || getMura();
  
  const getItemsPerPage = function(props){
    if(Mura.renderMode !='static'){
      if(typeof props.nextn != 'undefined'){
       return props.nextn
      } else if(typeof props.itemsperpage != 'undefined'){
       return props.itemsperpage;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
  const data = {};
  let cdata = {};
  let {content} = props;

  if(props.sourcetype === 'children') {
    const feed = Mura.getFeed('content');

    if(content.getAll) {
      cdata = content.getAll();
    }
    else {
      cdata = content;
    }

    feed.andProp('parentid').isEQ(cdata.contentid);
    feed.fields(getSelectFields(props));
    feed.expand(getExpandFields(props));
    feed.maxItems(props.maxitems);;
    feed.itemsPerPage(getItemsPerPage(props))
    feed.sort(cdata.sortby,cdata.sortdirection);
    
    const query = await feed.getQuery();
    data.collection = query.getAll();
  }
  else if(props.sourcetype === 'relatedcontent') {
    const src = props.source;
   
    if(src==='custom'){
      if(typeof props.items !='undefined'){
        if(!Array.isArray(props.items)){
          try{
            JSON.parse(props.items);
          } catch(e){
            console.log(e)
            props.items=[];
          }
        }
      } else {
        props.items=[];
      }

      if(props.items.length){
        const related = await Mura.getFeed('content')
        .where()
        .fields(getSelectFields(props))
        .expand(getExpandFields(props))
        .itemsPerPage(getItemsPerPage(props))
        .maxItems(props.maxitems)
        .findMany(props.items)
        .getQuery();
        
        data.collection=related.getAll();
      } else {
        data.collection={
          items: [],
          totaltems: 0,
        }
      }
    } else {
      if(!content.getRelatedContent){
        content=Mura.getEntity("content").set(content);
      }
      const related = await content.getRelatedContent(
        src,
        {
          fields:getSelectFields(props),
          expand:getExpandFields(props),
          imagesizes:getImageSizes(props),
          itemsPerPage:getItemsPerPage(props),
          maxitems:props.maxitems
        }
      );
      data.collection = related.getAll(); 
    }
  
    return data;
  }
  else if ((
    typeof props.sourcetype === 'undefined'
    || props.sourcetype === ''
    ) 
    ||  (
      typeof props.sourcetype !== 'undefined' &&
      props.sourcetype === 'localindex' &&
      Mura.isUUID(props.source)
    )
  ) {
    const feed = Mura.getFeed('content');

    if(props.source) {
      feed.andProp('feedid').isEQ(props.source);
    }
    feed.fields(getSelectFields(props));
    feed.expand(getExpandFields(props));
    feed.imageSizes(getImageSizes(props));
    feed.maxItems(props.maxitems);
    feed.itemsPerPage(getItemsPerPage(props));

    //Add stuff like maxitems, nextn
      
    const query = await feed.getQuery();

    data.collection = query.getAll();
  }
  
  return data;
};

const getExpandFields = function(props) {

  const data = getLayout(props.layout).getQueryProps();

  if(data.expand){
    return data.expand;
  } else {
    return '';
  }

}

const getImageSizes = function(props) {

  const data = getLayout(props.layout).getQueryProps();

  if(data.imagesizes){
    return data.imagesizes;
  } else {
    return '';
  }

}

export const getSelectFields = function(props) {

  const data = getLayout(props.layout).getQueryProps(props);

  let fieldlist = '';

  if(data.fields) {
    fieldlist = data.fields;
  } else {
    fieldlist = data.fields ? data.fields  : '';
  }

  if(!fieldlist){
    return '';
  }

  let fieldarray=fieldlist.split(",");
  let hasDate=false;
  let hasFilename=false;
  let hasReleaseDate=false;
  let hasLastUpdate=false;
  let hasCreated=false;
  let hasImage=false;
  let hasFileid=false;
  let hasContentid=false;
  let hasContenthistid=false;
  let hasParentid=false;

  fieldarray=fieldarray.filter(field=>{
    field=field.toLowerCase();
    if(field==='filename'){
      hasFilename=true;
    } else if(field==='date'){
      hasDate=true;
      return false;
    } else if(field==='image'){
      hasImage=true;
      return false;
    } else if(field==='images'){
      hasImage=true;
      return false;
    } else if(field==='fileid'){
      hasFileid=true;
    } else if(field==='contentid'){
      hasContentid=true;
    } else if(field==='contenthistid'){
      hasContenthistid=true;
    } else if(field==='parentid'){
      hasParentid=true;
    } 
    return true;
  });

  //There is no generic date field.  If selected these are the options
  if(hasDate){
    if(!hasReleaseDate){
      fieldarray.push('releasedate');
    } 
    if(!hasLastUpdate){
      fieldarray.push('lastupdate');
    }
    if(!hasCreated){
      fieldarray.push('created');
    }
  }
  if(hasImage){
    if(!hasFileid){
      fieldarray.push('fileid');
    }
    fieldarray.push('images');
  }
  if(!hasFilename){
    fieldarray.push('filename');
  }
  if(!hasContentid){
    fieldarray.push('contentid');
  }
  if(!hasContenthistid){
    fieldarray.push('contenthistid');
  }
  if(!hasParentid){
    fieldarray.push('parentid');
  }
  return fieldarray.join(',').toLowerCase();
}

export default Collection;

export const ModuleConfig={
  key: 'Collection',
  name: 'Collection',
  component: Collection,
  getQueryProps: function(){},
  getDynamicProps: getDynamicProps,
  contentypes:"*",
  excludeFromClient: false,
  isCollectionLayout: false,
  external:false
}