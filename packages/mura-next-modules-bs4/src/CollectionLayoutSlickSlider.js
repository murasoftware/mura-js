import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import OutputMarkup from "./OutputMarkup";
import ItemDate from './ItemDate';
import CollectionReadMoreBtn from './CollectionReadMoreBtn';
import ItemCredits from './ItemCredits';
import ItemTags from './ItemTags';

import Slider from "react-slick";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { getHref } from '@murasoftware/next-core'
/*
  The link component throws an error when rerending after being 
  reconfigured in edit mode. Hence CollectionLink
*/

const SlickSlider = ({props,collection,link}) => {

  function CustomNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </div>
    );
  }
  
  function CustomPrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </div>
    );    
  }  
  
  const slides = collection.map((item) => (
      <SliderItem 
        sliderimage={item.get('images')[props.imagesize]}
        imagesize={props.imagesize}
        item={item}
        link={link}
        slidestoshow={Number(props.slidestoshow)}
        {...props}
        key={item.get('contentid')}
      />
  ))
  
  //console.log('slidesToShow: ' + props.slidestoshow + ' slidesToScroll: ' + props.slidestoscroll + ' objectID: ' + props.objectid);
  // var slickSettings = {
  //   dots: {props.dots},
  //   arrows: {props.arrows},
  //   infinite: {props.infinite},
  //   speed: {Number(props.speed)},
  //   slidesToShow:{Number(props.slidestoshow)},
  //   slidesToScroll: {Number(props.slidestoshow)},
  //   autoplay: {props.autoplay},
  //   autoplaySpeed: {Number(props.autoplayspeed)},
  //   lazyLoad: {props.lazyload},
  //   vertical: {props.vertical},
  //   verticalSwiping: {props.verticalswiping},
  //   responsive={[
  //     {
  //       breakpoint: 0,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1
  //       }
  //     },
  //     {
  //       breakpoint: 576,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 2
  //       }
  //     },
  //     {
  //       breakpoint: 992,
  //       settings: {
  //         slidesToShow: Number(props.slidestoshow),
  //         slidesToScroll: Number(props.slidestoshow)
  //       }
  //     }
  //   ]},
  //   nextArrow: {<CustomNextArrow />},
  //   prevArrow: {<CustomPrevArrow />}
  // }
  return (
      slides != null && slides.length > 0 &&
      <div className={`collectionLayoutSlickSlider ${props.sliderlayout}`}>
        <Slider 
          dots={props.dots}
          arrows={props.arrows}
          infinite={props.infinite}
          speed={Number(props.speed)}
          slidesToShow={Number(props.slidestoshow)}
          slidesToScroll={Number(props.slidestoshow)}
          autoplay={props.autoplay}
          autoplaySpeed={Number(props.autoplayspeed)}        
          lazyLoad={props.lazyload}
          vertical={props.vertical}
          verticalSwiping={props.verticalswiping}
          fade={props.fade}
          centerMode={props.centermode}
          centerPadding={props.centerpadding}
          responsive={[
            {
              breakpoint: 0,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: Number(props.slidestoshow),
                slidesToScroll: Number(props.slidestoshow)
              }
            }
          ]}
          nextArrow={<CustomNextArrow />}
          prevArrow={<CustomPrevArrow />}
          key={props.objectid}
        >
        {slides}
      </Slider>
      </div>
      // these are causing an error: slidesPerRow={props.slidesperrow} rows={props.rows} 
  )
}

