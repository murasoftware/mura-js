#! /usr/bin/node
const fs = require('fs');
const pjson = require('./package.json');
const npm = require('npm');


if(process.env.MURA_PACKAGE==='mura.js'){
    pjson.name='mura.js';
    pjson.main='./src/index.js';
} else {
    pjson.name='@murasoftware/mura';
    pjson.main='./src/index-namespaced.js';
}

fs.writeFileSync('./package.json', JSON.stringify(pjson, null, 2));

async function build(name, main){
    await npm.run('dev', (err) => { console.log(err) });
    await npm.run('build', (err) => { console.log(err) });
}

npm.load(async () => {
    build();
});



