import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const MatrixSelector=function(props){
    const objectparams = Object.assign({}, props);

    const _personas = objectparams?.dynamicProps?.personas ? objectparams.dynamicProps.personas : false;
    const _stages =  objectparams?.dynamicProps?.stages ? objectparams.dynamicProps.stages : false;
 
    const [personas, setPersonas] = useState(_personas);
    const [stages, setStages] = useState(_stages);

    const _selfIdStart = objectparams.selfidstart ? objectparams.selfidstart : 'I am a';
    const _selfIdMiddle = objectparams.selfidmiddle ? objectparams.selfidmiddle : 'who';
    const _selfIdEnd = objectparams.selfidend ? objectparams.selfidend : 'your product.';
    const _displayType = objectparams.displaytype ? objectparams.displaytype : 'inline';

    const [selfIdStart, setSelfIdStart] = useState(_selfIdStart);
    const [selfIdMiddle, setSelfIdMiddle] = useState(_selfIdMiddle);
    const [selfIdEnd, setSelfIdEnd] = useState(_selfIdEnd);
    const [displayType, setDisplayType] = useState(_displayType);
    const [currentStageId, setCurrentStageId] = useState(false);
    const [currentPersonaId, setCurrentPersonaId] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

    const [curSelPersona, setCurSelPersona] = useState('');
    const [curSelStage, setCurSelStage] = useState('');
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showingAlert,setShowingAlert] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [selHasChanged, setSelHasChanged] = useState(false);

    const [selPersonaValidated, setSelPersonaValidated] = useState(false);
    const [selStageValidated, setSelStageValidated] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        saveExperience(curSelPersona,curSelStage);
        return false;
    }

    const handlePreview = (e) => {
        e.preventDefault();
        previewExperience(curSelPersona,curSelStage);
        return false;
    }

    const handleClear = (e) => {
        e.preventDefault();
        clearExperience();
        return false;
    }

    objectparams.mode=objectparams.mode  || 'preview only';

    const updateSelectedPersona = (e) => {
        const newPersona = e.target.value;
        if (curSelPersona != newPersona){
            setCurSelPersona(newPersona);
            setSelHasChanged(true);
            checkSelectValidation(newPersona,curSelStage);
        }
    }

    const updateSelectedStage = (e) => {
        const newStage = e.target.value;
        if (curSelStage != newStage){
            setCurSelStage(newStage);
            setSelHasChanged(true);
            checkSelectValidation(curSelPersona,newStage);
        }        
    }

    const checkSelectValidation = (persona,stage) => {
        //check persona value and personas length to see if validated flag should be updated
        if (persona != '' && personas.length){
            setSelPersonaValidated(true);
        } else if (persona = '' && personas.length){
            setSelPersonaValidated(false);
        }
        //check stage value and stages length to see if validated flag should be updated
        if (stage != '' && stages.length){
            setSelStageValidated(true);
        } else if (stage = '' && stages.length){
            setSelStageValidated(false);
        }
       
    }

    const updateButtonStatus = (selPersonaValidated,selStageValidated) => {
        //check validation flags to see if Button should be enabled
        if (selPersonaValidated && selStageValidated){
            setButtonEnabled(true);
        } else {
            setButtonEnabled(false);
        }
    }
    const saveExperience = (personaid,stageid) => {
        setIsSaving(true);
        setButtonEnabled(false);
    
         Mura
          .getEntity('matrix_selector')
          .invoke(
            'updateExperience',
            {
                personaid:personaid,
                stageid:stageid
            },
            'post'
          ).then( (exp)=>{
            if (exp.personaselected || exp.stageselected){
                window.location = window.location.href.split("?")[0];
            }
          });
    }

    const previewExperience = (personaid,stageid) => {
        setIsPreviewing(true);
        setButtonEnabled(false);
    
        Mura
          .getEntity('matrix_selector')
          .invoke(
            'previewExperience',
            {
                personaid:personaid,
                stageid:stageid
            },
            'post'
        ).then(() => {
            setUpdateSuccess(1);
            setShowingAlert(true);
            setIsPreviewing(false);
            setSeconds(3);
          });
       

    }

    const clearExperience = () => {
        setIsClearing(true);
        setButtonEnabled(false);
    
        Mura
          .getEntity('matrix_selector')
          .invoke(
            'clearExperience',
            {},
            'post'
          ).then(() => {
            window.location = window.location.href.split("?")[0];
          });
    }
    
    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            updateButtonStatus(selPersonaValidated,selStageValidated);
            //should we force a page refresh after this to load the updated persona and stage?
        }
        
        return () => { isMounted = false };
    }, [selPersonaValidated,selStageValidated])

    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        if (seconds > 0){
            setTimeout(() => setSeconds(seconds -1), 1000);
        }
        if (seconds < 1 && showingAlert ){
             window.location = window.location.href.split("?")[0];
        }
    }, [seconds]);

    if(!objectparams?.dynamicProps?.personas || !objectparams?.dynamicProps?.stages){
        useEffect(() => {
            let isMounted = true;
            const fetchData= async () => {
                const dynamicProps = await getDynamicProps();
             
                if (isMounted) {
                    setPersonas(dynamicProps.personas);

                    if (!personas.length){
                        if (isMounted) {
                            setSelPersonaValidated(true);
                        }
                    }

                    setStages(dynamicProps.stages);

                    if (!dynamicProps.stages.length){
                        if (isMounted) {
                            setSelStageValidated(true);
                        }
                    }

                    setCurrentStageId(dynamicProps.currentstageid);
                    setCurrentPersonaId(dynamicProps.currentpersonaid);
                    setCurSelPersona(dynamicProps.currentpersonaid);
                    setCurSelStage(dynamicProps.currentstageid);
                    setIsPreview(dynamicProps.ispreview);
                }
            }
            if (isMounted) {
                fetchData();
            }
            return () => { isMounted = false };
        }, []);

        //todo do we need to add hidden form fields if personas or stages EQ 1?
        const [open, setOpen] = useState('');
        const hasPersonaOrStage=(currentPersonaId || currentStageId);
        switch(displayType){
            case "widget" :
                return (
                    <>
                    {/* Mura.editing doesn't seem to work here */}
                    <Alert variant="info matrix-selector-edit-alert" >
                        <p className="mb-0">Experience Selector</p>
                    </Alert>
                    <div className={`${open ? 'open' : ''} mura-matrix-selector__widget ${props.widgetposition}`}>
                        <Button 
                            variant="light"
                            onClick={() => { setOpen(!open); }}>
                            {!hasPersonaOrStage && <><FontAwesomeIcon icon={faBolt}/> Optimize Your Experience</>}
                            {hasPersonaOrStage &&  <><FontAwesomeIcon icon={faBolt} className='text-success'/> Experience Optimized</>}
                        </Button>
                        <div className="mura-matrix-selector__widget__inner">
                            <MatrixForm 
                                updateSuccess={updateSuccess}
                                showingAlert={showingAlert}
                                handleSave={handleSave}
                                handleClear={handleClear}
                                handlePreview={handlePreview}
                                selfIdStart={selfIdStart}
                                updateSelectedPersona={updateSelectedPersona}
                                personas={personas}
                                stages={stages}
                                setShowingAlert={setShowingAlert}
                                setUpdateSuccess={setUpdateSuccess}
                                setSeconds={setSeconds}
                                curSelPersona={curSelPersona}
                                curSelStage={curSelStage}
                                currentStageId={currentStageId}
                                currentPersonaId={currentPersonaId}
                                isPreview={isPreview}
                                mode={objectparams.mode}
                                selHasChanged={selHasChanged}
                                selfIdMiddle={selfIdMiddle}
                                updateSelectedStage={updateSelectedStage}
                                selfIdEnd={selfIdEnd}
                                buttonEnabled={buttonEnabled}
                                isSaving={isSaving}
                                isPreviewing={isPreviewing}
                                isClearing={isClearing}
                                displaytype={displayType}
                                {...props}
                                seconds={seconds}
                            />
                            <div className="mura-matrix-selector__widget__inner__footer">
                                <MatrixSelectorFooter {...props} />
                            </div>
                        </div>
                    </div>
                    </>
                )
                break
            case "eyebrow" :
                return(
                    <div className={`mura-matrix-selector__eyebrow`}>
                        <div className="mura-matrix-selector__eyebrow__inner">
                            {!showingAlert &&
                                <div className="mura-matrix-selector__eyebrow__inner__heading">
                                    {!hasPersonaOrStage && <h4><FontAwesomeIcon icon={faBolt}/> Optimize Your Experience</h4>}
                                    {hasPersonaOrStage &&  <h4><FontAwesomeIcon icon={faBolt} className='text-success'/> Experience Optimized</h4>}
                                </div>
                            }
                            <MatrixForm 
                                updateSuccess={updateSuccess}
                                showingAlert={showingAlert}
                                handleSave={handleSave}
                                handleClear={handleClear}
                                handlePreview={handlePreview}
                                selfIdStart={selfIdStart}
                                updateSelectedPersona={updateSelectedPersona}
                                personas={personas}
                                stages={stages}
                                setShowingAlert={setShowingAlert}
                                setUpdateSuccess={setUpdateSuccess}
                                setSeconds={setSeconds}
                                curSelPersona={curSelPersona}
                                curSelStage={curSelStage}
                                currentStageId={currentStageId}
                                currentPersonaId={currentPersonaId}
                                isPreview={isPreview}
                                mode={objectparams.mode}
                                selHasChanged={selHasChanged}
                                selfIdMiddle={selfIdMiddle}
                                updateSelectedStage={updateSelectedStage}
                                selfIdEnd={selfIdEnd}
                                buttonEnabled={buttonEnabled}
                                isSaving={isSaving}
                                isPreviewing={isPreviewing}
                                isClearing={isClearing}
                                displaytype={displayType}
                                {...props}
                                seconds={seconds}
                            />
                            {!showingAlert &&
                                <div className="mura-matrix-selector__eyebrow__inner__footer">
                                    <MatrixSelectorFooter {...props} />
                                </div>
                            }
                        </div>
                    </div>
                )
                break
        }
            return (
                <>
                <MatrixForm 
                    updateSuccess={updateSuccess}
                    showingAlert={showingAlert}
                    handleSave={handleSave}
                    handleClear={handleClear}
                    handlePreview={handlePreview}
                    selfIdStart={selfIdStart}
                    updateSelectedPersona={updateSelectedPersona}
                    personas={personas}
                    stages={stages}
                    setShowingAlert={setShowingAlert}
                    setUpdateSuccess={setUpdateSuccess}
                    setSeconds={setSeconds}
                    curSelPersona={curSelPersona}
                    curSelStage={curSelStage}
                    currentStageId={currentStageId}
                    currentPersonaId={currentPersonaId}
                    isPreview={isPreview}
                    mode={objectparams.mode}
                    selHasChanged={selHasChanged}
                    selfIdMiddle={selfIdMiddle}
                    updateSelectedStage={updateSelectedStage}
                    selfIdEnd={selfIdEnd}
                    buttonEnabled={buttonEnabled}
                    isSaving={isSaving}
                    isPreviewing={isPreviewing}
                    isClearing={isClearing}
                    {...props}
                    seconds={seconds}
                />
                {!showingAlert &&
                    <div className="mura-matrix-selector__inline__footer" key="matrix-selector-footer">
                        <MatrixSelectorFooter {...props} />
                    </div>
                }
                </>
            )
    } else {

    }
}
const MatrixSelectorFooter = (props) => {
    const CustomLinks = props.customlinks ? Array.from(props.customlinks) : [];
    //console.log('props: ', props);
    if (CustomLinks && CustomLinks.length){
        const UtilityLinks = CustomLinks.map((link, index) => 
        <li className="list-inline-item" key={index}>
            <a href={link.value}>{link.name}</a>
        </li>
        );
        return (
            <ul className="list-inline" key='sdf'>
                {UtilityLinks}
            </ul>
        )
    }
    return null    
}

