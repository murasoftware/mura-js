import React, { useState } from "react";
import OutputMarkup from "./OutputMarkup";
import CollectionNav from './CollectionNav';
import ItemDate from './ItemDate';
import CollectionReadMoreBtn from './CollectionReadMoreBtn';
import ItemCredits from './ItemCredits';
import ItemTags from './ItemTags';
import ItemImage from './ItemImage';
import { getMura, getHref } from '@murasoftware/next-core';

const SearchResultsLayout = ({props,collection,setCollection,link}) => {
  const [pos, setPos] = useState(0);

  return (
    <div className="searchResultsLayout">

        <CurrentItems collection={collection} pos={pos} link={link} {...props} /> 
      
        <div className="row">
            <div className="col-12">
            <CollectionNav setCollection={setCollection} collection={collection} pos={pos} setPos={setPos} link={link} {...props} />
            </div>
        </div>
    </div>
  )
}

const CurrentItems = (props) => {
  const Mura = props.Mura || getMura();
  const {collection,nextn,link,pos,fields,scrollpages} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  let itemsTo = pos+nextn > items.length ? items.length : pos+nextn;
  const fieldlist = fields ? fields.toLowerCase().split(",") : [];
  const maxItems = props.maxitems;
  const startIndex = collection.get('startindex');

  if(Mura.renderMode != 'static' && scrollpages){
    itemsTo=items.length;
  } else {
    if (maxItems < items.length && pos+nextn > maxItems){
      itemsTo = maxItems;
    }
  }
  
  for(let i = pos;i < itemsTo;i++) {
    item = items[i];

    itemsList.push(
      <div className="row mb-3" key={item.get('contentid')}>
        <ListImage fieldlist={fieldlist} item={item} imagesize={props.imagesize} />
        <ListMeta startIndex={startIndex} index={i} pos={pos} itemsTo={itemsTo} fieldlist={fieldlist} item={item} Link={Link} />
      </div>
    );
  }

  return itemsList;
}

const ListImage = (props) => {
  const {fieldlist, item} = props;

  let hasImage = false;
  if (fieldlist.indexOf("image") > -1) {
    hasImage = true;
  }
  if(hasImage) {
    const imagesize= props.imagesize || 'medium';
    return(
      <div className="col-12 col-md-3 mb-3 pr-md-0">
          <ItemImage image={item.get('images')[imagesize]} className="img-fluid" alt={item.get('title')} key="image" />
      </div>
    )  
  }
  return(
    <></>
  )
}

const ListMeta = (props) => {
  const {fieldlist, item, Link, index, pos, startIndex} = props;
  const currentIndex = index + startIndex;

  let hasImage = false;
  if (fieldlist.indexOf("image") > -1) {
    hasImage = true;
  }

  let isLink = false;
  if (item.get('type') === "Link") {
    isLink = true;
  }
  // console.log(item.get('type'));
  return(
    <div className="col-12 py-3">
        <div className="mura-item-meta">
        {
            fieldlist.map(field => {
              switch(field) {
                case "title":
                  return (
                    <div className="mura-item-meta__title"key={field}>                        
                        <h3><Link href={getHref(item.get('filename'))} className="text-dark">{currentIndex}. {item.get('title')}</Link></h3>                        
                    </div>
                  )
                case "date":
                case "releasedate":
                    return (
                      <div className="mura-item-meta__date" key={field}>
                        <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                      </div>
                    );
                case "summary":
                  return <OutputMarkup source={item.get('summary')} key={field} />
                case "readmore":
                      return (
                        <div className="mura-item-meta__readmore" key={field}>
                          <CollectionReadMoreBtn
                            href={getHref(item.get('filename'))}
                            ctatext="Read More"
                            link={Link}
                            key={item.get('contentid')}
                          />
                        </div>
                      )
                case "credits":
                    if(item.get('credits').length){
                      return (
                        <div className="mura-item-meta__credits" key={field}>
                          <ItemCredits credits={item.get('credits')} />
                        </div>
                      );
                    }
                    return null;
                case "tags":
                    return (
                        <div className="mura-item-meta__tags pb-2" key={field}>
                          <ItemTags tags={item.get('tags')} />
                        </div>
                    );
                default:
                  return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
              }        
            })
        }
        </div>
      </div>
  )
}
/*
  This is not required; it is used to retrieve the required fields when populated getStatic/getServerSide props
*/
export const getQueryProps = (item) => {
  const data = {};
  data['fields'] = "";

  return data;
};

export default SearchResultsLayout;

export const ModuleConfig={
  name: 'SearchResultsLayout',
  component: SearchResultsLayout,
  getQueryProps: getQueryProps,
  excludeFromClient: true,
  isCollectionLayout: true,
  contenttypes:"",
}