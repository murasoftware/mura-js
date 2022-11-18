import React, { useEffect } from 'react';
import MuraStyles from './Styles';
import MuraExternalAssets from './ExternalAssets';
import { getMura } from './Connector';
import { MuraContext } from './GlobalContext';

const MainLayout = props => {
  
  const { Mura, content, moduleStyleData, children } = props;

  Mura.moduleStyleData = moduleStyleData;

  useEffect(() => {
    contentDidChange(content);
  },[content.contenthistid]);

  return (
    <div>
      <MuraStyles {...props} />
      {children}  
      <MuraExternalAssets {...props}/>
    </div>
  );
};

function contentDidChange(_content) {
  const content = Mura.getEntity('content').set(_content);

  getMura();

  if (content.get('redirect')) {
    
    if(Mura.editroute){
      const pathArray=window.location.pathname.split('/').filter((item)=>{
        if(item){
          return true;
        }
      });
    
      /*
        If site is returning a lockdown redirect check if it's 
        and edit route first.  If it's not then redirect to the dynamic edit
        route so that it can get the dynamic content
      */
      Mura.renderMode= Mura.renderMode || 'dynamic'
      
      if(Mura.editroute && Mura.renderMode=='static' && content.get('redirect').indexOf('lockdown')){
        let editroute="";

        if(pathArray.length){
          editroute=Mura.editroute + "/" +  pathArray.join("/") + "/";
          console.log('Redirecting to edit route',editroute)
          location.href = editroute;
        } else {
          editroute=Mura.editroute + "/";
          console.log('Redirecting to edit route',editroute)
          location.href = editroute;
        }   
      } else {
        console.log('Redirecting', content.get('redirect'))
        location.href = content.get('redirect');
      }
    } else {
      console.log('Redirecting', content.get('redirect'))
      location.href = content.get('redirect');
    }

    return;
  }

  //Remove pre-existing container
  Mura('#mura-remote-footer, .mura-cta, [data-transient="true"]').remove();

  if (typeof Mura.deInitLayoutManager !== 'undefined') {
    Mura.deInitLayoutManager();
  }

  Mura('html,body').attr('class', '');

  setTimeout(() => {
    // Ensure edit classes are removed
    if (typeof MuraInlineEditor === 'undefined') {
      Mura('html,body').attr('class', '');
    }

    // If edit route this will exist
    const htmlQueueContainerInner = Mura('#htmlqueues');
    if (htmlQueueContainerInner.length) {
      Mura('#htmlqueues').html(
        content.get('htmlheadqueue') + content.get('htmlfootqueue'),
      );
    }

    /*
      processMarkup is set to an empty string so that it doesn't actually select anything on init
      With this framework display object know how to process themselves. Mura.js is only use to add new ones
    */
    Mura.init(Mura.extend({ processMarkup:true,queueObjects: false, content }));

    Mura.holdReady(false);

    //This will happen on static route (IE not edit route)
    if (!htmlQueueContainerInner.length && Mura.variations) {
      Mura.loader().loadjs(Mura.rootpath + "/core/modules/v1/core_assets/js/variation.js?siteid=" + Mura.siteid + '&cacheid=' + Math.random())
    }
    if(Mura.MXP){
      if(Mura.MXPTracking==='basic'){
        Mura.loader().loadjs(Mura.rootpath + "/plugins/MXP/remote/basic/?siteid=" + Mura.siteid + "&contenthistid=" + Mura.contenthistid + "&contentid=" + Mura.contentid + "&cacheid=" + Math.random());
      } else {
        Mura.loader().loadjs(Mura.rootpath + "/plugins/MXP/remote/native/?siteid=" + Mura.siteid + "&contenthistid=" + Mura.contenthistid + "&contentid=" + Mura.contentid + "&cacheid=" + Math.random());
      }
    }
  },5);
  
}

export default MainLayout;
