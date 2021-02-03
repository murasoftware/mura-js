import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

function CTAButton({buttontext,buttoncolor,buttonsize,buttonlink,buttontarget,buttonblock}) {

  var btnclass = `btn btn-${buttoncolor||'primary'}`;
  if (buttonsize != 'md'){
    btnclass = btnclass + ` btn-${buttonsize}`;
  }
  if (buttonblock){
    btnclass = btnclass + ` btn-block`;
  }

  return (
    <>
        <Link href={buttonlink||'https://www.murasoftware.com'} passHref>
          <a target={buttontarget||'_self'} className={btnclass} role="button">{buttontext || 'Press Me'} <FontAwesomeIcon icon={faChevronRight} /></a>
        </Link>
    </>
  );
}

export default CTAButton;