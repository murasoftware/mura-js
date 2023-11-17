import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import OutputMarkup from "./OutputMarkup";
import CollectionNav from './CollectionNav';
import ItemDate from './ItemDate';
import CollectionReadMoreBtn from "./CollectionReadMoreBtn";
import ItemCredits from './ItemCredits';
import ItemTags from './ItemTags';
import { getMura, getHref } from '@murasoftware/next-core';

/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/
const AlternatingBoxes = ({props,collection,setCollection,link}) => {
  const [pos, setPos] = useState(0);
  return (
    <>
      <div className="collectionLayoutAlternatingBoxes">
          <CurrentItems collection={collection} pos={pos} link={link} {...props} /> 
      </div>
      <div className="row">
        <div className="col-12">
        <CollectionNav setCollection={setCollection} collection={collection} pos={pos} setPos={setPos} link={link} {...props} />
        </div>
      </div>
    </>
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
  const Mura = props.Mura || getMura();

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

      <Card className="border-0" key={item.get('contentid')}>
        <div className="row no-gutters align-items-stretch">
          <div className={`col-12 col-md-6 ${i % 2 == 0 ? "card-img-left" : "card-img-right  order-md-2"}`}>
            <Card.Img variant="top" src={item.get('images')[props.imagesize]} className="rounded-0" />
          </div>
          <div className="col-12 col-md-6 p-0">
            <Card.Body className="spacing-normal h-100">
              <div className="mura-item-meta">
                {
                fieldlist.map(field => {
                  switch(field) {
                    case "title":
                      return (
                        <Card.Title key={field}>{item.get('title')}</Card.Title>
                      )
                    case "date":
                    case "releasedate":
                        return (
                          <div className="mura-item-meta__date" key="date">
                            <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                          </div>
                        );
                    case "summary":
                      return <OutputMarkup source={item.get('summary')} key={field} />
                    case "readmore":
                      return(
                        <CollectionReadMoreBtn
                          href={getHref(item.get('filename'))}
                          ctatext="Read More"
                          link={Link}
                          key={item.get('contentid')}
                        />
                      );
                    case "credits":
                        if(item.get('credits').length){
                          return (
                            <div className="mura-item-meta__credits">
                              <ItemCredits credits={item.get('credits')} key="credits" />
                            </div>
                          );
                        }
                        return null;
                    case "tags":
                        return (
                            <div className="mura-item-meta__tags pb-2" key="tags">
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
            </Card.Body>
          </div>
        </div>
      </Card>
    );
  }

  return itemsList;
}

/*
  This is not required; it is used to retrieve the required fields when populated getStatic/getServerSide props
*/
export const getQueryProps = () => {
  const data = {};
  data['fields'] = "title,summary";

  return data;
};

export default AlternatingBoxes;

export const ModuleConfig={
  key: 'AlternatingBoxes',
  name: 'Alternating Boxes',
  component: AlternatingBoxes,
  getQueryProps: getQueryProps,
  contentypes:"",
  configurator:[
    {"type":"fieldlist","name":"fields","label":"Display List"},
    {"type":"select","name":"imagesize","label":"Image Size","labels":["Small","Medium","Large","Portrait","Landscape","Hero"],"options":["small","medium","large","portrait","landscape","hero"],"value":"landscape"}
  ],
  excludeFromClient: true,
  isCollectionLayout: true,
}