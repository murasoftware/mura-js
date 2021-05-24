import React from 'react';

export const ItemDate = (props) => {
    let date = '';
    let formatteddate = '';
    
    if((props.releasedate != null && props.releasedate != '') || (props.lastupdate != null && props.lastupdate != '')) {
      if(props.releasedate){
        date = new Date(props.releasedate);
      } else {
        date = new Date(props.lastupdate);
      }
      formatteddate = Intl.DateTimeFormat("en-US", {year: "numeric",month: "long",day: "2-digit"}).format(date);
      return formatteddate
    }    

    return (
        null
    )
  }

  export default ItemDate;