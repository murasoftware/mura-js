import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { getMura } from '@murasoftware/next-core';
import { getLayout, RouterlessLink, RouterLink, getSelectFields } from './Collection';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function getDefaultQueryPropsFromLayout(layout,item){
  if(layout){
    return layout.getQueryProps ? layout.getQueryProps(item) : {fields:''};
  } else {
    return  {fields:''};
  }
}

export function ResourceHub(props) {
  const Mura = getMura();
  // return('This is the resource hub');
  const objectparams = Object.assign({}, props);
  const DynamicCollectionLayout = getLayout(objectparams.layout).component;

  objectparams.fields=objectparams.fields || getDefaultQueryPropsFromLayout(DynamicCollectionLayout,objectparams).fields || 'Image,Date,Title,Summary,Credits,Tags';

  let tags = '';
  let author = '';
  if (!Mura.editing){
    const router = useRouter();
    tags = router.query.t;
    author = router.query.a;
  }  

  let _collection = false;
  //SET DEFAULTS FOR CURRENT FILTER PARAMETERS
  let _curSubtype = '*';
  let _curCategoryIds = '*';
  let _curPersonaId = '*';
  let _curCategoriesArray = [];
  let _hasMXP = false;

  if(objectparams.dynamicProps){
    _collection=new Mura.EntityCollection(objectparams.dynamicProps.collection,Mura._requestcontext);
    _curSubtype = objectparams.dynamicProps.filterprops.subtype;
    _curCategoryIds = objectparams.dynamicProps.filterprops.selectedcats.filter(sc => sc.instanceid == props.instanceid).map((item)=>item.value).join();
    _curPersonaId = objectparams.dynamicProps.filterprops.personaid;
    _curCategoriesArray = objectparams.dynamicProps.filterprops.selectedcats;
    _hasMXP = objectparams.dynamicProps.filterprops.hasmxp;
  }
  const [collection,setCollection]=useState(_collection);
  const instanceId = objectparams.instanceid;  

  const [curSubtype, setCurSubtype]=useState(_curSubtype);
  const [curCategoriesArray, setCurCategoriesArray]=useState(_curCategoriesArray);
  const [curCategoryIds, setCurCategoryIds]=useState(_curCategoryIds);
  const [curPersonaId, setCurPersonaId]=useState(_curPersonaId);
  const [curSearchText, setCurSearchText]=useState('');
  const [hasMXP, setHasMXP]=useState(_hasMXP);
  const [showTextSearch, setShowTextSearch]=useState(objectparams.showtextsearch);//objectparams.showtextsearch
  const [newFilter, setNewFilter]=useState(false);
  const [filterUpdated, setFilterUpdated]=useState(new Date().toString());
  
  useEffect(() => {
    let isMounted = true;
    return () => { isMounted = false };
  }, []);

  const handleSubmit = (e) => {
        e.preventDefault();
        setCurSearchText(curSearchText);
        setNewFilter(true);
        setFilterUpdated(new Date().toString());
  }
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
          // console.log('e.target.value: ', e.target.value);
          // console.log('curCategoryIds: ', curCategoryIds);
          
        }
        // console.log('instanceId: ', instanceId);
        setCurCategoriesArray(updateCategoryIds(e.target.name,e.target.value,curCategoriesArray,instanceId));
          setCurCategoryIds(getCategoryIds(curCategoriesArray.filter(sc => sc.instanceid == instanceId)));
          setNewFilter(true);
          setFilterUpdated(new Date().toString());
    }//switch    
  }

  if(!objectparams.dynamicProps){
    useEffect(() => {
      let isMounted = true;
      if (isMounted) {
        // setInstanceId(props.instanceid);
        getFilterProps(curSubtype,curCategoryIds,curPersonaId,curCategoriesArray,newFilter).then((filterProps) => {
          if (isMounted) {
            
            setHasMXP(filterProps.hasmxp);
            setCurSubtype(filterProps.subtype);
            setCurCategoryIds(filterProps.selectedcats.filter(sc => sc.instanceid == props.instanceid).map((item)=>item.value).join());
            setCurPersonaId(filterProps.personaid);
            setCurCategoriesArray(filterProps.selectedcats);
            if(isMounted){
              getCollection(props,filterProps,curSearchText,tags,author).then((collection) => {
                setCollection(collection);
              });
            }
          }
        });
      }
      return () => { isMounted = false };
    }, [filterUpdated])

    if(collection) {
    //   console.log('dynamic');
    
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
            handleSubmit={handleSubmit}
            curSearchText={curSearchText}
            setCurSearchText={setCurSearchText}
            showTextSearch={showTextSearch}
          />

          <DynamicCollectionLayout setCollection={setCollection} collection={collection} props={props} link={RouterlessLink}/>

        </div>
      )
    } else {
    //   console.log('empty');
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
            
            getCollection(props,filterProps,curSearchText,tags,author).then((collection) => {
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
            handleSubmit={handleSubmit}
            curSearchText={curSearchText}
            setCurSearchText={setCurSearchText}
            showTextSearch={showTextSearch}
        />
        <DynamicCollectionLayout setCollection={setCollection} collection={collection} props={props} link={RouterLink}/>
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

const getCollection = async (props,filterProps,curSearchText,tags,author) => {
  const Mura = getMura();
    
  let filterCategories = filterProps.categoryid;

  if(typeof props.content.getAll != 'undefined'){
      props.content=props.content.getAll();
  }
  if (filterProps.selectedcats.length){
    filterCategories = filterProps.selectedcats.filter(sc => sc.instanceid == props.instanceid).map((item)=>item.value);
    for( var i = 0; i < filterCategories.length; i++){ 
      if ( filterCategories[i] === '*') { 
        filterCategories.splice(i, 1); 
        i--; 
      }
    }
  }

  // console.log('filterProps.selectedcats: ', filterProps.selectedcats);

  let collection;

  try{
    const excludeIDList=props.content.contentid;
    const feed = Mura.getFeed('content');

    feed.prop('type').isIn('Page,Link,File');
    feed.andProp('path').containsValue(props.content.contentid);
    feed.andProp('contentid').isNotIn(excludeIDList);
    feed.expand('categoryassignments');
    feed.andProp('subtype').isNEQ('Author');
    feed.andProp('subtype').isNEQ('Confirmation');
    feed.andProp('subtype').isNEQ('Folder');
    feed.fields(getSelectFields(props));
    
    if(filterProps.subtype.length){
      feed.andProp('subtype').isEQ(filterProps.subtype);
    }
    
    if(filterCategories.length){
      feed.andProp('categoryid').isIn(filterCategories);
      feed.useCategoryIntersect(true);
    }
    
    if(curSearchText && curSearchText.length){
      feed.andOpenGrouping();
      feed.orProp('title').containsValue(curSearchText);
      feed.orProp('body').containsValue(curSearchText);
      feed.orProp('summary').containsValue(curSearchText);
      feed.closeGrouping();
    }
    
    if(tags){
      feed.andProp('tag').containsValue(tags);
    }
    
    if(author){
      feed.andProp('Credits').isEQ(author);
    }
    
    feed.maxItems(props.maxitems);

    
    if(Mura.renderMode !='static'){
      
      feed.itemsPerPage(props.nextn);
    } else {
      feed.itemsPerPage(0);
    }

    if(filterProps.personaid.length){
      collection = await feed.getQuery({sortBy:"mxpRelevance"});
    } else {
      collection = await feed.sort('releasedate','desc').getQuery();
    }
  } catch(e){
    console.log('error getting colleciton ',e)
  }
     
  return collection;
}

const getFilterProps = async (subtype,categoryid,personaid,selectedcategories,newfilter) => {
    const Mura = getMura();
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
    if(isMounted && categoryIds && categoryIds.length){
      getCategoriesInfo(categoryIds).then((data)=>{
        if(isMounted && data.items.length){
          setCategoriesArray(data.items);
        }
      });
     }
    if(isMounted && personaIds && personaIds.length){
      getPersonasInfo(personaIds).then((data)=>{
        if(isMounted && data.items.length){
          setPersonasArray(data.items);  
        }      
      });
    }   
    return () => { isMounted = false };
  }, []);

  return (
    <Form className="row row-cols-1 row-cols-sm-2 row-cols-lg-3" id="resource-filter-form" onSubmit={props.handleSubmit}>
        {props.showTextSearch &&
        <div className="col">
        <Form.Label>Search:</Form.Label>
        <InputGroup controlId="textSearch" className="text">
            <Form.Control 
                type="text"
                name="s"
                placeholder="Search"
                value={props.curSearchText}
                onChange={e => props.setCurSearchText(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="secondary" type="submit"><FontAwesomeIcon icon={faSearch} size="lg" /></Button>
            </InputGroup.Append>            
        </InputGroup>
        </div>
        }
      {subtypesArray && subtypesArray.length > 0 &&
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
  // console.log('curSelectValue: ', props.filterlabel, curSelectValue);
  return(
    <Form.Group controlId={`selectCategories${props.filterlabel}`} className="col topic">
      <Form.Label>{props.filterlabel}:</Form.Label>
        <Form.Control as="select" name={`categoryid${props.filterlabel}`} custom onChange={ props.updateFilter } value={curSelectValue}>
          <option value="*" key="All Categories">All {props.filterlabel}</option>
          {categoryKids.map((category, index) => (
            <option value={category.categoryid} key={index}>{category.name}</option>
          ))}
        </Form.Control>
    </Form.Group>
  )
}

const getCategoriesInfo = async (categoryIds) => {
    const Mura = getMura();
    const feed = Mura.getFeed('category');
          feed.findMany(categoryIds);

    const query = await feed.getQuery();
    const categories = query.getAll();
    // console.log('categories: ', categories);
    return categories
}

const getPersonasInfo = async (personaIds) => {
    const Mura = getMura();
    const feed = Mura.getFeed('persona');
          feed.findMany(personaIds);

    const query = await feed.getQuery();
    const personas = query.getAll();

  return personas
}

const getCategoryKidsInfo = async (categoryId) => {
    const Mura = getMura();
    const feed = Mura.getFeed('category');
          feed.prop('parentid').isEQ(categoryId);

    const query = await feed.getQuery();
    const categorykids = query.getAll();
    // console.log('categorykids: ', categorykids);
    return categorykids
}

const updateCategoryIds = (name,value,curCategoriesArray,InstanceId) => {
  let match = 0;
  // console.log('InstanceId: ', InstanceId);
    for (let i = 0; i < curCategoriesArray.length; i++) {
      if (curCategoriesArray[i].name === name) {
            curCategoriesArray[i].value = value;
            curCategoriesArray[i].instanceid = InstanceId;
          match = 1;
          break;
      }
    }
    if (!match){
        curCategoriesArray.push({ 
          name:name,
          value:value,
          instanceid:InstanceId
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