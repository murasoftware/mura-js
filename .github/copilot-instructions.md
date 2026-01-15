# Mura.js AI Coding Instructions

## Project Overview
Mura.js is a JavaScript utility library for interacting with the Mura CMS JSON/REST API. It provides a unified interface for both browser and Node.js environments with a modular factory pattern architecture.

## Architecture Patterns

### Factory Pattern & Module Loading
- Core modules are loaded via `src/core/factory.js` using a sequential require chain
- Each module extends the base `Mura` object using the attach pattern: `function attach(Mura) { ... }`
- Browser vs Node.js detection uses: `Mura.isInNode()` and conditional polyfill loading

### Single Package Strategy  
The project publishes as a single npm package:
- `@murasoftware/mura.js` - uses `src/index-namespaced.js` as entry point
- Simplified build process without dynamic package switching

### Entity-Collection Pattern
- Base class: `Mura.Core` (object inheritance via `extend()`)
- Entities: `Mura.Entity` for individual content/user objects
- Collections: `Mura.EntityCollection` for arrays of entities  
- Fluent API: `Mura.getEntity('content').loadBy('contentid','123').then()`

## Build System & Workflows

### Development Commands
- `npm run dev` - Runs Grunt templates + Webpack dev build
- `npm run build` - Production Webpack build with minification
- `grunt` - Compiles Handlebars templates to `src/core/templates-handlebars.js`

### Template System
- Handlebars templates in `src/templates/*.hbs` 
- Grunt compiles them into `Mura.templates` namespace
- Templates are automatically wrapped in module.exports attach function

### Publishing Workflow
```bash
npm run build:package          # Runs dev + build scripts
npm run publish                # Builds and publishes @murasoftware/mura.js
```

## Code Conventions

### Module Structure
All core modules follow this pattern:
```javascript
function attach(Mura){
    Mura.NewClass = Mura.Core.extend({
        init(properties, requestcontext) {
            // Constructor logic
        },
        // Methods...
    });
}
module.exports = attach;
```

### Environment Compatibility
- Use `Mura.isInNode()` for environment detection
- Browser globals set in `factory.js`: `window.Mura`, `window.m`, `window.mura`
- Node.js specific imports conditionally loaded (escape-html, node-fetch)

### Request Context Pattern
- Browser: Uses cookies and DOM for state
- Node.js: Requires `request`/`response` objects passed to `Mura.init()`
- REST mode: Uses headers instead of cookies

## Next.js Integration Packages

### Package Structure
- `packages/mura-next-core/` - Core Next.js utilities (v1 & v2)
- `packages/mura-next-modules-bs4/` - Bootstrap 4 React components
- Components export both default component and `ModuleConfig` for Mura integration

### React Component Patterns
- Dynamic props via `getDynamicProps` functions
- Layout components in separate files (e.g., `CollectionLayout*`)
- Router abstraction via `RouterLink`/`RouterlessLink` components

## Key Files to Reference
- `src/core/factory.js` - Module loading sequence and browser globals
- `src/core/core.js` - Main API methods and initialization
- `build-package.js` - Build automation script
- `webpack.config.js` - Browser bundle configuration with UMD output
- `packages/mura-next-modules-bs4/src/index.js` - React component exports pattern