import React,{useState,useEffect} from 'react';
import Mura from 'mura.js';
import Form from 'react-bootstrap/Form';
import {getLayout,RouterlessLink,RouterLink} from './Collection';
/*
  TODO: scrollpages -- not sure if this is even working at all in collection in NextJS, should test
*/

function ResourceHub(props) {
  // return('This is the resource hub');
  const objectparams = Object.assign({}, props);
  const DynamicCollectionLayout = getLayout(objectparams.layout).component;

  let _collection = false;
  if(objectparams.dynamicProps){
    _collection=new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext);
  }
  const [collection,setCollection]=useState(_collection);
  
  //console.log(objectparams.dynamicProps);

  //SET DEFAULTS FOR CURRENT FILTER PARAMETERS
  const _curSubtype = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.subtype : '*';
  const _curCategoryIds = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.categoryid : '*';
  const _curPersonaId = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.personaid : '*';
  const _curCategoriesArray = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.selectedcats : [];
  const _hasMXP = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.hasmxp : false;

  const [curSubtype, setCurSubtype]=useState(_curSubtype);
  const [curCategoriesArray, setCurCategoriesArray]=useState(_curCategoriesArray);
  const [curCategoryIds, setCurCategoryIds]=useState(_curCategoryIds);
  const [curPersonaId, setCurPersonaId]=useState(_curPersonaId);
  const [hasMXP, setHasMXP]=useState(_hasMXP);
  const [newFilter, setNewFilter]=useState(false);
  const [filterUpdated, setFilterUpdated]=useState(new Date().toString());
  
  const updateFilter = (e) => {
    switch(e.target.name) {
      case 'subtype':
        let subtype = e.target.value;
        if (subtype != curSubtype) {
          setCurSubtype(subtype);
          setNewFilter(true);
          setFilterUpdated(new Date().toString());
        }
        break
      case 'personaid':
        let personaid = e.target.value;
        if (personaid != curPersonaId){
          setCurPersonaId(personaid);
          setNewFilter(true);
          setFilterUpdated(new Date().toString());
        }
        break
      default:
        if (!curCategoryIds.includes(e.target.value)){
          setCurCategoriesArray(updateCategoryIds(e.target.name,e.target.value,curCategoriesArray));
          setCurCategoryIds(getCategoryIds(curCategoriesArray));
          setNewFilter(true);
          setFilterUpdated(new Date().toString());
        }        
    }//switch    
  }

  if(!objectparams.dynamicProps){

    useEffect(() => {
      let isMounted = true;
      if (isMounted) {
        getFilterProps(curSubtype,curCategoryIds,curPersonaId,curCategoriesArray,newFilter).then((filterProps) => {
          if (isMounted) {
            setHasMXP(filterProps.hasmxp);
            setCurSubtype(filterProps.subtype);
            setCurCategoryIds(filterProps.categoryid);
            setCurPersonaId(filterProps.personaid);
            setCurCategoriesArray(filterProps.selectedcats);
            if(isMounted){
              getCollection(props,filterProps).then((collection) => {
                setCollection(collection);
              });
            }
          }
        });
      }
      return () => { isMounted = false };
    }, [filterUpdated])

    if(collection) {
      console.log('dynamic');
      return (
        <div>
          <RenderFilterForm 
            updateFilter={updateFilter}
            {...props}
            curSubtype={curSubtype}
            curCategoryId={curCategoryIds}
            curPersonaId={curPersonaId}
            curCategoriesArray={curCategoriesArray}
            hasMXP={hasMXP}
          />

          <DynamicCollectionLayout collection={collection} props={props} link={RouterlessLink}/>

        </div>
      )
    } else {
      console.log('empty');
      return (
        <div>{/* EMPTY COLLECTION */}</div>
      )
    }

  } else {
    console.log('ssr');
    useEffect(() => {
      let isMounted = true;
      if (isMounted) {
        getFilterProps(curSubtype,curCategoryIds,curPersonaId,curCategoriesArray,newFilter).then((filterProps) => {
          if(isMounted){
            setHasMXP(filterProps.hasmxp);
            setCurSubtype(filterProps.subtype);
            setCurCategoryIds(filterProps.categoryid);
            setCurPersonaId(filterProps.personaid);
            setCurCategoriesArray(filterProps.selectedcats);
            
            getCollection(props,filterProps).then((collection) => {
              if(isMounted){
                setCollection(collection);
              }
            })
          }
        });
      }
      return () => { isMounted = false };
    }, [filterUpdated])

    return (
      <div>
        <RenderFilterForm 
          updateFilter={updateFilter}
          {...props}
          curSubtype={curSubtype}
          curCategoryId={curCategoryIds}
          curPersonaId={curPersonaId}
          curCategoriesArray={curCategoriesArray}
          hasMXP={hasMXP}
        />
        <DynamicCollectionLayout collection={collection} props={props} link={RouterLink}/>
      </div>
    )

  }
}

