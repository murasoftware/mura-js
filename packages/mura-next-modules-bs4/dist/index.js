function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Head = _interopDefault(require('next/head'));
var nextCore = require('@murasoftware/next-core');
var Badge = _interopDefault(require('react-bootstrap/Badge'));
var ReactMarkdown = _interopDefault(require('react-markdown/with-html'));
var gfm = _interopDefault(require('remark-gfm'));
var slug = _interopDefault(require('remark-slug'));
var directive = _interopDefault(require('remark-directive'));
var visit = _interopDefault(require('unist-util-visit'));
var h = _interopDefault(require('hastscript'));
var Link = _interopDefault(require('next/link'));
var reactFontawesome = require('@fortawesome/react-fontawesome');
var freeSolidSvgIcons = require('@fortawesome/free-solid-svg-icons');
var Accordion = _interopDefault(require('react-bootstrap/Accordion'));
var Card = _interopDefault(require('react-bootstrap/Card'));
var Slider = _interopDefault(require('react-slick'));
var Form = _interopDefault(require('react-bootstrap/Form'));
var Button = _interopDefault(require('react-bootstrap/Button'));
var Alert = _interopDefault(require('react-bootstrap/Alert'));
var Navbar = _interopDefault(require('react-bootstrap/Navbar'));
var Nav = _interopDefault(require('react-bootstrap/Nav'));
var NavDropdown = _interopDefault(require('react-bootstrap/NavDropdown'));
var InputGroup = _interopDefault(require('react-bootstrap/InputGroup'));
var router = require('next/router');

function Youtube(props) {
  var instanceid = props.instanceid,
      videoid = props.videoid;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "youtubeWrapper",
    id: "player-" + instanceid
  }, /*#__PURE__*/React__default.createElement("iframe", {
    title: "Youtube Player",
    src: "//www.youtube.com/embed/" + videoid + "?rel=0&autoplay=0&vq=hd1080&controls=1",
    frameBorder: "0",
    allowFullScreen: true
  }));
}

function Vimeo(props) {
  var instanceid = props.instanceid,
      videoid = props.videoid;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "vimeoWrapper",
    id: "player-" + instanceid
  }, /*#__PURE__*/React__default.createElement("iframe", {
    src: "https://player.vimeo.com/video/" + videoid,
    width: "960",
    height: "540",
    frameBorder: "0",
    allow: "autoplay; fullscreen",
    allowFullScreen: true
  }));
}

