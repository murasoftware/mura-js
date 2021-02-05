import Head from 'next/head';
import Mura from 'mura.js';

function Vidyard(props) {
	const { instanceid, videoid } = props;
	return (
		<div
			id={`player-${instanceid}`}
			className="vidyard-player-embed"
			data-uuid={videoid}
			data-v="4"
			data-type="lightbox">
		<Head>
			<script src="https://play.vidyard.com/embed/v4.js"></script>
			<script src={`${Mura.rootpath}'/core/modules/v1/video/js/video_module.js`}></script>
		</Head>
		</div>
	);
}

export default Vidyard;


/* <iframe
			id={`vidyard_iframe_${videoid}`}
			className="vidyard_iframe"
			src={`//play.vidyard.com/${videoid}?v=3.1&amp;type=inline&amp;autoplay=0&amp;marketo_id=id%253A922-ZEZ-237%2526token%253A_mch-nvoicepay.com-1573492811083-52558&amp;referring_url=https%253A%252F%252Fcontent.nvoicepay.com%252Fcustomer-stories&amp;`}
			title="Video"
			aria-label="Video"
			scrolling="no"
			allowtransparency="true"
			allowfullscreen=""
			allow="autoplay"
			style={{opacity: 1,'background-color': 'transparent',position: 'absolute',right: '0px',top: '0px'}}
			width="100%"
			height="100%"
			frameborder="0"></iframe> */