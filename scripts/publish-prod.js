#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Read current package.json
const pkg = require('../package.json');

// Get latest production version from npm
let latest;
try {
  latest = execSync(`npm view ${pkg.name} version`, { encoding: 'utf8' }).trim();
} catch (error) {
  // If package doesn't exist yet, use current version
  latest = pkg.version;
}

// Increment patch version
const parts = latest.split('.');
parts[2] = parseInt(parts[2]) + 1;
pkg.version = parts.join('.');

// Write updated package.json
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

console.log(`Updated version to: ${pkg.version}`);