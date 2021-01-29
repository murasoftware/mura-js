import React from 'react';
import ItemDate from '@mura/react/UI/Utilities/ItemDate';
import ItemCredits from '@mura/react/UI/Utilities/ItemCredits';
import ItemTags from '@mura/react/UI/Utilities/ItemTags';
import OutputMarkup from '../Utilities/OutputMarkup';

function ArticleMeta(props){
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
                            <h1 key="title">{item.title}</h1>
                        );
                    case "summary":
                        return (
                            <OutputMarkup source={item.summary} className="lead" />
                        );
                    case "date":
                    case "releasedate":
                        return (
                            <div className="mura-item-meta__date" key="date">
                                <span>Published on: </span> <ItemDate releasedate={item.releasedate} lastupdate={item.lastupdate}></ItemDate>
                            </div>
                        );
                    case "credits":
                        if(item.credits){
                            return (
                                <ItemCredits credits={item.credits} key="credits" />
                            );
                        }
                    case "tags":
                        if(item.tags){
                            return (
                                <div className="mura-item-meta__tags" key="tags">
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