import React,{ useContext, useEffect } from "react";
import {  EditContext  } from "./GlobalContext";

const EditLayout = ({children}) => {
    const [, setIsEditMode]  = useContext(EditContext);

    useEffect(()=>{
        setIsEditMode(true);
    }, [setIsEditMode])

    return (
        <div>
            {children}
            <div id="htmlqueues" />
        </div>
    )
}

export default EditLayout;