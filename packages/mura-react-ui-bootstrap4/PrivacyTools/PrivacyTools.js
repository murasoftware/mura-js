import React,{useState,useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function PrivacyTools(){
    const [optIn, setOptIn] = useState(0);
    const [optOut, setOptOut] = useState(0);
    const [mxpAnon, setMxpAnon] = useState(0);
    const [updateSuccess,setUpdateSuccess] = useState(0);
    const [showingAlert,setShowingAlert] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePrivacyMXP(optIn,optOut);        
        setUpdateSuccess(1);
        return false;
    }   

    const updatePrivacyMXP = async (optIn,optOut) => {
        
        const privacyOptIn = await Mura
            .getEntity('privacy_tools')
            .invoke(
                'updatePrivacyMXP',
                {
                mxp_opt_in:optIn,
                mxp_opt_out:optOut
                }
            );
        
        setShowingAlert(true);
        return privacyOptIn;
    }

    const mxpAnonChanged = (e) => {
        setMxpAnon(e.target.value);
        if(e.target.value == 1){
            setOptIn(0);
            setOptOut(1);
        } else {
            setOptIn(1);
            setOptOut(0);
        }
    }
    
    //update opt in / out values on radio button click
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            if(mxpAnon == 1){
                setOptIn(0);
                setOptOut(1);
            } else {
                setOptIn(1);
                setOptOut(0);
            }
        }
    
        return () => { isMounted = false };
      }, [mxpAnon]); 
    
    //show alert or not
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            if(showingAlert){
                setTimeout(() => {
                    setShowingAlert(false);
                }, 2000);
            }
        }

        return () => { isMounted = false };
    }, [showingAlert]);

    return(
    <>
        <h3>Privacy Settings</h3>
        {updateSuccess == 1 && showingAlert &&
            <Alert variant="success" >Your preference has been saved.</Alert>
        }
        <Form onSubmit={handleSubmit} data-autowire="false">
            <Form.Group controlId="radio_mxp_anon">
                <Form.Check
                    type="radio"
                    id="mxp_anon1"
                    name="mxp_anon"
                    value="0"
                    checked={mxpAnon == 0}
                    onChange={mxpAnonChanged}
                    label="For a better experience, allow this site to store some identifying information"
                />
                <Form.Check
                    type="radio"
                    id="mxp_anon2"
                    name="mxp_anon"
                    value="1"
                    checked={mxpAnon == 1}
                    onChange={mxpAnonChanged}
                    label="Do not allow this site to store some identifying information"
                />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </>
    );
}

export default PrivacyTools