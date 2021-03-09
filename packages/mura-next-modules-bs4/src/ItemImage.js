import React from 'react';

export const ItemImage = function ({image,className,alt}){
    const itemImage = image;
    if(typeof itemImage != 'undefined' && itemImage){
        return(
            <img
                src={itemImage}
                alt={alt}
                className={className}
            />
        )
    }
    return null;
}

export default ItemImage;