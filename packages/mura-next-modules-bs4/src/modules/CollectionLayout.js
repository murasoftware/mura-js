import { useEffect,useState } from "react";
import OutputMarkup from "./OutputMarkup";
import CollectionNav from './CollectionNav';

const CollectionLayout = ({props,collection,link}) => {
  const {nextn} = props;
  const items = collection.get('items');
  const [pos, setPos] = useState(0);
  const [itemsTo,setItemsTo]= useState((pos+nextn > items.length ? items.length : pos+nextn));

  useEffect(()=>{
    setItemsTo((pos+nextn > items.length ? items.length : pos+nextn));
  },[pos]);
  
  return (
    <div>
      <ul style={{'listStyle': 'none'}}>
        <CurrentItems collection={collection}  itemsTo={itemsTo} pos={pos} link={link} {...props} />
      </ul>
      <CollectionNav collection={collection}  itemsTo={itemsTo}  setItemsTo={setItemsTo} pos={pos} setPos={setPos} link={link} {...props} />   
    </div>
  )
}

const CurrentItems = (props) => {
  const {collection,link,pos,itemsTo} = props;
  let itemsList = [];
  let item = '';
  const Link = link;
  const items = collection.get('items');

  for(let i = pos;i < itemsTo;i++) {
    item = items[i];
    itemsList.push(
    <li key={item.get('contentid')}>
        <h1>
          <Link href={`/${item.get('filename')}`}>
            {item.get('title')}
          </Link>
        </h1>
        <OutputMarkup source={item.get('summary')}/>
    </li>
    );
  }

  return itemsList;
}

/*
  This is not required; it is used to retrieve the required fields when populated getStatic/getServerSide props
*/
export const getQueryProps = () => {
  const data = {};
  
  /*
    You wouldn't really need to set this because
    both of these are available in the default field list
  */
  data['fields'] = "title,summary";

  return data;
};

export default CollectionLayout;