import React, { useEffect, useState } from 'react';

export function UtilityNav(props) {
	const objectparams = Object.assign({}, props);

	if (!objectparams.dynamicProps) {
		return (
			<div className="mura-utility-links">
				<UtilityLinks {...props} />
			</div>
		) 
	} else {
		return (
			<div className="mura-utility-links"></div>
		)
	}
}

const UtilityLinks = (props) => {
	const CustomLinks = props.customlinks ? Array.from(props.customlinks) : [];
	console.log('props: ', props);
	if (CustomLinks && CustomLinks.length){
		const UtilityLinks = CustomLinks.map((link) => 
		<li className="list-inline-item" key={link.name}>
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