---
name: Angular 20 Migration
overview: Migrate the Alfresco Nx monorepo from Angular 19 to Angular 20, including Angular Material 20, TypeScript 5.9, and ng-packagr 20 using the nx migrate command.
todos:
  - id: prepare-migration
    content: Clean any existing migrations.json and generate migration plan with nx migrate latest
    status: completed
  - id: review-versions
    content: Review and adjust package.json versions to ensure Angular 20, TypeScript 5.9, ng-packagr 20, and compatible ESLint versions
    status: completed
  - id: install-deps
    content: Install updated dependencies with npm install
    status: completed
  - id: run-migrations
    content: Execute automated migrations with npx nx migrate --run-migrations
    status: completed
  - id: update-configs
    content: Update TypeScript and ESLint configurations for compatibility with new versions
    status: completed
  - id: verify-lint
    content: Run ESLint and stylelint across all projects to catch syntax and style issues
    status: in_progress
  - id: verify-builds
    content: Build all libraries in dependency order to ensure compilation succeeds
    status: pending
  - id: verify-tests
    content: Run test suites to ensure no runtime breaking changes
    status: pending
  - id: cleanup-commit
    content: Remove migrations.json and create comprehensive commit documenting the migration
    status: pending
isProject: false
---

# Angular 20 Migration Plan

## Current State

The workspace is currently on:

- Angular: 19.2.18
- Angular Material: 19.2.19
- TypeScript: 5.8.3
- ng-packagr: 19.2.2
- Nx: 22.4.1
- Node: v24.13.0

## Target Versions

- **@angular/core**: 20.x
- **@angular/material**: 20.x
- **typescript**: 5.9.x
- **ng-packagr**: 20.x
- **@typescript-eslint**: 8.x (compatible with TypeScript 5.9 and Angular 20)

## Migration Strategy

The migration will use `nx migrate` to ensure all dependencies are upgraded in a coordinated manner. This is the recommended approach for Nx workspaces as it handles:

- Package version updates
- Code transformations via automated migrations
- Dependency graph awareness

## Key Projects to Build and Test

Based on `[nx.json](nx.json)` and `[package.json](package.json)`, the following library projects use ng-packagr and must be verified:

1. **core** - `[lib/core](lib/core)` - Foundation library with dependencies on js-api and extensions
2. **content-services** - `[lib/content-services](lib/content-services)` - Depends on js-api, core, and extensions
3. **process-services** - `[lib/process-services](lib/process-services)` - Depends on js-api, core, content-services
4. **process-services-cloud** - `[lib/process-services-cloud](lib/process-services-cloud)` - Depends on js-api, core, content-services, extensions
5. **extensions** - `[lib/extensions](lib/extensions)` - Depends on js-api
6. **insights** - `[lib/insights](lib/insights)` - Depends on core, content-services, js-api

## Migration Steps

### Phase 1: Preparation and Migration Generation

1. **Clean existing migrations** (if any exist)
  - Check for and remove any existing `migrations.json` from previous incomplete migrations
2. **Generate migration plan**
  ```bash
   npx nx migrate latest
  ```
   This will:
  - Generate `migrations.json` with all necessary migration steps
  - Update `[package.json](package.json)` with new versions
  - Include migrations from @nx/angular, @angular/core, and related packages
3. **Review migration changes**
  - Examine the generated `migrations.json`
  - Review `[package.json](package.json)` changes to ensure target versions are correct:
    - TypeScript should be ~5.9.x
    - Angular packages should be ~20.x
    - Angular Material should be ~20.x
    - ng-packagr should be ~20.x
    - @typescript-eslint packages should be updated to v8.x
4. **Manual version adjustments** (if needed)
  - If `nx migrate latest` doesn't target Angular 20 specifically, manually adjust package.json versions
  - Ensure compatibility between:
    - @angular-eslint (should be 20.x for Angular 20)
    - @typescript-eslint (should be 8.x for TypeScript 5.9)
    - ESLint (may need to stay on v8.x depending on plugin compatibility)

### Phase 2: Installation and Migration Execution

1. **Install updated dependencies**
  ```bash
   npm install
  ```
  - This installs all updated packages from the modified `package.json`
  - May take several minutes given the size of dependencies
2. **Run automated migrations**
  ```bash
   npx nx migrate --run-migrations
  ```
   This executes all migrations in `migrations.json`, which may include:
  - Angular Material component API updates
  - Deprecation replacements
  - Import path changes
  - Configuration file updates
3. **Review migration results**
  - Check git diff to see what code changes were made
  - Look for any migration warnings or errors in the console output

### Phase 3: TypeScript and ESLint Configuration Updates

1. **Update TypeScript compiler options**
  - Review `[tsconfig.json](tsconfig.json)` for any needed changes
  - TypeScript 5.9 may introduce new strict checks or deprecations
  - Ensure `target: "ES2022"` is still appropriate