const getCategoryIds = categories => {
  let categoriesList;
  for (let i = 0; i < categories.length; i++){
    if (categories[i].value != '*'){
      if (i < 1){
        categoriesList = categories[i].value;
      } else {
        categoriesList = categoriesList + ',' + categories[i].value;
      }
    }
  }
  
  if (categoriesList == undefined){
    categoriesList = '*';
  }
  return categoriesList
}

export const getDynamicProps = async props => {
  const filterProps = await getFilterProps('','','','',false);
  const collection = await getCollection(props,filterProps);
  if(!Array.isArray(filterProps.selectedcats)){
    try{
      filterProps.selectedcats = JSON.parse(filterProps.selectedcats);
    }catch(e){
      filterProps.selectedcats = [];
    }
  }
  return{
    collection:collection.getAll(),
    filterprops:filterProps
  }
}

const getCollection = async (props,filterProps) => {
  if(typeof props.content.getAll != 'undefined'){
      props.content=props.content.getAll();
  }

  const excludeIDList=props.content.contentid;

  const feed = Mura.getFeed('content');

      feed.prop('type').isIn('Page,Link,File');
      feed.andProp('path').containsValue(props.content.contentid);
      feed.andProp('contentid').isNotIn(excludeIDList);
      feed.expand('categoryassignments');

      if(filterProps.subtype.length){
        feed.andProp('subtype').isEQ(filterProps.subtype);
      }
      if(filterProps.categoryid.length){
        feed.andProp('categoryid').isIn(filterProps.categoryid);
        feed.useCategoryIntersect(true);
      }
      feed.maxItems(props.maxitems);
      feed.itemsPerPage(0);

      let collection;

      if(filterProps.personaid.length){
        collection = await feed.getQuery({sortBy:"mxpRelevance"});
      } else {
        collection = await feed.sort('releasedate','desc').getQuery();
      }
  return collection;
}

const getFilterProps = async (subtype,categoryid,personaid,selectedcategories,newfilter) => {
  const Subtype = subtype;
  const Categoryid = categoryid;
  const Personaid = personaid;
  const CurSelectedCats = selectedcategories;
  const NewFilter = newfilter;

  
  const filterProps = await Mura
    .getEntity('resourcehub')
    .invoke(
      'processFilterArgs',
      {
        subtype:Subtype, 
        categoryid:Categoryid, 
        personaid:Personaid, 
        selectedcats:CurSelectedCats, 
        newfilter: NewFilter?1:0
      }
    );
  
  // console.log('filterProps: ', filterProps);
  return filterProps;
}