const SliderItem = (props) => {
  const item = props.item;
  const slidesToShow = props.slidesToShow;
  const Link = props.link;
  const fieldlist = props.fields ? props.fields.toLowerCase().split(",") : [];
  // console.log('image size: ' + props.imagesize);
  if (props.sliderlayout === 'banner') {//swith to props.layout
    return(
      <div key={item.get('contentid')} className="h-100 position-relative">
        <Link href={getHref(item.get('filename'))} passHref>
          <img src={props.sliderimage} />
        </Link>
        <div className="mura-item-meta">
                {
                fieldlist.map(field => {
                  switch(field) {
                    case "title":
                      return (
                        <div className="mura-item-meta__title" key={field}>{item.get('title')}</div>
                      )
                    case "date":
                    case "releasedate":
                        return (
                          <div className="mura-item-meta__date" key={item.get('releasedate')}>
                            <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                          </div>
                        );
                    case "summary":
                      return <OutputMarkup className="mura-item-meta__summary" source={item.get('summary')} key={field} />
                    case "readmore":
                      return(
                        <div className="mura-item-meta__readmore" key={item.get('contentid')}>
                          <CollectionReadMoreBtn
                            href={getHref(item.get('filename'))}
                            ctatext="Read More"
                            link={Link}
                            key={item.get('contentid')}
                          />
                        </div>
                      );
                    case "credits":
                        if(item.get('credits').length){
                          return (
                            <div className="mura-item-meta__credits">
                              <ItemCredits credits={item.get('credits')} key="credits" />
                            </div>
                          );
                        }
                        return null;
                    case "tags":
                        return (
                            <div className="mura-item-meta__tags pb-2" key="tags">
                              <ItemTags tags={item.get('tags')} />
                            </div>
                        );
                    default:
                      return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
                  }        
                })
                }
              </div>
      </div>
    )
  } else {
    return(
      <div className="mx-2 h-100" key={props.contentid} >
        <Card className="h-100">
          {
            fieldlist.filter(field => field == 'image').map(filteredField => (
              <Card.Img variant="top" src={item.get('images')[props.imagesize]} key={filteredField} />
            ))
          }          
          <Card.Body className="spacing-normal h-100">
              <div className="mura-item-meta">
                {
                fieldlist.map(field => {
                  switch(field) {
                    case "title":
                      return (
                        <Card.Title key={field}>{item.get('title')}</Card.Title>
                      )
                    case "date":
                    case "releasedate":
                        return (
                          <div className="mura-item-meta__date" key="date">
                            <ItemDate releasedate={item.get('releasedate')} lastupdate={item.get('lastupdate')}></ItemDate>
                          </div>
                        );
                    case "summary":
                      return <OutputMarkup source={item.get('summary')} key={field} />
                    case "readmore":
                      return(
                        <CollectionReadMoreBtn
                          href={getHref(item.get('filename'))}
                          ctatext="Read More"
                          link={Link}
                          key={item.get('contentid')}
                        />
                      );
                    default:
                      return <div className={`mura-item-meta__${field}`} key={field} data-value={item.get(field)}>{item.get(field)}</div>
                  }        
                })
                }
              </div>
            </Card.Body>
        </Card>
      </div>   
    )
  }

  

}

/*
  This is not required; it is used to retrieve the required fields when populated getStatic/getServerSide props
*/
export const getQueryProps = () => {
  const data = {};
  data['fields'] = "title,summary";

  return data;
};

export default SlickSlider;

export const ModuleConfig={
  key: 'SlickSlider',
  name: 'Slick Slider',
  component: SlickSlider,
  getQueryProps: getQueryProps,
  contentypes:"",
  configurator:[
      {"type":"fieldlist","name":"fields","label":"Display List"},
      {"type":"select","name":"imagesize","label":"Image Size","labels":["Small","Medium","Large","Portrait","Landscape","Hero"],"options":["small","medium","large","portrait","landscape","hero"],"value":"hero"},
      {"type":"select","name":"sliderLayout","label":"Slider Layout","labels":["Banner","Cards"],"options":["banner","cards"],"value":"cards"},
      {"type":"select","name":"slidesToShow","label":"Slides to Show","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"3"},
      {"type":"select","name":"slidesToScroll","label":"Slides to Scroll","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"3"},
      {"type":"radio","name":"dots","label":"Show Dots","labels":["Yes","No"],"options":["true","false"],"value":"true"},
      {"type":"radio","name":"arrows","label":"Show Arrows","labels":["Yes","No"],"options":["true","false"],"value":"true"},
      {"type":"radio","name":"infinite","label":"Inifinte","labels":["Yes","No"],"options":["true","false"],"value":"true"},
      {"type":"text","name":"speed","label":"Transition Speed","value":"500"},
      {"type":"text","name":"autoplayspeed","label":"Autoplay Speed","value":"2000"},
      {"type":"radio","name":"autoplay","label":"Autoplay","labels":["Yes","No"],"options":["true","false"],"value":"false"},
      {"type":"radio","name":"centermode","label":"Center Mode","labels":["Yes","No"],"options":["true","false"],"value":"false"},
      {"type":"text","name":"centerpadding","label":"Center Padding","value":"50"},
      {"type":"radio","name":"fade","label":"Fade","labels":["Yes","No"],"options":["true","false"],"value":"false"},
      {"type":"radio","name":"lazyload","label":"Lazy Load","labels":["Yes","No"],"options":["true","false"],"value":"false"},
      {"type":"select","name":"rows","label":"Rows","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"1"},
      {"type":"select","name":"slidesperrow","label":"Slides Per Row","labels":["6","5","4","3","2","1"],"options":["6","5","4","3","2","1"],"value":"3"},
      {"type":"radio","name":"vertical","label":"Vertical","labels":["Yes","No"],"options":["true","false"],"value":"false"},
      {"type":"radio","name":"verticalswiping","label":"Vertical Swiping","labels":["Yes","No"],"options":["true","false"],"value":"false"}
    ],
  excludeFromClient: true,
  isCollectionLayout: true,
}