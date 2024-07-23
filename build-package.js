#!/usr/bin/node
const fs = require('fs');
const { exec } = require('child_process');
const pjson = require('./package.json');

if (process.env.MURA_PACKAGE === 'mura.js') {
  pjson.name = 'mura.js';
  pjson.main = 'src/index.js';
} else {
  pjson.name = '@murasoftware/mura';
  pjson.main = 'src/index-namespaced.js';
}

fs.writeFileSync('./package.json', JSON.stringify(pjson, null, 2));

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    exec(`npm run ${scriptName}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error running ${scriptName}:`, error);
        reject(error);
      } else {
        console.log(`Output of ${scriptName}:`, stdout);
        if (stderr) console.log(`Error output of ${scriptName}:`, stderr);
        resolve(stdout);
      }
    });
  });
}

async function build() {
  try {
    await runScript('dev');
    await runScript('build');
  } catch (error) {
    console.error('Build process failed:', error);
  }
}

build();