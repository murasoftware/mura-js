import React, { useState } from "react";
import OutputMarkup from "./OutputMarkup";
import CollectionNav from './CollectionNav';
import ItemDate from './ItemDate';
import CollectionReadMoreBtn from './CollectionReadMoreBtn';
import ItemCredits from './ItemCredits';
import ItemTags from './ItemTags';
import ItemImage from './ItemImage';
import { getMura, getHref } from '@murasoftware/next-core';

/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/
const List = ({props,collection,setCollection,link}) => {
  const [pos, setPos] = useState(0);
  return (
    <div className="collectionLayoutList">
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
  const {collection,nextn,link,pos,fields,scrollpages} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  let itemsTo = pos+nextn > items.length ? items.length : pos+nextn;
  const fieldlist = fields ? fields.toLowerCase().split(",") : [];
  const maxItems = props.maxitems;
  console.log('itemsTo', itemsTo);
  console.log('pos', pos);
  
  if(getMura().renderMode != 'static' && scrollpages){
    itemsTo=items.length;
  } else {
    if (maxItems < items.length && pos+nextn > maxItems){
      itemsTo = maxItems;
    }
  }
  
  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    // console.log(item);

    itemsList.push(
      <div className="row mb-3" key={item.get('contentid')}>
        <ListImage fieldlist={fieldlist} item={item} imagesize={props.imagesize} />
        <ListMeta fieldlist={fieldlist} item={item} Link={Link} />
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
  const {fieldlist, item, Link} = props;

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
    <div className={hasImage ? 'col-12 col-md-9 py-3' : 'col-12 py-3'}>
        <div className="mura-item-meta">
        {
            fieldlist.map(field => {
              switch(field) {
                case "title":
                  return (
                    <div className="mura-item-meta__title" key={field}>
                      <h3>{item.get('title')}</h3>
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
                          <ItemCredits credits={item.get('credits')} key="credits" />
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
        {
          !fieldlist.includes('readmore') &&
            <Link href={getHref(item.get('filename'))} className="stretched-link"></Link>
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

export default List;