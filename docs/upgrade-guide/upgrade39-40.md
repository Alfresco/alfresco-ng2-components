---
Title: Upgrading from ADF v3.9 to v4.0
---

# Upgrading from ADF v3.9 to v4.0

This guide explains how to upgrade your ADF v3.9 project to work with v4.0.

Do not skip this task, if you want your application to be updated to a most recent version of ADF. 
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates. 

**Note:** the steps described below might involve making changes
to your code. If you are working with a versioning system then you should
commit any changes you are currently working on. If you aren't using versioning
then be sure to make a backup copy of your project before going ahead with the
upgrade.

## Angular 10

ADF 4.0 makes use of Angular 10. You will need to adapt your app to be compatible with Angular 10 before you can update to ADF 4.0.
Here's a list of some of the changes you'll need to apply to your code. 

Notice that this is incremental update. You will need to go from Angular 7 to Angular8, then Angular 9 and finally, Angular 10.

Please refer to then [Angular Update Guide](https://update.angular.io/#7.0:10.0) for a more detailed explanation.

Angular Update Guide | 7.0 -> 10.0 for Basic Apps

### Before Updating

If you use the legacy `HttpModule` and the Http service, switch to `HttpClientModule` and the `HttpClient` service. 
HttpClient simplifies the default ergonomics (you don't need to map to JSON anymore) and now supports typed return values and interceptors. 
Read more on [angular.io](https://angular.io/).

### During the Update

Update to version 8 of the core framework and CLI by running `ng update @angular/cli@8 @angular/core@8` in your terminal and review and commit the changes.

Replace `/deep/` with `::ng-deep` in your styles, read more about angular component styles and `::ng-deep`. `/deep/` and `::ng-deep` both are deprecated but using `::ng-deep` is preferred until the shadow-piercing descendant combinator is removed from browsers and tools completely.

Angular now uses TypeScript 3.4, read more about errors that might arise from improved type checking.

Make sure you are using [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) 10 or later.

The CLI's build command now automatically creates a modern ES2015 build with minimal polyfills and a compatible ES5 build for older browsers, and loads the appropriate file based on the browser. You may opt-out of this change by setting your target back to es5 in your tsconfig.json. Learn more on angular.io.

When using new versions of the CLI, you will be asked if you want to opt-in to share your CLI usage data. You can also add your own Google Analytics account. This lets us make better decisions about which CLI features to prioritize, and measure the impact of our improvements. Learn more on angular.io.

If you use ViewChild or ContentChild, we're updating the way we resolve these queries to give developers more control. You must now specify that change detection should run before results are set. Example: `@ContentChild('foo', {static: false}) foo !: ElementRef;`. ng update will update your queries automatically, but it will err on the side of making your queries static for compatibility. Learn more on angular.io.

For lazy loaded modules via the router, make sure you are using dynamic imports. Importing via string is removed in v9. ng update should take care of this automatically. Learn more on angular.io.

Make sure you are using [`Node`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Node.md) 10.13 or later.

Run `ng update @angular/core@8 @angular/cli@8` in your workspace directory to update to the latest 8.x version of @angular/core and @angular/cli and commit these changes.

Run `ng update @angular/core@9 @angular/cli@9` which should bring you to version 9 of Angular.

Your project has now been updated to TypeScript 3.8, read more about new compiler checks and errors that might require you to fix issues in your code in the TypeScript 3.7 or TypeScript 3.8 announcements.

If your project depends on other Angular libraries, we recommend that you consider updating to their latest version. In some cases this update might be required in order to resolve API incompatibilities. Consult ng update or npm outdated to learn about your outdated libraries.

During the update to version 9, your project was transformed as necessary via code migrations in order to remove any incompatible or deprecated API calls from your code base. You can now review these changes, and consult the Updating to version 9 guide to learn more about the changes.

If you depend on many Angular libraries you may consider speeding up your build by invoking the ngcc (Angular Compatibility Compiler) in an npm postinstall script via small change to your package.json.

Angular 9 introduced a global `$localize()` function that needs to be loaded if you depend on Angular's internationalization (i18n). Run `ng add @angular/localize` to add the necessary packages and code modifications. Consult the $localize Global Import Migration guide to learn more about the changes.

Run `ng update @angular/core @angular/cli` which should bring you to version 10 of Angular.

New projects use the filename `.browserslistrc` instead of `browserslist`. ng update will migrate you automatically.

Angular now recommends the use of a `tsconfig.base.json` to help organize the various typings contexts (shared, unit tests, end to end tests, application, etc). ng update will migrate you automatically.

### After the Update

Once you've updated your app you'll be able to update ADF 4.0.

### Common problems due an mistake during the Upgrade procedure

### Errror : `Error: No component factory found for`

Possible Solution:

    - Check you have in yor tsconfig.base.json `enableIvy: true`
