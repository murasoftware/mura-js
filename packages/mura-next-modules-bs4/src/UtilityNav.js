import React from 'react';

export function UtilityNav(props) {
	return (
		<div className="mura-utility-links">
			<UtilityLinks {...props} />
		</div>
	) 
	
}

const UtilityLinks = (props) => {
	const CustomLinks = props.customlinks ? Array.from(props.customlinks) : [];

	if (CustomLinks && CustomLinks.length){
		const UtilityLinks = CustomLinks.map((link,index) => 
		<li className="list-inline-item" key={index}>
			<a href={link.value} target={props.linktarget && props.linktarget != "_self" ? props.linktarget : ''}>{link.name}</a>
		</li>
		);
		return (
			<ul className="list-inline">
				{UtilityLinks}
			</ul>
		)
	}
	return null    
}

export default UtilityNav;