const MatrixForm = (props) => {

    return (
        <>
        {props.updateSuccess && props.showingAlert &&
            <div className="successMessage">
                <h4>Thanks!</h4>
                <p>We&rsquo;re tailoring our content for you in &hellip; {props.seconds}</p>
            </div>
        }
        {!props.updateSuccess && !props.showingAlert &&
        <Form inline id="mura_matrix-selector-form" onSubmit={props.handleSave} data-autowire="false">
            <div className="select-wrap">
            {props.personas && props.personas.length > 1 &&
            <>
                <Form.Label className="mr-2">{props.selfIdStart}</Form.Label>
                <Form.Control as="select" name="persona" size="sm" className="mr-2" value={props.curSelPersona} onChange={props.updateSelectedPersona}>
                    {!props.currentPersonaId && <option value="" key="--">--</option>}
                    {props.personas.map((persona) => (
                    <option value={persona.personaid} key={persona.personaid}>{persona.selfidq}</option>
                    ))}
                </Form.Control>
            </>
            }
            {props.stages && props.stages.length > 1 &&
            <>
                <Form.Label className="mr-2">{props.selfIdMiddle}</Form.Label>
                <Form.Control as="select" name="stage" size="sm" className="mr-2" value={props.curSelStage} onChange={props.updateSelectedStage}>
                    {!props.currentStageId && <option value="" key="--">--</option>}
                    {props.stages.map((stage) => (
                    <option value={stage.stageid} key={stage.stageid}>{stage.selfidq}</option>
                    ))}
                </Form.Control>
            </>
            }
            {props.personas && props.stages && <p>{props.selfIdEnd}</p>}
          
            {!props.isClearing && props.selHasChanged &&  props.curSelPersona &&  props.curSelStage && <Button className="ml-2" size="sm" variant="dark" type="button" onClick={props.handlePreview}>
                {props.isPreviewing ? 'Preview...' : 'Preview'}
            </Button>}
            {!props.isPreviewing && !props.isClearing && props.mode != 'preview only' && !props.selHasChanged && props.isPreview && <Button className="ml-2" size="sm" variant="dark" type="submit">
                {props.isSaving ? 'Saving...' : 'Save'}
            </Button>}
            {!props.isSaving && !props.isPreviewing && (props.currentPersonaId || props.currentStageId) && <Button className="ml-2" size="sm" variant="outline-dark" type="button" onClick={props.handleClear}>
                {props.isClearing ? 'Clearing...' : 'Clear'}
            </Button>}
            </div>
        </Form>
        }
        </>
    )
}
export const getDynamicProps = async () => {
    const dynamicProps = await Mura.getEntity('matrix_selector').invoke('getDynamicProps');
    //console.log(dynamicProps)
    return dynamicProps;
}


