import React, { useState,useEffect } from 'react';
import { Decorator, getMura } from '@murasoftware/next-core';

const GatedAsset =function(props) {
    const Mura=props.Mura || getMura();
    
    let objectparams = Object.assign({},props);
    
    const [gateIsOpen,setGateIsOpen]=useState(false);
    const [editMode,setEditMode]=useState(Mura.editing);
    const gateparams = objectparams.gateparams || {object:"container", items:[], 'render':'client',async:false};
    const assetparams = objectparams.assetparams || {object:"container", items:[], 'render':'client',async:false};

    gateparams.ssr=false;
    assetparams.ssr=false;
    gateparams.pinned=true;
    assetparams.pinned=true;
    
    if(typeof objectparams.isgatelocked == 'undefined'){
        objectparams.isgatelocked=true;
    }

    useEffect(() => {
        let isMounted = true;
        const gatedasset=Mura.getEntity('gatedasset');

        if (isMounted) {
            if(typeof Mura.displayObjectInstances[props.instanceid]=='undefined'){
                Mura.displayObjectInstances[props.instanceid]= new Mura.DisplayObject.GatedAsset(props);
            }

            Mura(document).on('muraContentEditInit',function(){
                if(isMounted){
                    setEditMode(true);
                }
            })

            const module= Mura('div[data-instanceid="' + props.instanceid +'"]');

            module.on('formSubmitSuccess',function(e){
                if(isMounted && !gateIsOpen){
                    const source = e.target || e.srcElement;
                    const formObj=Mura(source).closest('div.mura-object[data-object="form"]');
                    gatedasset.invoke('openGate',{contentid: props.content.contentid,formid:formObj.data('objectid')},'get');
                    setTimeout(
                        function(){
                            setGateIsOpen(true);
                        },
                        4000
                    );
                   
                }
            })
            
            const handleIsGateOpen = (response)=>{
                if(typeof response === 'boolean' && response
                    || typeof response === 'number' && response
                    || typeof response === 'string' && response.toLowerCase()=='true'){
                    if(isMounted){
                        setGateIsOpen(true);
                    }
                }
            }
            
            const checkContainerForOpenGates = function(params){
                if(Array.isArray(params.items)){
                    params.items.forEach((item)=>{
                        if(item.object=='form'){
                            gatedasset.invoke(
                                'isGateOpen',
                                {contentid: props.content.contentid,formid:item.objectid}
                                ,'get')
                                .then(
                                    handleIsGateOpen,
                                    handleIsGateOpen
                                )
                        } else if(item.object=='container'){
                            checkContainerForOpenGates(item);
                        }
                    })
                }
            }

            if( objectparams.isgatelocked ){
                checkContainerForOpenGates(gateparams);
            } else {
                setGateIsOpen(true);
            }
            
        }
        return () => { isMounted = false };
       
      }, []);

    return (
        <div>
            { 
                editMode
                    ? <div><button className={!gateIsOpen ? 'btn btn-primary' : 'btn'} onClick={function(){setGateIsOpen(false)}}>Gate</button>
                    <button className={gateIsOpen ? 'btn btn-primary' : 'btn'} onClick={function(){setGateIsOpen(true)}}>Asset</button></div>
                    : null 
            }
            <div>
                <div className="mura-gate" style={{display: !gateIsOpen ? 'block' : 'none' }}>
                    <Decorator {...gateparams} content={props.content} Mura={props.Mura}/>
                </div>
                <div className="mura-asset" style={{display: gateIsOpen ? 'block' : 'none' }}>
                    <Decorator {...assetparams} content={props.content} Mura={props.Mura}/>
                </div>
            </div>
        </div>
    );
}


export default GatedAsset;

export const ModuleConfig={
    key: 'GatedAsset',
    name: 'Gated Asset',
    component: GatedAsset,
    getDynamicProps:  function(){},
    excludeFromClient: false,
    isCollectionLayout: false,
    contentypes:"*",
    iconclass:"mi-lock",
    configurator:[{
        "type":"select",
        "name":"isgatelocked",
        "label":"Is Gate Locked?",
        "options":[
            {"name":"Yes","value":1},
            {"name":"No","value":0}
        ]
    }]
}
