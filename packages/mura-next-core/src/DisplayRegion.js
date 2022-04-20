import React from 'react';
import { getIsEditMode, getComponent, getMura } from './Connector';
import Decorator from './Decorator';

const DisplayRegionSection = ({ children, region, section, isEditMode }) => {
  let out = null;
  if (typeof region.name !== 'undefined' && isEditMode) {
    if (section === 'inherited' && region.inherited.items.length) {
      out = (
        <div className="mura-region-inherited">
          <div className="frontEndToolsModal mura">
            <span className="mura-edit-label mi-lock">
              {region.name.toUpperCase()}: Inherited
            </span>
          </div>
          {children}
        </div>
      );
    } if (section === 'local') {
      out = (
        <div className="mura-editable mura-inactive">
          <div
            className="mura-region-local mura-inactive mura-editable-attribute"
            data-loose="false"
            data-regionid={region.regionid}
            data-inited="false"
            data-perm="true"
          >
            <label className="mura-editable-label" style={{ display: 'none' }}>
              {region.name.toUpperCase()}
            </label>
            {children}
          </div>
        </div>
      );
    }
  } else {
    const regionName = `mura-region-${  section}`;

    out = <div className={regionName}>{children}</div>;
  }
  return out;
};

const DisplayRegion = ({ region, moduleStyleData, content, context, queryParams }) => {
  const isEditMode = getIsEditMode();
  const requestContext=getMura().getRequestContext();

  let inherited = '';
// Mura inheritance, where modules are inherited from parent content
  if (region.inherited && region.inherited.items.length) {
    inherited = (
      <DisplayRegionSection
        region={region}
        isEditMode={isEditMode}
        section="inherited"
      >
        {region.inherited.items.map(item => {
          const obj = Object.assign({}, item);
          obj.key = obj.instanceid;
          obj.moduleStyleData = moduleStyleData;
          obj.content = content;
          obj.queryParams = queryParams;
          obj.regionContext =  context;
          obj.requestContext =  requestContext;
          return <Decorator {...obj}>{getComponent(obj)}</Decorator>;
        })}
      </DisplayRegionSection>
    );
  }

  return (
    <div className="mura-region" data-regionid={region.regionid}>
      {inherited}
      <DisplayRegionSection
        region={region}
        isEditMode={isEditMode}
        section="local"
      >
        {region.local.items.map(item => {
          const obj = Object.assign({}, item);
          obj.key = obj.instanceid;
          obj.moduleStyleData = moduleStyleData;
          obj.content = content;
          obj.queryParams = queryParams;
          obj.regionContext =  context;
          obj.requestContext =  requestContext;
          return <Decorator {...obj}>{getComponent(obj)}</Decorator>;
        })}
      </DisplayRegionSection>
    </div>
  );
};

export default DisplayRegion;