export default MatrixSelector;

export const ModuleConfig={
    key: 'MatrixSelector',
    name:"Experience Selector",
    component: MatrixSelector,
    getDynamicProps:  getDynamicProps,
    excludeFromClient: false,
    isCollectionLayout: false,
    contenttypes:"*",
    iconclass:"mi-road",
    external:true,
    configurator:[
        {
            "type":"text",
            "name":"selfidstart",
            "label":"Self ID Start"
        },
        {
            "type":"text",
            "name":"selfidmiddle",
            "label":"Self ID Middle"
        },
        {
            "type":"text",
            "name":"selfidend",
            "label":"Self ID End"
        },
        {
            "type":"select",
            "name":"mode",
            "label":"Mode",
            "labels":["Preview Only","Preview and Save"],
            "options":["preview only","preview and save"],
            "value":"preview only"
        },
        {
            "type":"select",
            "name":"displaytype",
            "label":"Display Type",
            "labels":["Inline","Widget","Eyebrow"],
            "options":["inline","widget","eyebrow"],
            "value":"inline"
        },
        {
            "type":"select",
            "name":"widgetposition",
            "label":"Widget Position",
            "labels":["Top / Right","Bottom / Right","Bottom / Left","Top / Left"],
            "options":["top_right","bottom_right","bottom_left","top_left"],
            "value":"top_right",
            "condition":"this.displaytype==='widget'"

        },
        {
            "type":"name_value_array",
            "name":"customlinks",
            "label":"Links"
        }
    ]
  }