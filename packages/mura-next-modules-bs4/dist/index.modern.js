import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Badge from 'react-bootstrap/Badge';
import ReactMarkdown from 'react-markdown';
import { getMura, getMuraConfig, getHref, Decorator, getComponent } from '@murasoftware/next-core';
import Link from 'next/link';
import Mura$1 from 'mura.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Slider from 'react-slick';
import Mura$2 from 'mura.js/src/core/core';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Youtube(props) {
  var instanceid = props.instanceid,
      videoid = props.videoid;
  return /*#__PURE__*/React.createElement("div", {
    className: "youtubeWrapper",
    id: "player-" + instanceid
  }, /*#__PURE__*/React.createElement("iframe", {
    title: "Youtube Player",
    src: "//www.youtube.com/embed/" + videoid + "?rel=0&autoplay=0&vq=hd1080&controls=1",
    frameBorder: "0",
    allowFullScreen: true
  }));
}

function Vimeo(props) {
  var instanceid = props.instanceid,
      videoid = props.videoid;
  return /*#__PURE__*/React.createElement("div", {
    className: "vimeoWrapper",
    id: "player-" + instanceid
  }, /*#__PURE__*/React.createElement("iframe", {
    src: "https://player.vimeo.com/video/" + videoid,
    width: "960",
    height: "540",
    frameBorder: "0",
    allow: "autoplay; fullscreen",
    allowFullScreen: true
  }));
}

function Wistia(props) {
  var instanceid = props.instanceid,
      videoid = props.videoid;
  return /*#__PURE__*/React.createElement("div", {
    className: "wistiaWrapper",
    id: "player-" + instanceid
  }, /*#__PURE__*/React.createElement(Head, null, /*#__PURE__*/React.createElement("script", {
    src: "https://fast.wistia.net/assets/external/E-v1.js"
  }), /*#__PURE__*/React.createElement("script", {
    src: "https://fast.wistia.com/embed/medias/" + videoid + ".jsonp"
  })), /*#__PURE__*/React.createElement("div", {
    className: "wistia_responsive_padding",
    style: {
      padding: '56.25% 0 0 0',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wistia_responsive_wrapper",
    style: {
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wistia_embed wistia_async_" + videoid,
    seo: "false",
    videofoam: "true",
    style: {
      height: '100%',
      width: '100%'
    }
  }, "\xA0"))));
}

var ModalVideo = function ModalVideo(_ref) {
  var props = _ref.props;
  var modalcta = props.modalcta,
      buttonclass = props.buttonclass,
      buttonplayiconsize = props.buttonplayiconsize,
      buttonctatext = props.buttonctatext,
      showbuttonplayicon = props.showbuttonplayicon;

  switch (modalcta) {
    case "button":
      return /*#__PURE__*/React.createElement("button", {
        type: "button",
        onclick: "openVidyardLightbox('#esapiEncode('html',objectparams.videoid)#'); return false;",
        className: "btn btn-" + buttonclass
      }, showbuttonplayicon ? /*#__PURE__*/React.createElement("i", {
        className: "fas fa-play fa-" + buttonplayiconsize + " align-middle"
      }) : null, buttonctatext, /*#__PURE__*/React.createElement(Head, null));

    default:
      return /*#__PURE__*/React.createElement("div", null, "Nah");
  }
};

var getVideoPlayer = function getVideoPlayer(props) {
  var players = {};
  players['youtube'] = Youtube(props);
  players['vimeo'] = Vimeo(props);
  players['wistia'] = Wistia(props);
  return players[props.videoplatform];
};

function Video(props) {
  var displaytype = props.displaytype,
      videoid = props.videoid,
      videoplatform = props.videoplatform;

  if (!videoplatform.length) {
    return /*#__PURE__*/React.createElement("div", null, "Video platform missing.");
  } else if (!videoid) {
    return /*#__PURE__*/React.createElement("div", null, "Video id missing.");
  } else {
    if (displaytype === 'modal') {
      return /*#__PURE__*/React.createElement(ModalVideo, {
        props: props
      }, getVideoPlayer(props));
    } else {
      return getVideoPlayer(props);
    }
  }
}

var ItemDate = function ItemDate(props) {
  var date = '';
  var formatteddate = '';

  if (props.releasedate) {
    date = new Date(props.releasedate);
  } else {
    date = new Date(props.lastupdate);
  }

  formatteddate = Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  }).format(date);
  return formatteddate;
};

var ItemCredits = function ItemCredits(props) {
  var Credits = props.credits.split(',');
  var creditsList = [];
  var credit = '';

  for (var i = 0; i < Credits.length; i++) {
    credit = Credits[i];
    creditsList.push( /*#__PURE__*/React.createElement("div", {
      className: "mura-item-meta__credits pb-2",
      key: credit
    }, "By: ", /*#__PURE__*/React.createElement("strong", null, credit)));
  }

  return creditsList;
};

function ItemTags(props) {
  var Tags = props.tags.split(',');
  var tagList = [];
  var tag = '';

  for (var i = 0; i < Tags.length; i++) {
    tag = Tags[i];
    tagList.push( /*#__PURE__*/React.createElement(Badge, {
      variant: "primary mr-2",
      key: tag
    }, tag));
  }

  return tagList;
}

function OutputMarkup(_ref) {
  var source = _ref.source,
      className = _ref.className;
  var parsedSource = getMura().parseStringAsTemplate(source);

  if (getMuraConfig().ConnectorConfig.htmleditortype == 'markdown') {
    return /*#__PURE__*/React.createElement(ReactMarkdown, {
      source: parsedSource,
      className: className
    });
  }

  return /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: parsedSource
    },
    className: className
  });
}

var ArticleMeta = function ArticleMeta(props) {
  var fields = props.fields ? props.fields : 'Date,Credits,Tags';
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var item = props.content;
  return /*#__PURE__*/React.createElement("div", {
    className: "pb-4"
  }, fieldlist.map(function (field) {
    var _React$createElement, _React$createElement2;

    switch (field) {
      case "title":
        return /*#__PURE__*/React.createElement("h1", (_React$createElement = {
          key: "title"
        }, _React$createElement["key"] = field, _React$createElement), item.title);

      case "summary":
        return /*#__PURE__*/React.createElement(OutputMarkup, {
          source: item.summary,
          className: "lead",
          key: field
        });

      case "date":
      case "releasedate":
        return /*#__PURE__*/React.createElement("div", (_React$createElement2 = {
          className: "mura-item-meta__date",
          key: "date"
        }, _React$createElement2["key"] = field, _React$createElement2), /*#__PURE__*/React.createElement("span", null, "Published on: "), " ", /*#__PURE__*/React.createElement(ItemDate, {
          releasedate: item.releasedate,
          lastupdate: item.lastupdate
        }));

      case "credits":
        if (item.credits) {
          var _React$createElement3;

          return /*#__PURE__*/React.createElement(ItemCredits, (_React$createElement3 = {
            credits: item.credits,
            key: "credits"
          }, _React$createElement3["key"] = field, _React$createElement3));
        }

      case "tags":
        if (item.tags) {
          var _React$createElement4;

          return /*#__PURE__*/React.createElement("div", (_React$createElement4 = {
            className: "mura-item-meta__tags",
            key: "tags"
          }, _React$createElement4["key"] = field, _React$createElement4), /*#__PURE__*/React.createElement("span", null, "Tags: "), /*#__PURE__*/React.createElement(ItemTags, {
            tags: item.tags,
            key: "tags"
          }));
        }

      default:
        return /*#__PURE__*/React.createElement("div", {
          className: "mura-item-meta__" + field,
          key: field,
          "data-value": props.content[field]
        }, props.content[field]);
    }
  }));
};

var getLayout = function getLayout(layout) {
  var muraConfig = getMuraConfig();
  var ComponentRegistry = muraConfig.ComponentRegistry;
  var uselayout = !layout || layout == 'default' ? "List" : layout;

  if (typeof ComponentRegistry[uselayout] != 'undefined') {
    return ComponentRegistry[uselayout];
  } else {
    console.log("Layout not registered: ", layout);
    return ComponentRegistry['List'];
  }
};

function getDefaultQueryPropsFromLayout(layout, item) {
  if (layout) {
    return layout.getQueryProps ? layout.getQueryProps(item) : {
      fields: ''
    };
  } else {
    return {
      fields: ''
    };
  }
}

function Collection(props) {
  var Mura = getMura();
  var objectparams = Object.assign({}, props);
  var DynamicCollectionLayout = getLayout(objectparams.layout).component;
  objectparams.fields = objectparams.fields || getDefaultQueryPropsFromLayout(DynamicCollectionLayout, objectparams).fields || 'Image,Date,Title,Summary,Credits,Tags';
  objectparams.dynamicProps = objectparams.dynamicProps || {};

  var _collection = objectparams.dynamicProps.collection ? new Mura.EntityCollection(objectparams.dynamicProps.collection, Mura._requestcontext) : false;

  if (!_collection) {
    var _useState = useState(_collection),
        collection = _useState[0],
        setCollection = _useState[1];

    useEffect(function () {
      var isMounted = true;

      if (isMounted) {
        getDynamicProps(objectparams).then(function (_dynamicProps) {
          if (isMounted) {
            setCollection(new Mura.EntityCollection(_dynamicProps.collection, Mura._requestcontext));
          }
        });
      }

      return function () {
        isMounted = false;
      };
    }, []);

    if (collection) {
      return /*#__PURE__*/React.createElement(DynamicCollectionLayout, {
        setCollection: setCollection,
        collection: collection,
        props: objectparams,
        link: RouterlessLink
      });
    } else {
      return /*#__PURE__*/React.createElement("div", null);
    }
  } else {
    var _useState2 = useState(_collection),
        _collection2 = _useState2[0],
        _setCollection = _useState2[1];

    return /*#__PURE__*/React.createElement(DynamicCollectionLayout, {
      setCollection: _setCollection,
      collection: _collection2,
      props: props,
      link: RouterLink
    });
  }
}

