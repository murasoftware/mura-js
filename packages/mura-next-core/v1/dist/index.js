function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var Mura = _interopDefault(require('mura.js'));

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

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/(function() {
	function _Pact() {}
	_Pact.prototype.then = function(onFulfilled, onRejected) {
		const result = new _Pact();
		const state = this.s;
		if (state) {
			const callback = state & 1 ? onFulfilled : onRejected;
			if (callback) {
				try {
					_settle(result, 1, callback(this.v));
				} catch (e) {
					_settle(result, 2, e);
				}
				return result;
			} else {
				return this;
			}
		}
		this.o = function(_this) {
			try {
				const value = _this.v;
				if (_this.s & 1) {
					_settle(result, 1, onFulfilled ? onFulfilled(value) : value);
				} else if (onRejected) {
					_settle(result, 1, onRejected(value));
				} else {
					_settle(result, 2, value);
				}
			} catch (e) {
				_settle(result, 2, e);
			}
		};
		return result;
	};
	return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
	if (!pact.s) {
		if (value instanceof _Pact) {
			if (value.s) {
				if (state & 1) {
					state = value.s;
				}
				value = value.v;
			} else {
				value.o = _settle.bind(null, pact, state);
				return;
			}
		}
		if (value && value.then) {
			value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
			return;
		}
		pact.s = state;
		pact.v = value;
		const observer = pact.o;
		if (observer) {
			observer(pact);
		}
	}
}

function _isSettledPact(thenable) {
	return thenable instanceof _Pact && thenable.s & 1;
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
	var i = -1, pact, reject;
	function _cycle(result) {
		try {
			while (++i < array.length && (!check || !check())) {
				result = body(i);
				if (result && result.then) {
					if (_isSettledPact(result)) {
						result = result.v;
					} else {
						result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
						return;
					}
				}
			}
			if (pact) {
				_settle(pact, 1, result);
			} else {
				pact = result;
			}
		} catch (e) {
			_settle(pact || (pact = new _Pact()), 2, e);
		}
	}
	_cycle();
	return pact;
}

// Asynchronously iterate through an object's properties (including properties inherited from the prototype)
// Uses a snapshot of the object's properties
function _forIn(target, body, check) {
	var keys = [];
	for (var key in target) {
		keys.push(key);
	}
	return _forTo(keys, function(i) { return body(keys[i]); }, check);
}

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

var getModuleProps = function getModuleProps(item, moduleStyleData, isEditMode, content, queryParams, requestContext) {
  try {
    var _temp29 = function _temp29() {
      if (isEditMode || !Mura.isInNode()) {
        return {
          cssRules: []
        };
      } else {
        var styleData = Mura.recordModuleStyles(item);
        delete styleData.deleteRule;
        delete styleData.insertRule;
        return styleData;
      }
    };

    getMura();

    var _temp30 = _catch(function () {
      var objectkey = item.object;

      if (typeof ComponentRegistry[objectkey] == 'undefined') {
        objectkey = Mura.firstToUpperCase(item.object);
      }

      var _temp26 = function () {
        if (typeof ComponentRegistry[objectkey] != 'undefined') {
          var _temp31 = function _temp31() {
            var _temp23 = function () {
              if (item.object == 'container') {
                if (typeof item.items != 'undefined' && !Array.isArray(item.items)) {
                  try {
                    item.items = JSON.parse(item.items);
                  } catch (e) {
                    item.items = [];
                  }
                }

                var _temp33 = _forIn(item.items, function (containerIdx) {
                  var containerItem = item.items[containerIdx];
                  containerItem.instanceid = containerItem.instanceid || Mura.createUUID();
                  return Promise.resolve(getModuleProps(containerItem, moduleStyleData, isEditMode, content, queryParams, requestContext)).then(function (_getModuleProps3) {
                    moduleStyleData[containerItem.instanceid] = _getModuleProps3;
                  });
                });

                if (_temp33 && _temp33.then) return _temp33.then(function () {});
              }
            }();

            if (_temp23 && _temp23.then) return _temp23.then(function () {});
          };

          var _temp32 = function () {
            if (ComponentRegistry[objectkey].SSR) {
              var _temp34 = _catch(function () {
                return Promise.resolve(ComponentRegistry[objectkey].getDynamicProps(_extends({}, item, {
                  content: content,
                  queryParams: queryParams,
                  requestContext: requestContext
                }))).then(function (_ComponentRegistry$ob) {
                  item.dynamicProps = _ComponentRegistry$ob;
                });
              }, function (e) {
                console.error('Error getting dynamicProps', e);
                item.dynamicProps = {};
              });

              if (_temp34 && _temp34.then) return _temp34.then(function () {});
            }
          }();

          return _temp32 && _temp32.then ? _temp32.then(_temp31) : _temp31(_temp32);
        }
      }();

      if (_temp26 && _temp26.then) return _temp26.then(function () {});
    }, function (e) {
      console.error(e);
    });

    return Promise.resolve(_temp30 && _temp30.then ? _temp30.then(_temp29) : _temp29(_temp30));
  } catch (e) {
    return Promise.reject(e);
  }
};

var getRegionProps = function getRegionProps(content, queryParams, isEditMode, requestContext) {
  try {
    getMura();
    var moduleStyleData = {};
    content.displayregions = content.displayregions || {};
    var regions = Object.values(content.displayregions);

    var _temp19 = _forIn(regions, function (regionIdx) {
      function _temp17() {
        var _temp15 = _forIn(region.local.items, function (itemIdx) {
          var item = region.local.items[itemIdx];
          item.instanceid = item.instanceid || Mura.createUUID();
          return Promise.resolve(getModuleProps(item, moduleStyleData, isEditMode, content, queryParams, requestContext)).then(function (_getModuleProps2) {
            moduleStyleData[item.instanceid] = _getModuleProps2;
          });
        });

        if (_temp15 && _temp15.then) return _temp15.then(function () {});
      }

      var region = regions[regionIdx];

      var _temp16 = function () {
        if (typeof region.inherited != 'undefined' && Array.isArray(region.inherited.items)) {
          var _temp20 = _forIn(region.inherited.items, function (itemdIx) {
            var item = region.inherited.items[itemdIx];
            item.instanceid = item.instanceid || Mura.createUUID();
            return Promise.resolve(getModuleProps(item, moduleStyleData, isEditMode, content, queryParams, requestContext)).then(function (_getModuleProps) {
              moduleStyleData[item.instanceid] = _getModuleProps;
            });
          });

          if (_temp20 && _temp20.then) return _temp20.then(function () {});
        }
      }();

      return _temp16 && _temp16.then ? _temp16.then(_temp17) : _temp17(_temp16);
    });

    return Promise.resolve(_temp19 && _temp19.then ? _temp19.then(function () {
      return moduleStyleData;
    }) : moduleStyleData);
  } catch (e) {
    return Promise.reject(e);
  }
};

var renderContent = function renderContent(context, isEditMode, params, requestContext) {
  try {
    var query = {};

    if (context.browser) {
      query = Mura.getQueryStringParams();
    } else if (context.query) {
      query = _extends({}, context.query);
    }

    if (isEditMode) {
      query.isEditRoute = isEditMode;
    }

    var filename = '';

    if (context.params && context.params.page) {
      filename = [].concat(context.params.page);
    }

    if (Array.isArray(filename)) {
      if (filename.length && filename[0] == connectorConfig.siteid) {
        filename.shift();
      }

      filename = filename.join("/");
    }

    query = Object.assign(query, params);
    return Promise.resolve(requestContext.renderFilename(filename, query).then(function (rendered) {
      return Promise.resolve(rendered);
    }, function (rendered) {
      return Promise.resolve(rendered);
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

require('mura.js/src/core/stylemap-static');

var muraConfig, connectorConfig, ComponentRegistry, ConnectorConfig, ExternalModules;
var isEditMode = false;
var MuraJSRefPlaceholder = '"undefined"!=typeof window&&function(u){u.queuedMuraCmds=[],u.queuedMuraPreInitCmds=[],"function"!=typeof u.Mura&&(u.Mura=u.mura=u.Mura=function(e){u.queuedMuraCmds.push(e)},u.Mura.preInit=function(e){u.queuedMuraPreInitCmds.push(e)})}(window);';
var setIsEditMode = function setIsEditMode(value) {
  isEditMode = value;
};
var getIsEditMode = function getIsEditMode() {
  return isEditMode;
};
var setMuraConfig = function setMuraConfig(config) {
  muraConfig = config;
  ComponentRegistry = config.ComponentRegistry;
  ConnectorConfig = config.ConnectorConfig;
  ExternalModules = config.ExternalModules;
  connectorConfig = Object.assign({
    processMarkup: false
  }, ConnectorConfig);
};
var getMuraConfig = function getMuraConfig() {
  return muraConfig;
};
var useAsync = function useAsync(asyncFn, onSuccess) {
  React.useEffect(function () {
    var isMounted = true;
    asyncFn().then(function (data) {
      if (isMounted) onSuccess(data);
    });
    return function () {
      isMounted = false;
    };
  }, [asyncFn, onSuccess]);
};
var getHref = function getHref(filename) {
  var path = filename.split('/').filter(function (item) {
    return item.length;
  });

  if (connectorConfig.siteidinurls) {
    if (path.length) {
      return '/' + Mura.siteid + '/' + path.join('/') + '/';
    } else {
      return '/' + Mura.siteid + '/';
    }
  } else {
    if (path.length) {
      return '/' + path.join('/') + '/';
    } else {
      return '/';
    }
  }
};
var getComponent = function getComponent(item) {
  getMura();
  var objectkey = item.object;

  if (typeof ComponentRegistry[objectkey] == 'undefined') {
    objectkey = Mura.firstToUpperCase(item.object);
  }

  if (typeof ComponentRegistry[objectkey] != 'undefined') {
    var ComponentVariable = ComponentRegistry[objectkey].component;
    return /*#__PURE__*/React__default.createElement(ComponentVariable, _extends({
      key: item.instanceid
    }, item));
  }

  return /*#__PURE__*/React__default.createElement("p", {
    key: item.instanceid
  }, "DisplayRegion: ", item.objectname);
};
var getMuraPaths = function getMuraPaths() {
  try {
    var _temp3 = function _temp3() {
      var paths = pathList.map(function (item) {
        var page = [];

        if (item.filename) {
          page = item.filename.split('/');
        }

        page.unshift(item.siteid);
        console.log(item.filename, page);
        return {
          params: {
            page: page
          }
        };
      }).filter(function (item) {
        return item.params.page.length || item.params.page[0];
      });
      return paths;
    };

    var siteids = ConnectorConfig.siteid;
    var pathList = [];

    if (!Array.isArray(siteids)) {
      siteids = siteids.split();
    }

    var _temp4 = _forTo(siteids, function (index) {
      getMura(siteids[index]);
      return Promise.resolve(Mura.getFeed('content').maxItems(0).itemsPerPage(0).sort('orderno').where().prop('type').isNotIn('File,Link,Calendar').getQuery({
        renderMode: 'static'
      })).then(function (items) {
        pathList = pathList.concat(items.getAll().items);
        pathList.push({
          siteid: siteids[index],
          filename: ""
        });
      });
    });

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
};
var getMura = function getMura(context) {
  var startingsiteid = Mura.siteid;

  if (typeof context == 'string' && ConnectorConfig.siteid.find(function (item) {
    return item === context;
  })) {
    connectorConfig.siteid = context;
  } else {
    var ishomepage = context && !(context.params && context.params.page) || typeof location != 'undefined' && (location.pathname == "/" || location.pathname == ConnectorConfig.editroute + "/");

    if (Array.isArray(ConnectorConfig.siteid)) {
      if (ishomepage) {
        connectorConfig.siteid = ConnectorConfig.siteid[0];
      } else {
        var page = [];

        if (context && context.params && context.params.page) {
          page = [].concat(context.params.page);
          page = page.filter(function (item) {
            return item.length;
          });
        } else if (typeof location != 'undefined') {
          page = location.pathname.split("/");
          page = page.filter(function (item) {
            return item.length;
          });

          if (page.length && ConnectorConfig.editroute && page[0] === ConnectorConfig.editroute.split("/")[1]) {
            page.shift();
          }
        }

        if (page.length) {
          if (ConnectorConfig.siteid.find(function (item) {
            return item === page[0];
          })) {
            connectorConfig.siteid = page[0];
            connectorConfig.siteidinurls = true;
          } else {
            connectorConfig.siteid = ConnectorConfig.siteid[0];
          }
        }
      }
    }
  }

  var clearMuraAPICache = function clearMuraAPICache() {
    delete connectorConfig.apiEndpoint;
    delete connectorConfig.apiendpoint;
    delete Mura.apiEndpoint;
    delete Mura.apiendpoint;
  };

  if (context && context.res) {
    Object.assign(connectorConfig, {
      response: context.res,
      request: context.req
    });
    clearMuraAPICache();
    Mura.init(connectorConfig);
  } else if (startingsiteid != connectorConfig.siteid) {
    clearMuraAPICache();
    Mura.init(connectorConfig);
  }

  Mura.holdReady(true);
  return Mura;
};
var getRootPath = function getRootPath() {
  return getMura().rootpath;
};
var getSiteName = function getSiteName() {
  return getMura().sitename;
};
var getMuraProps = function getMuraProps(context, isEditMode, params, callback) {
  try {
    var _content;

    var _temp12 = function _temp12() {
      if (content.filename == '404') {
        if (typeof context.params != 'undefined') {
          console.error('404 rendering content', context.params);
        }

        if (typeof context.res != 'undefined') {
          context.res.statusCode = 404;
        }
      }

      if (typeof content.isondisplay != 'undefined' && !content.isondisplay) {
        context.res.statusCode = 404;
      } else {
        if (content.redirect) {
          context.res.setHeader('Location', content.redirect);

          if (content.statuscode) {
            context.res.statusCode = content.statuscode;
          } else {
            context.res.statusCode = 301;
          }

          if (context.res.statusCode != 301) {
            context.res.setHeader('Cache-Control', 'no-cache, no-store');
            context.res.setHeader('Expires', 'Mon, 01 Jan 1990 00:00:00 GMT');
          }
        }
      }

      var queryParams = {};

      if (context.browser) {
        queryParams = Mura.getQueryStringParams();
      } else if (context.query) {
        queryParams = _extends({}, context.query);
      }

      return Promise.resolve(getRegionProps(content, queryParams, isEditMode, requestContext)).then(function (moduleStyleData) {
        function _temp9() {
          function _temp7() {
            if (Mura.isInNode() && (typeof callback == 'undefined' || typeof callback == 'boolean' && callback)) {
              Mura.deInit();
            }

            if (isEditMode) {
              return {
                props: props
              };
            } else {
              return {
                props: props,
                revalidate: 1
              };
            }
          }

          var props = {
            content: content,
            moduleStyleData: moduleStyleData,
            externalModules: ExternalModules,
            codeblocks: codeblocks,
            queryParams: queryParams
          };

          var _temp6 = function () {
            if (typeof callback == 'function') {
              return Promise.resolve(callback(callback)).then(function () {});
            }
          }();

          return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
        }

        var codeblocks = {
          header: [],
          bodystart: [],
          footer: []
        };

        var _temp8 = _catch(function () {
          var _temp5 = function () {
            if (connectorConfig.codeblocks && (context.res || context.browser) && !(queryParams.codeblocks && queryParams.codeblocks === "false")) {
              return Promise.resolve(requestContext.getFeed('codeblock').where().prop('active').isEQ(1).getQuery()).then(function (codeCollection) {
                codeCollection.forEach(function (item) {
                  var placement = item.get('placement').toLowerCase();

                  if (placement == 'header') {
                    codeblocks.header.push(item.get('code'));
                  } else if (placement == 'footer') {
                    codeblocks.footer.push(item.get('code'));
                  } else if (placement == 'bodystart') {
                    codeblocks.bodystart.push(item.get('code'));
                  }
                });
              });
            }
          }();

          if (_temp5 && _temp5.then) return _temp5.then(function () {});
        }, function (e) {
          console.error(e);
        });

        return _temp8 && _temp8.then ? _temp8.then(_temp9) : _temp9(_temp8);
      });
    };

    getMura(context);
    setIsEditMode(isEditMode);
    Mura.renderMode = 'dynamic';

    if (!isEditMode) {
      Mura.renderMode = 'static';

      if (Mura.isInNode() && process && process.env && process.env.MURA_SSR_BASICTOKEN) {
        Mura.setRequestHeader("Authorization", "Basic " + process.env.MURA_SSR_BASICTOKEN);
        Mura.setMode("rest");
        Mura.setAPIEndpoint(Mura.getAPIEndpoint().replace('/json/', '/rest/'));
      }
    }

    var requestContext = Mura.getRequestContext();
    var content = (_content = {
      title: "We're sorry, an error occurred",
      menutitle: "We're sorry, an error occurred",
      body: "",
      contentid: Mura.createUUID(),
      isnew: 1,
      siteid: Mura.siteid,
      type: 'Page',
      subtype: 'Default'
    }, _content["contentid"] = Mura.createUUID(), _content.contenthistid = Mura.createUUID(), _content.filename = "500", _content.statusCode = 500, _content.errors = [], _content.displayregions = {
      primarycontent: {
        local: {
          items: []
        }
      }
    }, _content);

    var _temp13 = _catch(function () {
      return Promise.resolve(renderContent(context, isEditMode, params, requestContext)).then(function (muraObject) {
        if (typeof muraObject != 'undefined' && typeof muraObject.getAll != 'undefined') {
          content = muraObject.getAll();
        } else {
          console.error('Error rendering content', muraObject);

          if (typeof context.res != 'undefined') {
            if (typeof muraObject != 'undefined' && typeof muraObject.statusCode != 'undefined') {
              context.res.statusCode = muraObject.statusCode;
            } else {
              context.res.statusCode = 500;
            }
          }
        }
      });
    }, function (e) {
      console.error(e);
    });

    return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(_temp12) : _temp12(_temp13));
  } catch (e) {
    return Promise.reject(e);
  }
};

function Decorator(props) {
  var Mura = getMura();
  var muraConfig = getMuraConfig();
  var ComponentRegistry = muraConfig.ComponentRegistry,
      ExternalModules = muraConfig.ExternalModules;
  var label = props.label,
      instanceid = props.instanceid,
      labeltag = props.labeltag,
      children = props.children;
  var isEditMode = getIsEditMode();

  var _useState = React.useState(false),
      mounted = _useState[0],
      setMounted = _useState[1];

  React.useEffect(function () {
    setMounted(true);
  }, []);
  var objectStyles = {};
  var metaStyles = {};
  var contentStyles = {};

  if (!mounted && isEditMode && typeof props.stylesupport == 'object' && Object.keys(props.stylesupport).length) {
    var _props$stylesupport, _props$stylesupport2, _props$stylesupport3;

    var getModuleTargetStyles = function getModuleTargetStyles(incoming) {
      var styles = {};
      var invalid = {
        backgroundimage: true
      };
      Object.keys(incoming).forEach(function (key) {
        if (!invalid[key]) {
          if (Mura.styleMap.tojs[key]) {
            styles[Mura.styleMap.tojs[key]] = incoming[key];
          } else {
            styles[key] = incoming[key];
          }
        }
      });
      return styles;
    };

    objectStyles = props !== null && props !== void 0 && (_props$stylesupport = props.stylesupport) !== null && _props$stylesupport !== void 0 && _props$stylesupport.objectstyles ? getModuleTargetStyles(props.stylesupport.objectstyles) : {};
    metaStyles = props !== null && props !== void 0 && (_props$stylesupport2 = props.stylesupport) !== null && _props$stylesupport2 !== void 0 && _props$stylesupport2.metastyles ? getModuleTargetStyles(props.stylesupport.metastyles) : {};
    contentStyles = props !== null && props !== void 0 && (_props$stylesupport3 = props.stylesupport) !== null && _props$stylesupport3 !== void 0 && _props$stylesupport3.contentstyles ? getModuleTargetStyles(props.stylesupport.contentstyles) : {};

    if (typeof document != 'undefined') {
      var params = Object.assign({}, {
        stylesupport: props.stylesupport,
        instanceid: props.instanceid
      });
      var sheet = Mura.getStyleSheet('mura-styles-' + params.instanceid);
      var styleTargets = Mura.getModuleStyleTargets(params.instanceid, false);

      while (sheet.cssRules.length) {
        sheet.deleteRule(0);
      }

      Mura.applyModuleStyles(params.stylesupport, styleTargets.object, sheet);
      Mura.applyModuleCustomCSS(params.stylesupport, sheet, params.instanceid);
      Mura.applyModuleStyles(params.stylesupport, styleTargets.meta, sheet);
      Mura.applyModuleStyles(params.stylesupport, styleTargets.content, sheet);
    }
  }

  var domObject = {
    className: 'mura-object mura-async-object',
    'data-inited': true
  };
  var domContent = {
    className: 'mura-object-content'
  };
  var domMeta = {
    className: "mura-object-meta"
  };
  var domMetaWrapper = {
    className: "mura-object-meta-wrapper"
  };
  var isExternalModule = ExternalModules[props.object];
  var objectKey = props.object;

  if (typeof ComponentRegistry[objectKey] == 'undefined') {
    objectKey = Mura.firstToUpperCase(props.object);
  }

  var isSSR = ComponentRegistry[objectKey] && (ComponentRegistry[objectKey].SSR || ComponentRegistry[objectKey].ssr);

  if (typeof props.ssr != "undefined" && !props.ssr || typeof props.SSR != "undefined" && !props.SSR) {
    isSSR = false;
  }

  if (isEditMode || isExternalModule || !isSSR) {
    Object.keys(props).forEach(function (key) {
      if (!['queryParams', 'Router', 'Link', 'html', 'content', 'children', 'isEditMode', 'renderMode', 'dynamicProps', 'moduleStyleData', 'regionContext', 'requestContext', 'Mura'].find(function (restrictedkey) {
        return restrictedkey === key;
      })) {
        if (typeof props[key] === 'object') {
          domObject["data-" + key] = JSON.stringify(props[key]);
        } else if (typeof props[key] !== 'undefined' && !(typeof props[key] === 'string' && props[key] === '')) {
          domObject["data-" + key] = props[key];
        }
      }

      if (typeof props[key] != 'undefined' && props[key]) {
        if (key === 'class') {
          domObject.className += domObject.className ? " " + props[key] : props[key];
        } else if (key === 'cssclass') {
          domObject.className += domObject.className ? " " + props[key] : props[key];
        } else if (key === 'cssid') {
          domObject.id = props[key];
        } else if (key === 'contentcssclass') {
          domContent.className += domContent.className ? " " + props[key] : props[key];
        } else if (key === 'contentcssid') {
          domContent.id = props[key];
        } else if (key === 'metacssclass') {
          domMeta.className += domMeta.className ? " " + props[key] : props[key];
        } else if (key === 'metacssid') {
          domMeta.id = props[key];
        }
      }
    });

    if (domObject.className.split(' ').find(function ($class) {
      return $class === 'constrain';
    })) {
      domMetaWrapper.className += ' container';
    }
  } else {
    domObject['data-instanceid'] = instanceid;
    domObject.className = "mura-object-" + props.object;

    if (typeof props.moduleStyleData != 'undefined' && typeof props.moduleStyleData[instanceid] != 'undefined') {
      domObject.className += " " + props.moduleStyleData[instanceid].targets.object.class;
      domObject.id = props.moduleStyleData[props.instanceid].targets.object.id;
      domContent.className = props.moduleStyleData[props.instanceid].targets.content.class;
      domContent.id = props.moduleStyleData[props.instanceid].targets.content.id;
      domMetaWrapper.className = props.moduleStyleData[props.instanceid].targets.metawrapper.class;
      domMeta.className = props.moduleStyleData[props.instanceid].targets.meta.class;
      domMeta.id = props.moduleStyleData[props.instanceid].targets.meta.id;
    } else {
      domObject.id = '';
      domContent.id = '';
      domMetaWrapper.className = '';
      domMeta.className = '';
      domMeta.id = ';';
    }

    ['objectspacing', 'contentspacing', 'metaspacing'].forEach(function (key) {
      if (typeof props[key] != 'undefined' && props[key] && props[key] != 'custom') {
        domObject['data-' + key] = props[key];
      }
    });
  }

  if (isExternalModule || !isSSR) {
    if (isExternalModule && props.html) {
      /*#__PURE__*/
      React__default.createElement("div", _extends({
        style: objectStyles
      }, domObject), label ? /*#__PURE__*/React__default.createElement("eta", {
        styles: metaStyles,
        label: label,
        labeltag: labeltag,
        dommeta: domMeta,
        dommetawrapper: domMetaWrapper
      }) : null, label ? /*#__PURE__*/React__default.createElement("div", {
        className: "mura-flex-break"
      }) : null, /*#__PURE__*/React__default.createElement("div", _extends({
        style: contentStyles
      }, domContent, {
        dangerouslySetInnerHTML: {
          __html: props.html
        }
      })));
    } else {
      return /*#__PURE__*/React__default.createElement("div", _extends({
        style: objectStyles
      }, domObject));
    }
  } else {
    return /*#__PURE__*/React__default.createElement("div", _extends({
      style: objectStyles
    }, domObject), label ? /*#__PURE__*/React__default.createElement(Meta, {
      styles: metaStyles,
      label: label,
      labeltag: labeltag,
      dommeta: domMeta,
      dommetawrapper: domMetaWrapper
    }) : null, label ? /*#__PURE__*/React__default.createElement("div", {
      className: "mura-flex-break"
    }) : null, /*#__PURE__*/React__default.createElement("div", _extends({
      style: contentStyles
    }, domContent), children));
  }
}

var Meta = function Meta(_ref) {
  var label = _ref.label,
      labeltag = _ref.labeltag,
      dommeta = _ref.dommeta,
      dommetawrapper = _ref.dommetawrapper,
      styles = _ref.styles;
  var LabelHeader = labeltag ? "" + labeltag : 'h2';
  return /*#__PURE__*/React__default.createElement("div", dommetawrapper, /*#__PURE__*/React__default.createElement("div", _extends({
    style: styles
  }, dommeta), /*#__PURE__*/React__default.createElement(LabelHeader, null, label)));
};

var EditContext = React.createContext();
var MuraContext = React.createContext();

var DisplayRegionSection = function DisplayRegionSection(_ref) {
  var children = _ref.children,
      region = _ref.region,
      section = _ref.section,
      isEditMode = _ref.isEditMode;
  var out = null;

  if (typeof region.name !== 'undefined' && isEditMode) {
    if (section === 'inherited' && region.inherited.items.length) {
      out = /*#__PURE__*/React__default.createElement("div", {
        className: "mura-region-inherited"
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "frontEndToolsModal mura"
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "mura-edit-label mi-lock"
      }, region.name.toUpperCase(), ": Inherited")), children);
    }

    if (section === 'local') {
      out = /*#__PURE__*/React__default.createElement("div", {
        className: "mura-editable mura-inactive"
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "mura-region-local mura-inactive mura-editable-attribute",
        "data-loose": "false",
        "data-regionid": region.regionid,
        "data-inited": "false",
        "data-perm": "true"
      }, /*#__PURE__*/React__default.createElement("label", {
        className: "mura-editable-label",
        style: {
          display: 'none'
        }
      }, region.name.toUpperCase()), children));
    }
  } else {
    var regionName = "mura-region-" + section;
    out = /*#__PURE__*/React__default.createElement("div", {
      className: regionName
    }, children);
  }

  return out;
};

var DisplayRegion = function DisplayRegion(_ref2) {
  var region = _ref2.region,
      moduleStyleData = _ref2.moduleStyleData,
      content = _ref2.content,
      context = _ref2.context,
      queryParams = _ref2.queryParams;
  var isEditMode = getIsEditMode();
  var requestContext = getMura().getRequestContext();
  var inherited = '';

  if (region.inherited && region.inherited.items.length) {
    inherited = /*#__PURE__*/React__default.createElement(DisplayRegionSection, {
      region: region,
      isEditMode: isEditMode,
      section: "inherited"
    }, region.inherited.items.map(function (item) {
      var obj = Object.assign({}, item);
      obj.key = obj.instanceid;
      obj.moduleStyleData = moduleStyleData;
      obj.content = content;
      obj.queryParams = queryParams;
      obj.regionContext = context;
      obj.requestContext = requestContext;
      return /*#__PURE__*/React__default.createElement(Decorator, obj, getComponent(obj));
    }));
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "mura-region",
    "data-regionid": region.regionid
  }, inherited, /*#__PURE__*/React__default.createElement(DisplayRegionSection, {
    region: region,
    isEditMode: isEditMode,
    section: "local"
  }, region.local.items.map(function (item) {
    var obj = Object.assign({}, item);
    obj.key = obj.instanceid;
    obj.moduleStyleData = moduleStyleData;
    obj.content = content;
    obj.queryParams = queryParams;
    obj.regionContext = context;
    obj.requestContext = requestContext;
    return /*#__PURE__*/React__default.createElement(Decorator, obj, getComponent(obj));
  })));
};

function ExternalAssets(props) {
  var externalModules = props.externalModules;

  if (typeof externalModules !== 'undefined') {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "mura-external-assets"
    }, Object.keys(externalModules).map(function (key) {
      var module = externalModules[key];

      if (module.js && Array.isArray(module.js)) {
        return module.js.map(function (item) {
          return /*#__PURE__*/React__default.createElement("script", {
            key: item,
            src: item,
            defer: true
          });
        });
      }
    }), Object.keys(externalModules).map(function (key) {
      var module = externalModules[key];

      if (module.css && Array.isArray(module.css)) {
        return module.css.map(function (item) {
          return /*#__PURE__*/React__default.createElement("link", {
            key: item,
            rel: "stylesheet",
            href: item
          });
        });
      }
    }));
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "mura-external-assets"
    });
  }
}