const RenderFilterForm = (props) => {
  const objectparams = Object.assign({}, props);
  const [categoriesArray,setCategoriesArray]=useState(false);
  const [personasArray,setPersonasArray]=useState(false);

  const subtypesArray = objectparams.subtypes ? objectparams.subtypes.split(',') : [];
  const categoryIds = objectparams.categoryids ? objectparams.categoryids.split(',') : [];
  const personaIds = objectparams.personaids ? objectparams.personaids.split(',') : [];

  useEffect(() => {
    let isMounted = true;
    if(isMounted && personaIds.length){
      getCategoriesInfo(categoryIds).then((data)=>{
        if(isMounted && data.items.length){
          setCategoriesArray(data.items);
        }
      });
     }
    if(isMounted && personaIds.length){
      getPersonasInfo(personaIds).then((data)=>{
        if(isMounted && data.items.length){
          setPersonasArray(data.items);  
        }      
      });
    }   
    return () => { isMounted = false };
  }, []);
  
  return (
    <Form className="row row-cols-1 row-cols-sm-2 row-cols-lg-3" id="resource-filter-form">
      {subtypesArray.length > 0 &&
      <Form.Group controlId="selectSubtypes" className="col type">
        <Form.Label>Content Types:</Form.Label>
        <Form.Control as="select" name="subtype" custom onChange={ props.updateFilter } value={props.curSubtype}>
          <option value="*" key="All Subtypes">All</option>
          {subtypesArray.map((subtype, index) => (
            <option value={subtype} key={index}>{subtype}</option>
          ))}
        </Form.Control>
      </Form.Group>
      }
      {categoriesArray && categoriesArray.length > 0 &&
      <>
        {categoriesArray.map((category, index) => (
          <CategorySelect categoryid={category.categoryid} filterlabel={category.name} updateFilter={props.updateFilter} curCategoryId={props.curCategoryId} key={category.categoryid} curCategoriesArray={props.curCategoriesArray} />
        ))}
      </>
      }
      {props.hasMXP && personasArray.length > 0 &&
      <Form.Group controlId="selectPersonas" className="col topic">
      <Form.Label>Audience:</Form.Label>
        <Form.Control as="select" name="personaid" custom onChange={ props.updateFilter } value={props.curPersonaId}>
          <option value="*" key="All Personas">All</option>
          {personasArray.map(option => (
            <option value={option.personaid} key={option.personaid}>{option.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      }
    </Form>
  );
}

const CategorySelect = props => {
  const [categoryKids,setCategoryKids]=useState([]);
  let curSelectValue = '*';

  useEffect(() => {
    let isMounted = true;
    getCategoryKidsInfo(props.categoryid).then((data)=>{
      if (isMounted) {
        setCategoryKids(data.items);
      }
    });

    return () => { isMounted = false };
  }, []);  
  
  for (let i=0; i < categoryKids.length; i++){
      if (props.curCategoryId.includes(categoryKids[i].categoryid)){
        curSelectValue = categoryKids[i].categoryid;
        break
      }
  }

  return(
    <Form.Group controlId={`selectCategories${props.filterlabel}`} className="col topic">
      <Form.Label>{props.filterlabel}:</Form.Label>
        <Form.Control as="select" name={`categoryid${props.filterlabel}`} custom onChange={ props.updateFilter } value={curSelectValue}>
          <option value="*" key="All Categories">All</option>
          {categoryKids.map((category, index) => (
            <option value={category.categoryid} key={index}>{category.name}</option>
          ))}
        </Form.Control>
    </Form.Group>
  )
}

const getCategoriesInfo = async (categoryIds) => {
  const feed = Mura.getFeed('category');
        feed.findMany(categoryIds);

  const query = await feed.getQuery();
  const categories = query.getAll();

  return categories
}

const getPersonasInfo = async (personaIds) => {
  const feed = Mura.getFeed('persona');
        feed.findMany(personaIds);

  const query = await feed.getQuery();
  const personas = query.getAll();

  return personas
}

const getCategoryKidsInfo = async (categoryId) => {
  const feed = Mura.getFeed('category');
        feed.prop('parentid').isEQ(categoryId);

  const query = await feed.getQuery();
  const categorykids = query.getAll();

  return categorykids
}

const updateCategoryIds = (name,value,curCategoriesArray) => {
  let match = 0;

    for (let i = 0; i < curCategoriesArray.length; i++) {
      if (curCategoriesArray[i].name === name) {
            curCategoriesArray[i].value = value;
          match = 1;
          break;
      }
    }
    if (!match){
        curCategoriesArray.push({ 
          name:name,
          value:value 
        });
    }
  
  return curCategoriesArray;
}


//for debugging only
const replacerFunc = () => {
  const visited = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};

export default ResourceHub;