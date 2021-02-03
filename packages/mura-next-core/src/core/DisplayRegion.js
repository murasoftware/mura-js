import React, { useContext } from 'react';
import { getComponent } from './Connector';
import MuraDecorator from './Decorator';
import GlobalContext from './GlobalContext';

const DisplayRegionSection = ({ children, region, section, iseditmode }) => {
  let out = null;
  if (typeof region.name !== 'undefined' && iseditmode) {
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

const DisplayRegion = ({ region, moduleStyleData,content }) => {
  const [isEditMode] = useContext(GlobalContext);
  let inherited = '';
// Mura inheritance, where modules are inherited from parent content
  if (region.inherited && region.inherited.items.length) {
    inherited = (
      <DisplayRegionSection
        region={region}
        iseditmode={isEditMode}
        section="inherited"
      >
        {region.inherited.items.map(item => {
          const obj = Object.assign({}, item);
          obj.key = obj.instanceid;
          obj.moduleStyleData = moduleStyleData;
          obj.content = content;
          return <MuraDecorator {...obj}>{getComponent(obj)}</MuraDecorator>;
        })}
      </DisplayRegionSection>
    );
  }

  return (
    <div className="mura-region" data-regionid={region.regionid}>
      {inherited}
      <DisplayRegionSection
        region={region}
        iseditmode={isEditMode}
        content={content}
        section="local"
      >
        {region.local.items.map(item => {
          const obj = Object.assign({}, item);
          obj.key = obj.instanceid;
          obj.moduleStyleData = moduleStyleData;
          obj.content = content;
          return <MuraDecorator {...obj}>{getComponent(obj)}</MuraDecorator>;
        })}
      </DisplayRegionSection>
    </div>
  );
};

export default DisplayRegion;
