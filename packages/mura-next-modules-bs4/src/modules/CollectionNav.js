import Mura from 'mura.js';
import {useEffect} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const CollectionNav = (props) => {
	const {collection,pos,nextn,setPos,scrollpages,instanceid,itemsTo,setItemsTo} = props;
	const items = collection.get('items');
	const maxItems = props.maxitems;
	// console.log('maxItems (collectionNav): ' + maxItems);

	if(scrollpages){
		useEffect(()=>{
			if(!Mura.isInNode()){
				const isEndVisible = () => {
					const end=Mura(`div.mura-collection-end[data-instanceid="${instanceid}"]`);
					if(itemsTo  && maxItems && Mura.isScrolledIntoView(end.node)){
						if(itemsTo < (maxItems)){
							setItemsTo(itemsTo+1);
						}
					} else if(itemsTo < (maxItems)){
						setTimeout(isEndVisible,50);
					}
					
				}
				isEndVisible();
			}	
		},[]);

		return (
			<div className="mura-collection-end" data-instanceid={instanceid}/>
		)
	}

	const next = pos+nextn;
	const prev = pos > 0 ? pos-nextn > 0 ? pos-nextn : 0 : 0;
	let itemsOf = pos+nextn > items.length ? items.length : pos+nextn;
	let itemsToMax = items.length >= maxItems ? maxItems : items.length
	let nav = [];

	if (maxItems < items.length && pos+nextn > maxItems){
		itemsToMax = maxItems;
	}

	if(pos > 0) {
		nav.push (
		  <NavButton key="prev" pos={pos} val={prev} onItemClick={setPos} label="Prev"/>
		)
	  }
	
	  if(next<itemsToMax) {
		nav.push (
		  <NavButton key="next" pos={pos} val={next} onItemClick={setPos} label="Next"/>
		)
	  }
	
	if(nav.length){
		return (
		<div>
			<p>Displaying items {pos+1}-{itemsOf} of {itemsToMax}</p>
			<ul className="pagination">
				{nav}
			</ul>
		</div>
		);
	} else {
		return '';
	}
  }
  
  const NavButton = props => {
	let {val,onItemClick} = props;
  
	const _onClick = () => {
	  onItemClick(val);
	}

	
	return (
	  <li className="page-item">
	  	<a onClick={_onClick} className="page-link" aria-label={props.label}><NavButtonLabel label={props.label} /></a>
	  </li>
	)
  }

  const NavButtonLabel = props => {
	if (props.label == 'Next'){
		return(
			<>
				{props.label} <FontAwesomeIcon icon={faChevronRight} />
		  	</>
		)
	} else {
		return(
			<>
				<FontAwesomeIcon icon={faChevronLeft} /> {props.label}
		  	</>
		)
	}
  }
  
  export default CollectionNav;