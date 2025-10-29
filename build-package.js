#!/usr/bin/node
const { exec } = require('child_process');

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