2. **Update ESLint configuration**
  - Review `[.eslintrc.js](.eslintrc.js)` for compatibility
  - The current config uses @typescript-eslint v6.21.0 which needs updating to v8.x
  - Check for any deprecated rules in the new @typescript-eslint version
  - Ensure @angular-eslint plugins are compatible
3. **Fix ng-packagr configurations**
  - Review all `[ng-package.json](lib/core/ng-package.json)` files
    - ng-packagr 20 may have schema changes or deprecated options
    - Key projects with ng-package.json:
      - lib/core
      - lib/content-services
      - lib/process-services
      - lib/process-services-cloud
      - lib/extensions
      - lib/insights

### Phase 4: Verification - Linting

1. **Run ESLint across all projects**
  ```bash
    npx nx run-many -t lint --all --fix --skip-nx-cache --parallel=5
  ```
  - Uses parallel execution for faster linting
  - `--fix` attempts to auto-fix issues
  - `--skip-nx-cache` ensures fresh linting results
  - Address any linting errors that cannot be auto-fixed
2. **Run stylelint** (if applicable)
  ```bash
    npx nx run-many -t stylelint --all --skip-nx-cache
  ```
  - Verifies SCSS files haven't been broken by Material updates

### Phase 5: Verification - Builds

1. **Build core libraries in dependency order**
  Due to project dependencies, build in this order:
    a. **js-api** (no Angular dependencies)
    b. **extensions** (depends on js-api)
    c. **core** (depends on js-api, extensions)
    d. **content-services** (depends on js-api, core, extensions)
    e. **process-services** (depends on js-api, core, content-services)
    f. **process-services-cloud** (depends on js-api, core, content-services, extensions)
    g. **insights** (depends on core, content-services, js-api)
2. **Build all libraries at once** (if individual builds succeed)
  ```bash
    npx nx run-many -t build --all --skip-nx-cache
  ```
  - This verifies the entire build graph
  - May reveal transitive dependency issues

### Phase 6: Verification - Tests

1. **Run tests**
  ```bash
    npx nx run-many -t test --all --skip-nx-cache
  ```
  - Ensures no runtime breaking changes from Angular 20
  - May need to update test configurations if Karma or Jest have issues

### Phase 7: Cleanup

1. **Remove migrations.json**
  ```bash
    rm migrations.json
  ```
  - Only after all migrations are successfully applied and verified
2. **Commit the migration**
  - Create a comprehensive commit message documenting:
    - Angular 19 → 20 upgrade
    - TypeScript 5.8 → 5.9 upgrade
    - Angular Material 19 → 20 upgrade
    - ng-packagr 19 → 20 upgrade
    - Any breaking changes addressed

## Potential Issues and Solutions

### TypeScript 5.9 Strict Checks

- **Issue**: New strict checks may flag existing code
- **Solution**: Address type errors incrementally, or temporarily adjust `tsconfig.json` strict flags if needed

### ESLint v8 vs v9

- **Issue**: Current setup uses ESLint v8.47.0; many plugins may not support ESLint v9 yet
- **Solution**: Stay on ESLint v8 until all plugins (@angular-eslint, @typescript-eslint, custom plugins) support v9

### Angular Material Breaking Changes

- **Issue**: Angular Material 20 may have component API changes
- **Solution**: Review [Angular Material changelog](https://github.com/angular/components/releases) for breaking changes; most should be handled by migrations

### ng-packagr Configuration

- **Issue**: ng-packagr 20 may deprecate certain configuration options
- **Solution**: Check [ng-packagr releases](https://github.com/ng-packagr/ng-packagr/releases) for breaking changes; update ng-package.json files as needed

### Peer Dependency Warnings

- **Issue**: Library package.json files have broad peer dependency ranges (e.g., `>=16.0.0`)
- **Solution**: These may need updating to `>=20.0.0` after successful migration to prevent future version conflicts

### Storybook Compatibility

- **Issue**: The workspace uses Storybook 10.2.0 which should be compatible with Angular 20, but may need updates
- **Solution**: If Storybook build fails, check for @storybook/angular updates

## Verification Commands Summary

```bash
# Linting
npx nx run-many -t lint --all --fix --skip-nx-cache --parallel=5

# Individual builds (in dependency order)
nx build js-api
nx build extensions
nx build core
nx build content-services
nx build process-services
nx build process-services-cloud
nx build insights

# All builds
npx nx run-many -t build --all --skip-nx-cache

# Tests
npx nx run-many -t test --all --skip-nx-cache
```

## Rollback Strategy

If critical issues arise:

1. Git revert the migration commit
2. Run `npm install` to restore previous package versions
3. Delete `node_modules` and `package-lock.json`, then `npm install` if issues persist

## Timeline Expectations

- Phase 1-2 (Migration generation and installation): ~10-15 minutes
- Phase 3 (Configuration updates): ~15-30 minutes
- Phase 4 (Linting): ~5-10 minutes
- Phase 5 (Builds): ~15-30 minutes (depending on caching)
- Phase 6 (Tests): ~10-30 minutes (depending on test suite size)
- **Total estimated time**: 1-2 hours for a clean migration, potentially longer if significant issues arise

