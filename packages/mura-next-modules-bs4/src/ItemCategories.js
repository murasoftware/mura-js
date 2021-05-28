import React from "react";

export const ItemCategories = (props) => {
    const Categories = props.categories;
    let catsList = [];
    let cat = '';
    let cats = Categories.items;
    let Featuredonly = 0;
    let hasnext = false;
    const Parentcatname = props.parentcatname;

    if (props.featuredonly == "yes"){
        Featuredonly = 1;
    }
    // console.log('Featuredonly: ', Featuredonly);

    //filter for featured categories
    if(cats.length > 1 && Featuredonly){
        const filteredCats = cats.filter(category => category.isfeature == 1);
        if(filteredCats.length > 1){
            cats = filteredCats[0];
        } else {
            cats = filteredCats;
        }        
    }
    

    if (cats && cats.length){
        let catsTo = cats.length;

        for(let i = 0;i < catsTo;i++) {
          cat = cats[i];
          hasnext = i+1 < catsTo;
          
          catsList.push(
              <span key={cat.categoryid}>{cat.categoryname}{hasnext && `, ` }</span>
          ) 
        }
    }
    return catsList
}

export default ItemCategories;