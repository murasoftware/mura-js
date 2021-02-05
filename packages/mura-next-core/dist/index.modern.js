import React, { createContext, useContext, useEffect as useEffect$1 } from 'react';
import Mura from 'mura.js';

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

var EditContext = createContext();
var MuraContext = createContext();

var getModuleProps = function getModuleProps(item, moduleStyleData, isEditMode, content) {
  try {
    var _temp22 = function _temp22() {
      var styleData = Mura.recordModuleStyles(item);
      return {
        isEditMode: isEditMode,
        cssRules: styleData.cssRules,
        targets: styleData.targets,
        id: 'mura-styles' + item.instanceid,
        stylesupport: item.stylesupport || {}
      };
    };

    getMura();

    var _temp23 = _catch(function () {
      var objectkey = item.object;

      if (typeof ComponentRegistry[objectkey] == 'undefined') {
        objectkey = Mura.firstToUpperCase(item.object);
      }

      var _temp19 = function () {
        if (typeof ComponentRegistry[objectkey] != 'undefined') {
          var _temp24 = function _temp24() {
            var _temp16 = function () {
              if (item.object == 'container') {
                if (typeof item.items != 'undefined' && !Array.isArray(item.items)) {
                  try {
                    item.items = JSON.parse(item.items);
                  } catch (e) {
                    item.items = [];
                  }
                }

                var _temp26 = _forIn(item.items, function (containerIdx) {
                  var containerItem = item.items[containerIdx];
                  containerItem.instanceid = containerItem.instanceid || Mura.createUUID();
                  return Promise.resolve(getModuleProps(containerItem, moduleStyleData, isEditMode, content)).then(function (_getModuleProps3) {
                    moduleStyleData[containerItem.instanceid] = _getModuleProps3;
                  });
                });

                if (_temp26 && _temp26.then) return _temp26.then(function () {});
              }
            }();

            if (_temp16 && _temp16.then) return _temp16.then(function () {});
          };

          var _temp25 = function () {
            if (ComponentRegistry[objectkey].SSR) {
              return Promise.resolve(ComponentRegistry[objectkey].getDynamicProps(_extends({}, item, {
                content: content
              }))).then(function (_ComponentRegistry$ob) {
                item.dynamicProps = _ComponentRegistry$ob;
              });
            }
          }();

          return _temp25 && _temp25.then ? _temp25.then(_temp24) : _temp24(_temp25);
        }
      }();

      if (_temp19 && _temp19.then) return _temp19.then(function () {});
    }, function (e) {
      console.log(e);
    });

    return Promise.resolve(_temp23 && _temp23.then ? _temp23.then(_temp22) : _temp22(_temp23));
  } catch (e) {
    return Promise.reject(e);
  }
};

var getRegionProps = function getRegionProps(content, isEditMode) {
  try {
    getMura();
    var moduleStyleData = {};
    content.displayregions = content.displayregions || {};
    var regions = Object.values(content.displayregions);

    var _temp13 = _forIn(regions, function (regionIdx) {
      function _temp11() {
        var _temp9 = _forIn(region.local.items, function (itemIdx) {
          var item = region.local.items[itemIdx];
          item.instanceid = item.instanceid || Mura.createUUID();
          return Promise.resolve(getModuleProps(item, moduleStyleData, isEditMode, content)).then(function (_getModuleProps2) {
            moduleStyleData[item.instanceid] = _getModuleProps2;
          });
        });

        if (_temp9 && _temp9.then) return _temp9.then(function () {});
      }

      var region = regions[regionIdx];

      var _temp10 = function () {
        if (typeof region.inherited != 'undefined' && Array.isArray(region.inherited.items)) {
          var _temp14 = _forIn(region.inherited.items, function (itemdIx) {
            var item = region.inherited.items[itemdIx];
            item.instanceid = item.instanceid || Mura.createUUID();
            return Promise.resolve(getModuleProps(item, moduleStyleData, isEditMode, content)).then(function (_getModuleProps) {
              moduleStyleData[item.instanceid] = _getModuleProps;
            });
          });

          if (_temp14 && _temp14.then) return _temp14.then(function () {});
        }
      }();

      return _temp10 && _temp10.then ? _temp10.then(_temp11) : _temp11(_temp10);
    });

    return Promise.resolve(_temp13 && _temp13.then ? _temp13.then(function () {
      return moduleStyleData;
    }) : moduleStyleData);
  } catch (e) {
    return Promise.reject(e);
  }
};

