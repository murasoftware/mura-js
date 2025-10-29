#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Read current package.json
const pkg = require('../package.json');

// Get latest production version from npm
let prodVersion;
try {
  prodVersion = execSync(`npm view ${pkg.name} version`, { encoding: 'utf8' }).trim();
} catch (error) {
  // If package doesn't exist yet, use current version
  prodVersion = pkg.version;
}

// Get latest RC version from npm
let rcVersion;
try {
  rcVersion = execSync(`npm view ${pkg.name} version --tag rc`, { encoding: 'utf8' }).trim();
} catch (error) {
  rcVersion = 'none';
}

// Parse RC version to see if it matches current production base
const rcMatch = rcVersion.match(/^(.+)-rc\.(\d+)$/);

if (rcMatch && rcMatch[1] === prodVersion) {
  // Increment existing RC series
  pkg.version = `${prodVersion}-rc.${parseInt(rcMatch[2]) + 1}`;
} else {
  // Start new RC series
  pkg.version = `${prodVersion}-rc.0`;
}

// Write updated package.json
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

console.log(`Updated version to: ${pkg.version}`);