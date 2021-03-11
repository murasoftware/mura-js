import Mura from 'mura.js';
import React, {useState,useEffect} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faLaptopHouse } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

const CollectionNav = (props) => {
	let nav = [];
	const {collection,setCollection,pos,nextn,setPos,scrollpages,instanceid,itemsTo,setItemsTo} = props;


	if(Mura.renderMode == 'static'){
		const items = collection.get('items');
		const maxItems = props.maxitems;
		const next = pos+nextn;
		const prev = pos > 0 ? pos-nextn > 0 ? pos-nextn : 0 : 0;
		let itemsOf = pos+nextn > items.length ? items.length : pos+nextn;
		let itemsToMax = items.length >= maxItems ? maxItems : items.length
		
		if (maxItems < items.length && pos+nextn > maxItems){
			itemsToMax = maxItems;
		}

		if(scrollpages){
			if(Mura.isInNode()){
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
				
				Mura(isEndVisible);
			}		

			return (
				<div className="mura-collection-end" data-instanceid={instanceid}/>
			)
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

	} else {

		if(scrollpages){	

			const [endindex,setEndindex]=useState(0);
	
			const isEndVisible = () => {
				const end=Mura(`div.mura-collection-end[data-instanceid="${instanceid}"]`);
				if(collection.has('next')){
					if(Mura.isScrolledIntoView(end.node) &&  endindex != collection.get('endindex')){
						setEndindex(collection.get('endindex'));
					} else {
						setTimeout(isEndVisible,50);
					}	
				}
			}

			useEffect(()=>{
				let isMounted = true;
				if(isMounted){
					collection.get('next').then(function(_collection){
						let incoming=_collection.getAll();

						collection.getAll().items.reverse().forEach((item)=>{
							incoming.items.unshift(item);
						});

						setCollection(new Mura.EntityCollection(incoming,Mura._requestcontext));
						setTimeout(isEndVisible,50);
					});	
				}
				return () => { isMounted = false };
			},[endindex]);

			if(!Mura.isInNode()){				
				Mura(isEndVisible);
			}
				
			return (
				<div className="mura-collection-end" data-instanceid={instanceid}/>
			)
		} else {

			const goToPage = function(page){
				let isMounted = true;
				if(isMounted){
					collection.get(page).then(function(_collection){
						if(isMounted){
							setCollection(_collection);
						}
					});
				}
				return () => { isMounted = false };
			}

			if(collection.has('previous')) {
				nav.push (
				<NavButton key="prev" val="previous" onItemClick={goToPage} label="Prev"/>
				)
			}
			
			if(collection.has('next')) {
				nav.push (
				<NavButton key="next" val="next" onItemClick={goToPage} label="Next"/>
				)
			}

		}

		if(nav.length){
			return (
			<div>
				<p>Displaying items {collection.get('startindex')}-{collection.get('endindex')} of {collection.get('totalitems')}</p>
				<ul className="pagination">
					{nav}
				</ul>
			</div>
			);
		} else {
			return '';
		}
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