var renderContent = function renderContent(context, isEditMode, params) {
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
    return Promise.resolve(Mura.renderFilename(filename, query).then(function (rendered) {
      return Promise.resolve(rendered);
    }, function (rendered) {
      try {
        if (!rendered) {
          var _Mura$getEntity$set;

          return Promise.resolve(Mura.getEntity('Content').set((_Mura$getEntity$set = {
            title: '404',
            menutitle: '404',
            body: 'The content that you requested can not be found',
            contentid: Mura.createUUID(),
            isnew: 1,
            siteid: Mura.siteid,
            type: 'Page',
            subtype: 'Default'
          }, _Mura$getEntity$set["contentid"] = Mura.createUUID(), _Mura$getEntity$set.contenthistid = Mura.createUUID(), _Mura$getEntity$set.filename = '404', _Mura$getEntity$set.displayregions = {
            primarycontent: {
              local: {
                items: []
              }
            }
          }, _Mura$getEntity$set)));
        } else {
          return Promise.resolve(rendered);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};

require('mura.js/src/core/stylemap-static');

var connectorConfig, ComponentRegistry, ConnectorConfig, ExternalModules;
var MuraJSRefPlaceholder = '"undefined"!=typeof window&&function(u){u.queuedMuraCmds=[],u.queuedMuraPreInitCmds=[],"function"!=typeof u.Mura&&(u.Mura=u.mura=u.Mura=function(e){u.queuedMuraCmds.push(e)},u.Mura.preInit=function(e){u.queuedMuraPreInitCmds.push(e)})}(window);';
var initConnector = function initConnector(MuraConfig) {
  ComponentRegistry = MuraConfig.ComponentRegistry;
  ConnectorConfig = MuraConfig.ConnectorConfig;
  ExternalModules = MuraConfig.ExternalModules;
  connectorConfig = Object.assign({}, ConnectorConfig);
};
var useAsync = function useAsync(asyncFn, onSuccess) {
  useEffect(function () {
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
    return '/' + Mura.siteid + '/' + path.join('/');
  } else {
    return '/' + path.join('/');
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
    return /*#__PURE__*/React.createElement(ComponentVariable, _extends({
      key: item.instanceid
    }, item));
  }

  return /*#__PURE__*/React.createElement("p", {
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
      return Promise.resolve(Mura.getFeed('content').maxItems(0).itemsPerPage(0).sort('orderno').getQuery({
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
    console.log('initing', connectorConfig.siteid);
    Mura.init(connectorConfig);
  } else if (startingsiteid != connectorConfig.siteid) {
    console.log('changing siteid', startingsiteid, connectorConfig.siteid);
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
var getMuraProps = function getMuraProps(context, isEditMode, params) {
  try {
    var _Mura = getMura(context);

    _Mura.renderMode = 'dynamic';

    if (!isEditMode) {
      _Mura.renderMode = 'static';
    }

    return Promise.resolve(renderContent(context, isEditMode, params)).then(function (muraObject) {
      var content = muraObject.getAll();
      return Promise.resolve(getRegionProps(content, isEditMode)).then(function (moduleStyleData) {
        function _temp7() {
          delete _Mura._request;
          delete _Mura.response;
          delete _Mura.request;
          delete _Mura.renderMode;
          var props = {
            content: content,
            moduleStyleData: moduleStyleData,
            externalModules: ExternalModules,
            codeblocks: codeblocks
          };

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

        var codeblocks = {
          header: [],
          bodystart: [],
          footer: []
        };

        var _temp6 = _catch(function () {
          var _temp5 = function () {
            if (connectorConfig.codeblocks) {
              return Promise.resolve(_Mura.getFeed('codeblock').where().prop('active').isEQ(1).getQuery()).then(function (codeCollection) {
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
          console.log(e);
        });

        return _temp6 && _temp6.then ? _temp6.then(_temp7) : _temp7(_temp6);
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

function Decorator(props) {
  var MuraConfig = useContext(MuraContext);
  var ComponentRegistry = MuraConfig.ComponentRegistry,
      ExternalModules = MuraConfig.ExternalModules;
  var label = props.label,
      instanceid = props.instanceid,
      labeltag = props.labeltag,
      children = props.children;
  var isEditMode = true;

  try {
    var _useContext = useContext(EditContext);

    isEditMode = _useContext[0];
  } catch (e) {
    isEditMode = true;
  }

  var domObject = {
    className: 'mura-object mura-async-object'
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

  if (isEditMode || isExternalModule || !isSSR) {
    Object.keys(props).forEach(function (key) {
      if (!['html', 'content', 'children', 'isEditMode', 'dynamicProps', 'moduleStyleData'].find(function (restrictedkey) {
        return restrictedkey === key;
      })) {
        if (typeof props[key] === 'object') {
          domObject["data-" + key] = JSON.stringify(props[key]);
        } else if (typeof props[key] !== 'undefined' && !(typeof props[key] === 'string' && props[key] === '')) {
          domObject["data-" + key] = props[key];
        }
      }

      if (key === 'class') {
        domObject.className += " " + props[key];
      } else if (key === 'cssclass') {
        domObject.className += " " + props[key];
      } else if (key === 'cssid') {
        domObject.id += " " + props[key];
      } else if (key === 'contentcssclass') {
        domContent.className += " " + props[key];
      } else if (key === 'contentcssid') {
        domContent.id += " " + props[key];
      } else if (key === 'metacssclass') {
        domMeta.className += " " + props[key];
      } else if (key === 'metacssid') {
        domMeta.id += " " + props[key];
      }
    });

    if (domObject.className.split(' ').find(function ($class) {
      return $class === 'container';
    })) {
      domMetaWrapper.className += ' container';
    }
  } else {
    domObject['data-instanceid'] = instanceid;
    domObject['data-inited'] = true;
    domObject.className = "mura-object-" + props.object;

    if (typeof props.moduleStyleData != 'undefined' && typeof props.moduleStyleData[instanceid] != 'undefined') {
      domObject.className += " " + props.moduleStyleData[instanceid].targets.object["class"];
      domObject.id = props.moduleStyleData[props.instanceid].targets.object.id;
      domContent.className = props.moduleStyleData[props.instanceid].targets.content["class"];
      domContent.id = props.moduleStyleData[props.instanceid].targets.content.id;
      domMetaWrapper.className = props.moduleStyleData[props.instanceid].targets.metawrapper["class"];
      domMeta.className = props.moduleStyleData[props.instanceid].targets.meta["class"];
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
      React.createElement("div", domObject, label ? /*#__PURE__*/React.createElement(MuraMeta, {
        label: label,
        labeltag: labeltag,
        dommeta: domMeta,
        dommetawrapper: domMetaWrapper
      }) : null, label ? /*#__PURE__*/React.createElement("div", {
        className: "mura-flex-break"
      }) : null, /*#__PURE__*/React.createElement("div", _extends({}, domContent, {
        dangerouslySetInnerHTML: {
          __html: props.html
        }
      })));
    } else {
      return /*#__PURE__*/React.createElement("div", domObject);
    }
  } else {
    return /*#__PURE__*/React.createElement("div", domObject, label ? /*#__PURE__*/React.createElement(Meta, {
      label: label,
      labeltag: labeltag,
      dommeta: domMeta,
      dommetawrapper: domMetaWrapper
    }) : null, label ? /*#__PURE__*/React.createElement("div", {
      className: "mura-flex-break"
    }) : null, /*#__PURE__*/React.createElement("div", domContent, children));
  }
}

var Meta = function Meta(_ref) {
  var label = _ref.label,
      labeltag = _ref.labeltag,
      dommeta = _ref.dommeta,
      dommetawrapper = _ref.dommetawrapper;
  var LabelHeader = labeltag ? "" + labeltag : 'h2';
  return /*#__PURE__*/React.createElement("div", dommetawrapper, /*#__PURE__*/React.createElement("div", dommeta, /*#__PURE__*/React.createElement(LabelHeader, null, label)));
};

var DisplayRegionSection = function DisplayRegionSection(_ref) {
  var children = _ref.children,
      region = _ref.region,
      section = _ref.section,
      iseditmode = _ref.iseditmode;
  var out = null;

  if (typeof region.name !== 'undefined' && iseditmode) {
    if (section === 'inherited' && region.inherited.items.length) {
      out = /*#__PURE__*/React.createElement("div", {
        className: "mura-region-inherited"
      }, /*#__PURE__*/React.createElement("div", {
        className: "frontEndToolsModal mura"
      }, /*#__PURE__*/React.createElement("span", {
        className: "mura-edit-label mi-lock"
      }, region.name.toUpperCase(), ": Inherited")), children);
    }

    if (section === 'local') {
      out = /*#__PURE__*/React.createElement("div", {
        className: "mura-editable mura-inactive"
      }, /*#__PURE__*/React.createElement("div", {
        className: "mura-region-local mura-inactive mura-editable-attribute",
        "data-loose": "false",
        "data-regionid": region.regionid,
        "data-inited": "false",
        "data-perm": "true"
      }, /*#__PURE__*/React.createElement("label", {
        className: "mura-editable-label",
        style: {
          display: 'none'
        }
      }, region.name.toUpperCase()), children));
    }
  } else {
    var regionName = "mura-region-" + section;
    out = /*#__PURE__*/React.createElement("div", {
      className: regionName
    }, children);
  }

  return out;
};

var DisplayRegion = function DisplayRegion(_ref2) {
  var region = _ref2.region,
      moduleStyleData = _ref2.moduleStyleData,
      content = _ref2.content;

  var _useContext = useContext(EditContext),
      isEditMode = _useContext[0];

  var inherited = '';

  if (region.inherited && region.inherited.items.length) {
    inherited = /*#__PURE__*/React.createElement(DisplayRegionSection, {
      region: region,
      iseditmode: isEditMode,
      section: "inherited"
    }, region.inherited.items.map(function (item) {
      var obj = Object.assign({}, item);
      obj.key = obj.instanceid;
      obj.moduleStyleData = moduleStyleData;
      obj.content = content;
      return /*#__PURE__*/React.createElement(Decorator, obj, getComponent(obj));
    }));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "mura-region",
    "data-regionid": region.regionid
  }, inherited, /*#__PURE__*/React.createElement(DisplayRegionSection, {
    region: region,
    iseditmode: isEditMode,
    content: content,
    section: "local"
  }, region.local.items.map(function (item) {
    var obj = Object.assign({}, item);
    obj.key = obj.instanceid;
    obj.moduleStyleData = moduleStyleData;
    obj.content = content;
    return /*#__PURE__*/React.createElement(Decorator, obj, getComponent(obj));
  })));
};

function ExternalAssets(props) {
  var externalModules = props.externalModules;

  if (typeof externalModules !== 'undefined') {
    return /*#__PURE__*/React.createElement("div", {
      className: "mura-external-assets"
    }, Object.keys(externalModules).map(function (key) {
      var module = externalModules[key];

      if (module.js && Array.isArray(module.js)) {
        return module.js.map(function (item) {
          return /*#__PURE__*/React.createElement("script", {
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
          return /*#__PURE__*/React.createElement("link", {
            key: item,
            rel: "stylesheet",
            href: item
          });
        });
      }
    }));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      className: "mura-external-assets"
    });
  }
}

var EditLayout = function EditLayout(_ref) {
  var children = _ref.children;

  var _useContext = useContext(EditContext),
      setIsEditMode = _useContext[1];

  useEffect$1(function () {
    setIsEditMode(true);
  }, [setIsEditMode]);
  return /*#__PURE__*/React.createElement("div", null, children, /*#__PURE__*/React.createElement("div", {
    id: "htmlqueues"
  }));
};

function Styles(props) {
  var moduleStyleData = props.moduleStyleData;

  if (typeof moduleStyleData !== 'undefined') {
    return /*#__PURE__*/React.createElement(Fragment, null, Object.keys(moduleStyleData).map(function (instanceid) {
      var rules = moduleStyleData[instanceid];

      if (!rules.isEditMode) {
        return /*#__PURE__*/React.createElement("style", {
          id: rules.id,
          key: rules.id,
          dangerouslySetInnerHTML: {
            __html: rules.cssRules.join('\n')
          }
        });
      } else {
        return '';
      }
    }));
  }

  return /*#__PURE__*/React.createElement(Fragment, null);
}

var MainLayout = function MainLayout(props) {
  var content = props.content,
      moduleStyleData = props.moduleStyleData,
      children = props.children;
  Mura.moduleStyleData = moduleStyleData;
  useEffect$1(function () {
    contentDidChange(content);
  });
  return /*#__PURE__*/React.createElement("div", null, children, /*#__PURE__*/React.createElement(ExternalAssets, props), /*#__PURE__*/React.createElement(Styles, props));
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
    }

    return;
  }

  var remoteFooter = Mura('#mura-remote-footer');

  if (remoteFooter.length) {
    remoteFooter.remove();
  }

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
      queueObjects: false,
      content: content
    }));
    Mura.holdReady(false);

    if (!htmlQueueContainerInner.length && Mura.variations) {
      Mura.loader().loadjs(Mura.rootpath + "/core/modules/v1/core_assets/js/variation.js?siteid=" + Mura.siteid + '&cacheid=' + Math.random());
    }

    if (Mura.MXP) {
      Mura.loader().loadjs(Mura.rootpath + "/plugins/MXP/remote/native/?siteid=" + Mura.siteid + "&contenthistid=" + Mura.contenthistid + "&contentid=" + Mura.contentid + "&cacheid=" + Math.random());
    }
  }, 5);
}

export { Decorator, DisplayRegion, EditContext, EditLayout, ExternalAssets, MainLayout, MuraContext, MuraJSRefPlaceholder, Styles, getComponent, getHref, getMura, getMuraPaths, getMuraProps, getRootPath, getSiteName, initConnector, useAsync };
//# sourceMappingURL=index.modern.js.map
