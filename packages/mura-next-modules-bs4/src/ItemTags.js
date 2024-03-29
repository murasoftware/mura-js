import React from 'react';
import Badge from 'react-bootstrap/Badge';

function ItemTags(props){
    
    const Tags = props.tags.split(',');;
    let tagList = [];
    let tag = '';
    const variant = props.variant ? props.variant : 'primary';
    // console.log(props.tags);
    for(let i = 0;i < Tags.length;i++) {
        tag = Tags[i];
        tagList.push(
            <Badge variant={`${variant} mr-2`} key={tag}>{tag}</Badge>
        )
    }

    return tagList;

}

export default ItemTags;