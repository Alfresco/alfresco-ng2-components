# Migrating from Angular 16 to Angular 17

This guide for migrating ADF from Angular version 16 to version 17. Follow these steps to ensure a smooth transition.

## 1. Run Nx migrate

Use the `nx migrate` command to automatically update Nx and Angular dependencies.

```bash
npx nx migrate 17.3.1
```

Updated Nx dependencies:

```json
{
    "nx": "^20.0.0",
    "@nx/angular": "17.3.1",
    "@nx/eslint-plugin": "17.3.1",
    "@nx/js": "17.3.1",
    "@nx/node": "17.3.1",
    "@nx/storybook": "17.3.1",
    "@nx/workspace": "17.3.1"
}
```

Updated Angular dependencies

```json
{
    "@angular/animations": "17.1.3",
    "@angular/cdk": "17.1.2",
    "@angular/common": "17.1.3",
    "@angular/compiler": "17.1.3",
    "@angular/core": "17.1.3",
    "@angular/forms": "17.1.3",
    "@angular/material": "17.1.2",
    "@angular/material-date-fns-adapter": "17.1.2",
    "@angular/platform-browser": "17.1.3",
    "@angular/platform-browser-dynamic": "17.1.3",
    "@angular/router": "17.1.3",
    "zone.js": "0.14.8",
    "ng-packagr": "17.1.2",
    "@schematics/angular": "17.1.4"
}
```

## 2. Manually update other dependencies

There are a few dependencies that require manual update, here is the list:

```json
{
    "dependencies": {
        "apollo-angular": "6.0.0",
        "@mat-datetimepicker/core": "13.0.2"
    },
    "devDependencies": {
        "@typescript-eslint/eslint-plugin": "6.21.0",
        "@typescript-eslint/parser": "6.21.0",
        "@typescript-eslint/typescript-estree": "7.1.1",
        "eslint-config-prettier": "9.1.0"
    }
}
```

```bash
npm install --save apollo-angular@6.0.0 @mat-datetimepicker/core@13.0.2
npm install --save-dev @typescript-eslint/eslint-plugin@6.21.0 @typescript-eslint/parser@6.21.0 @typescript-eslint/typescript-estree@7.1.1 eslint-config-prettier@9.1.0
```

## 3. Migrating js-api from mocha to jest

In order to simplify the migration process, we are migrating the test runner from mocha to jest.

### Installing dependencies

```json
{
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "jest-preset-angular": "14.4.2",
    "@types/jest": "^29.5.14"
}
```

```bash
npm install --save-dev jest jest-environment-jsdom jest-preset-angular@14 @types/jest
```

### Performing the migration

It's recommended to use both test runners in parallel during the migration process. Nx project test jobs configuration:

```json
{
    "test-old-mocha": {
        "executor": "nx:run-commands",
        "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
        "options": {
            "codeCoverage": true
        }
    },
    "test": {
        "executor": "@nx/jest:jest",
        "outputs": ["{workspaceRoot}/coverage/{projectRoot}"],
        "options": {
            "jestConfig": "lib/js-api/jest.config.ts",
            "passWithNoTests": true
        }
    }
}
```

-   delete `.mocharc.json`
-   delete `test-old-mocha` job from the project configuration

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
