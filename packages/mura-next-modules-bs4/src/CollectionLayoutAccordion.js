import React, { useState } from "react";
import OutputMarkup from "./OutputMarkup";
import CollectionNav from './CollectionNav';
import ItemDate from './ItemDate';
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import CollectionReadMoreBtn from "./CollectionReadMoreBtn";
import ItemCredits from './ItemCredits';
import ItemTags from './ItemTags';
import ItemImage from './ItemImage';
import { getMura, getHref } from '@murasoftware/next-core';
/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/

export const CollectionLayoutAccordian = ({props,collection,setCollection,link}) => {
  const [pos, setPos] = useState(0);
  return (
    <>
      <Accordion className={`collectionLayoutAccordion ${props.accordionpadding}-spacing ${props.collapseindicators} ${props.collapseindicatorslocation}-indicator`}>
        <CurrentItems collection={collection} pos={pos} link={link} {...props} /> 
      </Accordion>

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

  const [activeId, setActiveId] = useState('0');

  function toggleActive(id) {
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  }

  // console.log(fieldlist);
  //console.log("image size: " + props.imagesize);

  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    itemsList.push(
      <Card key={item.get('contentid')}>
        <Accordion.Toggle as={Card.Header} variant="link" eventKey={item.get('contentid')} className={activeId === i ? 'open' : 'not-open'} onClick={() => toggleActive(i)} role="button">
          {item.get('title')}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={item.get('contentid')}>
          <Card.Body>
            {
                fieldlist.map(field => {
                  switch(field) {
                    case "image":
                        return(
                          <ItemImage image={item.get('images')[props.imagesize]} className="img-fluid" alt={item.get('title')} key="image" />
                        );
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
                            <CollectionReadMoreBtn
                              href={getHref(item.get('filename'))}
                              ctatext="Read More"
                              link={Link}
                              key={field}
                            />
                          )
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
          </Card.Body>
        </Accordion.Collapse>
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

export default CollectionLayoutAccordian;

export const ModuleConfig={
  key: 'CollectionLayoutAccordian',
  name: 'Accordian',
  component: CollectionLayoutAccordian,
  getQueryProps: getQueryProps,
  contentypes:"",
  configurator:[
    {"type":"fieldlist","name":"fields","label":"Display List"},
    {"type":"select","name":"imagesize","label":"Image Size","labels":["Small","Medium","Large","Portrait","Landscape","Hero"],"options":["small","medium","large","portrait","landscape","hero"],"value":"medium"},
    {"type":"select","name":"accordionpadding","label":"Padding","labels":["Tight","Normal","Loose"],"options":["tight","normal","loose"],"value":"nomral"},
    {"type":"select","name":"collapseindicators","label":"Indicator Type","labels":["Chevrons","Plus-Min"],"options":["chevrons","plus-min"],"value":"chevrons"},
    {"type":"select","name":"collapseindicatorslocation","label":"Indicator Location","labels":["Left","Right"],"options":["left","right"],"value":"right"}
  ],
  excludeFromClient: true,
  isCollectionLayout: true,
}