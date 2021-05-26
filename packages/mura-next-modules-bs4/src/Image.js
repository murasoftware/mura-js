import React from 'react';
import OutputMarkup from "./OutputMarkup";

const Image =function(props) {
  let objectparams = Object.assign({},props);
  objectparams=objectparams || {};
	objectparams.src=objectparams.src||'';
	objectparams.alt=objectparams.alt||'';
	objectparams.caption=objectparams.caption||'';
	objectparams.imagelink=objectparams.imagelink||'';
  objectparams.fit=objectparams.fit||'';
  objectparams.imagelinktarget=objectparams.imagelinktarget||'';

  if(typeof objectparams.imagelinktarget==='string' && objectparams.imagelinktarget.toLowerCase()==='no'){
    objectparams.imagelinktarget="";
  }

	if(!objectparams.src){
		return '';
	}

  if(objectparams.imagelink){
    return (
      <figure>
        <a href={objectparams.imagelink} target={objectparams.imagelinktarget}>
          <Img {...objectparams} />
        </a>
        <FigCaption {...objectparams} />
      </figure>
  );
  } else {
    return (
      <figure style={{margin:"0px"}}>
         <Img {...objectparams} />
        <FigCaption {...objectparams} />
      </figure>
  );
  }
 
}

const FigCaption = ({caption}) => {
  if(caption && caption != '<p></p>'){
    return (
      <figcaption><OutputMarkup source={caption} /></figcaption>
    );
  } else {
    return '';
  }
}

const Img = (props) => {
  let currentDate = new Date();
  let timestamp = currentDate.getTime();
  let imageUrl = props.src + "?timestamp=timestamp";

  if(props.fit){
    return (
      <img src={imageUrl} alt={props.alt} loading="lazy" style={{height:"100%",width:"100%",objectFit:props.fit}} data-object-fit={props.fit} />
    );
  } else {
    return (
      <img src={imageUrl} alt={props.alt} loading="lazy" />
    )
  }
 
}


export default Image;