var RouterlessLink = function RouterlessLink(_ref) {
  var href = _ref.href,
      children = _ref.children,
      className = _ref.className;
  return /*#__PURE__*/React.createElement("a", {
    href: getHref(href),
    className: className
  }, children);
};
var RouterLink = function RouterLink(_ref2) {
  var href = _ref2.href,
      children = _ref2.children,
      className = _ref2.className;
  return /*#__PURE__*/React.createElement(Link, {
    href: getHref(href)
  }, /*#__PURE__*/React.createElement("a", {
    className: className
  }, children));
};
var getDynamicProps = function getDynamicProps(item) {
  try {
    var _exit2 = false;
    var Mura = getMura();

    var getItemsPerPage = function getItemsPerPage(item) {
      if (Mura.renderMode != 'static') {
        if (typeof item.nextn != 'undefined') {
          return item.nextn;
        } else if (typeof item.itemsperpage != 'undefined') {
          return item.itemsperpage;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    };

    var data = {};
    var cdata = {};
    var content = item.content;

    var _temp6 = function () {
      if (item.sourcetype === 'children') {
        var feed = Mura.getFeed('content');

        if (content.getAll) {
          cdata = content.getAll();
        } else {
          cdata = content;
        }

        feed.andProp('parentid').isEQ(cdata.contentid);
        feed.fields(getSelectFields(item));
        feed.expand(getExpandFields(item));
        feed.itemsPerPage(getItemsPerPage(item));
        feed.sort(cdata.sortby, cdata.sortdirection);
        return Promise.resolve(feed.getQuery()).then(function (query) {
          data.collection = query.getAll();
        });
      } else return function () {
        if (item.sourcetype === 'relatedcontent') {
          var _temp7 = function _temp7() {
            _exit2 = true;
            return data;
          };

          var src = item.source;

          var _temp8 = function () {
            if (src === 'custom') {
              if (typeof item.items != 'undefined') {
                if (!Array.isArray(item.items)) {
                  try {
                    JSON.parse(item.items);
                  } catch (e) {
                    console.log(e);
                    item.items = [];
                  }
                }
              } else {
                item.items = [];
              }

              var _temp9 = function () {
                if (item.items.length) {
                  return Promise.resolve(Mura.getFeed('content').where().fields(getSelectFields(item)).expand(getExpandFields(item)).itemsPerPage(getItemsPerPage(item)).maxItems(item.maxitems).findMany(item.items).getQuery()).then(function (related) {
                    data.collection = related.getAll();
                  });
                } else {
                  data.collection = {
                    items: [],
                    totaltems: 0
                  };
                }
              }();

              if (_temp9 && _temp9.then) return _temp9.then(function () {});
            } else {
              if (!content.getRelatedContent) {
                content = Mura.getEntity("content").set(content);
              }

              return Promise.resolve(content.getRelatedContent(src, {
                fields: getSelectFields(item),
                expand: getExpandFields(item),
                imagesizes: getImageSizes(item),
                itemsPerPage: getItemsPerPage(item),
                maxitems: item.maxitems
              })).then(function (related) {
                data.collection = related.getAll();
              });
            }
          }();

          return _temp8 && _temp8.then ? _temp8.then(_temp7) : _temp7(_temp8);
        } else {
          var _temp10 = function () {
            if (typeof item.sourcetype === 'undefined' || item.sourcetype === '' || typeof item.sourcetype !== 'undefined' && item.sourcetype === 'localindex' && Mura.isUUID(item.source)) {
              var _feed = Mura.getFeed('content');

              if (item.source) {
                _feed.andProp('feedid').isEQ(item.source);
              }

              _feed.fields(getSelectFields(item));

              _feed.expand(getExpandFields(item));

              _feed.imageSizes(getImageSizes(item));

              _feed.maxItems(item.maxitems);

              _feed.itemsPerPage(getItemsPerPage(item));

              return Promise.resolve(_feed.getQuery()).then(function (query) {
                data.collection = query.getAll();
              });
            }
          }();

          if (_temp10 && _temp10.then) return _temp10.then(function () {});
        }
      }();
    }();

    return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(function (_result) {
      return _exit2 ? _result : data;
    }) : _exit2 ? _temp6 : data);
  } catch (e) {
    return Promise.reject(e);
  }
};

var getExpandFields = function getExpandFields(item) {
  var data = getLayout(item.layout).getQueryProps();

  if (data.expand) {
    return data.expand;
  } else {
    return '';
  }
};

var getImageSizes = function getImageSizes(item) {
  var data = getLayout(item.layout).getQueryProps();

  if (data.imagesizes) {
    return data.imagesizes;
  } else {
    return '';
  }
};

var getSelectFields = function getSelectFields(item) {
  var data = getLayout(item.layout).getQueryProps(item);
  var fieldlist = '';

  if (data.fields) {
    fieldlist = data.fields;
  } else {
    fieldlist = data.fields ? data.fields : '';
  }

  if (!fieldlist) {
    return '';
  }

  var fieldarray = fieldlist.split(",");
  var hasDate = false;
  var hasFilename = false;
  var hasImage = false;
  var hasFileid = false;
  var hasContentid = false;
  var hasContenthistid = false;
  var hasParentid = false;
  fieldarray = fieldarray.filter(function (field) {
    field = field.toLowerCase();

    if (field === 'filename') {
      hasFilename = true;
    } else if (field === 'date') {
      hasDate = true;
      return false;
    } else if (field === 'image') {
      hasImage = true;
      return false;
    } else if (field === 'images') {
      hasImage = true;
      return false;
    } else if (field === 'fileid') {
      hasFileid = true;
    } else if (field === 'contentid') {
      hasContentid = true;
    } else if (field === 'contenthistid') {
      hasContenthistid = true;
    } else if (field === 'parentid') {
      hasParentid = true;
    }

    return true;
  });

  if (hasDate) {
    {
      fieldarray.push('releasedate');
    }

    {
      fieldarray.push('lastupdate');
    }

    {
      fieldarray.push('created');
    }
  }

  if (hasImage) {
    if (!hasFileid) {
      fieldarray.push('fileid');
    }

    fieldarray.push('images');
  }

  if (!hasFilename) {
    fieldarray.push('filename');
  }

  if (!hasContentid) {
    fieldarray.push('contentid');
  }

  if (!hasContenthistid) {
    fieldarray.push('contenthistid');
  }

  if (!hasParentid) {
    fieldarray.push('parentid');
  }

  return fieldarray.join(',').toLowerCase();
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}

var CollectionNav = function CollectionNav(props) {
  var nav = [];
  var collection = props.collection,
      setCollection = props.setCollection,
      pos = props.pos,
      nextn = props.nextn,
      setPos = props.setPos,
      scrollpages = props.scrollpages,
      instanceid = props.instanceid,
      itemsTo = props.itemsTo,
      setItemsTo = props.setItemsTo;

  if (Mura$1.renderMode == 'static') {
    var items = collection.get('items');
    var maxItems = props.maxitems;
    var next = pos + nextn;
    var prev = pos > 0 ? pos - nextn > 0 ? pos - nextn : 0 : 0;
    var itemsOf = pos + nextn > items.length ? items.length : pos + nextn;
    var itemsToMax = items.length >= maxItems ? maxItems : items.length;

    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsToMax = maxItems;
    }

    if (scrollpages) {
      if (Mura$1.isInNode()) {
        var isEndVisible = function isEndVisible() {
          var end = Mura$1("div.mura-collection-end[data-instanceid=\"" + instanceid + "\"]");

          if (itemsTo && maxItems && Mura$1.isScrolledIntoView(end.node)) {
            if (itemsTo < maxItems) {
              setItemsTo(itemsTo + 1);
            }
          } else if (itemsTo < maxItems) {
            setTimeout(isEndVisible, 50);
          }
        };

        Mura$1(isEndVisible);
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "mura-collection-end",
        "data-instanceid": instanceid
      });
    }

    if (pos > 0) {
      nav.push( /*#__PURE__*/React.createElement(NavButton, {
        key: "prev",
        pos: pos,
        val: prev,
        onItemClick: setPos,
        label: "Prev"
      }));
    }

    if (next < itemsToMax) {
      nav.push( /*#__PURE__*/React.createElement(NavButton, {
        key: "next",
        pos: pos,
        val: next,
        onItemClick: setPos,
        label: "Next"
      }));
    }

    if (nav.length) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Displaying items ", pos + 1, "-", itemsOf, " of ", itemsToMax), /*#__PURE__*/React.createElement("ul", {
        className: "pagination"
      }, nav));
    } else {
      return '';
    }
  } else {
    if (scrollpages) {
      var _useState = useState(0),
          endindex = _useState[0],
          setEndindex = _useState[1];

      var _isEndVisible = function _isEndVisible() {
        var end = Mura$1("div.mura-collection-end[data-instanceid=\"" + instanceid + "\"]");

        if (collection.has('next')) {
          if (Mura$1.isScrolledIntoView(end.node) && endindex != collection.get('endindex')) {
            setEndindex(collection.get('endindex'));
          } else {
            setTimeout(_isEndVisible, 50);
          }
        }
      };

      useEffect(function () {
        var isMounted = true;

        if (isMounted) {
          collection.get('next').then(function (_collection) {
            var incoming = _collection.getAll();

            collection.getAll().items.reverse().forEach(function (item) {
              incoming.items.unshift(item);
            });
            setCollection(new Mura$1.EntityCollection(incoming, Mura$1._requestcontext));
            setTimeout(_isEndVisible, 50);
          });
        }

        return function () {
          isMounted = false;
        };
      }, [endindex]);

      if (!Mura$1.isInNode()) {
        Mura$1(_isEndVisible);
      }

      return /*#__PURE__*/React.createElement("div", {
        className: "mura-collection-end",
        "data-instanceid": instanceid
      });
    } else {
      var goToPage = function goToPage(page) {
        var isMounted = true;

        if (isMounted) {
          collection.get(page).then(function (_collection) {
            if (isMounted) {
              setCollection(_collection);
            }
          });
        }

        return function () {
          isMounted = false;
        };
      };

      if (collection.has('previous')) {
        nav.push( /*#__PURE__*/React.createElement(NavButton, {
          key: "prev",
          val: "previous",
          onItemClick: goToPage,
          label: "Prev"
        }));
      }

      if (collection.has('next')) {
        nav.push( /*#__PURE__*/React.createElement(NavButton, {
          key: "next",
          val: "next",
          onItemClick: goToPage,
          label: "Next"
        }));
      }
    }

    if (nav.length) {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Displaying items ", collection.get('startindex'), "-", collection.get('endindex'), " of ", collection.get('totalitems')), /*#__PURE__*/React.createElement("ul", {
        className: "pagination"
      }, nav));
    } else {
      return '';
    }
  }
};

