import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getLayout, RouterlessLink, RouterLink, getSelectFields } from './Collection';
import { getMura } from '@murasoftware/next-core';
import Alert from 'react-bootstrap/Alert'

function getDefaultQueryPropsFromLayout(layout,item){
  if(layout){
    return layout.getQueryProps ? layout.getQueryProps(item) : {fields:''};
  } else {
    return  {fields:''};
  }
}

function SearchResults(props) {
  const Mura = props.Mura || getMura();
  const objectparams = Object.assign({}, props);
  const DynamicCollectionLayout = getLayout('SearchResultsLayout').component;

  objectparams.fields=objectparams.fields || getDefaultQueryPropsFromLayout(DynamicCollectionLayout,objectparams).fields || 'Image,Date,Title,Summary,Credits,Tags';

  let queryText = '';

  if (!Mura.editing){
      const router = useRouter();
      queryText = router.query.q;
  }
  
  objectparams.dynamicProps=objectparams.dynamicProps ||  {something:'new'};

  const _collection=objectparams.dynamicProps.collection ? new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext) : false;
  
  if(!_collection){
    const [collection,setCollection]=useState(_collection);
    
    useEffect(() => {
      let isMounted = true;
      if (isMounted) {
        getDynamicProps(queryText,props).then((_dynamicProps) => {
          if(isMounted){
            setCollection(new Mura.EntityCollection(_dynamicProps.collection,Mura._requestcontext));
          }
        });
      }
      return () => { isMounted = false };
    }, []);

    if(collection) {
      return (
        <>
          <SearchMessage qText={queryText} />
          <DynamicCollectionLayout setCollection={setCollection} collection={collection} props={objectparams} link={RouterlessLink}/>
        </>
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
      <>
        <SearchMessage qText={queryText} />
        <DynamicCollectionLayout setCollection={setCollection} collection={collection} props={props} link={RouterLink}/>
      </>
      )
  }
}

export const getDynamicProps = async function(queryText,props) {
    const Mura = props.Mura || getMura();
    const data = {};
    const feed = Mura.getFeed('content');

    //exclude stuff you don't want returned
    feed.prop('subtype').isNEQ('Author');
    feed.andProp('subtype').isNEQ('Confirmation');
    
    feed.andOpenGrouping();
    feed.orProp('title').containsValue(queryText);
    feed.orProp('body').containsValue(queryText);
    feed.orProp('summary').containsValue(queryText);
    feed.closeGrouping();
    feed.maxItems(props.maxitems);
    
    if(Mura.renderMode !='static'){      
      feed.itemsPerPage(props.nextn);
    } else {
      feed.itemsPerPage(0);
    }

    const query = await feed.getQuery();
    data.collection = query.getAll();
    // console.log('search results: ', data);
    return data;
}

const SearchMessage = (props) => {
  const qText = props.qText;
  return(
    <Alert variant="info">
        <p className="mb-0">Results for your search of: <strong>{qText}</strong></p>
    </Alert>
  )
}
export default SearchResults;