function Vimeo(props) {
	const { instanceid, videoid } = props;
	// 56282283
	return (
	  <div className="vimeoWrapper" id={`player-${instanceid}`}>
		<iframe
			src={`https://player.vimeo.com/video/${videoid}`}
			width="960"
			height="540"
			frameBorder="0"
			allow="autoplay; fullscreen"
			allowFullScreen>
		</iframe>		
	  </div>
	);
}

export default Vimeo;