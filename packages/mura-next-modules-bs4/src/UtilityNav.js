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

export const ModuleConfig={
	name: "UtilityNav",
	label: "Utility Nav",
	component: UtilityNav,
	excludeFromClient: false,
	isCollectionLayout: false,
	contenttypes:"*",
	iconclass:"mi-navicon",
	configurator:[
		{
			"type":"select",
			"name":"linktarget",
			"label":"Link Target",
			"options":[
				"",
				"_self",
				"_top",
				"_blank"
			]
		},
		{
			"type":"name_value_array",
			"name":"customlinks",
			"label":"Links"
		}
	]
  }