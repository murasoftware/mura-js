import react from 'react';

function ItemImage({image,className,alt}){
    const itemImage = image;
    if(typeof itemImage != 'undefined'){
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