function Wistia(props) {
  var Mura = props.Mura || nextCore.getMura();
  var instanceid = props.instanceid,
      videoid = props.videoid,
      dynamicProps = props.dynamicProps;
  React.useEffect(function () {
    if (typeof dynamicProps == 'undefined') {
      var loader = Mura.loader();

      if (typeof window.Wistia == 'undefined') {
        loader.loadjs('https://fast.wistia.net/assets/external/E-v1.js', {
          async: true
        });
      }

      loader.loadjs('https://fast.wistia.com/embed/medias/${videoid}.jsonp', {
        async: true
      });
    }
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "wistiaWrapper",
    id: "player-" + instanceid
  }, /*#__PURE__*/React__default.createElement(Head, null, /*#__PURE__*/React__default.createElement("script", {
    async: true,
    src: "https://fast.wistia.net/assets/external/E-v1.js"
  }), /*#__PURE__*/React__default.createElement("script", {
    async: true,
    src: "https://fast.wistia.com/embed/medias/" + videoid + ".jsonp"
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "wistia_responsive_padding",
    style: {
      padding: '56.25% 0 0 0',
      position: 'relative'
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "wistia_responsive_wrapper",
    style: {
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%'
    }
  }, /*#__PURE__*/React__default.createElement("div", {
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

  var openPlayer = function openPlayer() {
    openVidyardLightbox(props.videoid);
    return false;
  };

  switch (modalcta) {
    case "button":
      return /*#__PURE__*/React__default.createElement("button", {
        type: "button",
        onClick: openPlayer,
        className: "btn btn-" + buttonclass
      }, showbuttonplayicon ? /*#__PURE__*/React__default.createElement("i", {
        className: "fas fa-play fa-" + buttonplayiconsize + " align-middle"
      }) : null, buttonctatext, /*#__PURE__*/React__default.createElement(Head, null));

    default:
      return /*#__PURE__*/React__default.createElement("div", null, "Nah");
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

  if (typeof videoplatform == 'undefined' || !videoplatform.length) {
    return /*#__PURE__*/React__default.createElement("div", null, "Video platform missing.");
  } else if (!videoid) {
    return /*#__PURE__*/React__default.createElement("div", null, "Video id missing.");
  } else {
    if (displaytype === 'modal') {
      return /*#__PURE__*/React__default.createElement(ModalVideo, {
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

  if (props.releasedate != null && props.releasedate != '' || props.lastupdate != null && props.lastupdate != '') {
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
  }

  return null;
};

var ItemCredits = function ItemCredits(props) {
  var Credits = props.credits.split(',');
  var creditsList = [];
  var credit = '';

  for (var i = 0; i < Credits.length; i++) {
    credit = Credits[i];
    creditsList.push( /*#__PURE__*/React__default.createElement("div", {
      className: "mura-item-meta__credits pb-2",
      key: credit
    }, "By: ", /*#__PURE__*/React__default.createElement("strong", null, credit)));
  }

  return creditsList;
};

function ItemTags(props) {
  var Tags = props.tags.split(',');
  var tagList = [];
  var tag = '';
  var variant = props.variant ? props.variant : 'primary';

  for (var i = 0; i < Tags.length; i++) {
    tag = Tags[i];
    tagList.push( /*#__PURE__*/React__default.createElement(Badge, {
      variant: variant + " mr-2",
      key: tag
    }, tag));
  }

  return tagList;
}

function htmlDirectives() {
  return transform;

  function transform(tree) {
    visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], ondirective);
  }

  function ondirective(node) {
    var data = node.data || (node.data = {});
    var hast = h(node.name, node.attributes);
    data.hName = hast.tagName;
    data.hProperties = hast.properties;
  }
}

function renderDirective(elem) {
  var tag = elem.node.data.hName;
  var props = Object.assign({}, elem.node.data.hProperties);

  try {
    switch (elem.node.data.hName.toLowerCase()) {
      case 'module':
        tag = nextCore.Decorator;
        props['data-render'] = "client";
        props.ssr = false;
        break;

      case 'content':
        break;

      case 'content':
        break;
    }

    if (elem.children.length) {
      return React__default.createElement(tag, props, elem.children);
    } else {
      return React__default.createElement(tag, props);
    }
  } catch (e) {
    console.error("error rendering html directive", e);
    return '';
  }
}

var renderers = {
  textDirective: renderDirective,
  leafDirective: renderDirective,
  containerDirective: renderDirective,
  heading: function heading(elem) {
    return React__default.createElement('h' + elem.level, elem.node.data.hProperties, elem.children);
  }
};

function parseStringAsTemplate(stringValue) {
  var parsedString = stringValue;
  var doLoop = true;

  do {
    var finder = /(\${)(.+?)(})/.exec(parsedString);

    if (finder) {
      var template = void 0;

      try {
        template = eval('`${' + finder[2] + '}`');
      } catch (e) {
        console.log('error parsing string template: ' + '${' + finder[2] + '}', e);
        template = '[error]' + finder[2] + '[/error]';
      }

      parsedString = parsedString.replace(finder[0], template);
    } else {
      doLoop = false;
    }
  } while (doLoop);

  parsedString = parsedString.replace('[error]', '${');
  parsedString = parsedString.replace('[/error]', '}');
  return parsedString;
}

function OutputMarkup(_ref) {
  var source = _ref.source,
      className = _ref.className;
  var parsedSource = parseStringAsTemplate(source);

  if (nextCore.getMuraConfig().ConnectorConfig.htmleditortype == 'markdown') {
    return /*#__PURE__*/React__default.createElement(ReactMarkdown, {
      plugins: [gfm, slug, directive, htmlDirectives],
      allowDangerousHtml: true,
      renderers: renderers,
      children: parsedSource,
      className: className
    });
  }

  return /*#__PURE__*/React__default.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: parsedSource
    },
    className: className
  });
}

var ArticleMeta = function ArticleMeta(props) {
  var fields = props.fields ? props.fields : '';
  var fieldlist = fields ? fields.toLowerCase().split(",") : [];
  var titleclass = props.titleclass ? props.titleclass : '';
  var item = props.content;
  var catAssignments = item.categoryassignments;
  var FeaturedCategoryOnly = "no";

  if (props.featuredcategoryonly) {
    FeaturedCategoryOnly = "yes";
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "mura-article-meta"
  }, fieldlist.map(function (field) {
    var _React$createElement, _React$createElement2;

    switch (field) {
      case "category":
        return /*#__PURE__*/React__default.createElement("div", {
          key: field,
          className: "mura-item-meta__category"
        }, /*#__PURE__*/React__default.createElement(ItemCategories, {
          categories: catAssignments,
          featuredonly: FeaturedCategoryOnly
        }));

      case "title":
        return /*#__PURE__*/React__default.createElement("h1", (_React$createElement = {
          key: "title"
        }, _React$createElement["key"] = field, _React$createElement.className = titleclass, _React$createElement), item.title);

      case "menutitle":
        return /*#__PURE__*/React__default.createElement("p", (_React$createElement2 = {
          key: "menutitle"
        }, _React$createElement2["key"] = field, _React$createElement2.className = "mura-item-meta__menutitle", _React$createElement2), item.menutitle);

      case "summary":
        return /*#__PURE__*/React__default.createElement(OutputMarkup, {
          source: item.summary,
          className: "lead",
          key: field
        });

      case "date":
      case "releasedate":
        return /*#__PURE__*/React__default.createElement("span", {
          className: "mura-item-meta__date",
          key: field
        }, /*#__PURE__*/React__default.createElement(ItemDate, {
          releasedate: item.releasedate,
          lastupdate: item.lastupdate
        }));

      case "credits":
        if (item.credits) {
          return /*#__PURE__*/React__default.createElement(ItemCredits, {
            credits: item.credits,
            key: field
          });
        }

        return null;

      case "tags":
        if (item.tags) {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__tags",
            key: field
          }, /*#__PURE__*/React__default.createElement(ItemTags, {
            tagshref: "/blog",
            tags: item.tags
          }));
        }

        return null;

      default:
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__" + field,
          key: field,
          "data-value": props.content[field]
        }, props.content[field]);
    }
  }));
};

var getLayout = function getLayout(layout) {
  var muraConfig = nextCore.getMuraConfig();
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
  var Mura = props.Mura || nextCore.getMura();
  var objectparams = Object.assign({}, props);
  var DynamicCollectionLayout = getLayout(objectparams.layout).component;
  objectparams.fields = getDefaultQueryPropsFromLayout(DynamicCollectionLayout, objectparams).fields || objectparams.fields || 'Image,Date,Title,Summary,Credits,Tags';
  objectparams.dynamicProps = objectparams.dynamicProps || {};

  var _collection = objectparams.dynamicProps.collection ? new Mura.EntityCollection(objectparams.dynamicProps.collection, Mura._requestcontext) : false;

  if (!_collection) {
    var _useState = React.useState(_collection),
        collection = _useState[0],
        setCollection = _useState[1];

    React.useEffect(function () {
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
      return /*#__PURE__*/React__default.createElement(DynamicCollectionLayout, {
        setCollection: setCollection,
        collection: collection,
        props: objectparams,
        link: RouterlessLink
      });
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  } else {
    var _useState2 = React.useState(_collection),
        _collection2 = _useState2[0],
        _setCollection = _useState2[1];

    return /*#__PURE__*/React__default.createElement(DynamicCollectionLayout, {
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
  return /*#__PURE__*/React__default.createElement("a", {
    href: nextCore.getHref(href),
    className: className
  }, children);
};
var RouterLink = function RouterLink(_ref2) {
  var href = _ref2.href,
      children = _ref2.children,
      className = _ref2.className;
  return /*#__PURE__*/React__default.createElement(Link, {
    href: nextCore.getHref(href)
  }, /*#__PURE__*/React__default.createElement("a", {
    className: className
  }, children));
};
var getDynamicProps = function getDynamicProps(props) {
  try {
    var _exit2 = false;
    var Mura = props.Mura || nextCore.getMura();

    var getItemsPerPage = function getItemsPerPage(props) {
      if (Mura.renderMode != 'static') {
        if (typeof props.nextn != 'undefined') {
          return props.nextn;
        } else if (typeof props.itemsperpage != 'undefined') {
          return props.itemsperpage;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    };

    var data = {};
    var cdata = {};
    var content = props.content;

    var _temp6 = function () {
      if (props.sourcetype === 'children') {
        var feed = Mura.getFeed('content');

        if (content.getAll) {
          cdata = content.getAll();
        } else {
          cdata = content;
        }

        feed.andProp('parentid').isEQ(cdata.contentid);
        feed.fields(getSelectFields(props));
        feed.expand(getExpandFields(props));
        feed.maxItems(props.maxitems);
        feed.itemsPerPage(getItemsPerPage(props));
        feed.sort(cdata.sortby, cdata.sortdirection);
        return Promise.resolve(feed.getQuery()).then(function (query) {
          data.collection = query.getAll();
        });
      } else return function () {
        if (props.sourcetype === 'relatedcontent') {
          var _temp7 = function _temp7() {
            _exit2 = true;
            return data;
          };

          var src = props.source;

          var _temp8 = function () {
            if (src === 'custom') {
              if (typeof props.items != 'undefined') {
                if (!Array.isArray(props.items)) {
                  try {
                    JSON.parse(props.items);
                  } catch (e) {
                    console.log(e);
                    props.items = [];
                  }
                }
              } else {
                props.items = [];
              }

              var _temp9 = function () {
                if (props.items.length) {
                  return Promise.resolve(Mura.getFeed('content').where().fields(getSelectFields(props)).expand(getExpandFields(props)).itemsPerPage(getItemsPerPage(props)).maxItems(props.maxitems).findMany(props.items).getQuery()).then(function (related) {
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
                fields: getSelectFields(props),
                expand: getExpandFields(props),
                imagesizes: getImageSizes(props),
                itemsPerPage: getItemsPerPage(props),
                maxitems: props.maxitems
              })).then(function (related) {
                data.collection = related.getAll();
              });
            }
          }();

          return _temp8 && _temp8.then ? _temp8.then(_temp7) : _temp7(_temp8);
        } else {
          var _temp10 = function () {
            if (typeof props.sourcetype === 'undefined' || props.sourcetype === '' || typeof props.sourcetype !== 'undefined' && props.sourcetype === 'localindex' && Mura.isUUID(props.source)) {
              var _feed = Mura.getFeed('content');

              if (props.source) {
                _feed.andProp('feedid').isEQ(props.source);
              }

              _feed.fields(getSelectFields(props));

              _feed.expand(getExpandFields(props));

              _feed.imageSizes(getImageSizes(props));

              _feed.maxItems(props.maxitems);

              _feed.itemsPerPage(getItemsPerPage(props));

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

var getExpandFields = function getExpandFields(props) {
  var data = getLayout(props.layout).getQueryProps();

  if (data.expand) {
    return data.expand;
  } else {
    return '';
  }
};

var getImageSizes = function getImageSizes(props) {
  var data = getLayout(props.layout).getQueryProps();

  if (data.imagesizes) {
    return data.imagesizes;
  } else {
    return '';
  }
};

var getSelectFields = function getSelectFields(props) {
  var data = getLayout(props.layout).getQueryProps(props);
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
  _extends = Object.assign ? Object.assign.bind() : function (target) {
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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
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
  var Mura = props.Mura || nextCore.getMura();
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

  if (Mura.renderMode == 'static') {
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
      if (Mura.isInNode()) {
        var isEndVisible = function isEndVisible() {
          var end = Mura("div.mura-collection-end[data-instanceid=\"" + instanceid + "\"]");

          if (itemsTo && maxItems && Mura.isScrolledIntoView(end.node)) {
            if (itemsTo < maxItems) {
              setItemsTo(itemsTo + 1);
            }
          } else if (itemsTo < maxItems) {
            setTimeout(isEndVisible, 50);
          }
        };

        Mura(isEndVisible);
      }

      return /*#__PURE__*/React__default.createElement("div", {
        className: "mura-collection-end",
        "data-instanceid": instanceid
      });
    }

    if (pos > 0) {
      nav.push( /*#__PURE__*/React__default.createElement(NavButton, {
        key: "prev",
        pos: pos,
        val: prev,
        onItemClick: setPos,
        label: "Prev"
      }));
    }

    if (next < itemsToMax) {
      nav.push( /*#__PURE__*/React__default.createElement(NavButton, {
        key: "next",
        pos: pos,
        val: next,
        onItemClick: setPos,
        label: "Next"
      }));
    }

    if (nav.length) {
      return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", null, "Displaying items ", pos + 1, "-", itemsOf, " of ", itemsToMax), /*#__PURE__*/React__default.createElement("ul", {
        className: "pagination"
      }, nav));
    } else {
      return '';
    }
  } else {
    if ((typeof scrollpages === 'boolean' || typeof scrollpages === 'number') && scrollpages || typeof scrollpages === 'string' && scrollpages.toLocaleLowerCase() === 'true') {
      var _useState = React.useState(0),
          endindex = _useState[0],
          setEndindex = _useState[1];

      var _isEndVisible = function _isEndVisible() {
        var end = Mura("div.mura-collection-end[data-instanceid=\"" + instanceid + "\"]");

        if (collection.has('next')) {
          if (Mura.isScrolledIntoView(end.node) && endindex != collection.get('endindex')) {
            setEndindex(collection.get('endindex'));
          } else {
            setTimeout(_isEndVisible, 50);
          }
        }
      };

      React.useEffect(function () {
        var isMounted = true;

        if (isMounted) {
          collection.get('next').then(function (_collection) {
            var incoming = _collection.getAll();

            collection.getAll().items.reverse().forEach(function (item) {
              incoming.items.unshift(item);
            });
            setCollection(new Mura.EntityCollection(incoming, Mura._requestcontext));
            setTimeout(_isEndVisible, 50);
          });
        }

        return function () {
          isMounted = false;
        };
      }, [endindex]);

      if (!Mura.isInNode()) {
        Mura(_isEndVisible);
      }

      return /*#__PURE__*/React__default.createElement("div", {
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
        nav.push( /*#__PURE__*/React__default.createElement(NavButton, {
          key: "prev",
          val: "previous",
          onItemClick: goToPage,
          label: "Prev"
        }));
      }

      if (collection.has('next')) {
        nav.push( /*#__PURE__*/React__default.createElement(NavButton, {
          key: "next",
          val: "next",
          onItemClick: goToPage,
          label: "Next"
        }));
      }
    }

    if (nav.length) {
      return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", null, "Displaying items ", collection.get('startindex'), "-", collection.get('endindex'), " of ", collection.get('totalitems')), /*#__PURE__*/React__default.createElement("ul", {
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

  return /*#__PURE__*/React__default.createElement("li", {
    className: "page-item"
  }, /*#__PURE__*/React__default.createElement("a", {
    onClick: _onClick,
    className: "page-link",
    "aria-label": props.label
  }, /*#__PURE__*/React__default.createElement(NavButtonLabel, {
    label: props.label
  })));
};

var NavButtonLabel = function NavButtonLabel(props) {
  if (props.label == 'Next') {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, props.label, " ", /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faChevronRight
    }));
  } else {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faChevronLeft
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

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  var _useState2 = React.useState(pos + nextn > items.length ? items.length : pos + nextn),
      itemsTo = _useState2[0],
      setItemsTo = _useState2[1];

  React.useEffect(function () {
    setItemsTo(pos + nextn > items.length ? items.length : pos + nextn);
  }, [pos]);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("ul", {
    style: {
      'listStyle': 'none'
    }
  }, /*#__PURE__*/React__default.createElement(CurrentItems, _extends({
    collection: collection,
    itemsTo: itemsTo,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
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

  if (nextCore.getMura().renderMode != 'static' && scrollpages) {
    _readOnlyError("itemsTo");
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      maxItems, _readOnlyError("itemsTo");
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React__default.createElement("li", {
      key: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement("h1", null, /*#__PURE__*/React__default.createElement(Link, {
      href: "/" + item.get('filename')
    }, item.get('title'))), /*#__PURE__*/React__default.createElement(OutputMarkup, {
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
  return /*#__PURE__*/React__default.createElement(Link, {
    href: props.href,
    passHref: true,
    className: "stretched-link btn btn-primary"
  }, props.ctatext, "  ", /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faChevronRight
  }));
};

var ItemImage = function ItemImage(_ref) {
  var image = _ref.image,
      className = _ref.className,
      alt = _ref.alt;
  var itemImage = image;

  if (typeof itemImage != 'undefined' && itemImage) {
    return /*#__PURE__*/React__default.createElement("img", {
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

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Accordion, {
    className: "collectionLayoutAccordion " + props.accordionpadding + "-spacing " + props.collapseindicators + " " + props.collapseindicatorslocation + "-indicator"
  }, /*#__PURE__*/React__default.createElement(CurrentItems$1, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
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

  if (nextCore.getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  var _useState2 = React.useState('0'),
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
    itemsList.push( /*#__PURE__*/React__default.createElement(Card, {
      key: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement(Accordion.Toggle, {
      as: Card.Header,
      variant: "link",
      eventKey: item.get('contentid'),
      className: activeId === i ? 'open' : 'not-open',
      onClick: function onClick() {
        return toggleActive(i);
      },
      role: "button"
    }, item.get('title')), /*#__PURE__*/React__default.createElement(Accordion.Collapse, {
      eventKey: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement(Card.Body, null, fieldlist.map(function (field) {
      switch (field) {
        case "image":
          return /*#__PURE__*/React__default.createElement(ItemImage, {
            image: item.get('images')[props.imagesize],
            className: "img-fluid",
            alt: item.get('title'),
            key: "image"
          });

        case "date":
        case "releasedate":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__date",
            key: field
          }, /*#__PURE__*/React__default.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React__default.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: field
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React__default.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React__default.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React__default.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React__default.createElement("div", {
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

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "collectionLayoutAlternatingBoxes"
  }, /*#__PURE__*/React__default.createElement(CurrentItems$2, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
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

  if (nextCore.getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React__default.createElement(Card, {
      className: "border-0",
      key: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "row no-gutters align-items-stretch"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "col-12 col-md-6 " + (i % 2 == 0 ? "card-img-left" : "card-img-right  order-md-2")
    }, /*#__PURE__*/React__default.createElement(Card.Img, {
      variant: "top",
      src: item.get('images')[props.imagesize],
      className: "rounded-0"
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "col-12 col-md-6 p-0"
    }, /*#__PURE__*/React__default.createElement(Card.Body, {
      className: "spacing-normal h-100"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React__default.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React__default.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React__default.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React__default.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React__default.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React__default.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    }), !fieldlist.includes('readmore') && /*#__PURE__*/React__default.createElement(Link, {
      href: "/" + item.get('filename'),
      className: "stretched-link"
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

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "collectionLayoutAlternatingBoxes"
  }, /*#__PURE__*/React__default.createElement(CurrentItems$3, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
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

  if (nextCore.getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React__default.createElement("div", {
      className: "mb-4",
      key: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement(Card, {
      className: "mb-3 h-100 shadow"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "row no-gutters align-items-stretch"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "col-12 col-md-6 " + (i % 2 == 0 ? "card-img-left" : "card-img-right  order-md-2")
    }, /*#__PURE__*/React__default.createElement(Card.Img, {
      variant: "top",
      src: item.get('images')[props.imagesize]
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "col-12 col-md-6 p-0"
    }, /*#__PURE__*/React__default.createElement(Card.Body, {
      className: "spacing-normal h-100"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React__default.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React__default.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React__default.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React__default.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React__default.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React__default.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    }), !fieldlist.includes('readmore') && /*#__PURE__*/React__default.createElement(Link, {
      href: "/" + item.get('filename'),
      className: "stretched-link"
    }))))))));
  }

  return itemsList;
};

var getQueryProps$3 = function getQueryProps() {
  var data = {};
  data['fields'] = "title,summary";
  return data;
};

var ItemCategories$1 = function ItemCategories(props) {
  var Categories = props.categories;
  var catsList = [];
  var cat = '';
  var cats = Categories.items;
  var Featuredonly = 0;
  var hasnext = false;

  if (props.featuredonly == "yes") {
    Featuredonly = 1;
  }

  if (cats.length > 1 && Featuredonly) {
    var filteredCats = cats.filter(function (category) {
      return category.isfeature == 1;
    });

    if (filteredCats.length > 1) {
      cats = filteredCats[0];
    } else {
      cats = filteredCats;
    }
  }

  if (cats && cats.length) {
    var catsTo = cats.length;

    for (var i = 0; i < catsTo; i++) {
      cat = cats[i];
      hasnext = i + 1 < catsTo;
      catsList.push( /*#__PURE__*/React__default.createElement("span", {
        key: cat.categoryid
      }, cat.categoryname, hasnext && ", "));
    }
  }

  return catsList;
};

function CheckForItems() {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "alert alert-warning"
  }, "No results to display.");
}

var Cards = function Cards(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  if (!collection.properties.totalpages) {
    return /*#__PURE__*/React__default.createElement(CheckForItems, null);
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "row collectionLayoutCards row-cols-1 row-cols-sm-" + props.rowcolssm + " row-cols-md-" + props.rowcolsmd + " row-cols-lg-" + props.rowcolslg + " row-cols-xl-" + props.rowcolsxl
  }, /*#__PURE__*/React__default.createElement(CurrentItems$4, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
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

  if (nextCore.getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    catAssignments = item.getAll().categoryassignments;
    itemsList.push( /*#__PURE__*/React__default.createElement("div", {
      className: "col mb-4",
      key: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement(Card, {
      className: "mb-3 h-100 shadow"
    }, fieldlist.filter(function (field) {
      return field == 'image';
    }).map(function (filteredField) {
      return /*#__PURE__*/React__default.createElement(Card.Img, {
        variant: "top",
        src: item.get('images')[props.imagesize],
        key: item.get('fileid')
      });
    }), /*#__PURE__*/React__default.createElement(Card.Body, null, /*#__PURE__*/React__default.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React__default.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__date",
            key: "date" + item.get('contentid')
          }, /*#__PURE__*/React__default.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React__default.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return null;

        default:
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    })), !fieldlist.includes('readmore') && /*#__PURE__*/React__default.createElement(Link, {
      href: "/" + item.get('filename'),
      className: "stretched-link"
    })), (fieldlist.includes('readmore') || catAssignments && props.showcategories) && /*#__PURE__*/React__default.createElement(Card.Footer, null, fieldlist.includes('readmore') && /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
      href: "/" + item.get('filename'),
      ctatext: "Read More",
      link: Link,
      key: item.get('contentid')
    }), catAssignments && props.showcategories && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("hr", null), /*#__PURE__*/React__default.createElement(Card.Text, {
      key: "categories"
    }, /*#__PURE__*/React__default.createElement(ItemCategories$1, {
      categories: catAssignments,
      featuredonly: props.featuredcategoriesonly
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

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React__default.createElement("div", {
    className: "collectionLayoutList"
  }, /*#__PURE__*/React__default.createElement(CurrentItems$5, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props)), /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
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
  console.log('itemsTo', itemsTo);
  console.log('pos', pos);

  if (nextCore.getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React__default.createElement("div", {
      className: "row mb-3",
      key: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement(ListImage, {
      fieldlist: fieldlist,
      item: item,
      imagesize: props.imagesize
    }), /*#__PURE__*/React__default.createElement(ListMeta, {
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
    return /*#__PURE__*/React__default.createElement("div", {
      className: "col-12 col-md-3 mb-3 pr-md-0"
    }, /*#__PURE__*/React__default.createElement(ItemImage, {
      image: item.get('images')[imagesize],
      className: "img-fluid",
      alt: item.get('title'),
      key: "image"
    }));
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
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

  return /*#__PURE__*/React__default.createElement("div", {
    className: hasImage ? 'col-12 col-md-9 py-3' : 'col-12 py-3'
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mura-item-meta"
  }, fieldlist.map(function (field) {
    switch (field) {
      case "title":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__title",
          key: item.get('field')
        }, /*#__PURE__*/React__default.createElement("h3", null, item.get('title')));

      case "date":
      case "releasedate":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__date",
          key: "date"
        }, /*#__PURE__*/React__default.createElement(ItemDate, {
          releasedate: item.get('releasedate'),
          lastupdate: item.get('lastupdate')
        }));

      case "summary":
        return /*#__PURE__*/React__default.createElement(OutputMarkup, {
          source: item.get('summary'),
          key: field
        });

      case "readmore":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__readmore",
          key: field
        }, /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
          href: "/" + item.get('filename'),
          ctatext: "Read More",
          link: Link,
          key: item.get('contentid')
        }));

      case "credits":
        if (item.get('credits').length) {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__credits"
          }, /*#__PURE__*/React__default.createElement(ItemCredits, {
            credits: item.get('credits'),
            key: "credits"
          }));
        }

        return null;

      case "tags":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__tags pb-2",
          key: "tags"
        }, /*#__PURE__*/React__default.createElement(ItemTags, {
          tags: item.get('tags')
        }));

      default:
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__" + field,
          key: field,
          "data-value": item.get(field)
        }, item.get(field));
    }
  }), !fieldlist.includes('readmore') && /*#__PURE__*/React__default.createElement(Link, {
    href: "/" + item.get('filename'),
    className: "stretched-link"
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

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "collectionLayoutMasonry card-columns"
  }, /*#__PURE__*/React__default.createElement(CurrentItems$6, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props))), /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
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

  if (nextCore.getMura().renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React__default.createElement(Card, {
      className: "mb-3 h-100 shadow",
      key: item.get('contentid')
    }, fieldlist.filter(function (field) {
      return field == 'image';
    }).map(function (filteredField) {
      return /*#__PURE__*/React__default.createElement(Card.Img, {
        variant: "top",
        src: item.get('images')[props.imagesize],
        key: item.get('fileid')
      });
    }), /*#__PURE__*/React__default.createElement(Card.Body, null, /*#__PURE__*/React__default.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React__default.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React__default.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React__default.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React__default.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React__default.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React__default.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    })), !fieldlist.includes('readmore') && /*#__PURE__*/React__default.createElement(Link, {
      href: "/" + item.get('filename'),
      className: "stretched-link"
    })), fieldlist.includes('readmore') && /*#__PURE__*/React__default.createElement(Card.Footer, null, /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
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
    return /*#__PURE__*/React__default.createElement("div", {
      className: className,
      onClick: onClick
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faChevronRight
    }));
  }

  function CustomPrevArrow(props) {
    var className = props.className,
        onClick = props.onClick;
    return /*#__PURE__*/React__default.createElement("div", {
      className: className,
      onClick: onClick
    }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
      icon: freeSolidSvgIcons.faChevronLeft
    }));
  }

  var slides = collection.map(function (item) {
    return /*#__PURE__*/React__default.createElement(SliderItem, _extends({
      sliderimage: item.get('images')[props.imagesize],
      imagesize: props.imagesize,
      item: item,
      link: link,
      slidestoshow: Number(props.slidestoshow)
    }, props, {
      key: item.get('contentid')
    }));
  });
  return slides != null && slides.length > 0 && /*#__PURE__*/React__default.createElement("div", {
    className: "collectionLayoutSlickSlider " + props.sliderlayout
  }, /*#__PURE__*/React__default.createElement(Slider, {
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
    nextArrow: /*#__PURE__*/React__default.createElement(CustomNextArrow, null),
    prevArrow: /*#__PURE__*/React__default.createElement(CustomPrevArrow, null),
    key: props.objectid
  }, slides));
};

var SliderItem = function SliderItem(props) {
  var item = props.item;
  var Link = props.link;
  var fieldlist = props.fields ? props.fields.toLowerCase().split(",") : [];

  if (props.sliderlayout === 'banner') {
    return /*#__PURE__*/React__default.createElement("div", {
      key: item.get('contentid'),
      className: "h-100 position-relative"
    }, /*#__PURE__*/React__default.createElement(Link, {
      href: "/" + item.get('filename'),
      passHref: true
    }, /*#__PURE__*/React__default.createElement("img", {
      src: props.sliderimage
    })), /*#__PURE__*/React__default.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__title",
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__date",
            key: item.get('releasedate')
          }, /*#__PURE__*/React__default.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React__default.createElement(OutputMarkup, {
            className: "mura-item-meta__summary",
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__readmore",
            key: item.get('contentid')
          }, /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          }));

        case "credits":
          if (item.get('credits').length) {
            return /*#__PURE__*/React__default.createElement("div", {
              className: "mura-item-meta__credits"
            }, /*#__PURE__*/React__default.createElement(ItemCredits, {
              credits: item.get('credits'),
              key: "credits"
            }));
          }

          return null;

        case "tags":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__tags pb-2",
            key: "tags"
          }, /*#__PURE__*/React__default.createElement(ItemTags, {
            tags: item.get('tags')
          }));

        default:
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__" + field,
            key: field,
            "data-value": item.get(field)
          }, item.get(field));
      }
    })));
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "mx-2 h-100",
      key: props.contentid
    }, /*#__PURE__*/React__default.createElement(Card, {
      className: "h-100"
    }, fieldlist.filter(function (field) {
      return field == 'image';
    }).map(function (filteredField) {
      return /*#__PURE__*/React__default.createElement(Card.Img, {
        variant: "top",
        src: item.get('images')[props.imagesize],
        key: filteredField
      });
    }), /*#__PURE__*/React__default.createElement(Card.Body, {
      className: "spacing-normal h-100"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "mura-item-meta"
    }, fieldlist.map(function (field) {
      switch (field) {
        case "title":
          return /*#__PURE__*/React__default.createElement(Card.Title, {
            key: field
          }, item.get('title'));

        case "date":
        case "releasedate":
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__date",
            key: "date"
          }, /*#__PURE__*/React__default.createElement(ItemDate, {
            releasedate: item.get('releasedate'),
            lastupdate: item.get('lastupdate')
          }));

        case "summary":
          return /*#__PURE__*/React__default.createElement(OutputMarkup, {
            source: item.get('summary'),
            key: field
          });

        case "readmore":
          return /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
            href: "/" + item.get('filename'),
            ctatext: "Read More",
            link: Link,
            key: item.get('contentid')
          });

        default:
          return /*#__PURE__*/React__default.createElement("div", {
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
      content = props.content,
      instanceid = props.instanceid;
  var Mura = props.Mura || nextCore.getMura();
  if (!items) return '';
  React.useEffect(function () {
    Mura.displayObjectInstances = Mura.displayObjectInstances || {};

    if (typeof Mura.displayObjectInstances[instanceid] == 'undefined') {
      Mura.displayObjectInstances[instanceid] = new Mura.DisplayObject.Container(props);
    }
  }, []);
  var $items = items;

  if (!Array.isArray($items)) {
    try {
      $items = JSON.parse($items);
    } catch (e) {
      $items = [];
    }
  }

  var resetInstanceIds = function resetInstanceIds(_items) {
    _items.forEach(function (item) {
      item.instanceid = Mura.createUUID();

      if (item.object == 'container' && item.items) {
        var _$items = item.items;

        if (!Array.isArray(_$items)) {
          try {
            _$items = JSON.parse(_$items);
          } catch (e) {
            _$items = [];
          }
        }

        item.items = resetInstanceIds(_$items);
      }
    });

    return _items;
  };

  if (Mura.cloning) {
    $items = $items.map(function (i) {
      return i;
    });
    resetInstanceIds($items);
  }

  return $items.map(function (item) {
    var obj = Object.assign({}, item);
    obj.key = obj.instanceid;
    obj.moduleStyleData = props.moduleStyleData;
    obj.regionContext = props.regionContext;
    obj.queryParams = props.queryParams;
    obj.content = content;
    obj.Mura = Mura;
    return /*#__PURE__*/React__default.createElement(nextCore.Decorator, obj, " ", nextCore.getComponent(obj), " ");
  });
};

var Hr = function Hr(props) {
  return /*#__PURE__*/React__default.createElement("hr", null);
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

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Link, {
    href: buttonlink || 'https://www.murasoftware.com',
    passHref: true
  }, /*#__PURE__*/React__default.createElement("a", {
    target: buttontarget || '_self',
    className: btnclass,
    role: "button"
  }, buttontext || 'Press Me', " ", /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faChevronRight
  }))));
};

var Embed = function Embed(props) {
  var Mura = props.Mura || getMura();
  var objectparams = Object.assign({}, props);
  objectparams.source = objectparams.source || '';
  var containerid = 'source-contianer-' + objectparams.instanceid;
  React.useEffect(function () {
    Mura('#' + containerid).html(objectparams.source);
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
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
  objectparams.imagelinktarget = objectparams.imagelinktarget || '';

  if (typeof objectparams.imagelinktarget === 'string' && objectparams.imagelinktarget.toLowerCase() === 'no') {
    objectparams.imagelinktarget = "";
  }

  if (!objectparams.src) {
    return '';
  }

  if (objectparams.imagelink) {
    return /*#__PURE__*/React__default.createElement("figure", null, /*#__PURE__*/React__default.createElement("a", {
      href: objectparams.imagelink,
      target: objectparams.imagelinktarget
    }, /*#__PURE__*/React__default.createElement(Img, objectparams)), /*#__PURE__*/React__default.createElement(FigCaption, objectparams));
  } else {
    return /*#__PURE__*/React__default.createElement("figure", {
      style: {
        margin: "0px"
      }
    }, /*#__PURE__*/React__default.createElement(Img, objectparams), /*#__PURE__*/React__default.createElement(FigCaption, objectparams));
  }
};

var FigCaption = function FigCaption(_ref) {
  var caption = _ref.caption;

  if (caption && caption != '<p></p>') {
    return /*#__PURE__*/React__default.createElement("figcaption", null, /*#__PURE__*/React__default.createElement(OutputMarkup, {
      source: caption
    }));
  } else {
    return '';
  }
};

var Img = function Img(props) {
  if (props.fit) {
    return /*#__PURE__*/React__default.createElement("img", {
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
    return /*#__PURE__*/React__default.createElement("img", {
      src: props.src,
      alt: props.alt,
      loading: "lazy"
    });
  }
};

function Login(props) {
  React.useEffect(function () {
    Mura('div.mura-object[data-instanceid="' + props.instanceid + '"]').processDisplayObject();
  }, []);
  return /*#__PURE__*/React__default.createElement("h3", null, "Login");
}

function MatrixSelector(props) {
  var objectparams = Object.assign({}, props);

  var _personaIds = objectparams.dynamicProps ? objectparams.dynamicProps.personaProps : '';

  var _stageIds = objectparams.dynamicProps ? objectparams.dynamicProps.stageProps : '';

  var _useState = React.useState(_personaIds),
      personaIds = _useState[0],
      setPersonaIds = _useState[1];

  var _useState2 = React.useState(_stageIds),
      stageIds = _useState2[0],
      setStageIds = _useState2[1];

  var _selfIdStart = objectparams.selfidstart ? objectparams.selfidstart : 'I am a';

  var _selfIdMiddle = objectparams.selfidmiddle ? objectparams.selfidmiddle : 'who';

  var _selfIdEnd = objectparams.selfidend ? objectparams.selfidend : 'your product.';

  var _displayType = objectparams.displaytype ? objectparams.displaytype : 'inline';

  var _useState3 = React.useState(_selfIdStart),
      selfIdStart = _useState3[0];

  var _useState4 = React.useState(_selfIdMiddle),
      selfIdMiddle = _useState4[0];

  var _useState5 = React.useState(_selfIdEnd),
      selfIdEnd = _useState5[0];

  var _useState6 = React.useState(_displayType),
      displayType = _useState6[0];

  var _useState7 = React.useState(''),
      curSelPersona = _useState7[0],
      setCurSelPersona = _useState7[1];

  var _useState8 = React.useState(''),
      curSelStage = _useState8[0],
      setCurSelStage = _useState8[1];

  var _useState9 = React.useState(false),
      buttonEnabled = _useState9[0],
      setButtonEnabled = _useState9[1];

  var _useState10 = React.useState(false),
      updateSuccess = _useState10[0],
      setUpdateSuccess = _useState10[1];

  var _useState11 = React.useState(false),
      showingAlert = _useState11[0],
      setShowingAlert = _useState11[1];

  var _useState12 = React.useState(false),
      isUpdating = _useState12[0],
      setIsUpdating = _useState12[1];

  var _useState13 = React.useState(false),
      selPersonaValidated = _useState13[0],
      setSelPersonaValidated = _useState13[1];

  var _useState14 = React.useState(false),
      selStageValidated = _useState14[0],
      setSelStageValidated = _useState14[1];

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
      return Promise.resolve(Mura.getEntity('matrix_selector').invoke('updateExperience', {
        personaid: personaid,
        stageid: stageid
      })).then(function (exp) {
        if (exp.personaselected || exp.stageselected) {
          setUpdateSuccess(1);
          setShowingAlert(true);
          setIsUpdating(false);
          setSeconds(3);
        }

        if (exp.personaselected) {
          Mura(function () {
            Mura.trackEvent({
              category: 'Matrix Self ID',
              action: 'Persona',
              label: '#esapiEncode("javascript",personaName)#'
            });
          });
        }

        if (exp.stageselected) {
          Mura(function () {
            Mura.trackEvent({
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

  React.useEffect(function () {
    var isMounted = true;

    if (isMounted) {
      updateButtonStatus(selPersonaValidated, selStageValidated);
    }

    return function () {
      isMounted = false;
    };
  }, [selPersonaValidated, selStageValidated]);

  var _useState15 = React.useState(0),
      seconds = _useState15[0],
      setSeconds = _useState15[1];

  React.useEffect(function () {
    if (seconds > 0) {
      setTimeout(function () {
        return setSeconds(seconds - 1);
      }, 1000);
    }

    if (seconds < 1 && showingAlert) {
      window.location = window.location.href.split("?")[0];
    }
  }, [seconds]);

  if (!objectparams.dynamicProps) {
    React.useEffect(function () {
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

    var _React$useState = React__default.useState(''),
        open = _React$useState[0],
        setOpen = _React$useState[1];

    switch (displayType) {
      case "widget":
        return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Alert, {
          variant: "info matrix-selector-edit-alert"
        }, /*#__PURE__*/React__default.createElement("p", {
          className: "mb-0"
        }, "Matrix Selector")), /*#__PURE__*/React__default.createElement("div", {
          className: (open ? 'open' : '') + " mura-matrix-selector__widget " + props.widgetposition
        }, /*#__PURE__*/React__default.createElement(Button, {
          variant: "light",
          onClick: function onClick() {
            setOpen(!open);
          }
        }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
          icon: freeSolidSvgIcons.faBolt
        }), " Optimize Your Experience"), /*#__PURE__*/React__default.createElement("div", {
          className: "mura-matrix-selector__widget__inner"
        }, /*#__PURE__*/React__default.createElement(MatrixForm, _extends({
          updateSuccess: updateSuccess,
          showingAlert: showingAlert,
          handleSubmit: handleSubmit,
          selfIdStart: selfIdStart,
          updateSelectedPersona: updateSelectedPersona,
          personaIds: personaIds,
          stageIds: stageIds,
          selfIdMiddle: selfIdMiddle,
          updateSelectedStage: updateSelectedStage,
          selfIdEnd: selfIdEnd,
          buttonEnabled: buttonEnabled,
          isUpdating: isUpdating,
          displaytype: displayType
        }, props, {
          seconds: seconds
        })), /*#__PURE__*/React__default.createElement("div", {
          className: "mura-matrix-selector__widget__inner__footer"
        }, /*#__PURE__*/React__default.createElement(MatrixSelectorFooter, props)))));

      case "eyebrow":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-matrix-selector__eyebrow"
        }, /*#__PURE__*/React__default.createElement("div", {
          className: "mura-matrix-selector__eyebrow__inner"
        }, !showingAlert && /*#__PURE__*/React__default.createElement("div", {
          className: "mura-matrix-selector__eyebrow__inner__heading"
        }, /*#__PURE__*/React__default.createElement("h4", null, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
          icon: freeSolidSvgIcons.faBolt
        }), " Optimize Your Experience")), /*#__PURE__*/React__default.createElement(MatrixForm, _extends({
          updateSuccess: updateSuccess,
          showingAlert: showingAlert,
          handleSubmit: handleSubmit,
          selfIdStart: selfIdStart,
          updateSelectedPersona: updateSelectedPersona,
          personaIds: personaIds,
          stageIds: stageIds,
          selfIdMiddle: selfIdMiddle,
          updateSelectedStage: updateSelectedStage,
          selfIdEnd: selfIdEnd,
          buttonEnabled: buttonEnabled,
          isUpdating: isUpdating,
          displaytype: displayType
        }, props, {
          seconds: seconds
        })), !showingAlert && /*#__PURE__*/React__default.createElement("div", {
          className: "mura-matrix-selector__eyebrow__inner__footer"
        }, /*#__PURE__*/React__default.createElement(MatrixSelectorFooter, props))));
    }

    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(MatrixForm, _extends({
      updateSuccess: updateSuccess,
      showingAlert: showingAlert,
      handleSubmit: handleSubmit,
      selfIdStart: selfIdStart,
      updateSelectedPersona: updateSelectedPersona,
      personaIds: personaIds,
      stageIds: stageIds,
      selfIdMiddle: selfIdMiddle,
      updateSelectedStage: updateSelectedStage,
      selfIdEnd: selfIdEnd,
      buttonEnabled: buttonEnabled,
      isUpdating: isUpdating
    }, props, {
      seconds: seconds
    })), !showingAlert && /*#__PURE__*/React__default.createElement("div", {
      className: "mura-matrix-selector__inline__footer",
      key: "matrix-selector-footer"
    }, /*#__PURE__*/React__default.createElement(MatrixSelectorFooter, props)));
  }
}

var MatrixSelectorFooter = function MatrixSelectorFooter(props) {
  var CustomLinks = props.customlinks ? Array.from(props.customlinks) : [];

  if (CustomLinks && CustomLinks.length) {
    var UtilityLinks = CustomLinks.map(function (link) {
      return /*#__PURE__*/React__default.createElement("li", {
        className: "list-inline-item",
        key: link.name
      }, /*#__PURE__*/React__default.createElement("a", {
        href: link.value
      }, link.name));
    });
    return /*#__PURE__*/React__default.createElement("ul", {
      className: "list-inline"
    }, UtilityLinks);
  }

  return null;
};

var MatrixForm = function MatrixForm(props) {
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, props.updateSuccess && props.showingAlert && /*#__PURE__*/React__default.createElement("div", {
    className: "successMessage"
  }, /*#__PURE__*/React__default.createElement("h4", null, "Thanks!"), /*#__PURE__*/React__default.createElement("p", null, "We\u2019re tailoring our content for you in \u2026 ", props.seconds)), !props.updateSuccess && !props.showingAlert && /*#__PURE__*/React__default.createElement(Form, {
    inline: true,
    id: "mura_matrix-selector-form",
    onSubmit: props.handleSubmit,
    "data-autowire": "false"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "select-wrap"
  }, props.personaIds.length > 1 && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Form.Label, {
    className: "mr-2"
  }, props.selfIdStart), /*#__PURE__*/React__default.createElement(Form.Control, {
    as: "select",
    name: "persona",
    size: "sm",
    className: "mr-2",
    value: props.curSelPersona,
    onChange: props.updateSelectedPersona
  }, /*#__PURE__*/React__default.createElement("option", {
    value: "",
    key: "--"
  }, "--"), props.personaIds.map(function (personaId) {
    return /*#__PURE__*/React__default.createElement("option", {
      value: personaId.personaid,
      key: personaId.personaid
    }, personaId.selfidq);
  }))), props.stageIds.length > 1 && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Form.Label, {
    className: "mr-2"
  }, props.selfIdMiddle), /*#__PURE__*/React__default.createElement(Form.Control, {
    as: "select",
    name: "stage",
    size: "sm",
    className: "mr-2",
    value: props.curSelStage,
    onChange: props.updateSelectedStage
  }, /*#__PURE__*/React__default.createElement("option", {
    value: "",
    key: "--"
  }, "--"), props.stageIds.map(function (stageId) {
    return /*#__PURE__*/React__default.createElement("option", {
      value: stageId.stageid,
      key: stageId.stageid
    }, stageId.selfidq);
  }))), /*#__PURE__*/React__default.createElement("p", null, props.selfIdEnd), /*#__PURE__*/React__default.createElement(Button, {
    className: "ml-2",
    variant: "link",
    size: "sm",
    type: "submit",
    disabled: !props.buttonEnabled
  }, props.isUpdating ? 'Updating...' : 'Update'))));
};

var getDynamicProps$1 = function getDynamicProps(props) {
  return Promise.resolve(getPersonas()).then(function (personaIds) {
    return Promise.resolve(getStages()).then(function (stageIds) {
      return {
        personaProps: personaIds,
        stageProps: stageIds
      };
    });
  });
};

var getPersonas = function getPersonas() {
  try {
    return Promise.resolve(Mura.getEntity('matrix_selector').invoke('getPersonas'));
  } catch (e) {
    return Promise.reject(e);
  }
};

var getStages = function getStages() {
  try {
    return Promise.resolve(Mura.getEntity('matrix_selector').invoke('getStages'));
  } catch (e) {
    return Promise.reject(e);
  }
};

var _excluded = ["items", "link"];

function PrimaryNav(props) {
  var objectparams = Object.assign({}, props);

  if (!objectparams.dynamicProps || !objectparams.dynamicProps.items) {
    var _useState = React.useState(''),
        items = _useState[0],
        setItems = _useState[1];

    React.useEffect(function () {
      getDynamicProps$2(objectparams).then(function (dynamicProps) {
        setItems(dynamicProps.items);
      });
    }, []);

    if (items) {
      return /*#__PURE__*/React__default.createElement(Render, {
        items: items,
        link: RouterlessLink$1,
        props: props
      });
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  } else {
    return /*#__PURE__*/React__default.createElement(Render, {
      items: objectparams.dynamicProps.items,
      link: RouterLink$1,
      props: props
    });
  }
}

var Render = function Render(_ref) {
  var items = _ref.items,
      link = _ref.link,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var Mura = props.Mura || nextCore.getMura();
  var Link = link;
  var homeNavIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 20"><path d="M16 8.5l1.53 1.53l-1.06 1.06L10 4.62l-6.47 6.47l-1.06-1.06L10 2.5l4 4v-2h2v4zm-6-2.46l6 5.99V18H4v-5.97zM12 17v-5H8v5h4z" fill="#626262"/></svg>';
  return /*#__PURE__*/React__default.createElement(Navbar, {
    bg: "white",
    variant: "light",
    expand: "lg",
    className: "navbar-static-top py-0",
    collapseOnSelect: true
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "container-xl"
  }, /*#__PURE__*/React__default.createElement(Link, {
    href: '/',
    className: "navbar-brand",
    type: "navbarbrand",
    navlogo: props.props.navlogo
  }), /*#__PURE__*/React__default.createElement(Navbar.Toggle, {
    "aria-controls": "primary-nav"
  }), /*#__PURE__*/React__default.createElement(Navbar.Collapse, {
    id: "primary-nav"
  }, /*#__PURE__*/React__default.createElement(Nav, {
    className: "ml-auto"
  }, /*#__PURE__*/React__default.createElement(Homelink, {
    displayhome: props.props.displayhome,
    link: Link,
    navicon: homeNavIcon,
    Mura: Mura
  }), items.map(function (item) {
    return /*#__PURE__*/React__default.createElement(NavLinkDropdown, {
      key: item.contentid,
      contentid: item.contentid,
      filename: item.filename,
      menutitle: item.menutitle,
      kids: item.kids,
      link: Link,
      navicon: item.navicon
    });
  }), props.props.content && props.props.content.translations && /*#__PURE__*/React__default.createElement(LangOptions, {
    translations: props.props.content.translations
  })), props.props.displaysearch && /*#__PURE__*/React__default.createElement(SearchForm, null))));
};

var getDynamicProps$2 = function getDynamicProps(props) {
  try {
    var Mura = props.Mura || nextCore.getMura();
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
      return /*#__PURE__*/React__default.createElement(NavDropdown.Item, {
        href: nextCore.getHref(href)
      }, menutitle);

    case "navlink":
      return /*#__PURE__*/React__default.createElement(Nav.Link, {
        href: nextCore.getHref(href)
      }, menutitle);

    case "navbarbrand":
      return /*#__PURE__*/React__default.createElement(Navbar.Brand, {
        href: nextCore.getHref(href)
      }, /*#__PURE__*/React__default.createElement("img", {
        src: navlogo,
        loading: "lazy"
      }));

    default:
      return /*#__PURE__*/React__default.createElement("a", {
        className: className,
        href: nextCore.getHref(href)
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
      return /*#__PURE__*/React__default.createElement(Link, {
        href: nextCore.getHref(href),
        passHref: true
      }, /*#__PURE__*/React__default.createElement(NavDropdown.Item, null, menutitle));

    case "navlink":
      return /*#__PURE__*/React__default.createElement(Link, {
        href: nextCore.getHref(href),
        passHref: true
      }, /*#__PURE__*/React__default.createElement(Nav.Link, null, menutitle));

    case "navbarbrand":
      return /*#__PURE__*/React__default.createElement(Link, {
        href: nextCore.getHref(href),
        passHref: true
      }, /*#__PURE__*/React__default.createElement(Navbar.Brand, null, /*#__PURE__*/React__default.createElement("img", {
        src: navlogo,
        loading: "lazy"
      })));

    default:
      return /*#__PURE__*/React__default.createElement(Link, {
        href: nextCore.getHref(href)
      }, /*#__PURE__*/React__default.createElement("a", {
        className: className
      }, menutitle));
  }
};

var Homelink = function Homelink(props) {
  var Link = props.link;
  var homeTitle = 'Home';
  var Mura = props.Mura || nextCore.getMura();

  function createIcon() {
    return {
      __html: props.navicon
    };
  }

  if (props.displayhome) {
    return /*#__PURE__*/React__default.createElement("li", {
      className: "nav-item"
    }, /*#__PURE__*/React__default.createElement(Link, {
      key: Mura.homeid,
      href: "/",
      className: "nav-link",
      menutitle: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("span", {
        dangerouslySetInnerHTML: createIcon()
      }), " ", homeTitle),
      type: "navlink"
    }));
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

var LangOptions = function LangOptions(props) {
  if (props.translations.items.length) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(NavDropdown, {
      key: "lang-options",
      title: "Other Languages",
      id: "lang-options",
      href: "",
      renderMenuOnMount: true
    }, props.translations.items.map(function (translation) {
      return /*#__PURE__*/React__default.createElement(NavDropdown.Item, {
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
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(NavDropdown, {
      key: props.contentid + 'navdropdown',
      title: /*#__PURE__*/React__default.createElement("div", {
        style: {
          display: "inline-block"
        }
      }, /*#__PURE__*/React__default.createElement("span", {
        dangerouslySetInnerHTML: createIcon()
      }), " ", props.menutitle, " "),
      id: "dropdown-" + props.contentid,
      href: "/" + props.filename,
      renderMenuOnMount: true
    }, /*#__PURE__*/React__default.createElement(Link, {
      key: props.contentid + 'topitem',
      href: "/" + props.filename,
      type: "navdropdownitem",
      menutitle: props.menutitle
    }), props.kids.items.map(function (child) {
      return /*#__PURE__*/React__default.createElement(Link, {
        key: child.contentid,
        href: "/" + child.filename,
        type: "navdropdownitem",
        menutitle: child.menutitle
      });
    })));
  }

  return /*#__PURE__*/React__default.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React__default.createElement(Link, {
    key: props.contentid,
    href: "/" + props.filename,
    type: "navlink",
    menutitle: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("span", {
      dangerouslySetInnerHTML: createIcon()
    }), " ", props.menutitle, " ")
  }));
};

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

function getDefaultQueryPropsFromLayout$1(layout, item) {
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

function ResourceHub(props) {
  var Mura = nextCore.getMura();
  var objectparams = Object.assign({}, props);
  var DynamicCollectionLayout = getLayout(objectparams.layout).component;
  objectparams.fields = objectparams.fields || getDefaultQueryPropsFromLayout$1(DynamicCollectionLayout, objectparams).fields || 'Image,Date,Title,Summary,Credits,Tags';
  var tags = '';
  var author = '';

  if (!Mura.editing) {
    var router$1 = router.useRouter();
    tags = router$1.query.t;
    author = router$1.query.a;
  }

  var _collection = false;
  var _curSubtype = '*';
  var _curCategoryIds = '*';
  var _curPersonaId = '*';
  var _curCategoriesArray = [];
  var _hasMXP = false;

  if (objectparams.dynamicProps) {
    _collection = new Mura.EntityCollection(objectparams.dynamicProps.collection, Mura._requestcontext);
    _curSubtype = objectparams.dynamicProps.filterprops.subtype;
    _curCategoryIds = objectparams.dynamicProps.filterprops.selectedcats.filter(function (sc) {
      return sc.instanceid == props.instanceid;
    }).map(function (item) {
      return item.value;
    }).join();
    _curPersonaId = objectparams.dynamicProps.filterprops.personaid;
    _curCategoriesArray = objectparams.dynamicProps.filterprops.selectedcats;
    _hasMXP = objectparams.dynamicProps.filterprops.hasmxp;
  }

  var _useState = React.useState(_collection),
      collection = _useState[0],
      setCollection = _useState[1];

  var instanceId = objectparams.instanceid;

  var _useState2 = React.useState(_curSubtype),
      curSubtype = _useState2[0],
      setCurSubtype = _useState2[1];

  var _useState3 = React.useState(_curCategoriesArray),
      curCategoriesArray = _useState3[0],
      setCurCategoriesArray = _useState3[1];

  var _useState4 = React.useState(_curCategoryIds),
      curCategoryIds = _useState4[0],
      setCurCategoryIds = _useState4[1];

  var _useState5 = React.useState(_curPersonaId),
      curPersonaId = _useState5[0],
      setCurPersonaId = _useState5[1];

  var _useState6 = React.useState(''),
      curSearchText = _useState6[0],
      setCurSearchText = _useState6[1];

  var _useState7 = React.useState(_hasMXP),
      hasMXP = _useState7[0],
      setHasMXP = _useState7[1];

  var _useState8 = React.useState(objectparams.showtextsearch),
      showTextSearch = _useState8[0];

  var _useState9 = React.useState(false),
      newFilter = _useState9[0],
      setNewFilter = _useState9[1];

  var _useState10 = React.useState(new Date().toString()),
      filterUpdated = _useState10[0],
      setFilterUpdated = _useState10[1];

  React.useEffect(function () {
    return function () {
    };
  }, []);

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    setCurSearchText(curSearchText);
    setNewFilter(true);
    setFilterUpdated(new Date().toString());
  };

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
        if (!curCategoryIds.includes(e.target.value)) ;

        setCurCategoriesArray(updateCategoryIds(e.target.name, e.target.value, curCategoriesArray, instanceId));
        setCurCategoryIds(getCategoryIds(curCategoriesArray.filter(function (sc) {
          return sc.instanceid == instanceId;
        })));
        setNewFilter(true);
        setFilterUpdated(new Date().toString());
    }
  };

  if (!objectparams.dynamicProps) {
    React.useEffect(function () {
      var isMounted = true;

      if (isMounted) {
        getFilterProps(curSubtype, curCategoryIds, curPersonaId, curCategoriesArray, newFilter).then(function (filterProps) {
          if (isMounted) {
            setHasMXP(filterProps.hasmxp);
            setCurSubtype(filterProps.subtype);
            setCurCategoryIds(filterProps.selectedcats.filter(function (sc) {
              return sc.instanceid == props.instanceid;
            }).map(function (item) {
              return item.value;
            }).join());
            setCurPersonaId(filterProps.personaid);
            setCurCategoriesArray(filterProps.selectedcats);

            if (isMounted) {
              getCollection(props, filterProps, curSearchText, tags, author).then(function (collection) {
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
      return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(RenderFilterForm, _extends({
        updateFilter: updateFilter
      }, props, {
        curSubtype: curSubtype,
        curCategoryId: curCategoryIds,
        curPersonaId: curPersonaId,
        curCategoriesArray: curCategoriesArray,
        hasMXP: hasMXP,
        handleSubmit: handleSubmit,
        curSearchText: curSearchText,
        setCurSearchText: setCurSearchText,
        showTextSearch: showTextSearch
      })), /*#__PURE__*/React__default.createElement(DynamicCollectionLayout, {
        setCollection: setCollection,
        collection: collection,
        props: props,
        link: RouterlessLink
      }));
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  } else {
    React.useEffect(function () {
      var isMounted = true;

      if (isMounted) {
        getFilterProps(curSubtype, curCategoryIds, curPersonaId, curCategoriesArray, newFilter).then(function (filterProps) {
          if (isMounted) {
            setHasMXP(filterProps.hasmxp);
            setCurSubtype(filterProps.subtype);
            setCurCategoryIds(filterProps.categoryid);
            setCurPersonaId(filterProps.personaid);
            setCurCategoriesArray(filterProps.selectedcats);
            getCollection(props, filterProps, curSearchText, tags, author).then(function (collection) {
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
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(RenderFilterForm, _extends({
      updateFilter: updateFilter
    }, props, {
      curSubtype: curSubtype,
      curCategoryId: curCategoryIds,
      curPersonaId: curPersonaId,
      curCategoriesArray: curCategoriesArray,
      hasMXP: hasMXP,
      handleSubmit: handleSubmit,
      curSearchText: curSearchText,
      setCurSearchText: setCurSearchText,
      showTextSearch: showTextSearch
    })), /*#__PURE__*/React__default.createElement(DynamicCollectionLayout, {
      setCollection: setCollection,
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
};

var getCollection = function getCollection(props, filterProps, curSearchText, tags, author) {
  try {
    var Mura = props.Mura || nextCore.getMura();
    var filterCategories = filterProps.categoryid;

    if (typeof props.content.getAll != 'undefined') {
      props.content = props.content.getAll();
    }

    if (filterProps.selectedcats.length) {
      filterCategories = filterProps.selectedcats.filter(function (sc) {
        return sc.instanceid == props.instanceid;
      }).map(function (item) {
        return item.value;
      });

      for (var i = 0; i < filterCategories.length; i++) {
        if (filterCategories[i] === '*') {
          filterCategories.splice(i, 1);
          i--;
        }
      }
    }

    var collection;

    var _temp3 = _catch(function () {
      var excludeIDList = props.content.contentid;
      var feed = Mura.getFeed('content');
      feed.prop('type').isIn('Page,Link,File');
      feed.andProp('path').containsValue(props.content.contentid);
      feed.andProp('contentid').isNotIn(excludeIDList);
      feed.expand('categoryassignments');
      feed.andProp('subtype').isNEQ('Author');
      feed.andProp('subtype').isNEQ('Confirmation');
      feed.andProp('subtype').isNEQ('Folder');
      feed.fields(getSelectFields(props));

      if (filterProps.subtype.length) {
        feed.andProp('subtype').isEQ(filterProps.subtype);
      }

      if (filterCategories.length) {
        feed.andProp('categoryid').isIn(filterCategories);
        feed.useCategoryIntersect(true);
      }

      if (curSearchText && curSearchText.length) {
        feed.andOpenGrouping();
        feed.orProp('title').containsValue(curSearchText);
        feed.orProp('body').containsValue(curSearchText);
        feed.orProp('summary').containsValue(curSearchText);
        feed.closeGrouping();
      }

      if (tags) {
        feed.andProp('tag').containsValue(tags);
      }

      if (author) {
        feed.andProp('Credits').isEQ(author);
      }

      feed.maxItems(props.maxitems);

      if (Mura.renderMode != 'static') {
        feed.itemsPerPage(props.nextn);
      } else {
        feed.itemsPerPage(0);
      }

      var _temp = function () {
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

      if (_temp && _temp.then) return _temp.then(function () {});
    }, function (e) {
      console.log('error getting colleciton ', e);
    });

    return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {
      return collection;
    }) : collection);
  } catch (e) {
    return Promise.reject(e);
  }
};

var getFilterProps = function getFilterProps(subtype, categoryid, personaid, selectedcategories, newfilter) {
  try {
    var Mura = nextCore.getMura();
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

  var _useState11 = React.useState(false),
      categoriesArray = _useState11[0],
      setCategoriesArray = _useState11[1];

  var _useState12 = React.useState(false),
      personasArray = _useState12[0],
      setPersonasArray = _useState12[1];

  var subtypesArray = objectparams.subtypes ? objectparams.subtypes.split(',') : [];
  var categoryIds = objectparams.categoryids ? objectparams.categoryids.split(',') : [];
  var personaIds = objectparams.personaids ? objectparams.personaids.split(',') : [];
  React.useEffect(function () {
    var isMounted = true;

    if (isMounted && categoryIds && categoryIds.length) {
      getCategoriesInfo(categoryIds).then(function (data) {
        if (isMounted && data.items.length) {
          setCategoriesArray(data.items);
        }
      });
    }

    if (isMounted && personaIds && personaIds.length) {
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
  return /*#__PURE__*/React__default.createElement(Form, {
    className: "row row-cols-1 row-cols-sm-2 row-cols-lg-3",
    id: "resource-filter-form",
    onSubmit: props.handleSubmit
  }, props.showTextSearch && /*#__PURE__*/React__default.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React__default.createElement(Form.Label, null, "Search:"), /*#__PURE__*/React__default.createElement(InputGroup, {
    controlid: "textSearch",
    className: "text"
  }, /*#__PURE__*/React__default.createElement(Form.Control, {
    type: "text",
    name: "s",
    placeholder: "Search",
    value: props.curSearchText,
    onChange: function onChange(e) {
      return props.setCurSearchText(e.target.value);
    }
  }), /*#__PURE__*/React__default.createElement(InputGroup.Append, null, /*#__PURE__*/React__default.createElement(Button, {
    variant: "secondary",
    type: "submit"
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faSearch,
    size: "lg"
  }))))), subtypesArray && subtypesArray.length > 0 && /*#__PURE__*/React__default.createElement(Form.Group, {
    controlid: "selectSubtypes",
    className: "col type"
  }, /*#__PURE__*/React__default.createElement(Form.Label, null, "Content Types:"), /*#__PURE__*/React__default.createElement(Form.Control, {
    as: "select",
    name: "subtype",
    custom: true,
    onChange: props.updateFilter,
    value: props.curSubtype
  }, /*#__PURE__*/React__default.createElement("option", {
    value: "*",
    key: "All Subtypes"
  }, "All"), subtypesArray.map(function (subtype, index) {
    return /*#__PURE__*/React__default.createElement("option", {
      value: subtype,
      key: index
    }, subtype);
  }))), categoriesArray && categoriesArray.length > 0 && /*#__PURE__*/React__default.createElement(React__default.Fragment, null, categoriesArray.map(function (category, index) {
    return /*#__PURE__*/React__default.createElement(CategorySelect, {
      categoryid: category.categoryid,
      filterlabel: category.name,
      updateFilter: props.updateFilter,
      curCategoryId: props.curCategoryId,
      key: category.categoryid,
      curCategoriesArray: props.curCategoriesArray
    });
  })), props.hasMXP && personasArray.length > 0 && /*#__PURE__*/React__default.createElement(Form.Group, {
    controlid: "selectPersonas",
    className: "col topic"
  }, /*#__PURE__*/React__default.createElement(Form.Label, null, "Audience:"), /*#__PURE__*/React__default.createElement(Form.Control, {
    as: "select",
    name: "personaid",
    custom: true,
    onChange: props.updateFilter,
    value: props.curPersonaId
  }, /*#__PURE__*/React__default.createElement("option", {
    value: "*",
    key: "All Personas"
  }, "All"), personasArray.map(function (option) {
    return /*#__PURE__*/React__default.createElement("option", {
      value: option.personaid,
      key: option.personaid
    }, option.name);
  }))));
};

var CategorySelect = function CategorySelect(props) {
  var _useState13 = React.useState([]),
      categoryKids = _useState13[0],
      setCategoryKids = _useState13[1];

  var curSelectValue = '*';
  React.useEffect(function () {
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

  return /*#__PURE__*/React__default.createElement(Form.Group, {
    controlid: "selectCategories" + props.filterlabel,
    className: "col topic"
  }, /*#__PURE__*/React__default.createElement(Form.Label, null, props.filterlabel, ":"), /*#__PURE__*/React__default.createElement(Form.Control, {
    as: "select",
    name: "categoryid" + props.filterlabel,
    custom: true,
    onChange: props.updateFilter,
    value: curSelectValue
  }, /*#__PURE__*/React__default.createElement("option", {
    value: "*",
    key: "All Categories"
  }, "All ", props.filterlabel), categoryKids.map(function (category, index) {
    return /*#__PURE__*/React__default.createElement("option", {
      value: category.categoryid,
      key: index
    }, category.name);
  })));
};

var getCategoriesInfo = function getCategoriesInfo(categoryIds) {
  try {
    var Mura = nextCore.getMura();
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
    var Mura = nextCore.getMura();
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
    var Mura = nextCore.getMura();
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

var updateCategoryIds = function updateCategoryIds(name, value, curCategoriesArray, InstanceId) {
  var match = 0;

  for (var i = 0; i < curCategoriesArray.length; i++) {
    if (curCategoriesArray[i].name === name) {
      curCategoriesArray[i].value = value;
      curCategoriesArray[i].instanceid = InstanceId;
      match = 1;
      break;
    }
  }

  if (!match) {
    curCategoriesArray.push({
      name: name,
      value: value,
      instanceid: InstanceId
    });
  }

  return curCategoriesArray;
};

function Text(props) {
  var objectparams = Object.assign({}, props);

  if (!objectparams.dynamicProps && (objectparams.sourcetype === 'component' || objectparams.sourcetype === 'boundattribute')) {
    var _useState = React.useState(''),
        source = _useState[0],
        setSource = _useState[1];

    React.useEffect(function () {
      getDynamicProps$4(objectparams).then(function (dynamicProps) {
        setSource(dynamicProps.source);
      });
    }, []);

    if (source) {
      return /*#__PURE__*/React__default.createElement(OutputMarkup, {
        source: source
      });
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  } else {
    var _source = '';

    if (objectparams.dynamicProps && (objectparams.sourcetype === 'component' || objectparams.sourcetype === 'boundattribute')) {
      _source = objectparams.dynamicProps.source;
    } else {
      _source = objectparams.source;
    }

    if (_source && _source !== 'unconfigured') {
      return /*#__PURE__*/React__default.createElement(OutputMarkup, {
        source: _source
      });
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  }
}

var getDynamicProps$4 = function getDynamicProps(props) {
  try {
    var Mura = props.Mura || nextCore.getMura();
    var data = {};

    var _temp4 = function () {
      if (typeof props.sourcetype !== 'undefined' && (props.sourcetype === 'component' || props.sourcetype === 'boundattribute')) {
        var _temp5 = function () {
          if (props.sourcetype === 'component') {
            var _temp6 = function () {
              if (Mura.isUUID(props.source)) {
                return Promise.resolve(Mura.getEntity('content').loadBy('contentid', props.source, {
                  type: 'component',
                  fields: 'body'
                })).then(function (entity) {
                  data.source = entity.get('body');
                });
              } else {
                return Promise.resolve(Mura.getEntity('content').loadBy('title', props.source, {
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
  var _useState = React.useState(0),
      optIn = _useState[0],
      setOptIn = _useState[1];

  var _useState2 = React.useState(0),
      optOut = _useState2[0],
      setOptOut = _useState2[1];

  var _useState3 = React.useState(1),
      mxpAnon = _useState3[0],
      setMxpAnon = _useState3[1];

  var _useState4 = React.useState(0),
      updateSuccess = _useState4[0],
      setUpdateSuccess = _useState4[1];

  var _useState5 = React.useState(false),
      showingAlert = _useState5[0],
      setShowingAlert = _useState5[1];

  React.useEffect(function () {
    var isMounted = true;

    if (isMounted) {
      getCurrentPrivacy().then(function (result) {
        setMxpAnon(result);
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

  React.useEffect(function () {
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
  React.useEffect(function () {
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
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("h3", null, "Privacy Settings"), updateSuccess == 1 && showingAlert && /*#__PURE__*/React__default.createElement(Alert, {
    variant: "success"
  }, "Your preference has been saved."), /*#__PURE__*/React__default.createElement(Form, {
    onSubmit: handleSubmit,
    "data-autowire": "false"
  }, /*#__PURE__*/React__default.createElement(Form.Group, {
    controlId: "radio_mxp_anon"
  }, /*#__PURE__*/React__default.createElement(Form.Check, {
    type: "radio",
    id: "mxp_anon1",
    name: "mxp_anon",
    value: "0",
    checked: mxpAnon == 0,
    onChange: mxpAnonChanged,
    label: "For a better experience, allow this site to store some identifying information"
  }), /*#__PURE__*/React__default.createElement(Form.Check, {
    type: "radio",
    id: "mxp_anon2",
    name: "mxp_anon",
    value: "1",
    checked: mxpAnon == 1,
    onChange: mxpAnonChanged,
    label: "Do not allow this site to store some identifying information"
  })), /*#__PURE__*/React__default.createElement(Button, {
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

var GatedAsset = function GatedAsset(props) {
  var Mura = props.Mura || nextCore.getMura();
  var objectparams = Object.assign({}, props);

  var _useState = React.useState(false),
      gateIsOpen = _useState[0],
      setGateIsOpen = _useState[1];

  var _useState2 = React.useState(Mura.editing),
      editMode = _useState2[0],
      setEditMode = _useState2[1];

  var gateparams = objectparams.gateparams || {
    object: "container",
    items: [],
    'render': 'client',
    async: false
  };
  var assetparams = objectparams.assetparams || {
    object: "container",
    items: [],
    'render': 'client',
    async: false
  };
  gateparams.ssr = false;
  assetparams.ssr = false;
  gateparams.pinned = true;
  assetparams.pinned = true;

  if (typeof objectparams.isgatelocked == 'undefined') {
    objectparams.isgatelocked = true;
  }

  React.useEffect(function () {
    var isMounted = true;
    var gatedasset = Mura.getEntity('gatedasset');

    if (isMounted) {
      if (typeof Mura.displayObjectInstances[props.instanceid] == 'undefined') {
        Mura.displayObjectInstances[props.instanceid] = new Mura.DisplayObject.GatedAsset(props);
      }

      Mura(document).on('muraContentEditInit', function () {
        if (isMounted) {
          setEditMode(true);
        }
      });
      var module = Mura('div[data-instanceid="' + props.instanceid + '"]');
      module.on('formSubmitSuccess', function (e) {
        if (isMounted && !gateIsOpen) {
          var source = e.target || e.srcElement;
          var formObj = Mura(source).closest('div.mura-object[data-object="form"]');
          gatedasset.invoke('openGate', {
            contentid: props.content.contentid,
            formid: formObj.data('objectid')
          }, 'get');
          setTimeout(function () {
            setGateIsOpen(true);
          }, 4000);
        }
      });

      var handleIsGateOpen = function handleIsGateOpen(response) {
        if (typeof response === 'boolean' && response || typeof response === 'number' && response || typeof response === 'string' && response.toLowerCase() == 'true') {
          if (isMounted) {
            setGateIsOpen(true);
          }
        }
      };

      var checkContainerForOpenGates = function checkContainerForOpenGates(params) {
        if (Array.isArray(params.items)) {
          params.items.forEach(function (item) {
            if (item.object == 'form') {
              gatedasset.invoke('isGateOpen', {
                contentid: props.content.contentid,
                formid: item.objectid
              }, 'get').then(handleIsGateOpen, handleIsGateOpen);
            } else if (item.object == 'container') {
              checkContainerForOpenGates(item);
            }
          });
        }
      };

      if (objectparams.isgatelocked) {
        checkContainerForOpenGates(gateparams);
      } else {
        setGateIsOpen(true);
      }
    }

    return function () {
      isMounted = false;
    };
  }, []);
  return /*#__PURE__*/React__default.createElement("div", null, editMode ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("button", {
    className: !gateIsOpen ? 'btn btn-primary' : 'btn',
    onClick: function onClick() {
      setGateIsOpen(false);
    }
  }, "Gate"), /*#__PURE__*/React__default.createElement("button", {
    className: gateIsOpen ? 'btn btn-primary' : 'btn',
    onClick: function onClick() {
      setGateIsOpen(true);
    }
  }, "Asset")) : null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "mura-gate",
    style: {
      display: !gateIsOpen ? 'block' : 'none'
    }
  }, /*#__PURE__*/React__default.createElement(nextCore.Decorator, _extends({}, gateparams, {
    content: props.content,
    Mura: props.Mura
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "mura-asset",
    style: {
      display: gateIsOpen ? 'block' : 'none'
    }
  }, /*#__PURE__*/React__default.createElement(nextCore.Decorator, _extends({}, assetparams, {
    content: props.content,
    Mura: props.Mura
  })))));
};

var Gist = /*#__PURE__*/function (_React$PureComponent) {
  _inheritsLoose(Gist, _React$PureComponent);

  function Gist() {
    return _React$PureComponent.apply(this, arguments) || this;
  }

  var _proto = Gist.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._updateIframeContent();
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    this._updateIframeContent();
  };

  _proto._defineUrl = function _defineUrl() {
    var _this$props = this.props,
        id = _this$props.id,
        file = _this$props.file;
    var fileArg = file ? "?file=" + file : '';
    return "https://gist.github.com/" + id + ".js" + fileArg;
  };

  _proto._updateIframeContent = function _updateIframeContent() {
    var _this$props2 = this.props,
        id = _this$props2.id,
        file = _this$props2.file;
    var iframe = this.iframeNode;
    var doc = iframe.document;
    if (iframe.contentDocument) doc = iframe.contentDocument;else if (iframe.contentWindow) doc = iframe.contentWindow.document;

    var gistLink = this._defineUrl();

    var gistScript = "<script type=\"text/javascript\" src=\"" + gistLink + "\"></script>";
    var styles = '<style>*{font-size:12px;}</style>';
    var elementId = file ? "gist-" + id + "-" + file : "gist-" + id;
    var resizeScript = "onload=\"parent.document.getElementById('" + elementId + "').style.height=document.body.scrollHeight + 'px'\"";
    var iframeHtml = "<html><head><base target=\"_parent\">" + styles + "</head><body " + resizeScript + ">" + gistScript + "</body></html>";
    doc.open();
    doc.writeln(iframeHtml);
    doc.close();
  };

  _proto.render = function render() {
    var _this = this;

    var _this$props3 = this.props,
        id = _this$props3.id,
        file = _this$props3.file;
    return /*#__PURE__*/React__default.createElement("iframe", {
      ref: function ref(n) {
        _this.iframeNode = n;
      },
      width: "100%",
      frameBorder: 0,
      id: file ? "gist-" + id + "-" + file : "gist-" + id
    });
  };

  return Gist;
}(React__default.PureComponent);

var render = function render(props) {
  var objectparams = Object.assign({}, props);
  objectparams.gistid = objectparams.gistid || '';
  objectparams.file = objectparams.file || '';

  if (objectparams.gistid) {
    return /*#__PURE__*/React__default.createElement(Gist, {
      id: objectparams.gistid,
      file: objectparams.file
    });
  } else {
    return /*#__PURE__*/React__default.createElement("div", null);
  }
};

function getDefaultQueryPropsFromLayout$2(layout, item) {
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

function SearchResults(props) {
  var Mura = props.Mura || nextCore.getMura();
  var objectparams = Object.assign({}, props);
  var DynamicCollectionLayout = getLayout('SearchResultsLayout').component;
  objectparams.fields = objectparams.fields || getDefaultQueryPropsFromLayout$2(DynamicCollectionLayout, objectparams).fields || 'Image,Date,Title,Summary,Credits,Tags';
  var queryText = '';

  if (!Mura.editing) {
    var router$1 = router.useRouter();
    queryText = router$1.query.q;
  }

  objectparams.dynamicProps = objectparams.dynamicProps || {
    something: 'new'
  };

  var _collection = objectparams.dynamicProps.collection ? new Mura.EntityCollection(objectparams.dynamicProps.collection, Mura._requestcontext) : false;

  if (!_collection) {
    var _useState = React.useState(_collection),
        collection = _useState[0],
        setCollection = _useState[1];

    React.useEffect(function () {
      var isMounted = true;

      if (isMounted) {
        getDynamicProps$5(queryText, props).then(function (_dynamicProps) {
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
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(SearchMessage, {
        qText: queryText
      }), /*#__PURE__*/React__default.createElement(DynamicCollectionLayout, {
        setCollection: setCollection,
        collection: collection,
        props: objectparams,
        link: RouterlessLink
      }));
    } else {
      return /*#__PURE__*/React__default.createElement("div", null);
    }
  } else {
    var _useState2 = React.useState(_collection),
        _collection2 = _useState2[0],
        _setCollection = _useState2[1];

    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(SearchMessage, {
      qText: queryText
    }), /*#__PURE__*/React__default.createElement(DynamicCollectionLayout, {
      setCollection: _setCollection,
      collection: _collection2,
      props: props,
      link: RouterLink
    }));
  }
}

var getDynamicProps$5 = function getDynamicProps(queryText, props) {
  try {
    var Mura = props.Mura || nextCore.getMura();
    var data = {};
    var feed = Mura.getFeed('content');
    feed.prop('subtype').isNEQ('Author');
    feed.andProp('subtype').isNEQ('Confirmation');
    feed.andOpenGrouping();
    feed.orProp('title').containsValue(queryText);
    feed.orProp('body').containsValue(queryText);
    feed.orProp('summary').containsValue(queryText);
    feed.closeGrouping();
    feed.maxItems(props.maxitems);

    if (Mura.renderMode != 'static') {
      feed.itemsPerPage(props.nextn);
    } else {
      feed.itemsPerPage(0);
    }

    return Promise.resolve(feed.getQuery()).then(function (query) {
      data.collection = query.getAll();
      return data;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var SearchMessage = function SearchMessage(props) {
  var qText = props.qText;
  return /*#__PURE__*/React__default.createElement(Alert, {
    variant: "info"
  }, /*#__PURE__*/React__default.createElement("p", {
    className: "mb-0"
  }, "Results for your search of: ", /*#__PURE__*/React__default.createElement("strong", null, qText)));
};

var SearchResultsLayout = function SearchResultsLayout(_ref) {
  var props = _ref.props,
      collection = _ref.collection,
      setCollection = _ref.setCollection,
      link = _ref.link;

  var _useState = React.useState(0),
      pos = _useState[0],
      setPos = _useState[1];

  return /*#__PURE__*/React__default.createElement("div", {
    className: "searchResultsLayout"
  }, /*#__PURE__*/React__default.createElement(CurrentItems$7, _extends({
    collection: collection,
    pos: pos,
    link: link
  }, props)), /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React__default.createElement(CollectionNav, _extends({
    setCollection: setCollection,
    collection: collection,
    pos: pos,
    setPos: setPos,
    link: link
  }, props)))));
};

var CurrentItems$7 = function CurrentItems(props) {
  var Mura = props.Mura || nextCore.getMura();
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
  var startIndex = collection.get('startindex');

  if (Mura.renderMode != 'static' && scrollpages) {
    itemsTo = items.length;
  } else {
    if (maxItems < items.length && pos + nextn > maxItems) {
      itemsTo = maxItems;
    }
  }

  for (var i = pos; i < itemsTo; i++) {
    item = items[i];
    itemsList.push( /*#__PURE__*/React__default.createElement("div", {
      className: "row mb-3",
      key: item.get('contentid')
    }, /*#__PURE__*/React__default.createElement(ListImage$1, {
      fieldlist: fieldlist,
      item: item,
      imagesize: props.imagesize
    }), /*#__PURE__*/React__default.createElement(ListMeta$1, {
      startIndex: startIndex,
      index: i,
      pos: pos,
      itemsTo: itemsTo,
      fieldlist: fieldlist,
      item: item,
      Link: Link
    })));
  }

  return itemsList;
};

var ListImage$1 = function ListImage(props) {
  var fieldlist = props.fieldlist,
      item = props.item;
  var hasImage = false;

  if (fieldlist.indexOf("image") > -1) {
    hasImage = true;
  }

  if (hasImage) {
    var imagesize = props.imagesize || 'medium';
    return /*#__PURE__*/React__default.createElement("div", {
      className: "col-12 col-md-3 mb-3 pr-md-0"
    }, /*#__PURE__*/React__default.createElement(ItemImage, {
      image: item.get('images')[imagesize],
      className: "img-fluid",
      alt: item.get('title'),
      key: "image"
    }));
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

var ListMeta$1 = function ListMeta(props) {
  var fieldlist = props.fieldlist,
      item = props.item,
      Link = props.Link,
      index = props.index,
      startIndex = props.startIndex;
  var currentIndex = index + startIndex;

  if (fieldlist.indexOf("image") > -1) ;

  if (item.get('type') === "Link") ;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "col-12 py-3"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "mura-item-meta"
  }, fieldlist.map(function (field) {
    switch (field) {
      case "title":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__title",
          key: item.get('field')
        }, /*#__PURE__*/React__default.createElement("h3", null, /*#__PURE__*/React__default.createElement(Link, {
          href: "/" + item.get('filename'),
          className: "text-dark"
        }, currentIndex, ". ", item.get('title'))));

      case "date":
      case "releasedate":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__date",
          key: "date"
        }, /*#__PURE__*/React__default.createElement(ItemDate, {
          releasedate: item.get('releasedate'),
          lastupdate: item.get('lastupdate')
        }));

      case "summary":
        return /*#__PURE__*/React__default.createElement(OutputMarkup, {
          source: item.get('summary'),
          key: field
        });

      case "readmore":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__readmore",
          key: field
        }, /*#__PURE__*/React__default.createElement(CollectionReadMoreBtn, {
          href: "/" + item.get('filename'),
          ctatext: "Read More",
          link: Link,
          key: item.get('contentid')
        }));

      case "credits":
        if (item.get('credits').length) {
          return /*#__PURE__*/React__default.createElement("div", {
            className: "mura-item-meta__credits"
          }, /*#__PURE__*/React__default.createElement(ItemCredits, {
            credits: item.get('credits'),
            key: "credits"
          }));
        }

        return null;

      case "tags":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__tags pb-2",
          key: "tags"
        }, /*#__PURE__*/React__default.createElement(ItemTags, {
          tags: item.get('tags')
        }));

      default:
        return /*#__PURE__*/React__default.createElement("div", {
          className: "mura-item-meta__" + field,
          key: field,
          "data-value": item.get(field)
        }, item.get(field));
    }
  })));
};

function SearchForm(props) {
  return /*#__PURE__*/React__default.createElement(Form, {
    method: "get",
    id: "searchForm",
    className: "form-inline ml-5",
    role: "search",
    action: "/search-results",
    key: "siteSearch"
  }, /*#__PURE__*/React__default.createElement(InputGroup, {
    className: ""
  }, /*#__PURE__*/React__default.createElement(Form.Control, {
    placeholder: "Search",
    "aria-label": "Search",
    "aria-describedby": "Search",
    name: "q",
    type: "text"
  }), /*#__PURE__*/React__default.createElement(InputGroup.Append, null, /*#__PURE__*/React__default.createElement(Button, {
    variant: "light",
    type: "submit"
  }, /*#__PURE__*/React__default.createElement(reactFontawesome.FontAwesomeIcon, {
    icon: freeSolidSvgIcons.faSearch,
    size: "lg"
  })))));
}

function UtilityNav(props) {
  var objectparams = Object.assign({}, props);

  if (!objectparams.dynamicProps) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "mura-utility-links"
    }, /*#__PURE__*/React__default.createElement(UtilityLinks, props));
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "mura-utility-links"
    });
  }
}

var UtilityLinks = function UtilityLinks(props) {
  var CustomLinks = props.customlinks ? Array.from(props.customlinks) : [];

  if (CustomLinks && CustomLinks.length) {
    var _UtilityLinks = CustomLinks.map(function (link) {
      return /*#__PURE__*/React__default.createElement("li", {
        className: "list-inline-item",
        key: link.name
      }, /*#__PURE__*/React__default.createElement("a", {
        href: link.value,
        target: props.linktarget && props.linktarget != "_self" ? props.linktarget : ''
      }, link.name));
    });

    return /*#__PURE__*/React__default.createElement("ul", {
      className: "list-inline"
    }, _UtilityLinks);
  }

  return null;
};

var MuraClassicWrapper = function MuraClassicWrapper(props) {
  var Mura = props.Mura;
  var objectparams = Object.assign({}, props);
  objectparams.html = objectparams.html || '';
  var containerid = 'mc-container-' + objectparams.instanceid;
  React.useEffect(function () {
    if (!objectparams.dynamicProps || !objectparams.dynamicProps.html) {
      getDynamicProps$6(objectparams).then(function (dynamicProps) {
        Mura('#' + containerid).html(objectparams.dynamicProps.html);
      });
    } else {
      Mura('#' + containerid).html(objectparams.dynamicProps.html);
    }
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    id: containerid
  });
};
var getDynamicProps$6 = function getDynamicProps(props) {
  try {
    var Mura = props.Mura;
    var objectparams = Object.assign({}, props);
    delete props.moduleStyleData;
    delete props.content;
    delete props.queryParams;
    delete props.dynamicProps;
    delete props.queryParams;
    delete props.regionContext;
    delete props.objectname;
    delete props.objecticon;
    delete props.objecticonclass;
    delete props.Mura;
    objectparams.render = "server";
    objectparams.method = 'processAsyncObject';
    objectparams.decoupled = false;
    return Promise.resolve(Mura.get(Mura.getAPIEndpoint(), objectparams)).then(function (result) {
      return result.data;
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

exports.ArticleMeta = ArticleMeta;
exports.CTAButton = CTAButton;
exports.Collection = Collection;
exports.CollectionLayout = CollectionLayout;
exports.CollectionLayoutAccordion = CollectionLayoutAccordian;
exports.CollectionLayoutAlternatingBoxes = AlternatingBoxes;
exports.CollectionLayoutAlternatingRows = AlternatingRows;
exports.CollectionLayoutCards = Cards;
exports.CollectionLayoutList = List;
exports.CollectionLayoutMasonry = Masonry;
exports.CollectionLayoutSlickSlider = SlickSlider;
exports.CollectionNav = CollectionNav;
exports.CollectionReadMoreBtn = CollectionReadMoreBtn;
exports.Container = Container;
exports.Embed = Embed;
exports.GatedAsset = GatedAsset;
exports.Gist = render;
exports.Hr = Hr;
exports.Image = Image;
exports.ItemCategories = ItemCategories$1;
exports.ItemCredits = ItemCredits;
exports.ItemDate = ItemDate;
exports.ItemImage = ItemImage;
exports.ItemTags = ItemTags;
exports.Login = Login;
exports.MatrixSelector = MatrixSelector;
exports.MuraClassicWrapper = MuraClassicWrapper;
exports.NoItemsMessage = CheckForItems;
exports.OutputMarkup = OutputMarkup;
exports.PrimaryNav = PrimaryNav;
exports.PrivacyTools = PrivacyTools;
exports.ResourceHub = ResourceHub;
exports.RouterLink = RouterLink;
exports.RouterlessLink = RouterlessLink;
exports.SearchForm = SearchForm;
exports.SearchResults = SearchResults;
exports.SearchResultsLayout = SearchResultsLayout;
exports.Text = Text;
exports.UtilityNav = UtilityNav;
exports.Video = Video;
exports.getClassicDynamicProps = getDynamicProps$6;
exports.getCollectionDynamicProps = getDynamicProps;
exports.getCollectionLayout = getLayout;
exports.getCollectionLayoutAccordionQueryProps = getQueryProps$1;
exports.getCollectionLayoutAlternatingBoxesQueryProps = getQueryProps$2;
exports.getCollectionLayoutAlternatingRowsQueryProps = getQueryProps$3;
exports.getCollectionLayoutCardsQueryProps = getQueryProps$4;
exports.getCollectionLayoutListQueryProps = getQueryProps$5;
exports.getCollectionLayoutMasonryQueryProps = getQueryProps$6;
exports.getCollectionLayoutQueryProps = getQueryProps;
exports.getCollectionLayoutSlickSliderQueryProps = getQueryProps$7;
exports.getMatrixSelectorDynamicProps = getDynamicProps$1;
exports.getPrimaryNavDynamicProps = getDynamicProps$2;
exports.getResourceHubDynamicProps = getDynamicProps$3;
exports.getSearchResultsDynamicProps = getDynamicProps$5;
exports.getTextDynamicProps = getDynamicProps$4;
//# sourceMappingURL=index.js.map