var EditLayout = function EditLayout(_ref) {
  var children = _ref.children;
  setIsEditMode(true);
  return /*#__PURE__*/React__default.createElement("div", null, children, /*#__PURE__*/React__default.createElement("div", {
    id: "htmlqueues"
  }));
};

function Styles(props) {
  var moduleStyleData = props.moduleStyleData;

  if (!getIsEditMode() && typeof moduleStyleData !== 'undefined') {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, Object.keys(moduleStyleData).map(function (instanceid) {
      var rules = moduleStyleData[instanceid];
      var id = "mura-styles-" + instanceid;
      return /*#__PURE__*/React__default.createElement("style", {
        id: id,
        key: id,
        dangerouslySetInnerHTML: {
          __html: rules.cssRules.join('\n')
        }
      });
    }));
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
}

var MainLayout = function MainLayout(props) {
  var Mura = getMura();
  var content = props.content,
      moduleStyleData = props.moduleStyleData,
      children = props.children;
  Mura.moduleStyleData = moduleStyleData;
  React.useEffect(function () {
    contentDidChange(content);
  }, [content.contenthistid]);
  return /*#__PURE__*/React__default.createElement("div", null, children, /*#__PURE__*/React__default.createElement(ExternalAssets, props), /*#__PURE__*/React__default.createElement(Styles, props));
};

