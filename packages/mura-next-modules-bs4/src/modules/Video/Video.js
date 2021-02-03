import Youtube from './Youtube';
import Vimeo from './Vimeo';
//import Vidyard from './Vidyard';
import Wistia from './Wistia';
import ModalVideo from './ModalVideo';
import {videoConfig} from './videoConfig';

const getVideoPlayer = props => {
  const players = {};
  players['youtube'] = Youtube(props);
  players['vimeo'] = Vimeo(props);
  players['wistia'] = Wistia(props);
  //players['vidyard'] = Vidyard(props);

  return players[props.videoplatform];
};

function Video(props) {

  const { displaytype, videoid, videoplatform } = props;
  const {modalsize} = videoConfig;
  if(!videoplatform.length) {
    return <div>Video platform missing.</div>
  }
  else if(!videoid) {
    return <div>Video id missing.</div>
  }
  else {
    if(displaytype === 'modal') {
      return (
      <ModalVideo props={props}>
        {getVideoPlayer(props)}
      </ModalVideo>
      )
    }
    else {
      return getVideoPlayer(props);
    }
  }
}

export default Video;