var NavButton = function NavButton(props) {
  var val = props.val,
      onItemClick = props.onItemClick;

  var _onClick = function _onClick() {
    onItemClick(val);
  };

  return /*#__PURE__*/React.createElement("li", {
    className: "page-item"
  }, /*#__PURE__*/React.createElement("a", {
    onClick: _onClick,
    className: "page-link",
    "aria-label": props.label
  }, /*#__PURE__*/React.createElement(NavButtonLabel, {
    label: props.label
  })));
};

var NavButtonLabel = function NavButtonLabel(props) {
  if (props.label == 'Next') {
    return /*#__PURE__*/React.createElement(React.Fragment, null, props.label, " ", /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faChevronRight
    }));
  } else {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faChevronLeft
    }), " ", props.label);
  }
};

var CollectionLayout = function CollectionLayout(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;
  var nextn = props.nextn;
  var items = collection.get('items');

  var _useState = useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  var _useState2 = useState(pos + nextn > items.length ? items.length : pos + nextn),
      itemsTo = _useState2[0],
      setItemsTo = _useState2[1];

  useEffect(function () {
    setItemsTo(pos + nextn > items.length ? items.length : pos + nextn);
  }, [pos]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("ul", {
    style: {
      'listStyle': 'none'
    }
  }, /*#__PURE__*/React.createElement(CurrentItems, _extends({
    collection: collection,
    itemsTo: itemsTo,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    itemsTo: itemsTo,
    setItemsTo: setItemsTo,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)));
};

var CurrentItems = function CurrentItems(props) {
  var collection = props.collection,
      link = props.link,
      pos = props.pos,
      itemsTo = props.itemsTo,
      scrollpages = props.scrollpages;
  var itemsList = [];
  var item = '';
  var Link = link;
  var items = collection.get('items');

  if (getMura().renderMode != 'static' && scrollpages) {
    itemsTo = (_readOnlyError("itemsTo"), items.length);
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = (_readOnlyError("itemsTo"), maxItems);
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React.createElement("li", {
      key: item.get('contentid')
    }, /*#__PURE__*/React.createElement("h1", null, /*#__PURE__*/React.createElement(Link, {
      href: "/" + item.get('filename')
    }, item.get('title'))), /*#__PURE__*/React.createElement(OutputMarkup, {
      source: item.get('summary')
    })));
  }

  return itemsList;
};

var getQueryProps = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var CollectionReadMoreBtn = function CollectionReadMoreBtn(props) {
  var Link = props.link;
  return /*#__PURE__*/React.createElement(Link, {
    href: props.href,
    passHref: true,
    className: "stretched-link btn btn-primary"
  }, props.ctatext, "  ", /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faChevronRight
  }));
};

var ItemImage = function ItemImage(_ref) {
  var image = _ref.image,
      className = _ref.className,
      alt = _ref.alt;
  var itemImage = image;

  if (typeof itemImage != 'undefined' && itemImage) {
    return /*#__PURE__*/React.createElement("img", {
      src: itemImage,
      alt: alt,
      className: className
    });
  }

  return null;
};

var CollectionLayoutAccordian = function CollectionLayoutAccordian(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Accordion, {
    className: "collectionLayoutAccordion " + props.accordionpadding + "-spacing " + props.collapseindicators + " " + props.collapseindicatorslocation + "-indicator"
  }, /*#__PURE__*/React.createElement(CurrentItems$1, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)))));
};

var CurrentItems$1 = function CurrentItems(props) {
  var collection = props.collection,
      nextn = props.nextn,
      link = props.link,
      pos = props.pos,
      fields = props.fields,
      scrollpages = props.scrollpages;
  var itemsList = [];
  var item = '';
  var Link = link;
  var items = collection.get('items');
  var itemsTo = pos + nextn > items.length ? items.length : pos + nextn;
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var maxItems = props.maxitems;

  if (getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  var _useState2 = useState('0'),
      activeId = _useState2[0],
      setActiveId = _useState2[1];

  function toggleActive(id) {
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  }

  var _loop = function _loop(i) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React.createElement(Card, {
      key: item.get('contentid')
    }, /*#__PURE__*/React.createElement(Accordion.Toggle, {
      as: Card.Header,
      variant: "link",
      eventKey: item.get('contentid'),
      className: activeId === i ? 'open' : 'not-open',
      onClick: function onClick() {
        return toggleActive(i);
      },
      role: "button"
    }, item.get('title')), /*#__PURE__*/React.createElement(Accordion.Collapse, {
      eventKey: item.get('contentid')
    }, /*#__PURE__*/React.createElement(Card.Body, null, fieldlist.map(function (field) {
      switch (field) {
        case "image":
          return /*#__PURE__*/React.createElement(ItemImage, {
            image: item.get('images')[props.imagesize],
            className: "img-fluid",
            alt: item.get('title'),
            key: "image"
          });

        case "date":
        case "releasedate":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__date",
            key: field
          }, /*#__PURE__*/React.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: field
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    })))));
  };

  for (var i = pos; i < itemsTo; i++) {
    _loop(i);
  }

  return itemsList;
};

var getQueryProps$1 = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var AlternatingBoxes = function AlternatingBoxes(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "collectionLayoutAlternatingBoxes"
  }, /*#__PURE__*/React.createElement(CurrentItems$2, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)))));
};

var CurrentItems$2 = function CurrentItems(props) {
  var collection = props.collection,
      nextn = props.nextn,
      link = props.link,
      pos = props.pos,
      fields = props.fields,
      scrollpages = props.scrollpages;
  var itemsList = [];
  var item = '';
  var Link = link;
  var items = collection.get('items');
  var itemsTo = pos + nextn > items.length ? items.length : pos + nextn;
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var maxItems = props.maxitems;

  if (getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React.createElement(Card, {
      className: "border-0",
      key: item.get('contentid')
    }, /*#__PURE__*/React.createElement("div", {
      className: "row no-gutters align-items-stretch"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6 " + (i % 2 == 0 ? "card-img-left" : "card-img-right  order-md-2")
    }, /*#__PURE__*/React.createElement(Card.Img, {
      variant: "top",
      src: item.get('images')[props.imagesize],
      className: "rounded-0"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6 p-0"
    }, /*#__PURE__*/React.createElement(Card.Body, {
      className: "spacing-normal h-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    })))))));
  }

  return itemsList;
};

var getQueryProps$2 = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var AlternatingRows = function AlternatingRows(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "collectionLayoutAlternatingBoxes"
  }, /*#__PURE__*/React.createElement(CurrentItems$3, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)))));
};

var CurrentItems$3 = function CurrentItems(props) {
  var collection = props.collection,
      nextn = props.nextn,
      link = props.link,
      pos = props.pos,
      fields = props.fields,
      scrollpages = props.scrollpages;
  var itemsList = [];
  var item = '';
  var Link = link;
  var items = collection.get('items');
  var itemsTo = pos + nextn > items.length ? items.length : pos + nextn;
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var maxItems = props.maxitems;

  if (getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React.createElement("div", {
      className: "mb-4",
      key: item.get('contentid')
    }, /*#__PURE__*/React.createElement(Card, {
      className: "mb-3 h-100 shadow"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row no-gutters align-items-stretch"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6 " + (i % 2 == 0 ? "card-img-left" : "card-img-right  order-md-2")
    }, /*#__PURE__*/React.createElement(Card.Img, {
      variant: "top",
      src: item.get('images')[props.imagesize]
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-6 p-0"
    }, /*#__PURE__*/React.createElement(Card.Body, {
      className: "spacing-normal h-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    }))))))));
  }

  return itemsList;
};

var getQueryProps$3 = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var ItemCategories = function ItemCategories(props) {
  var Categories = props.categories;
  var catsList = [];
  var cat = '';
  var cats = Categories.items;
  var catsTo = cats.length;
  var hasnext = false;

  if (cats.length) {
    for (var i = 0; i < catsTo; i++) {
      cat = cats[i];
      hasnext = i + 1 < catsTo;
      catsList.push( /*#__PURE__*/React.createElement("span", {
        key: cat.categoryid
      }, cat.categoryname, hasnext && ", "));
    }

    return catsList;
  }

  return /*#__PURE__*/React.createElement("span", null, "No Categories");
};

function CheckForItems() {
  return /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning"
  }, "No results to display.");
}

var Cards = function Cards(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  if (!collection.properties.totalpages) {
    return /*#__PURE__*/React.createElement(CheckForItems, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row collectionLayoutCards row-cols-1 row-cols-sm-" + props.rowcolssm + " row-cols-md-" + props.rowcolsmd + " row-cols-lg-" + props.rowcolslg + " row-cols-xl-" + props.rowcolsxl
  }, /*#__PURE__*/React.createElement(CurrentItems$4, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)))));
};

