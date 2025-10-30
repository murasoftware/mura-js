# Development Process

This document outlines the development workflow for the mura.js project.

## Branch Structure

- **`develop`** - Development branch for ongoing work
- **`master`** - Production branch for stable releases
- **Feature branches** - Individual development work

## Development Workflow

### 1. Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 2. Making Changes
- Make your code changes
- Test locally using `npm run build:package` to verify builds work
- Commit your changes with descriptive messages

### 3. Opening a Pull Request
**Pull Requests are REQUIRED for all code merges:**
- **To `develop` branch**: For feature development and bug fixes
- **To `master` branch**: For production releases (only from `develop` branch)

**Branch Protection Rules:**
- Cannot push directly to `develop` or `master`
- Must use Pull Requests
- Requires code review approval

### 4. CI/CD Pipeline Behavior

**When PR is created targeting `develop`:**
- CodeBuild runs automatically
- Publishes RC version (e.g., `1.0.416-rc.0`)
- Comments on PR with published version
- Uses `npm run publish:rc` script

**When PR is merged to `master`:**
- CodeBuild runs automatically  
- Publishes production version (e.g., `1.0.416`)
- Uses `npm run publish:prod` script

## Versioning Strategy

### RC Versions (Development)
- Format: `1.0.416-rc.0`, `1.0.416-rc.1`, etc.
- Published with `rc` tag: `npm install @murasoftware/mura.js@rc`
- Based on next production version (`current + 1`)

### Production Versions
- Format: `1.0.416`, `1.0.417`, etc.
- Published with `latest` tag: `npm install @murasoftware/mura.js`
- Auto-increments patch version

## Local Development

### Prerequisites
- Node.js
- npm
- Git

### Setup
```bash
git clone https://github.com/murasoftware/mura-js.git
cd mura-js
npm install
```

### Build Commands
```bash
npm run dev          # Grunt + Webpack dev build
npm run build        # Webpack production build  
npm run build:package # Both dev and build
```

### Testing Changes Locally
```bash
# Build the package
npm run build:package

# Test specific scripts (won't actually publish without npm token)
node scripts/publish-rc.js    # Shows what RC version would be created
node scripts/publish-prod.js  # Shows what prod version would be created
```

## Important Notes

### Automated Versioning
- **Never manually edit version numbers** in `package.json`
- CI/CD scripts automatically determine versions based on npm registry
- RC versions check latest production + increment
- Production versions check latest production + increment

### Dependabot
- Automatically creates PRs for dependency updates
- Targets `develop` branch (not `master`)
- Grouped updates to reduce PR noise
- Follows same review process as manual PRs

### Package Distribution
- NPM package: `@murasoftware/mura.js`
- Includes both `dist/mura.js` and `dist/mura.min.js`
- Also includes full source code in `src/`

## Troubleshooting

### Build Issues
- Ensure you have the latest dependencies: `npm install`
- Check that grunt and webpack run successfully
- Verify `dist/` files are generated

### Version Conflicts
- CI/CD handles version conflicts automatically
- Scripts check npm registry for latest versions
- No manual intervention needed for version management

### PR Status Checks
- If CI/CD fails, check CodeBuild logs
- Common issues: build failures, npm publish permissions
- Must resolve before PR can be merged
