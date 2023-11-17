import React, { useEffect } from 'react';
/* 
    This is not being used yet

    steps to use:
        1. Set external:true or remove the attribute from the mura.config.json
        2. Remove the comment from the mura/react/Login import in the mura.config.js
        3. Add the component to the moduleRegistry "login" item in the mura.config.js
        4. Update the MuraMinimal theme login module to be this.SSR aware
        5. docker-compose up --build
*/

function Login(props) {

    useEffect(() => {
      Mura('div.mura-object[data-instanceid="'  + props.instanceid + '"]').processDisplayObject();
    }, []);

    return (
      <h3>Login</h3>
    );
  
}

export default Login;

export const ModuleConfig={
  key: 'Login',
  name: 'Login',
  component: Login,
  getDynamicProps:  function(){},
  external:false,
  excludeFromClient: false,
  isCollectionLayout: false,
  contentypes:"*",
  external:false,
  iconclass:"mi-keyboard-o",
  external:false
}