var CurrentItems$4 = function CurrentItems(props) {
  var collection = props.collection,
      nextn = props.nextn,
      link = props.link,
      pos = props.pos,
      fields = props.fields,
      scrollpages = props.scrollpages;
  var itemsList = [];
  var item = '';
  var Link = link;
  var items = collection.get('items');
  var itemsTo = pos + nextn > items.length ? items.length : pos + nextn;
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var maxItems = props.maxitems;
  var catAssignments = [];

  if (getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    catAssignments = item.getAll().categoryassignments;
    itemsList.push( /*#__PURE__*/React.createElement("div", {
      className: "col mb-4",
      key: item.get('contentid')
    }, /*#__PURE__*/React.createElement(Card, {
      className: "mb-3 h-100 shadow"
    }, fieldlist.filter(function (field) {
      return field == 'image';
    }).map(function (filteredField) {
      return /*#__PURE__*/React.createElement(Card.Img, {
        variant: "top",
        src: item.get('images')[props.imagesize],
        key: item.get('fileid')
      });
    }), /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__date",
            key: "date" + item.get('contentid')
          }, /*#__PURE__*/React.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        default:
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    }))), /*#__PURE__*/React.createElement(Card.Footer, null, /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
      href: "/" + item.get('filename'),
      ctatext: "Read More",
      link: Link,
      key: item.get('contentid')
    }), catAssignments && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Card.Text, {
      key: "categories"
    }, /*#__PURE__*/React.createElement(ItemCategories, {
      categories: catAssignments
    })))))));
  }

  return itemsList;
};

var getQueryProps$4 = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var List = function List(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CurrentItems$5, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props)), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)))));
};

var CurrentItems$5 = function CurrentItems(props) {
  var collection = props.collection,
      nextn = props.nextn,
      link = props.link,
      pos = props.pos,
      fields = props.fields,
      scrollpages = props.scrollpages;
  var itemsList = [];
  var item = '';
  var Link = link;
  var items = collection.get('items');
  var itemsTo = pos + nextn > items.length ? items.length : pos + nextn;
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var maxItems = props.maxitems;

  if (getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React.createElement("div", {
      className: "row mb-3",
      key: item.get('contentid')
    }, /*#__PURE__*/React.createElement(ListImage, {
      fieldlist: fieldlist,
      item: item,
      imagesize: props.imagesize
    }), /*#__PURE__*/React.createElement(ListMeta, {
      fieldlist: fieldlist,
      item: item,
      Link: Link
    })));
  }

  return itemsList;
};

var ListImage = function ListImage(props) {
  var fieldlist = props.fieldlist,
      item = props.item;
  var hasImage = false;

  if (fieldlist.indexOf("image") > -1) {
    hasImage = true;
  }

  if (hasImage) {
    var imagesize = props.imagesize || 'medium';
    return /*#__PURE__*/React.createElement("div", {
      className: "col-12 col-md-3 mb-3 pr-md-0"
    }, /*#__PURE__*/React.createElement(ItemImage, {
      image: item.get('images')[imagesize],
      className: "img-fluid",
      alt: item.get('title'),
      key: "image"
    }));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null);
};

var ListMeta = function ListMeta(props) {
  var fieldlist = props.fieldlist,
      item = props.item,
      Link = props.Link;
  var hasImage = false;

  if (fieldlist.indexOf("image") > -1) {
    hasImage = true;
  }

  if (item.get('type') === "Link") ;

  return /*#__PURE__*/React.createElement("div", {
    className: hasImage ? 'col-12 col-md-9 py-3' : 'col-12 py-3'
  }, /*#__PURE__*/React.createElement("div", {
    className: "mura-item-meta"
  }, fieldlist.map(function (field) {
    switch (field) {
      case "title":
        return /*#__PURE__*/React.createElement("div", {
          className: "mura-item-meta__title",
          key: item.get('field')
        }, /*#__PURE__*/React.createElement("h3", null, item.get('title')));

      case "date":
      case "releasedate":
        return /*#__PURE__*/React.createElement("div", {
          className: "mura-item-meta__date",
          key: "date"
        }, /*#__PURE__*/React.createElement(ItemDate, {
          releasedate: item.get('releasedate'),
          lastupdate: item.get('lastupdate')
        }));

      case "summary":
        return /*#__PURE__*/React.createElement(OutputMarkup, {
          source: item.get('summary'),
          key: field
        });

      case "readmore":
        return /*#__PURE__*/React.createElement("div", {
          className: "mura-item-meta__readmore",
          key: field
        }, /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
          href: "/" + item.get('filename'),
          ctatext: "Read More",
          link: Link,
          key: item.get('contentid')
        }));

      case "credits":
        if (item.get('credits').length) {
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__credits"
          }, /*#__PURE__*/React.createElement(ItemCredits, {
            credits: item.get('credits'),
            key: "credits"
          }));
        }

        return null;

      case "tags":
        return /*#__PURE__*/React.createElement("div", {
          className: "mura-item-meta__tags pb-2",
          key: "tags"
        }, /*#__PURE__*/React.createElement(ItemTags, {
          tags: item.get('tags')
        }));

      default:
        return /*#__PURE__*/React.createElement("div", {
          className: "mura-item-meta__" + field,
          key: field,
          "data-value": item.get(field)
        }, item.get(field));
    }
  })));
};

var getQueryProps$5 = function getQueryProps(item) {
  var data = {};
  data['fields'] = "";
  return data;
};

var Masonry = function Masonry(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "collectionLayoutMasonry card-columns"
  }, /*#__PURE__*/React.createElement(CurrentItems$6, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)))));
};

var CurrentItems$6 = function CurrentItems(props) {
  var collection = props.collection,
      nextn = props.nextn,
      link = props.link,
      pos = props.pos,
      fields = props.fields,
      scrollpages = props.scrollpages;
  var itemsList = [];
  var item = '';
  var Link = link;
  var items = collection.get('items');
  var itemsTo = pos + nextn > items.length ? items.length : pos + nextn;
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var maxItems = props.maxitems;

  if (getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React.createElement(Card, {
      className: "mb-3 h-100 shadow",
      key: item.get('contentid')
    }, fieldlist.filter(function (field) {
      return field == 'image';
    }).map(function (filteredField) {
      return /*#__PURE__*/React.createElement(Card.Img, {
        variant: "top",
        src: item.get('images')[props.imagesize],
        key: item.get('fileid')
      });
    }), /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    }))), /*#__PURE__*/React.createElement(Card.Footer, null, /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
      href: "/" + item.get('filename'),
      ctatext: "Read More",
      link: Link,
      key: item.get('contentid')
    }))));
  }

  return itemsList;
};

var getQueryProps$6 = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var SlickSlider = function SlickSlider(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      link = _ref.link;

  function CustomNextArrow(props) {
    var className = props.className,
        onClick = props.onClick;
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      onClick: onClick
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faChevronRight
    }));
  }

  function CustomPrevArrow(props) {
    var className = props.className,
        onClick = props.onClick;
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      onClick: onClick
    }, /*#__PURE__*/React.createElement(FontAwesomeIcon, {
      icon: faChevronLeft
    }));
  }

  var slides = collection.map(function (item) {
    return /*#__PURE__*/React.createElement(SliderItem, _extends({
      sliderimage: item.get('images')[props.imagesize],
      imagesize: props.imagesize,
      item: item,
      link: link,
      slidestoshow: Number(props.slidestoshow)
    }, props, {
      key: item.get('contentid')
    }));
  });
  return slides != null && slides.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "collectionLayoutSlickSlider " + props.sliderlayout
  }, /*#__PURE__*/React.createElement(Slider, {
    dots: props.dots,
    arrows: props.arrows,
    infinite: props.infinite,
    speed: Number(props.speed),
    slidesToShow: Number(props.slidestoshow),
    slidesToScroll: Number(props.slidestoshow),
    autoplay: props.autoplay,
    autoplaySpeed: Number(props.autoplayspeed),
    lazyLoad: props.lazyload,
    vertical: props.vertical,
    verticalSwiping: props.verticalswiping,
    fade: props.fade,
    centerMode: props.centermode,
    centerPadding: props.centerpadding,
    responsive: [{
      breakpoint: 0,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }, {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    }, {
      breakpoint: 992,
      settings: {
        slidesToShow: Number(props.slidestoshow),
        slidesToScroll: Number(props.slidestoshow)
      }
    }],
    nextArrow: /*#__PURE__*/React.createElement(CustomNextArrow, null),
    prevArrow: /*#__PURE__*/React.createElement(CustomPrevArrow, null),
    key: props.objectid
  }, slides));
};

var SliderItem = function SliderItem(props) {
  var item = props.item;
  var Link = props.link;
  var fieldlist = props.fields ? props.fields.toLowerCase().split(",") : [];

  if (props.sliderlayout === 'banner') {
    return /*#__PURE__*/React.createElement("div", {
      key: item.get('contentid'),
      className: "h-100 position-relative"
    }, /*#__PURE__*/React.createElement(Link, {
      href: "/" + item.get('filename'),
      passHref: true
    }, /*#__PURE__*/React.createElement("img", {
      src: props.sliderimage
    })), /*#__PURE__*/React.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__title",
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__date",
            key: item.get('releasedate')
          }, /*#__PURE__*/React.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React.createElement(OutputMarkup, {
            className: "mura-item-meta__summary",
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__readmore",
            key: item.get('contentid')
          }, /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          }));

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    })));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: "mx-2 h-100",
      key: props.contentid
    }, /*#__PURE__*/React.createElement(Card, {
      className: "h-100"
    }, fieldlist.filter(function (field) {
      return field == 'image';
    }).map(function (filteredField) {
      return /*#__PURE__*/React.createElement(Card.Img, {
        variant: "top",
        src: item.get('images')[props.imagesize],
        key: filteredField
      });
    }), /*#__PURE__*/React.createElement(Card.Body, {
      className: "spacing-normal h-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          });

        default:
          return /*#__PURE__*/React.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    })))));
  }
};

var getQueryProps$7 = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var Container = function Container(props) {
  var items = props.items,
      content = props.content;
  if (!items) return '';
  var $items = items;

  if (!Array.isArray($items)) {
    try {
      $items = JSON.parse($items);
    } catch (e) {
      $items = [];
    }
  }

  return $items.map(function (item) {
    var obj = Object.assign({}, item);

    if (Mura$2.cloning) {
      obj.instanceid = Mura$2.createUUID();
    }

    obj.key = obj.instanceid;
    obj.moduleStyleData = props.moduleStyleData;
    obj.content = content;
    obj.inited = true;
    return /*#__PURE__*/React.createElement(Decorator, obj, " ", getComponent(obj), " ");
  });
};

