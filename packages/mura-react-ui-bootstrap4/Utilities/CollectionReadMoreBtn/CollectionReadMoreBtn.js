import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

const CollectionReadMoreBtn = (props) => {
    const Link = props.link;
    return (
        <Link href={props.href} passHref className="stretched-link btn btn-primary">{props.ctatext}  <FontAwesomeIcon icon={faChevronRight} /></Link>
    )
  }

export default CollectionReadMoreBtn;