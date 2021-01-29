const ItemDate = (props) => {
    let date = '';
    let formatteddate = '';
  
    if(props.releasedate){
      date = new Date(props.releasedate);
    } else {
      date = new Date(props.lastupdate);
    }
    //console.log(date);
    
    formatteddate = Intl.DateTimeFormat("en-US", {year: "numeric",month: "long",day: "2-digit"}).format(date);

    return (
        formatteddate
    )
  }

  export default ItemDate;