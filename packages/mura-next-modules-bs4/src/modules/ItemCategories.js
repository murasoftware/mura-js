const ItemCategories = (props) => {
    const Categories = props.categories;
    // console.log('category assignments ItemCategories: ', Categories);
    let catsList = [];
    let cat = '';
    const cats = Categories.items;
    let catsTo = cats.length;
    let hasnext = false;
  
    // console.log('getCategories categories: ' + JSON.stringify(cats, undefined, 2));
    
    if (cats.length){
        for(let i = 0;i < catsTo;i++) {
        cat = cats[i];
        hasnext = i+1 < catsTo;
  
        catsList.push(
          <span key={cat.categoryid}>{cat.categoryname}{hasnext && `, ` }</span>
        )
  
      }
      return catsList;
    }
    return (
      <span>No Categories</span>
    )
}

export default ItemCategories;