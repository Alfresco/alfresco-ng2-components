# Migrating from Angular 17 to Angular 18

This guide describes how to migrate ADF from Angular version 17 to version 18. Follow these steps to ensure a smooth transition.

## 1. Update changed dependencies

Update the following packages in your `package.json`:

### dependencies

```json
{
    "@angular/animations": "18.2.13",
    "@angular/cdk": "18.2.14",
    "@angular/common": "18.2.13",
    "@angular/compiler": "18.2.13",
    "@angular/core": "18.2.13",
    "@angular/forms": "18.2.13",
    "@angular/material": "18.2.14",
    "@angular/material-date-fns-adapter": "18.2.14",
    "@angular/platform-browser": "18.2.13",
    "@angular/platform-browser-dynamic": "18.2.13",
    "@angular/router": "18.2.13",
    "@apollo/client": "3.13.1",
    "@mat-datetimepicker/core": "14.0.0",
    "apollo-angular": "10.0.3",
    "minimatch-browser": "1.0.0",
    "node-fetch": "^3.3.2",
    "zone.js": "0.14.10"
}
```

### devDependencies

```json
{
    "@angular-devkit/architect": "0.1802.13",
    "@angular-devkit/build-angular": "18.2.14",
    "@angular-devkit/core": "18.2.13",
    "@angular-devkit/schematics": "18.2.13",
    "@angular/compiler-cli": "18.2.13",
    "@nx/angular": "19.2.0",
    "@nx/js": "18.3.5",
    "@nx/workspace": "18.3.5",
    "@storybook/angular": "8.4.7",
    "ng-packagr": "18.2.1",
    "npm-run-all": "^4.1.5",
    "postcss": "8.4.41",
    "postcss-sass": "^0.5.0",
    "tsconfig-paths": "^4.1.1",
    "typescript": "5.5.4",
    "webpack-cli": "^5.1.4"
}
```

## 2. Material mixins update

Angular Material 18 introduced Material 3 mixins as new default. As we are still using Material 2, we need to ensure that we are still using the Material 2 version.

In order to use Material 2 mixins, you need to add a `m2-` prefix to the mixins in your stylesheets. For example:

```scss
mat.define-typography-config()
mat.get-color-from-palette()
```

should be changed to:

```scss
mat.m2-define-typography-config()
mat.m2-get-color-from-palette()
```

## 3. Fixing CI/CD issues

After running the migration script, you may need to manually fix some issues. Run common build targets to identify any problems.

```bash
npx nx run-many --target=build --skip-nx-cache
```

If blocked by linting issues, disable the linting rules in the affected files. You can re-enable them in the next step.

### Lint jobs

After getting the build to work, run the lint jobs. Re-enable previously disabled linting rules and fix any issues that arise.

```bash
npx nx run-many --target=lint --skip-nx-cache
```

### Unit tests

Run the unit tests and fix any problems that arise.

```bash
npx nx run-many --target=test --skip-nx-cache
```

## 4. Review Angular 18 breaking changes

Angular 18 is a minor update with no major breaking changes for most projects. However, always review the [Angular 18 changelog](https://github.com/angular/angular/blob/main/CHANGELOG.md) and [official update guide](https://angular.dev/update-guide?v=17.0-18.0).