function contentDidChange(_content) {
  var content = Mura.getEntity('content').set(_content);
  getMura();

  if (content.get('redirect')) {
    if (Mura.editroute) {
      var pathArray = window.location.pathname.split('/').filter(function (item) {
        if (item) {
          return true;
        }
      });
      var isEditMode = pathArray.length && '/' + pathArray[0] == Mura.editroute;

      if (!isEditMode && content.get('redirect').indexOf('lockdown')) {
        var editroute = "";

        if (pathArray.length) {
          editroute = "/edit/" + pathArray.join("/") + "/";
          console.log('Redirecting to edit route', editroute);
          location.href = editroute;
        } else {
          editroute = "/edit/";
          console.log('Redirecting to edit route', editroute);
          location.href = editroute;
        }
      } else {
        console.log('Redirecting', content.get('redirect'));
        location.href = content.get('redirect');
      }
    } else {
      console.log('Redirecting', content.get('redirect'));
      location.href = content.get('redirect');
    }

    return;
  }

  Mura('#mura-remote-footer, .mura-cta, [data-transient="true"]').remove();

  if (typeof Mura.deInitLayoutManager !== 'undefined') {
    Mura.deInitLayoutManager();
  }

  Mura('html,body').attr('class', '');
  setTimeout(function () {
    if (typeof MuraInlineEditor === 'undefined') {
      Mura('html,body').attr('class', '');
    }

    var htmlQueueContainerInner = Mura('#htmlqueues');

    if (htmlQueueContainerInner.length) {
      Mura('#htmlqueues').html(content.get('htmlheadqueue') + content.get('htmlfootqueue'));
    }

    Mura.init(Mura.extend({
      processMarkup: true,
      queueObjects: false,
      content: content
    }));
    Mura.holdReady(false);

    if (!htmlQueueContainerInner.length && Mura.variations) {
      Mura.loader().loadjs(Mura.rootpath + "/core/modules/v1/core_assets/js/variation.js?siteid=" + Mura.siteid + '&cacheid=' + Math.random());
    }

    if (Mura.MXP) {
      if (Mura.MXPTracking === 'basic') {
        Mura.loader().loadjs(Mura.rootpath + "/plugins/MXP/remote/basic/?siteid=" + Mura.siteid + "&contenthistid=" + Mura.contenthistid + "&contentid=" + Mura.contentid + "&cacheid=" + Math.random());
      } else {
        Mura.loader().loadjs(Mura.rootpath + "/plugins/MXP/remote/native/?siteid=" + Mura.siteid + "&contenthistid=" + Mura.contenthistid + "&contentid=" + Mura.contentid + "&cacheid=" + Math.random());
      }
    }
  }, 5);
}

exports.Decorator = Decorator;
exports.DisplayRegion = DisplayRegion;
exports.EditContext = EditContext;
exports.EditLayout = EditLayout;
exports.ExternalAssets = ExternalAssets;
exports.MainLayout = MainLayout;
exports.MuraContext = MuraContext;
exports.MuraJSRefPlaceholder = MuraJSRefPlaceholder;
exports.Styles = Styles;
exports.getComponent = getComponent;
exports.getHref = getHref;
exports.getIsEditMode = getIsEditMode;
exports.getMura = getMura;
exports.getMuraConfig = getMuraConfig;
exports.getMuraPaths = getMuraPaths;
exports.getMuraProps = getMuraProps;
exports.getRootPath = getRootPath;
exports.getSiteName = getSiteName;
exports.setIsEditMode = setIsEditMode;
exports.setMuraConfig = setMuraConfig;
exports.useAsync = useAsync;
//# sourceMappingURL=index.js.map
