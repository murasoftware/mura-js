import React from 'react';
import Head from 'next/head';

const ModalVideo = ({props,children}) => {

	const {modalcta,buttonclass,buttonplayiconsize,buttonctatext,showbuttonplayicon} = props;
	const openPlayer=function(){openVidyardLightbox(props.videoid); return false;};
	switch(modalcta) {
		case "button":
			return (
				<button
					type="button"
					onClick={openPlayer}
					className={`btn btn-${buttonclass}`}>
					{showbuttonplayicon ?
						<i className={`fas fa-play fa-${buttonplayiconsize} align-middle`}></i>
						:
						null
					}
					{buttonctatext}
					<Head>
					
					</Head>
				</button>
			)
			break;	

		default:
			return <div>Nah</div>
	}
}

export default ModalVideo;