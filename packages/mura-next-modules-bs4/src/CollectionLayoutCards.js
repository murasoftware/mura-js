import { useState } from "react";
import React from 'react';
import Card from 'react-bootstrap/Card';
import OutputMarkup from "./OutputMarkup";
import CollectionNav from './CollectionNav';
import ItemDate from './ItemDate';
import CollectionReadMoreBtn from './CollectionReadMoreBtn';
import ItemCategories from './ItemCategories';
import NoItemsMessage from './NoItemsMessage';
/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/
const Cards = ({props,collection,link}) => {
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
        <CollectionNav collection={collection} pos={pos} setPos={setPos} link={link} {...props} />
        </div>
      </div>
    </>
  )
}

const CurrentItems = (props) => {
  const {collection,nextn,link,pos,fields} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');
  let itemsTo = pos+nextn > items.length ? items.length : pos+nextn;
  const fieldlist = fields ? fields.toLowerCase().split(",") : [];
  const maxItems = props.maxitems;
  // console.log('fieldlist: ' + fieldlist);
  let catAssignments = [];

  if (maxItems < items.length && pos+nextn > maxItems){
    itemsTo = maxItems;
  }
  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    //categoryassignments require the feed to be expanded to include them
    //the feed in resource hub is expanded but collection is not
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
                default:
                  return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
              }        
            })
            }
          </div>
        </Card.Body>
        <Card.Footer>
          <CollectionReadMoreBtn
            href={`/${item.get('filename')}`}
            ctatext="Read More"
            link={Link}
            key={item.get('contentid')}
          />
          
          {catAssignments &&
            <>
              <hr />
              <Card.Text key="categories"><ItemCategories categories={catAssignments} /></Card.Text>
            </>
          }
        </Card.Footer>

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