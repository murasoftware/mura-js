import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Mura from 'mura.js';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function MatrixSelector(props){
    const objectparams = Object.assign({}, props);

    const _personaIds = objectparams.dynamicProps ? objectparams.dynamicProps.personaProps : '';
    const _stageIds = objectparams.dynamicProps ? objectparams.dynamicProps.stageProps : '';

    const [personaIds, setPersonaIds] = useState(_personaIds);
    const [stageIds, setStageIds] = useState(_stageIds);

    const _selfIdStart = objectparams.selfidstart ? objectparams.selfidstart : 'I want to learn about';
    const _selfIdMiddle = objectparams.selfidmiddle ? objectparams.selfidmiddle : 'for my company, or about the';
    const _selfIdEnd = objectparams.selfidend ? objectparams.selfidend : 'industry.';
    const _displayType = objectparams.displaytype ? objectparams.displaytype : 'inline';

    const [selfIdStart, setSelfIdStart] = useState(_selfIdStart);
    const [selfIdMiddle, setSelfIdMiddle] = useState(_selfIdMiddle);
    const [selfIdEnd, setSelfIdEnd] = useState(_selfIdEnd);
    const [displayType, setDisplayType] = useState(_displayType);

    const [curSelPersona, setCurSelPersona] = useState('');
    const [curSelStage, setCurSelStage] = useState('');
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showingAlert,setShowingAlert] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [selPersonaValidated, setSelPersonaValidated] = useState(false);
    const [selStageValidated, setSelStageValidated] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        updateExperience(curSelPersona,curSelStage);
        return false;
    }

    const updateSelectedPersona = (e) => {
        const newPersona = e.target.value;
        if (curSelPersona != newPersona){
            setCurSelPersona(newPersona);
            checkSelectValidation(newPersona,curSelStage);
        }
    }

    const updateSelectedStage = (e) => {
        const newStage = e.target.value;
        if (curSelStage != newStage){
            setCurSelStage(newStage);
            checkSelectValidation(curSelPersona,newStage);
        }        
    }

    const checkSelectValidation = (persona,stage) => {
        //check persona value and personaIds length to see if validated flag should be updated
        if (persona != '' && personaIds.length){
            setSelPersonaValidated(true);
        } else if (persona = '' && personaIds.length){
            setSelPersonaValidated(false);
        }
        //check stage value and stageIds length to see if validated flag should be updated
        if (stage != '' && stageIds.length){
            setSelStageValidated(true);
        } else if (stage = '' && stageIds.length){
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
    const updateExperience = async (personaid,stageid) => {
        setIsUpdating(true);
        setButtonEnabled(false);
        
        const Personaid = personaid;
        const Stageid = stageid;
        // console.log('Personaid: ', Personaid);
        // console.log('Stageid: ', Stageid);
        const exp = await Mura
          .getEntity('matrix_selector')
          .invoke(
            'updateExperience',
            {
                personaid:personaid,
                stageid:stageid
            }
          );
        
        if (exp.personaselected || exp.stageselected){
            setUpdateSuccess(1);
            setShowingAlert(true);
            setIsUpdating(false);
            setSeconds(3);
        }
    
        if (exp.personaselected){
            Mura(function(){
                Mura.trackEvent({
                        category: 'Matrix Self ID',
                        action: 'Persona',
                        label:  '#esapiEncode("javascript",personaName)#'
                });
            });
        }
        
        if (exp.stageselected){
            Mura(function(){
                Mura.trackEvent({
                        category: 'Matrix Self ID',
                        action: 'Stage',
                        label: '#esapiEncode("javascript",stageName)#'
                });
            });
        }
    
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

    if(!objectparams.dynamicProps){
        useEffect(() => {
            let isMounted = true;
            if (isMounted) {
                getPersonas().then((personaProps) => {
                    if (isMounted) {
                        setPersonaIds(personaProps);
                        if (!personaProps.length){
                            if (isMounted) {
                                setSelPersonaValidated(true);
                            }
                        }
                    }
                });
                getStages().then((stageProps) => {
                    if (isMounted) {
                        setStageIds(stageProps);
                        if (!stageProps.length){
                            if (isMounted) {
                                setSelStageValidated(true);
                            }
                        }
                    }
                });
            }
            return () => { isMounted = false };
        }, []);
        //todo do we need to add hidden form fields if personaIds or stageIds EQ 1?
        const [open, setOpen] = React.useState('');

        switch(displayType){
            case "widget" :
                return(
                    <>
                    {/* Mura.editing doesn't seem to work here */}
                    <Alert variant="info matrix-selector-edit-alert" >
                        <p className="mb-0">Matrix Selector</p>
                    </Alert>
                    <div className={`${open ? 'open' : ''} mura-matrix-selector__widget ${props.widgetposition}`}>
                        <Button 
                            variant="light"
                            onClick={() => { setOpen(!open); }}>
                            <FontAwesomeIcon icon={faBolt} /> Optimize Your Experience
                        </Button>
                        <div className="mura-matrix-selector__widget__inner">
                            <MatrixForm 
                                updateSuccess={updateSuccess}
                                showingAlert={showingAlert}
                                handleSubmit={handleSubmit}
                                selfIdStart={selfIdStart}
                                updateSelectedPersona={updateSelectedPersona}
                                personaIds={personaIds}
                                stageIds={stageIds}
                                selfIdMiddle={selfIdMiddle}
                                updateSelectedStage={updateSelectedStage}
                                selfIdEnd={selfIdEnd}
                                buttonEnabled={buttonEnabled}
                                isUpdating={isUpdating}
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
                                    <h4><FontAwesomeIcon icon={faBolt} /> Optimize Your Experience</h4>
                                </div>
                            }
                            <MatrixForm 
                                updateSuccess={updateSuccess}
                                showingAlert={showingAlert}
                                handleSubmit={handleSubmit}
                                selfIdStart={selfIdStart}
                                updateSelectedPersona={updateSelectedPersona}
                                personaIds={personaIds}
                                stageIds={stageIds}
                                selfIdMiddle={selfIdMiddle}
                                updateSelectedStage={updateSelectedStage}
                                selfIdEnd={selfIdEnd}
                                buttonEnabled={buttonEnabled}
                                isUpdating={isUpdating}
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
                    handleSubmit={handleSubmit}
                    selfIdStart={selfIdStart}
                    updateSelectedPersona={updateSelectedPersona}
                    personaIds={personaIds}
                    stageIds={stageIds}
                    selfIdMiddle={selfIdMiddle}
                    updateSelectedStage={updateSelectedStage}
                    selfIdEnd={selfIdEnd}
                    buttonEnabled={buttonEnabled}
                    isUpdating={isUpdating}
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
    console.log('props: ', props);
    if (CustomLinks && CustomLinks.length){
        const UtilityLinks = CustomLinks.map((link) => 
        <li className="list-inline-item" key={link.name}>
            <a href={link.value}>{link.name}</a>
        </li>
        );
        return (
            <ul className="list-inline">
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
        <Form inline id="mura_matrix-selector-form" onSubmit={props.handleSubmit} data-autowire="false">
            <div className="select-wrap">
            {props.personaIds.length > 1 &&
            <>
                <Form.Label className="mr-2">{props.selfIdStart}</Form.Label>
                <Form.Control as="select" name="persona" size="sm" className="mr-2" value={props.curSelPersona} onChange={props.updateSelectedPersona}>
                    <option value="" key="--">--</option>
                    {props.personaIds.map((personaId) => (
                    <option value={personaId.personaid} key={personaId.personaid}>{personaId.selfidq}</option>
                    ))}
                </Form.Control>
            </>
            }
            {props.stageIds.length > 1 &&
            <>
                <Form.Label className="mr-2">{props.selfIdMiddle}</Form.Label>
                <Form.Control as="select" name="stage" size="sm" className="mr-2" value={props.curSelStage} onChange={props.updateSelectedStage}>
                    <option value="" key="--">--</option>
                    {props.stageIds.map((stageId) => (
                    <option value={stageId.stageid} key={stageId.stageid}>{stageId.selfidq}</option>
                    ))}
                </Form.Control>
            </>
            }
            <p>{props.selfIdEnd}</p>
            
            
            <Button className="ml-2" variant="link" size="sm" type="submit" disabled={!props.buttonEnabled}>
                {props.isUpdating ? 'Updating...' : 'Update'}
            </Button>
            </div>
        </Form>
        }
        </>
    )
}
export const getDynamicProps = async props => {
    const personaIds = await getPersonas();
    const stageIds = await getStages();

    return{
      personaProps:personaIds,
      stageProps:stageIds
    }
}

const getPersonas = async () => {  
    
    const personaIds = await Mura
      .getEntity('matrix_selector')
      .invoke(
        'getPersonas'
      );

    return personaIds;
}

const getStages = async () => {  
    
    const stageIds = await Mura
      .getEntity('matrix_selector')
      .invoke(
        'getStages'
      );
    
    return stageIds;
}

export default MatrixSelector;