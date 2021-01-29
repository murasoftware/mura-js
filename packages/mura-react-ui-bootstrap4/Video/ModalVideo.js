import Head from 'next/head';

const ModalVideo = ({props,children}) => {

	const {modalcta,buttonclass,buttonplayiconsize,buttonctatext,showbuttonplayicon} = props;

	switch(modalcta) {
		case "button":
			return (
				<button
					type="button"
					onclick="openVidyardLightbox('#esapiEncode('html',objectparams.videoid)#'); return false;"
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