var Hr = function Hr(props) {
  return /*#__PURE__*/React.createElement("hr", null);
};

var CTAButton = function CTAButton(_ref) {
  var buttontext = _ref.buttontext,
      buttoncolor = _ref.buttoncolor,
      buttonsize = _ref.buttonsize,
      buttonlink = _ref.buttonlink,
      buttontarget = _ref.buttontarget,
      buttonblock = _ref.buttonblock;
  var btnclass = "btn btn-" + (buttoncolor || 'primary');

  if (buttonsize != 'md') {
    btnclass = btnclass + (" btn-" + buttonsize);
  }

  if (buttonblock) {
    btnclass = btnclass + " btn-block";
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
    href: buttonlink || 'https://www.murasoftware.com',
    passHref: true
  }, /*#__PURE__*/React.createElement("a", {
    target: buttontarget || '_self',
    className: btnclass,
    role: "button"
  }, buttontext || 'Press Me', " ", /*#__PURE__*/React.createElement(FontAwesomeIcon, {
    icon: faChevronRight
  }))));
};

var Embed = function Embed(props) {
  var objectparams = Object.assign({}, props);
  objectparams.source = objectparams.source || '';
  var containerid = 'source-contianer-' + objectparams.instanceid;

  if (!Mura$1.isInNode()) {
    useEffect(function () {
      Mura$1('#' + containerid).html(objectparams.source);
    }, []);
  }

  return /*#__PURE__*/React.createElement("div", {
    id: containerid
  });
};

var Image = function Image(props) {
  var objectparams = Object.assign({}, props);
  objectparams = objectparams || {};
  objectparams.src = objectparams.src || '';
  objectparams.alt = objectparams.alt || '';
  objectparams.caption = objectparams.caption || '';
  objectparams.imagelink = objectparams.imagelink || '';
  objectparams.fit = objectparams.fit || '';
  objectparams.imagelinktarget = objectparams.imagelinktarget || ';';

  if (!objectparams.src) {
    return '';
  }

  if (objectparams.imagelink) {
    return /*#__PURE__*/React.createElement("figure", null, /*#__PURE__*/React.createElement("a", {
      href: objectparams.imagelink,
      target: objectparams.imagelinktarget
    }, /*#__PURE__*/React.createElement(Img, objectparams)), /*#__PURE__*/React.createElement(FigCaption, objectparams));
  } else {
    return /*#__PURE__*/React.createElement("figure", {
      style: {
        margin: "0px"
      }
    }, /*#__PURE__*/React.createElement(Img, objectparams), /*#__PURE__*/React.createElement(FigCaption, objectparams));
  }
};

var FigCaption = function FigCaption(_ref) {
  var caption = _ref.caption;

  if (caption && caption != '<p></p>') {
    return /*#__PURE__*/React.createElement("figcaption", null, /*#__PURE__*/React.createElement(OutputMarkup, {
      source: caption
    }));
  } else {
    return '';
  }
};

var Img = function Img(props) {
  if (props.fit) {
    return /*#__PURE__*/React.createElement("img", {
      src: props.src,
      alt: props.alt,
      loading: "lazy",
      style: {
        height: "100%",
        width: "100%",
        objectFit: props.fit
      },
      "data-object-fit": props.fit
    });
  } else {
    return /*#__PURE__*/React.createElement("img", {
      src: props.src,
      alt: props.alt,
      loading: "lazy"
    });
  }
};

function Login(props) {
  return /*#__PURE__*/React.createElement("h3", null, "Login");
}

function MatrixSelector(props) {
  var objectparams = Object.assign({}, props);

  var _personaIds = objectparams.dynamicProps ? objectparams.dynamicProps.personaProps : '';

  var _stageIds = objectparams.dynamicProps ? objectparams.dynamicProps.stageProps : '';

  var _useState = useState(_personaIds),
      personaIds = _useState[0],
      setPersonaIds = _useState[1];

  var _useState2 = useState(_stageIds),
      stageIds = _useState2[0],
      setStageIds = _useState2[1];

  var _personaQ = objectparams.personaq ? objectparams.personaq : 'Who are you?';

  var _stageQ = objectparams.stageq ? objectparams.stageq : 'Where are you in the process?';

  var _useState3 = useState(_personaQ),
      personaQ = _useState3[0];

  var _useState4 = useState(_stageQ),
      stageQ = _useState4[0];

  var _useState5 = useState(''),
      curSelPersona = _useState5[0],
      setCurSelPersona = _useState5[1];

  var _useState6 = useState(''),
      curSelStage = _useState6[0],
      setCurSelStage = _useState6[1];

  var _useState7 = useState(false),
      buttonEnabled = _useState7[0],
      setButtonEnabled = _useState7[1];

  var _useState8 = useState(false),
      updateSuccess = _useState8[0],
      setUpdateSuccess = _useState8[1];

  var _useState9 = useState(false),
      showingAlert = _useState9[0],
      setShowingAlert = _useState9[1];

  var _useState10 = useState(false),
      isUpdating = _useState10[0],
      setIsUpdating = _useState10[1];

  var _useState11 = useState(false),
      selPersonaValidated = _useState11[0],
      setSelPersonaValidated = _useState11[1];

  var _useState12 = useState(false),
      selStageValidated = _useState12[0],
      setSelStageValidated = _useState12[1];

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    updateExperience(curSelPersona, curSelStage);
    return false;
  };

  var updateSelectedPersona = function updateSelectedPersona(e) {
    var newPersona = e.target.value;

    if (curSelPersona != newPersona) {
      setCurSelPersona(newPersona);
      checkSelectValidation(newPersona, curSelStage);
    }
  };

  var updateSelectedStage = function updateSelectedStage(e) {
    var newStage = e.target.value;

    if (curSelStage != newStage) {
      setCurSelStage(newStage);
      checkSelectValidation(curSelPersona, newStage);
    }
  };

  var checkSelectValidation = function checkSelectValidation(persona, stage) {
    if (persona != '' && personaIds.length) {
      setSelPersonaValidated(true);
    } else if (persona = '' ) {
      setSelPersonaValidated(false);
    }

    if (stage != '' && stageIds.length) {
      setSelStageValidated(true);
    } else if (stage = '' ) {
      setSelStageValidated(false);
    }
  };

  var updateButtonStatus = function updateButtonStatus(selPersonaValidated, selStageValidated) {
    if (selPersonaValidated && selStageValidated) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  };

  var updateExperience = function updateExperience(personaid, stageid) {
    try {
      setIsUpdating(true);
      setButtonEnabled(false);
      var Personaid = personaid;
      var Stageid = stageid;
      return Promise.resolve(Mura$1.getEntity('matrix_selector').invoke('updateExperience', {
        personaid: personaid,
        stageid: stageid
      })).then(function (exp) {
        if (exp.personaselected || exp.stageselected) {
          setUpdateSuccess(1);
          setShowingAlert(true);
          setIsUpdating(false);
        }

        if (exp.personaselected) {
          Mura$1(function () {
            Mura$1.trackEvent({
              category: 'Matrix Self ID',
              action: 'Persona',
              label: '#esapiEncode("javascript",personaName)#'
            });
          });
        }

        if (exp.stageselected) {
          Mura$1(function () {
            Mura$1.trackEvent({
              category: 'Matrix Self ID',
              action: 'Stage',
              label: '#esapiEncode("javascript",stageName)#'
            });
          });
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  useEffect(function () {
    var isMounted = true;

    if (isMounted) {
      updateButtonStatus(selPersonaValidated, selStageValidated);
    }

    return function () {
      isMounted = false;
    };
  }, [selPersonaValidated, selStageValidated]);

  if (!objectparams.dynamicProps) {
    useEffect(function () {
      var isMounted = true;

      if (isMounted) {
        getPersonas().then(function (personaProps) {
          if (isMounted) {
            setPersonaIds(personaProps);

            if (!personaProps.length) {
              if (isMounted) {
                setSelPersonaValidated(true);
              }
            }
          }
        });
        getStages().then(function (stageProps) {
          if (isMounted) {
            setStageIds(stageProps);

            if (!stageProps.length) {
              if (isMounted) {
                setSelStageValidated(true);
              }
            }
          }
        });
      }

      return function () {
        isMounted = false;
      };
    }, []);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Matrix Selector"), updateSuccess && showingAlert && /*#__PURE__*/React.createElement(Alert, {
      variant: "success"
    }, /*#__PURE__*/React.createElement("h4", null, "Thanks!"), /*#__PURE__*/React.createElement("p", null, "We\u2019re tailoring our content for you\u2026")), !updateSuccess && !showingAlert && /*#__PURE__*/React.createElement(Form, {
      inline: true,
      id: "mura_matrix-selector-form",
      onSubmit: handleSubmit,
      "data-autowire": "false"
    }, /*#__PURE__*/React.createElement("div", {
      className: "select-wrap"
    }, personaIds.length > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form.Label, {
      className: "mr-2"
    }, personaQ), /*#__PURE__*/React.createElement(Form.Control, {
      as: "select",
      name: "persona",
      size: "sm",
      className: "mr-2",
      value: props.curSelPersona,
      onChange: updateSelectedPersona
    }, /*#__PURE__*/React.createElement("option", {
      value: "",
      key: "--"
    }, "--"), personaIds.map(function (personaId) {
      return /*#__PURE__*/React.createElement("option", {
        value: personaId.personaid,
        key: personaId.personaid
      }, personaId.selfidq);
    }))), stageIds.length > 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form.Label, {
      className: "mr-2"
    }, stageQ), /*#__PURE__*/React.createElement(Form.Control, {
      as: "select",
      name: "stage",
      size: "sm",
      value: props.curSelStage,
      onChange: updateSelectedStage
    }, /*#__PURE__*/React.createElement("option", {
      value: "",
      key: "--"
    }, "--"), stageIds.map(function (stageId) {
      return /*#__PURE__*/React.createElement("option", {
        value: stageId.stageid,
        key: stageId.stageid
      }, stageId.selfidq);
    })))), /*#__PURE__*/React.createElement("div", {
      className: "w-100 mt-3"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      type: "submit",
      disabled: !buttonEnabled
    }, isUpdating ? 'Updating...' : 'Submit'))));
  }
}

