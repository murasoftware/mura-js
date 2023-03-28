const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
jsdoc2md.render({ files: 'src/**/*.js' }).then((output) => {
    let md=output.replace(/new /g,"new Mura.");
    md=md.replace(/new Mura.Mura/g,"new Mura.");
    md=md.replace(/\.\./g,".");
    md=md.replace("* [new Mura.Mura()](#new_Mura_new)","");
    md=md.replace("new Mura.instance","new instance");
  fs.writeFileSync('docs/README.md', md);
});