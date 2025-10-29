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

// Increment production version to get the next version base
const parts = prodVersion.split('.');
parts[2] = parseInt(parts[2]) + 1;
const nextVersion = parts.join('.');

// Get latest RC version from npm
let rcVersion;
try {
  rcVersion = execSync(`npm view ${pkg.name} version --tag rc`, { encoding: 'utf8' }).trim();
} catch (error) {
  rcVersion = 'none';
}

// Parse RC version to see if it matches the next version base
const rcMatch = rcVersion.match(/^(.+)-rc\.(\d+)$/);

if (rcMatch && rcMatch[1] === nextVersion) {
  // Increment existing RC series for the next version
  pkg.version = `${nextVersion}-rc.${parseInt(rcMatch[2]) + 1}`;
} else {
  // Start new RC series for the next version
  pkg.version = `${nextVersion}-rc.0`;
}

// Write updated package.json
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

console.log(`Updated version to: ${pkg.version}`);