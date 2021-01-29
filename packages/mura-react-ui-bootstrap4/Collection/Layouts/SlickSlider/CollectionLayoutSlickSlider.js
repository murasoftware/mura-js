import { useState } from "react";
import React from 'react';
import Card from 'react-bootstrap/Card';
import OutputMarkup from "@mura/react/UI/Utilities/OutputMarkup";
import ItemDate from '@mura/react/UI/Utilities/ItemDate';
import CollectionReadMoreBtn from '@mura/react/UI/Utilities/CollectionReadMoreBtn';
import ItemCredits from '@mura/react/UI/Utilities/ItemCredits';
import ItemTags from '@mura/react/UI/Utilities/ItemTags';

import Slider from "react-slick";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
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
        <Link href={`/${item.get('filename')}`} passHref>
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
                            href={`/${item.get('filename')}`}
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
                          href={`/${item.get('filename')}`}
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