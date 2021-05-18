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
  const Mura = getMura();
  const objectparams = Object.assign({}, props);
  const DynamicCollectionLayout = getLayout(objectparams.layout).component;

  objectparams.fields= getDefaultQueryPropsFromLayout(DynamicCollectionLayout,objectparams).fields || objectparams.fields || 'Image,Date,Title,Summary,Credits,Tags';
  objectparams.dynamicProps=objectparams.dynamicProps ||  {};

  const _collection=objectparams.dynamicProps.collection ? new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext) : false;

  if(!_collection){
    const [collection,setCollection]=useState(_collection);

    useEffect(() => {
      let isMounted = true;
      if(isMounted){
        getDynamicProps(objectparams).then((_dynamicProps)=>{
          if(isMounted){
            setCollection(new Mura.EntityCollection(_dynamicProps.collection,Mura._requestcontext));
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
    <Link href={getHref(href)}>
      <a className={className}>{children}</a>
    </Link>
  );
}

export const getDynamicProps = async function(item){
  const Mura = getMura();
  const getItemsPerPage = function(item){
    if(Mura.renderMode !='static'){
      if(typeof item.nextn != 'undefined'){
       return item.nextn
      } else if(typeof item.itemsperpage != 'undefined'){
       return item.itemsperpage;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
  const data = {};
  let cdata = {};
  let {content} = item;

  if(item.sourcetype === 'children') {
    const feed = Mura.getFeed('content');

    if(content.getAll) {
      cdata = content.getAll();
    }
    else {
      cdata = content;
    }

    feed.andProp('parentid').isEQ(cdata.contentid);
    feed.fields(getSelectFields(item));
    feed.expand(getExpandFields(item));
    feed.maxItems(item.maxitems);;
    feed.itemsPerPage(getItemsPerPage(item))
    feed.sort(cdata.sortby,cdata.sortdirection);
    
    const query = await feed.getQuery();
    data.collection = query.getAll();
  }
  else if(item.sourcetype === 'relatedcontent') {
    const src = item.source;
   
    if(src==='custom'){
      if(typeof item.items !='undefined'){
        if(!Array.isArray(item.items)){
          try{
            JSON.parse(item.items);
          } catch(e){
            console.log(e)
            item.items=[];
          }
        }
      } else {
        item.items=[];
      }

      if(item.items.length){
        const related = await Mura.getFeed('content')
        .where()
        .fields(getSelectFields(item))
        .expand(getExpandFields(item))
        .itemsPerPage(getItemsPerPage(item))
        .maxItems(item.maxitems)
        .findMany(item.items)
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
          fields:getSelectFields(item),
          expand:getExpandFields(item),
          imagesizes:getImageSizes(item),
          itemsPerPage:getItemsPerPage(item),
          maxitems:item.maxitems
        }
      );
      data.collection = related.getAll(); 
    }
    return data;
  }
  else if ((
    typeof item.sourcetype === 'undefined'
    || item.sourcetype === ''
    ) 
    ||  (
      typeof item.sourcetype !== 'undefined' &&
      item.sourcetype === 'localindex' &&
      Mura.isUUID(item.source)
    )
  ) {
    const feed = Mura.getFeed('content');

    if(item.source) {
      feed.andProp('feedid').isEQ(item.source);
    }
    feed.fields(getSelectFields(item));
    feed.expand(getExpandFields(item));
    feed.imageSizes(getImageSizes(item));
    feed.maxItems(item.maxitems);
    feed.itemsPerPage(getItemsPerPage(item));

    //Add stuff like maxitems, nextn
      
    const query = await feed.getQuery();

    data.collection = query.getAll();
  }

  return data;
};

const getExpandFields = function(item) {

  const data = getLayout(item.layout).getQueryProps();

  if(data.expand){
    return data.expand;
  } else {
    return '';
  }

}

const getImageSizes = function(item) {

  const data = getLayout(item.layout).getQueryProps();

  if(data.imagesizes){
    return data.imagesizes;
  } else {
    return '';
  }

}

export const getSelectFields = function(item) {

  const data = getLayout(item.layout).getQueryProps(item);

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