var getDynamicProps$1 = function getDynamicProps(props) {
  try {
    return Promise.resolve(getPersonas()).then(function (personaIds) {
      return Promise.resolve(getStages()).then(function (stageIds) {
        return {
          personaProps: personaIds,
          stageProps: stageIds
        };
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var getPersonas = function getPersonas() {
  try {
    return Promise.resolve(Mura$1.getEntity('matrix_selector').invoke('getPersonas'));
  } catch (e) {
    return Promise.reject(e);
  }
};

var getStages = function getStages() {
  try {
    return Promise.resolve(Mura$1.getEntity('matrix_selector').invoke('getStages'));
  } catch (e) {
    return Promise.reject(e);
  }
};

function PrimaryNav(props) {
  var objectparams = Object.assign({}, props);

  if (!objectparams.dynamicProps) {
    var _useState = useState(''),
        items = _useState[0],
        setItems = _useState[1];

    useEffect(function () {
      getDynamicProps$2().then(function (dynamicProps) {
        setItems(dynamicProps.items);
      });
    }, []);

    if (items) {
      return /*#__PURE__*/React.createElement(Render, {
        items: items,
        link: RouterlessLink$1,
        props: props
      });
    } else {
      return /*#__PURE__*/React.createElement("div", null);
    }
  } else {
    return /*#__PURE__*/React.createElement(Render, {
      items: objectparams.dynamicProps.items,
      link: RouterLink$1,
      props: props
    });
  }
}

var Render = function Render(_ref) {
  var items = _ref.items,
      link = _ref.link,
      props = _objectWithoutPropertiesLoose(_ref, ["items", "link"]);

  var Link = link;
  var homeNavIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path d="M16 8.5l1.53 1.53l-1.06 1.06L10 4.62l-6.47 6.47l-1.06-1.06L10 2.5l4 4v-2h2v4zm-6-2.46l6 5.99V18H4v-5.97zM12 17v-5H8v5h4z" fill="#626262"/></svg>';
  return /*#__PURE__*/React.createElement(Navbar, {
    bg: "white",
    variant: "light",
    expand: "lg",
    className: "navbar-static-top py-0",
    collapseOnSelect: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-xl"
  }, /*#__PURE__*/React.createElement(Link, {
    href: '/',
    className: "navbar-brand",
    type: "navbarbrand",
    navlogo: props.props.navlogo
  }), /*#__PURE__*/React.createElement(Navbar.Toggle, {
    "aria-controls": "primary-nav"
  }), /*#__PURE__*/React.createElement(Navbar.Collapse, {
    id: "primary-nav"
  }, /*#__PURE__*/React.createElement(Nav, {
    className: "ml-auto"
  }, /*#__PURE__*/React.createElement(Homelink, {
    displayhome: props.props.displayhome,
    link: Link,
    navicon: homeNavIcon
  }), items.map(function (item) {
    return /*#__PURE__*/React.createElement(NavLinkDropdown, {
      key: item.contentid,
      contentid: item.contentid,
      filename: item.filename,
      menutitle: item.menutitle,
      kids: item.kids,
      link: Link,
      navicon: item.navicon
    });
  }), props.props.content && props.props.content.translations && /*#__PURE__*/React.createElement(LangOptions, {
    translations: props.props.content.translations
  })))));
};

var getDynamicProps$2 = function getDynamicProps(props) {
  try {
    var Mura = getMura();
    return Promise.resolve(Mura.getFeed('content').where().prop('parentid').isEQ(Mura.homeid).sort('orderno').expand("kids").fields('navicon,menutitle,url,filename').getQuery()).then(function (collection) {
      return {
        items: collection.getAll().items
      };
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var RouterlessLink$1 = function RouterlessLink(_ref2) {
  var href = _ref2.href,
      className = _ref2.className,
      type = _ref2.type,
      menutitle = _ref2.menutitle,
      navlogo = _ref2.navlogo;

  switch (type) {
    case "navdropdownitem":
      return /*#__PURE__*/React.createElement(NavDropdown.Item, {
        href: getHref(href)
      }, menutitle);

    case "navlink":
      return /*#__PURE__*/React.createElement(Nav.Link, {
        href: getHref(href)
      }, menutitle);

    case "navbarbrand":
      return /*#__PURE__*/React.createElement(Navbar.Brand, {
        href: getHref(href)
      }, /*#__PURE__*/React.createElement("img", {
        src: navlogo,
        loading: "lazy"
      }));

    default:
      return /*#__PURE__*/React.createElement("a", {
        className: className,
        href: getHref(href)
      }, menutitle);
  }
};

var RouterLink$1 = function RouterLink(_ref3) {
  var href = _ref3.href,
      className = _ref3.className,
      type = _ref3.type,
      menutitle = _ref3.menutitle,
      navlogo = _ref3.navlogo;

  switch (type) {
    case "navdropdownitem":
      return /*#__PURE__*/React.createElement(Link, {
        href: getHref(href),
        passHref: true
      }, /*#__PURE__*/React.createElement(NavDropdown.Item, null, menutitle));

    case "navlink":
      return /*#__PURE__*/React.createElement(Link, {
        href: getHref(href),
        passHref: true
      }, /*#__PURE__*/React.createElement(Nav.Link, null, menutitle));

    case "navbarbrand":
      return /*#__PURE__*/React.createElement(Link, {
        href: getHref(href),
        passHref: true
      }, /*#__PURE__*/React.createElement(Navbar.Brand, null, /*#__PURE__*/React.createElement("img", {
        src: navlogo,
        loading: "lazy"
      })));

    default:
      return /*#__PURE__*/React.createElement(Link, {
        href: getHref(href)
      }, /*#__PURE__*/React.createElement("a", {
        className: className
      }, menutitle));
  }
};

var Homelink = function Homelink(props) {
  var Link = props.link;
  var homeTitle = 'Home';
  var Mura = getMura();

  function createIcon() {
    return {
      __html: props.navicon
    };
  }

  if (props.displayhome) {
    var _React$createElement;

    return /*#__PURE__*/React.createElement("li", {
      className: "nav-item"
    }, /*#__PURE__*/React.createElement(Link, (_React$createElement = {
      key: Mura.homeid,
      href: "/",
      className: "nav-link",
      type: "navitem",
      menutitle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        dangerouslySetInnerHTML: createIcon()
      }), " ", homeTitle)
    }, _React$createElement["type"] = "navlink", _React$createElement)));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null);
};

var LangOptions = function LangOptions(props) {
  if (props.translations.items.length) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NavDropdown, {
      key: "lang-options",
      title: "Other Languages",
      id: "lang-options",
      href: "",
      renderMenuOnMount: true
    }, props.translations.items.map(function (translation) {
      return /*#__PURE__*/React.createElement(NavDropdown.Item, {
        key: "lang-option-" + translation.siteid,
        href: translation.url
      }, translation.label);
    })));
  }
};

var NavLinkDropdown = function NavLinkDropdown(props) {
  var Link = props.link;

  function createIcon() {
    return {
      __html: props.navicon
    };
  }

  if (props.kids.items.length) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(NavDropdown, {
      key: props.contentid,
      title: /*#__PURE__*/React.createElement("div", {
        style: {
          display: "inline-block"
        }
      }, /*#__PURE__*/React.createElement("span", {
        dangerouslySetInnerHTML: createIcon()
      }), " ", props.menutitle, " "),
      id: "dropdown-" + props.contentid,
      href: "/" + props.filename,
      renderMenuOnMount: true
    }, /*#__PURE__*/React.createElement(Link, {
      key: props.contentid,
      href: "/" + props.filename,
      type: "navdropdownitem",
      menutitle: props.menutitle
    }), props.kids.items.map(function (child) {
      return /*#__PURE__*/React.createElement(Link, {
        key: child.contentid,
        href: "/" + child.filename,
        type: "navdropdownitem",
        menutitle: child.menutitle
      });
    })));
  }

  return /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement(Link, {
    key: props.contentid,
    href: "/" + props.filename,
    type: "navlink",
    menutitle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      dangerouslySetInnerHTML: createIcon()
    }), " ", props.menutitle, " ")
  }));
};

