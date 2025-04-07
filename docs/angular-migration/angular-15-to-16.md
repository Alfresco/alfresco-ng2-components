# Migrating from Angular 15 to Angular 16

This guide will help you migrate your Angular application from version 15 to version 16. Follow these steps to ensure a smooth transition.

## 1. Update Nx

First, update the Nx development dependencies. Use the `nx migrate` command for this purpose.

```bash
npx nx migrate 16.10.0
```

Updated Nx dependencies:

```json
{
    "@nx/angular": "16.10.0",
    "@nx/eslint-plugin": "16.10.0",
    "@nx/js": "16.10.0",
    "@nx/node": "16.10.0",
    "@nx/storybook": "19.6.2",
    "@nx/workspace": "16.10.0"
}
```

**As of Nx 16 package scope has changed from `@nrwl/*` to `@nx/*`.**
Nx's migration scripts will replace all `@nrwl` references in the project with `@nx`. This includes any imports, configuration files, and scripts.

## 2. Run Nx migrations

After the initial update a `migrations.json` file will be created containing all the additional changes that need to be made. You can run the migration script to apply these changes.

```bash
npx nx migrate --run-migrations
```

Those migrations should update required packages to the Angular 16 compatible version including Angular itself, Storybook, and others.

```json
{
    "@angular/animations": "16.2.9",
    "@angular/cdk": "16.2.9",
    "@angular/common": "16.2.9",
    "@angular/compiler": "16.2.9",
    "@angular/core": "16.2.9",
    "@angular/forms": "16.2.9",
    "@angular/material": "16.2.9",
    "@angular/material-date-fns-adapter": "16.2.9",
    "@angular/platform-browser": "16.2.9",
    "@angular/platform-browser-dynamic": "16.2.9",
    "@angular/router": "16.2.9",
    "@schematics/angular": "16.2.9",
    "ng-packagr": "16.2.3"
}
```

Reference `storybook-migration-summary.md` file for more details on Storybook migration.

## 3. Manually update other dependencies

There are a few dependencies that require manual update, here is the list:

```json
{
    "dependencies": {
        "angular-oauth2-oidc": "16.0.0",
        "@apollo/client": "3.11.4",
        "chart.js": "4.4.4",
        "@mat-datetimepicker/core": "12.0.1"
    },
    "devDependencies": {
        "@editorjs/editorjs": "2.30.5"
    }
}
```

```bash
npm install --save angular-oauth2-oidc@16.0.0 @apollo/client@3.11.4 chart.js@4.4.4 @mat-datetimepicker/core@12.0.1
npm install --save-dev @editorjs/editorjs@2.30.5
```

## 4. Fixing CI/CD issues

### General migration issues

After running the migration script, you may need to manually fix some issues. Run common build targets to identify any problems.

```bash
npx nx run-many --target=build --skip-nx-cache
```

Work through all the problems topic by topic. If blocked by linting issues, disable the linting rules in the affected files. You can re-enable them in the next step.

### Lint jobs

After getting the build to work, run the lint jobs. Re-enable previously disabled linting rules and fix any issues that arise.

```bash
npx nx run-many --target=lint --skip-nx-cache
```

### Unit tests

Despite Angular 16 not introducing major breaking changes, you may still encounter issues with unit tests. Run the unit tests and fix any problems that arise.

```bash
npx nx run-many --target=test --skip-nx-cache
```
