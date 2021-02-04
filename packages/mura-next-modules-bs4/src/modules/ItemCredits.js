import React from 'react';

const ItemCredits = (props) => {
    const Credits = props.credits.split(',');
    let creditsList = [];
    let credit = '';
    // console.log(props.tags);
    for(let i = 0;i < Credits.length;i++) {
        credit = Credits[i];
        creditsList.push(
            <div className="mura-item-meta__credits pb-2" key={credit}>
                By: <strong>{credit}</strong>
            </div>
        )
    }

    return creditsList;
}

export default ItemCredits;