import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { getMura, getHref } from '@murasoftware/next-core';
import SearchForm from './SearchForm';

function PrimaryNav(props) {
  const objectparams = Object.assign({}, props);
  //console.log(props)

  if(!objectparams.dynamicProps || !objectparams.dynamicProps.items){
    const [items, setItems]=useState('');

    useEffect(() => {
        getDynamicProps(objectparams).then((dynamicProps)=>{
          setItems(dynamicProps.items);
        });
    },[]);

    if(items){
      return (
        <Render items={items} link={RouterlessLink} {...props} />
      );
    } else {
      return (
        <div></div>
        );
    }
  } else {
    return (
      <Render items={objectparams.dynamicProps.items} link={RouterLink} {...props} />
    );
  }
}

const Render = (props) => {
   /* 
    In new development you should use this. 
    const { Mura } = props; 

    This pattern is for legacy support 
    const Mura = props.Mura || getMura();
  */
    const Mura = props.Mura || getMura();
    const Link=props.link;
    const homeNavIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path d="M16 8.5l1.53 1.53l-1.06 1.06L10 4.62l-6.47 6.47l-1.06-1.06L10 2.5l4 4v-2h2v4zm-6-2.46l6 5.99V18H4v-5.97zM12 17v-5H8v5h4z" fill="#626262"/></svg>';
   
    return (
      <Navbar bg="white" variant="light" expand="lg" className="navbar-static-top py-0"  collapseOnSelect>
      <div className="container-xl">
        <Link
          href={'/'}
          className="navbar-brand"
          type="navbarbrand"
          navlogo={props.navlogo} />
        <Navbar.Toggle aria-controls="primary-nav" />
        <Navbar.Collapse id="primary-nav">
          <Nav className="ml-auto">

            <Homelink displayhome={props.displayhome} link={Link} navicon={homeNavIcon} Mura={Mura} />
            
            {
              props.items.map(item => {
                  return (  
                    <NavLinkDropdown key={item.contentid} contentid={item.contentid} filename={item.filename} menutitle={item.menutitle} kids={item.kids} link={Link} navicon={item.navicon} />
                  )
              })
            }
            {props.content && props.content.translations && (
                <LangOptions translations={props.content.translations} />
              )
            }
            </Nav>
            {props.displaysearch &&
              <SearchForm />
            }
          </Navbar.Collapse>
        </div>
      </Navbar>
    )
};

export const getDynamicProps = async (props) => {
   /* 
    In new development you should use this. 
    const { Mura } = props; 

    This pattern is for legacy support 
    const Mura = props.Mura || getMura();
  */
  const Mura = props.Mura || getMura();
  //console.log("requesting primary nav data",props.instanceid,Date.now(),Mura.siteid);
 
  const collection=await Mura.getFeed('content')
    .where()
    .prop('parentid')
    .isEQ(Mura.homeid)
    .sort('orderno')
    .expand("kids")
    .fields('navicon,menutitle,url,filename')
    .getQuery();
  
    //console.log("receiving primary nav data",props.instanceid,Date.now(),Mura.siteid);
  return {
    items:collection.getAll().items
  };
}

const RouterlessLink = ({href,className,type,menutitle,navlogo})=>{

  switch(type) {
    case "navdropdownitem":
      return (
        <NavDropdown.Item href={getHref(href)}>{menutitle}</NavDropdown.Item>
      )
    case "navlink":
      return (
        <Nav.Link href={getHref(href)}>{menutitle}</Nav.Link>
      )
    case "navbarbrand":
      return(
        <Navbar.Brand href={getHref(href)}>
          <img src={navlogo} loading="lazy" />
        </Navbar.Brand>
      )
    default:
      return (     
        <a className={className} href={getHref(href)}>
            {menutitle}
        </a>
      )
    }
  }
  
const RouterLink = ({href,className,type,menutitle,navlogo})=>{
  switch(type) {
    case "navdropdownitem":
      return (
        <Link 
        legacyBehavior
        href={getHref(href)} 
        passHref>
          <NavDropdown.Item>{menutitle}</NavDropdown.Item>
        </Link>
      )
    case "navlink":
      return (
        <Link 
        legacyBehavior
        href={getHref(href)} 
        passHref>
          <Nav.Link>{menutitle}</Nav.Link>
        </Link>
      )
    case "navbarbrand":
      return(
        <Link 
        legacyBehavior
        href={getHref(href)} 
        passHref>
          <Navbar.Brand>
            <img src={navlogo} loading="lazy" />
          </Navbar.Brand>
        </Link>
      )
    default:
      return (
        <Link 
          legacyBehavior
          href={getHref(href)}>      
            <a 
              className={className}>
                {menutitle}
            </a>
        </Link>
      )
    }
}

const Homelink = (props) => {
  const Link=props.link;
  const homeTitle = 'Home';
  const Mura = props.Mura || getMura();

  function createIcon() { 
    return {__html: props.navicon};
  };

  if (props.displayhome){
    return (
      <li className="nav-item">
        <Link
          key={Mura.homeid}
          href="/"
          className="nav-link"
          menutitle={<><span dangerouslySetInnerHTML={createIcon()} /> {homeTitle}</>}
          type="navlink" />
      </li>
    )
  }
  return (
    <></>
  )
}

const LangOptions = props => {

  if (props.translations.items.length) {
       
    return (
      <>
      <NavDropdown key="lang-options" title="Other Languages" id="lang-options" href="" renderMenuOnMount={true}>
        {/* if there are children, build the rest of the dropdown */}
        {props.translations.items.map((translation) => {
          return(
            <NavDropdown.Item key={`lang-option-${translation.siteid}`} href={translation.url}>{translation.label}</NavDropdown.Item>
          )
        })}
      </NavDropdown>
      </>
    )
  }
}

const NavLinkDropdown = props => {
  const Link = props.link;
  function createIcon() { 
    return {__html: props.navicon};
  };
  if (props.kids.items.length) {
       
    return (
      <>
      <NavDropdown key={props.contentid + 'navdropdown'} title={<div style={{display: "inline-block"}}><span dangerouslySetInnerHTML={createIcon()} /> {props.menutitle} </div>} id={`dropdown-${props.contentid}`} href={getHref(props.filename)} renderMenuOnMount={true}>
        {/* placing the main nav item in the dropdown for now since the parent nav item is not a clickable link */}
        <Link
          key={props.contentid + 'topitem'}
          href={getHref(props.filename)}
          type="navdropdownitem"
          menutitle={props.menutitle} />

        {/* if there are children, build the rest of the dropdown */}
        {props.kids.items.map((child) => {
          return(
            <Link
              key={child.contentid}
              href={getHref(child.filename)}
              type="navdropdownitem"
              menutitle={child.menutitle} />
          )
        })}
      </NavDropdown>
      </>
    )
  }

  // if item doesn't have children create a link
  return (
    <li className="nav-item">
      <Link 
        key={props.contentid}
        href={getHref(props.filename)}
        type="navlink"
        menutitle={<><span dangerouslySetInnerHTML={createIcon()} /> {props.menutitle} </>} />
    </li>    
  )

}
export default PrimaryNav;
