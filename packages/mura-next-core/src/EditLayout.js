import React from "react";
import {  setIsEditMode  } from "@murasoftware/next-core";

const EditLayout = ({children}) => {
  
    setIsEditMode(true);

    return (
        <div>
            {children}
            <div id="htmlqueues" />
        </div>
    )
}

export default EditLayout;