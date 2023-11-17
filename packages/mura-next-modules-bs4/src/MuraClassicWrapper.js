import React, { useEffect } from 'react';

export const MuraClassicWrapper=function(props) {
    const{ Mura } = props;
    const objectparams = Object.assign({}, props);
    objectparams.html=objectparams.html || '';
    const containerid='mc-container-' + objectparams.instanceid;

    useEffect(() => {
        if(!objectparams.dynamicProps || !objectparams.dynamicProps.html){
            getDynamicProps(objectparams).then((dynamicProps)=>{
                Mura('#'  + containerid).html(objectparams.dynamicProps.html);
            });
        } else {
            Mura('#'  + containerid).html(objectparams.dynamicProps.html);
        }
        
    },[]);
  
    return (
        <div id={containerid}/>
    );
}

export const getDynamicProps = async props => {
    const{ Mura } = props;
    const objectparams = Object.assign({}, props);
   
    delete props.moduleStyleData;
    delete props.content;
    delete props.queryParams;
    delete props.dynamicProps;
    delete props.queryParams;
    delete props.regionContext;
    delete props.objectname
    delete props.objecticon
    delete props.objecticonclass
    delete props.Mura

    objectparams.render="server";
    objectparams.method='processAsyncObject';
    objectparams.decoupled=false;
   
   const result=await Mura.get(Mura.getAPIEndpoint(),objectparams);
   
   return result.data;
  }

  export default MuraClassicWrapper;

  export const ModuleConfig={
    key: 'MuraClassicWrapper',
    name: 'Mura Classic Wrapper',
    component: MuraClassicWrapper,
    getDynamicProps: getDynamicProps,
    excludeFromClient: false,
    isCollectionLayout: false,
    contenttypes:""
  }