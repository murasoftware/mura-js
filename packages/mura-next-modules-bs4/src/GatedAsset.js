import React, { useState,useEffect } from 'react';
import { Decorator } from '@murasoftware/next-core';
import Mura from 'mura.js';

const GatedAsset =function(props) {
    let objectparams = Object.assign({},props);
    
    const [gateIsOpen,setGateIsOpen]=useState(false);
    const [editMode,setEditMode]=useState(Mura.editing);
    const gateparams = objectparams.gateparams || {object:"container", items:[], 'render':'client',async:false};
    const assetparams = objectparams.assetparams || {object:"container", items:[], 'render':'client',async:false};

    gateparams.ssr=false;
    assetparams.ssr=false;

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
                    } else if(obj.data('object')=='container'){
                        checkContainerForOpenGates(item);
                    }
                })
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
                    <Decorator {...gateparams} content={props.content}/>
                </div>
                <div className="mura-asset" style={{display: gateIsOpen ? 'block' : 'none' }}>
                    <Decorator {...assetparams} content={props.content}/>
                </div>
            </div>
        </div>
    );
}


export default GatedAsset;
