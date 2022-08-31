import React from 'react';
import ItemDate from './ItemDate';
import ItemCredits from './ItemCredits';
import ItemTags from './ItemTags';
import OutputMarkup from './OutputMarkup';

export const ArticleMeta = (props) => {
    // console.log('fields ArticleMeta: ' + props.fields);
    
    const fields = props.fields ? props.fields : '';
    const fieldlist = fields ? fields.toLowerCase().split(",") : [];
    const titleclass = props.titleclass ? props.titleclass : '';    
    const item = props.content;
    let catAssignments = item.categoryassignments;
    let FeaturedCategoryOnly = "no";
    if (props.featuredcategoryonly){
        FeaturedCategoryOnly = "yes";
    }
    // console.log('fieldlist: ' + fieldlist);
    return (
        <div className="mura-article-meta">
            {
                fieldlist.map(field => {
                    switch(field) {
                    case "category":
                        return (
                            <div key={field} className="mura-item-meta__category">
                                <ItemCategories categories={catAssignments} featuredonly={FeaturedCategoryOnly} />
                            </div>
                        );
                    case "title":
                        return (
                            <h1 key="title" className={titleclass}>{item.title}</h1>
                        );
                    case "menutitle":
                        return (
                            <p key="menutitle" className="mura-item-meta__menutitle">{item.menutitle}</p>
                        );
                    case "summary":
                        return (
                            <OutputMarkup source={item.summary} className="lead" key={field} />
                        );
                    case "date":
                    case "releasedate":
                        return (
                            <span className="mura-item-meta__date" key={field}>
                               <ItemDate releasedate={item.releasedate} lastupdate={item.lastupdate}></ItemDate>
                            </span>
                        );
                    case "credits":
                        if(item.credits){
                            return (
                                <ItemCredits credits={item.credits} key={field} />
                            );
                        }
                        return null
                    case "tags":
                        if(item.tags){
                            return (
                                <div className="mura-item-meta__tags" key={field}>
                                    <ItemTags tagshref="/blog/" tags={item.tags} />
                                </div>
                            );
                        }
                        return null
                    default:
                        return <div className={`mura-item-meta__${field}`} key={field} data-value={props.content[field]}>{props.content[field]}</div>
                    }
                })
            }
        </div>
    )
}

export default ArticleMeta;