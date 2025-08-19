
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CollectionReadMoreBtn = (props) => {
    const Link = props.link;
    const _target = props.target ? props.target : '';
    return (
        <Link href={props.href} passHref className="stretched-link btn btn-primary" target={_target}>{props.ctatext}  <FontAwesomeIcon icon={faChevronRight} /></Link>
    )
  }

export default CollectionReadMoreBtn;