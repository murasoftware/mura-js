import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import OutputMarkup from "./OutputMarkup";
import CollectionNav from './CollectionNav';
import ItemDate from './ItemDate';
import CollectionReadMoreBtn from './CollectionReadMoreBtn';
import ItemCategories from './ItemCategories';
import NoItemsMessage from './NoItemsMessage';
import { getMura, getHref } from '@murasoftware/next-core';

const Cards = ({props,collection,setCollection,link}) => {
  const [pos, setPos] = useState(0);
  if (!collection.properties.totalpages){
    return(
      <NoItemsMessage />
    )
  }
  return (
    <>
      <div className={`row collectionLayoutCards row-cols-1 row-cols-sm-${props.rowcolssm} row-cols-md-${props.rowcolsmd} row-cols-lg-${props.rowcolslg} row-cols-xl-${props.rowcolsxl}`}>
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
  let catAssignments = [];
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
    catAssignments = item.getAll().categoryassignments;
    
    itemsList.push(    
    <div className="col mb-4" key={item.get('contentid')}>
      <Card className="mb-3 h-100 shadow">
        {
          fieldlist.filter(field => field == 'image').map(filteredField => (
            <Card.Img variant="top" src={item.get('images')[props.imagesize]} key={item.get('fileid')} />
          ))
        }
        <Card.Body>
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
                      <div className="mura-item-meta__date" key={`date${item.get('contentid')}`}>
                        <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                      </div>
                    );
                case "summary":
                  return <OutputMarkup source={item.get('summary')} key={field} />
                case "readmore":
                  return null
                default:
                  return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
              }        
            })
            }
          </div>
          {
            !fieldlist.includes('readmore') &&
              <Link href={getHref(item.get('filename'))} className="stretched-link"></Link>
          }
        </Card.Body>
        {(fieldlist.includes('readmore') || (catAssignments && props.showcategories)) &&
        <Card.Footer>
        {
          fieldlist.includes('readmore') &&
            <CollectionReadMoreBtn
              href={getHref(item.get('filename'))}
              ctatext="Read More"
              link={Link}
              key={item.get('contentid')}
            />
        }       
          
          {catAssignments && props.showcategories &&
            <>
              <hr />
              <Card.Text key="categories">
                <ItemCategories 
                  categories={catAssignments}
                  featuredonly={props.featuredcategoriesonly}
                />
              </Card.Text>
            </>
          }
        </Card.Footer>
        }
      </Card>
    </div>
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

export default Cards;

export const ModuleConfig={
  key: 'Cards',
  name: 'Cards',
  component: Cards,
  getQueryProps: getQueryProps,
  contentypes:"",
  configurator:[
    {"type":"fieldlist","name":"fields","label":"Display List"},
    {"type":"select","name":"rowcolsxl","label":"Columns > 1199px","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"4"},
    {"type":"select","name":"rowcolslg","label":"Columns > 991px","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"3"},
    {"type":"select","name":"rowcolsmd","label":"Columns > 767px","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"3"},
    {"type":"select","name":"rowcolssm","label":"Columns > 575px","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"2"},
    {"type":"select","name":"imagesize","label":"Image Size","labels":["Small","Medium","Large","Portrait","Landscape","Hero"],"options":["small","medium","large","portrait","landscape","hero"],"value":"landscape"},
    {"type":"radio","name":"showcategories","label":"Show Categories","labels":["Yes","No"],"options":["true","false"],"value":"false"},
    {"type":"radio","name":"featuredcategoriesonly","label":"Featured Categories Only","labels":["Yes","No"],"options":["yes","no"],"value":"no","condition":"this.showcategories==='true'"}
  ],
  excludeFromClient: true,
  isCollectionLayout: true,
}