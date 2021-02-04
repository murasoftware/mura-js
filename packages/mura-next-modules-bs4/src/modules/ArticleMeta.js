import React from 'react';
import ItemDate from './ItemDate';
import ItemCredits from './ItemCredits';
import ItemTags from './ItemTags';
import OutputMarkup from './OutputMarkup';

const ArticleMeta = (props) => {
    // console.log('fields ArticleMeta: ' + props.fields);
    
    const fields = props.fields ? props.fields : 'Date,Credits,Tags';
    const fieldlist = fields ? fields.toLowerCase().split(",") : [];
    const item = props.content;
    return (
        <div className="pb-4">
            {
                fieldlist.map(field => {
                    switch(field) {
                    case "title":
                        return (
                            <h1 key="title" key={field}>{item.title}</h1>
                        );
                    case "summary":
                        return (
                            <OutputMarkup source={item.summary} className="lead"key={field} />
                        );
                    case "date":
                    case "releasedate":
                        return (
                            <div className="mura-item-meta__date" key="date" key={field}>
                                <span>Published on: </span> <ItemDate releasedate={item.releasedate} lastupdate={item.lastupdate}></ItemDate>
                            </div>
                        );
                    case "credits":
                        if(item.credits){
                            return (
                                <ItemCredits credits={item.credits} key="credits" key={field} />
                            );
                        }
                    case "tags":
                        if(item.tags){
                            return (
                                <div className="mura-item-meta__tags" key="tags" key={field}>
                                    <span>Tags: </span><ItemTags tags={item.tags} key="tags" />
                                </div>
                            );
                        }                        
                    default:
                        return <div className={`mura-item-meta__${field}`} key={field} data-value={props.content[field]}>{props.content[field]}</div>
                    }
                })
            }
        </div>
    )
}

export default ArticleMeta;