function ResourceHub(props) {
  var Mura = getMura();
  var objectparams = Object.assign({}, props);
  var DynamicCollectionLayout = getLayout(objectparams.layout).component;
  var _collection = false;

  if (objectparams.dynamicProps) {
    _collection = new Mura.EntityCollection(objectparams.dynamicProps.collection, Mura._requestcontext);
  }

  var _useState = useState(_collection),
      collection = _useState[0],
      setCollection = _useState[1];

  var _curSubtype = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.subtype : '*';

  var _curCategoryIds = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.categoryid : '*';

  var _curPersonaId = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.personaid : '*';

  var _curCategoriesArray = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.selectedcats : [];

  var _hasMXP = objectparams.dynamicProps ? objectparams.dynamicProps.filterprops.hasmxp : false;

  var _useState2 = useState(_curSubtype),
      curSubtype = _useState2[0],
      setCurSubtype = _useState2[1];

  var _useState3 = useState(_curCategoriesArray),
      curCategoriesArray = _useState3[0],
      setCurCategoriesArray = _useState3[1];

  var _useState4 = useState(_curCategoryIds),
      curCategoryIds = _useState4[0],
      setCurCategoryIds = _useState4[1];

  var _useState5 = useState(_curPersonaId),
      curPersonaId = _useState5[0],
      setCurPersonaId = _useState5[1];

  var _useState6 = useState(_hasMXP),
      hasMXP = _useState6[0],
      setHasMXP = _useState6[1];

  var _useState7 = useState(false),
      newFilter = _useState7[0],
      setNewFilter = _useState7[1];

  var _useState8 = useState(new Date().toString()),
      filterUpdated = _useState8[0],
      setFilterUpdated = _useState8[1];

  var updateFilter = function updateFilter(e) {
    switch (e.target.name) {
      case 'subtype':
        var subtype = e.target.value;

        if (subtype != curSubtype) {
          setCurSubtype(subtype);
          setNewFilter(true);
          setFilterUpdated(new Date().toString());
        }

        break;

      case 'personaid':
        var personaid = e.target.value;

        if (personaid != curPersonaId) {
          setCurPersonaId(personaid);
          setNewFilter(true);
          setFilterUpdated(new Date().toString());
        }

        break;

      default:
        if (!curCategoryIds.includes(e.target.value)) {
          setCurCategoriesArray(updateCategoryIds(e.target.name, e.target.value, curCategoriesArray));
          setCurCategoryIds(getCategoryIds(curCategoriesArray));
          setNewFilter(true);
          setFilterUpdated(new Date().toString());
        }

    }
  };

  if (!objectparams.dynamicProps) {
    useEffect(function () {
      var isMounted = true;

      if (isMounted) {
        getFilterProps(curSubtype, curCategoryIds, curPersonaId, curCategoriesArray, newFilter).then(function (filterProps) {
          if (isMounted) {
            setHasMXP(filterProps.hasmxp);
            setCurSubtype(filterProps.subtype);
            setCurCategoryIds(filterProps.categoryid);
            setCurPersonaId(filterProps.personaid);
            setCurCategoriesArray(filterProps.selectedcats);

            if (isMounted) {
              getCollection(props, filterProps).then(function (collection) {
                setCollection(collection);
              });
            }
          }
        });
      }

      return function () {
        isMounted = false;
      };
    }, [filterUpdated]);

    if (collection) {
      console.log('dynamic');
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RenderFilterForm, _extends({
        updateFilter: updateFilter
      }, props, {
        curSubtype: curSubtype,
        curCategoryId: curCategoryIds,
        curPersonaId: curPersonaId,
        curCategoriesArray: curCategoriesArray,
        hasMXP: hasMXP
      })), /*#__PURE__*/React.createElement(DynamicCollectionLayout, {
        setCollection: setCollection,
        collection: collection,
        props: props,
        link: RouterlessLink
      }));
    } else {
      console.log('empty');
      return /*#__PURE__*/React.createElement("div", null);
    }
  } else {
    console.log('ssr');
    useEffect(function () {
      var isMounted = true;

      if (isMounted) {
        getFilterProps(curSubtype, curCategoryIds, curPersonaId, curCategoriesArray, newFilter).then(function (filterProps) {
          if (isMounted) {
            setHasMXP(filterProps.hasmxp);
            setCurSubtype(filterProps.subtype);
            setCurCategoryIds(filterProps.categoryid);
            setCurPersonaId(filterProps.personaid);
            setCurCategoriesArray(filterProps.selectedcats);
            getCollection(props, filterProps).then(function (collection) {
              if (isMounted) {
                setCollection(collection);
              }
            });
          }
        });
      }

      return function () {
        isMounted = false;
      };
    }, [filterUpdated]);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RenderFilterForm, _extends({
      updateFilter: updateFilter
    }, props, {
      curSubtype: curSubtype,
      curCategoryId: curCategoryIds,
      curPersonaId: curPersonaId,
      curCategoriesArray: curCategoriesArray,
      hasMXP: hasMXP
    })), /*#__PURE__*/React.createElement(DynamicCollectionLayout, {
      collection: collection,
      props: props,
      link: RouterLink
    }));
  }
}

var getCategoryIds = function getCategoryIds(categories) {
  var categoriesList;

  for (var i = 0; i < categories.length; i++) {
    if (categories[i].value != '*') {
      if (i < 1) {
        categoriesList = categories[i].value;
      } else {
        categoriesList = categoriesList + ',' + categories[i].value;
      }
    }
  }

  if (categoriesList == undefined) {
    categoriesList = '*';
  }

  return categoriesList;
};

