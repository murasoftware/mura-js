import React from 'react';


function Youtube(props) {
  const { instanceid, videoid } = props;
  // z5DqB0cv8uw
  return (
    <div className="youtubeWrapper" id={`player-${instanceid}`}>
      <iframe
        title="Youtube Player"
        src={`//www.youtube.com/embed/${videoid}?rel=0&autoplay=0&vq=hd1080&controls=1`}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

export default Youtube;