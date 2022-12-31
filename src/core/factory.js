function factory(){
    const Mura=require('./core.js')({});
    require('./object.js')(Mura);
    require('./req-instance.js')(Mura);
    require('./req-context.js')(Mura);
    require('./cache.js')(Mura);
    require('./entity.js')(Mura);
    require('./content.js')(Mura);
    require('./user.js')(Mura);
    require('./entitycollection.js')(Mura);
    require('./feed.js')(Mura);
    require('./loader.js')(Mura);
    require('./domselection.js')(Mura);
    require('./ui.js')(Mura);
    require('./ui.form')(Mura);
    require('./ui.text')(Mura);
    require('./ui.hr')(Mura);
    require('./ui.embed')(Mura);
    require('./ui.image')(Mura);
    require('./ui.collection')(Mura);
    require('./ui.container')(Mura);
    require('./templates')(Mura);
    require('./stylemap')(Mura);

    if(Mura.isInNode()){
        Mura._escapeHTML=require('escape-html');
        
    } else if (typeof window != 'undefined'){

        window.m=Mura;
        window.mura=Mura;
        window.Mura=Mura;
        window.validateForm=Mura.validateForm;
        window.setHTMLEditor=Mura.setHTMLEditor;
        window.createCookie=Mura.createCookie;
        window.readCookie=Mura.readCookie;
        window.addLoadEvent=Mura.addLoadEvent;
        window.noSpam=Mura.noSpam;
        window.initMura=Mura.init;
    }
    return Mura;
}

module.exports=factory;

