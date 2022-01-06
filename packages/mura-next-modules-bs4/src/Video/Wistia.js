import React, {useEffect} from 'react';
import Head from 'next/head';
import { getMura } from '@murasoftware/next-core';

function Wistia(props) {
	const Mura=getMura();
	const { instanceid, videoid, dynamicProps } = props;
	
	useEffect(() => {
		if(typeof dynamicProps == 'undefined'){
			const loader=Mura.loader();
			if(typeof window.Wistia == 'undefined'){
				loader.loadjs('https://fast.wistia.net/assets/external/E-v1.js',{async:true});
			}
			loader.loadjs('https://fast.wistia.com/embed/medias/${videoid}.jsonp',{async:true});
		}
	}, []);

	// j38ihh83m5
	return (
	  <div className="wistiaWrapper" id={`player-${instanceid}`}>
		<Head>
			<script async src='https://fast.wistia.net/assets/external/E-v1.js'></script>
			<script async src={`https://fast.wistia.com/embed/medias/${videoid}.jsonp`}></script>
		</Head>
		<div
			className="wistia_responsive_padding"
			style={{padding: '56.25% 0 0 0',position: 'relative'}}>
			<div
				className="wistia_responsive_wrapper"
				style={{height:'100%',left:0,position:'absolute',top:0,width:'100%'}}>
				<div
					className={`wistia_embed wistia_async_${videoid}`}
					seo='false'
					videofoam='true'
					style={{height:'100%',width:'100%'}}>&nbsp;</div>
				</div>
			</div>
	  </div>
	);
}

export default Wistia;