var getDynamicProps$3 = function getDynamicProps(props) {
  try {
    return Promise.resolve(getFilterProps('', '', '', '', false)).then(function (filterProps) {
      return Promise.resolve(getCollection(props, filterProps)).then(function (collection) {
        if (!Array.isArray(filterProps.selectedcats)) {
          try {
            filterProps.selectedcats = JSON.parse(filterProps.selectedcats);
          } catch (e) {
            filterProps.selectedcats = [];
          }
        }

        return {
          collection: collection.getAll(),
          filterprops: filterProps
        };
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var getCollection = function getCollection(props, filterProps) {
  try {
    var _Mura = getMura();

    if (typeof props.content.getAll != 'undefined') {
      props.content = props.content.getAll();
    }

    var excludeIDList = props.content.contentid;

    var feed = _Mura.getFeed('content');

    feed.prop('type').isIn('Page,Link,File');
    feed.andProp('path').containsValue(props.content.contentid);
    feed.andProp('contentid').isNotIn(excludeIDList);
    feed.expand('categoryassignments');

    if (filterProps.subtype.length) {
      feed.andProp('subtype').isEQ(filterProps.subtype);
    }

    if (filterProps.categoryid.length) {
      feed.andProp('categoryid').isIn(filterProps.categoryid);
      feed.useCategoryIntersect(true);
    }

    feed.maxItems(props.maxitems);
    feed.itemsPerPage(0);
    var collection;

    var _temp2 = function () {
      if (filterProps.personaid.length) {
        return Promise.resolve(feed.getQuery({
          sortBy: "mxpRelevance"
        })).then(function (_feed$getQuery) {
          collection = _feed$getQuery;
        });
      } else {
        return Promise.resolve(feed.sort('releasedate', 'desc').getQuery()).then(function (_feed$sort$getQuery) {
          collection = _feed$sort$getQuery;
        });
      }
    }();

    return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
      return collection;
    }) : collection);
  } catch (e) {
    return Promise.reject(e);
  }
};

var getFilterProps = function getFilterProps(subtype, categoryid, personaid, selectedcategories, newfilter) {
  try {
    var Subtype = subtype;
    var Categoryid = categoryid;
    var Personaid = personaid;
    var CurSelectedCats = selectedcategories;
    var NewFilter = newfilter;
    return Promise.resolve(Mura.getEntity('resourcehub').invoke('processFilterArgs', {
      subtype: Subtype,
      categoryid: Categoryid,
      personaid: Personaid,
      selectedcats: CurSelectedCats,
      newfilter: NewFilter ? 1 : 0
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

var RenderFilterForm = function RenderFilterForm(props) {
  var objectparams = Object.assign({}, props);

  var _useState9 = useState(false),
      categoriesArray = _useState9[0],
      setCategoriesArray = _useState9[1];

  var _useState10 = useState(false),
      personasArray = _useState10[0],
      setPersonasArray = _useState10[1];

  var subtypesArray = objectparams.subtypes ? objectparams.subtypes.split(',') : [];
  var categoryIds = objectparams.categoryids ? objectparams.categoryids.split(',') : [];
  var personaIds = objectparams.personaids ? objectparams.personaids.split(',') : [];
  useEffect(function () {
    var isMounted = true;

    if (isMounted && personaIds.length) {
      getCategoriesInfo(categoryIds).then(function (data) {
        if (isMounted && data.items.length) {
          setCategoriesArray(data.items);
        }
      });
    }

    if (isMounted && personaIds.length) {
      getPersonasInfo(personaIds).then(function (data) {
        if (isMounted && data.items.length) {
          setPersonasArray(data.items);
        }
      });
    }

    return function () {
      isMounted = false;
    };
  }, []);
  return /*#__PURE__*/React.createElement(Form, {
    className: "row row-cols-1 row-cols-sm-2 row-cols-lg-3",
    id: "resource-filter-form"
  }, subtypesArray.length > 0 && /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "selectSubtypes",
    className: "col type"
  }, /*#__PURE__*/React.createElement(Form.Label, null, "Content Types:"), /*#__PURE__*/React.createElement(Form.Control, {
    as: "select",
    name: "subtype",
    custom: true,
    onChange: props.updateFilter,
    value: props.curSubtype
  }, /*#__PURE__*/React.createElement("option", {
    value: "*",
    key: "All Subtypes"
  }, "All"), subtypesArray.map(function (subtype, index) {
    return /*#__PURE__*/React.createElement("option", {
      value: subtype,
      key: index
    }, subtype);
  }))), categoriesArray && categoriesArray.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, categoriesArray.map(function (category, index) {
    return /*#__PURE__*/React.createElement(CategorySelect, {
      categoryid: category.categoryid,
      filterlabel: category.name,
      updateFilter: props.updateFilter,
      curCategoryId: props.curCategoryId,
      key: category.categoryid,
      curCategoriesArray: props.curCategoriesArray
    });
  })), props.hasMXP && personasArray.length > 0 && /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "selectPersonas",
    className: "col topic"
  }, /*#__PURE__*/React.createElement(Form.Label, null, "Audience:"), /*#__PURE__*/React.createElement(Form.Control, {
    as: "select",
    name: "personaid",
    custom: true,
    onChange: props.updateFilter,
    value: props.curPersonaId
  }, /*#__PURE__*/React.createElement("option", {
    value: "*",
    key: "All Personas"
  }, "All"), personasArray.map(function (option) {
    return /*#__PURE__*/React.createElement("option", {
      value: option.personaid,
      key: option.personaid
    }, option.name);
  }))));
};

var CategorySelect = function CategorySelect(props) {
  var _useState11 = useState([]),
      categoryKids = _useState11[0],
      setCategoryKids = _useState11[1];

  var curSelectValue = '*';
  useEffect(function () {
    var isMounted = true;
    getCategoryKidsInfo(props.categoryid).then(function (data) {
      if (isMounted) {
        setCategoryKids(data.items);
      }
    });
    return function () {
      isMounted = false;
    };
  }, []);

  for (var i = 0; i < categoryKids.length; i++) {
    if (props.curCategoryId.includes(categoryKids[i].categoryid)) {
      curSelectValue = categoryKids[i].categoryid;
      break;
    }
  }

  return /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "selectCategories" + props.filterlabel,
    className: "col topic"
  }, /*#__PURE__*/React.createElement(Form.Label, null, props.filterlabel, ":"), /*#__PURE__*/React.createElement(Form.Control, {
    as: "select",
    name: "categoryid" + props.filterlabel,
    custom: true,
    onChange: props.updateFilter,
    value: curSelectValue
  }, /*#__PURE__*/React.createElement("option", {
    value: "*",
    key: "All Categories"
  }, "All"), categoryKids.map(function (category, index) {
    return /*#__PURE__*/React.createElement("option", {
      value: category.categoryid,
      key: index
    }, category.name);
  })));
};

var getCategoriesInfo = function getCategoriesInfo(categoryIds) {
  try {
    var feed = Mura.getFeed('category');
    feed.findMany(categoryIds);
    return Promise.resolve(feed.getQuery()).then(function (query) {
      var categories = query.getAll();
      return categories;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var getPersonasInfo = function getPersonasInfo(personaIds) {
  try {
    var feed = Mura.getFeed('persona');
    feed.findMany(personaIds);
    return Promise.resolve(feed.getQuery()).then(function (query) {
      var personas = query.getAll();
      return personas;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var getCategoryKidsInfo = function getCategoryKidsInfo(categoryId) {
  try {
    var feed = Mura.getFeed('category');
    feed.prop('parentid').isEQ(categoryId);
    return Promise.resolve(feed.getQuery()).then(function (query) {
      var categorykids = query.getAll();
      return categorykids;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var updateCategoryIds = function updateCategoryIds(name, value, curCategoriesArray) {
  var match = 0;

  for (var i = 0; i < curCategoriesArray.length; i++) {
    if (curCategoriesArray[i].name === name) {
      curCategoriesArray[i].value = value;
      match = 1;
      break;
    }
  }

  if (!match) {
    curCategoriesArray.push({
      name: name,
      value: value
    });
  }

  return curCategoriesArray;
};

function Text(props) {
  var objectparams = Object.assign({}, props);

  if (!objectparams.dynamicProps && (objectparams.sourcetype === 'component' || objectparams.sourcetype === 'boundattribute')) {
    var _useState = useState(''),
        source = _useState[0],
        setSource = _useState[1];

    useEffect(function () {
      getDynamicProps$4(objectparams).then(function (dynamicProps) {
        setSource(dynamicProps.source);
      });
    }, []);

    if (source) {
      return /*#__PURE__*/React.createElement(OutputMarkup, {
        source: source
      });
    } else {
      return /*#__PURE__*/React.createElement("div", null);
    }
  } else {
    var _source = '';

    if (objectparams.dynamicProps && (objectparams.sourcetype === 'component' || objectparams.sourcetype === 'boundattribute')) {
      _source = objectparams.dynamicProps.source;
    } else {
      _source = objectparams.source;
    }

    if (_source && _source !== 'unconfigured') {
      return /*#__PURE__*/React.createElement(OutputMarkup, {
        source: _source
      });
    } else {
      return /*#__PURE__*/React.createElement("div", null);
    }
  }
}

var getDynamicProps$4 = function getDynamicProps(props) {
  try {
    var data = {};

    var _temp4 = function () {
      if (typeof props.sourcetype !== 'undefined' && (props.sourcetype === 'component' || props.sourcetype === 'boundattribute')) {
        var _temp5 = function () {
          if (props.sourcetype === 'component') {
            var _temp6 = function () {
              if (Mura$1.isUUID(props.source)) {
                return Promise.resolve(Mura$1.getEntity('content').loadBy('contentid', props.source, {
                  type: 'component',
                  fields: 'body'
                })).then(function (entity) {
                  data.source = entity.get('body');
                });
              } else {
                return Promise.resolve(Mura$1.getEntity('content').loadBy('title', props.source, {
                  type: 'component',
                  fields: 'body'
                })).then(function (entity) {
                  data.source = entity.get('body');
                });
              }
            }();

            if (_temp6 && _temp6.then) return _temp6.then(function () {});
          } else if (props.sourcetype === 'boundattribute') {
            if (typeof props.content.get == 'function') {
              data.source = props.content.get(props.source);
            } else {
              data.source = props.content[props.source] || '';
            }
          }
        }();

        if (_temp5 && _temp5.then) return _temp5.then(function () {});
      }
    }();

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {
      return data;
    }) : data);
  } catch (e) {
    return Promise.reject(e);
  }
};

function PrivacyTools(props) {
  var _useState = useState(0),
      optIn = _useState[0],
      setOptIn = _useState[1];

  var _useState2 = useState(0),
      optOut = _useState2[0],
      setOptOut = _useState2[1];

  var _useState3 = useState(1),
      mxpAnon = _useState3[0],
      setMxpAnon = _useState3[1];

  var _useState4 = useState(0),
      updateSuccess = _useState4[0],
      setUpdateSuccess = _useState4[1];

  var _useState5 = useState(false),
      showingAlert = _useState5[0],
      setShowingAlert = _useState5[1];

  useEffect(function () {
    var isMounted = true;

    if (isMounted) {
      getCurrentPrivacy().then(function (result) {
        setMxpAnon(result);
        console.log('result: ' + result);
      });
    }

    return function () {
      isMounted = false;
    };
  }, []);

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    updatePrivacyMXP(optIn, optOut);
    setUpdateSuccess(1);
    return false;
  };

  var updatePrivacyMXP = function updatePrivacyMXP(optIn, optOut) {
    try {
      return Promise.resolve(Mura.getEntity('privacy_tools').invoke('updatePrivacyMXP', {
        mxp_opt_in: optIn,
        mxp_opt_out: optOut
      })).then(function (privacyOptIn) {
        setShowingAlert(true);
        return privacyOptIn;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var mxpAnonChanged = function mxpAnonChanged(e) {
    setMxpAnon(e.target.value);

    if (e.target.value == 1) {
      setOptIn(0);
      setOptOut(1);
    } else {
      setOptIn(1);
      setOptOut(0);
    }
  };

  useEffect(function () {
    var isMounted = true;

    if (isMounted) {
      if (mxpAnon == 1) {
        setOptIn(0);
        setOptOut(1);
      } else {
        setOptIn(1);
        setOptOut(0);
      }
    }

    return function () {
      isMounted = false;
    };
  }, [mxpAnon]);
  useEffect(function () {
    var isMounted = true;

    if (isMounted) {
      if (showingAlert) {
        setTimeout(function () {
          setShowingAlert(false);
        }, 2000);
      }
    }

    return function () {
      isMounted = false;
    };
  }, [showingAlert]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", null, "Privacy Settings"), updateSuccess == 1 && showingAlert && /*#__PURE__*/React.createElement(Alert, {
    variant: "success"
  }, "Your preference has been saved."), /*#__PURE__*/React.createElement(Form, {
    onSubmit: handleSubmit,
    "data-autowire": "false"
  }, /*#__PURE__*/React.createElement(Form.Group, {
    controlId: "radio_mxp_anon"
  }, /*#__PURE__*/React.createElement(Form.Check, {
    type: "radio",
    id: "mxp_anon1",
    name: "mxp_anon",
    value: "0",
    checked: mxpAnon == 0,
    onChange: mxpAnonChanged,
    label: "For a better experience, allow this site to store some identifying information"
  }), /*#__PURE__*/React.createElement(Form.Check, {
    type: "radio",
    id: "mxp_anon2",
    name: "mxp_anon",
    value: "1",
    checked: mxpAnon == 1,
    onChange: mxpAnonChanged,
    label: "Do not allow this site to store some identifying information"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit"
  }, "Submit")));
}

var getCurrentPrivacy = function getCurrentPrivacy() {
  try {
    return Promise.resolve(Mura.getEntity('privacy_tools').invoke('privacyStatus'));
  } catch (e) {
    return Promise.reject(e);
  }
};

export { ArticleMeta, CTAButton, Collection, CollectionLayout, CollectionLayoutAccordian as CollectionLayoutAccordion, AlternatingBoxes as CollectionLayoutAlternatingBoxes, AlternatingRows as CollectionLayoutAlternatingRows, Cards as CollectionLayoutCards, List as CollectionLayoutList, Masonry as CollectionLayoutMasonry, SlickSlider as CollectionLayoutSlickSlider, CollectionNav, CollectionReadMoreBtn, Container, Embed, Hr, Image, ItemCategories, ItemCredits, ItemDate, ItemImage, ItemTags, Login, MatrixSelector, CheckForItems as NoItemsMessage, OutputMarkup, PrimaryNav, PrivacyTools, ResourceHub, RouterLink, RouterlessLink, Text, Video, getDynamicProps as getCollectionDynamicProps, getLayout as getCollectionLayout, getQueryProps$1 as getCollectionLayoutAccordionQueryProps, getQueryProps$2 as getCollectionLayoutAlternatingBoxesQueryProps, getQueryProps$3 as getCollectionLayoutAlternatingRowsQueryProps, getQueryProps$4 as getCollectionLayoutCardsQueryProps, getQueryProps$5 as getCollectionLayoutListQueryProps, getQueryProps$6 as getCollectionLayoutMasonryQueryProps, getQueryProps as getCollectionLayoutQueryProps, getQueryProps$7 as getCollectionLayoutSlickSliderQueryProps, getDynamicProps$1 as getMatrixSelectorDynamicProps, getDynamicProps$2 as getPrimaryNavDynamicProps, getDynamicProps$3 as getResourceHubDynamicProps, getDynamicProps$4 as getTextDynamicProps };
//# sourceMappingURL=index.modern.js.map
