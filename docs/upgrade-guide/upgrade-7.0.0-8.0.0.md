---
Title: Upgrading from ADF v7.0 to v8.0
---

# Upgrading from ADF v7.0 to v8.0

This guide provides instructions for upgrading your v7.0.0 ADF projects to v8.0.0.

## Before you begin

Always perform upgrades on a "clean" project state. Back up your changes or create a full project backup before proceeding.

```shell
# Recommended clean up
nx reset && rm -rf .angular .nx dist node_modules nxcache tmp
```

## Libraries

Update your dependencies to the versions introduced in the 8.0.0 release:

```json
{
    "dependencies": {
        "@alfresco/adf-core": "8.0.0",
        "@alfresco/adf-content-services": "8.0.0",
        "@alfresco/adf-process-services-cloud": "8.0.0",
        "@alfresco/adf-insights": "8.0.0",
        "@alfresco/adf-extensions": "8.0.0",
        "@alfresco/adf-cli": "8.0.0",
        "@alfresco/eslint-plugin-eslint-angular": "8.0.0",
        "@alfresco/adf-testing": "8.0.0",
        "@alfresco/js-api": "9.0.0"
    }
}
```

Currently used Node version: 22.14.0.

### Breaking changes

Major version updates have been applied to the following core libraries:

- Angular: 19.2.6
- Angular Material: 19.2.9
- Typescript: 5.8.2

> Details on Angular update can be found in *Update Guide* from Angular documentation.

### Added libraries

```json
{
    "dependencies": {
        "node-fetch": "^3.3.2"
    },
    "devDependencies": {
        "resize-observer-polyfill": "^1.5.1",
        "webdriver-manager": "12.1.9"
    }
}
```

### Deleted libraries

```json
{
    "devDependencies": {
        "mini-css-extract-plugin"
        "css-loader"
    }
}
```

Reinstall your dependencies and perform an initial build:

```shell
npm i
npm run build
```

Review your applications as some styles and classes of Angular Material components might have changed.

## Deprecations

The following table lists deprecated features and modules that will be removed in upcoming releases. Consider replacing them as soon as you update ADF to minimize future technical debt.

| Name                          | Notes                                                                                         |
|-------------------------------|-----------------------------------------------------------------------------------------------|
| Custom Theme                  | Refer to [Custom Theme documentation](../../lib/core/custom-theme/README.md)                  |
| ShellModule                   | Refer to [Shell documentation](../../lib/core/shell/README.md)                                |
| FormBaseModule                | Use standalone components instead.                                                            |
| CoreTestingModule             | Use standalone components instead.                                                            |
| ProcessServicesCloudModule    | Refer to [ProcessServicesCloudModule replacement](#processservicescloudmodule-replacement)    |

### ProcessServicesCloudModule replacement

To replace this module, import the standalone components directly or use the following provider API to replicate its behavior:

```typescript
providers: [
    provideTranslations('adf-process-services-cloud', 'assets/adf-process-services-cloud')
    provideCloudPreferences()
    provideCloudFormRenderer(),
    { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService }
]
```

## New features and APIs

You can start using the new features and APIs introduced in the 8.0.0 release.

### XMLHttpRequest.withCredentials

Support for disabling the `withCredentials` property in `app.config.json` for identity providers that disallow credentials has been introduced. You can configure it as shown below:

```json
{
    "auth": {
        "withCredentials": false
    }
}
```

### provideShell

The new provideShell API for providing the main application layout can replace the `withRoutes(routes: Routes | AppShellRoutesConfig)` method, as shown below.

```typescript
import { provideShell } from '@alfresco/adf-core/shell';

provideShell(
    {
        routes: [],
        appService: AppService,
        authGuard: AuthGuard,
        navBar: {
            minWidth: 0,
            maxWidth: 100
        }
    }
)
```

### provideI18N

The new `provideI18N` API for providing translation can replace `provideTranslations('app', 'assets')` method, as shown below.

```typescript
import { provideI18N } from '@alfresco/adf-core';

provideI18N(
    {
        defaultLanguage: "en", // optional, defaults to "en"
        assets: [['en', '/assets/i18n/en.json'], ['fr', '/assets/i18n/fr.json']] 
    }
)
```

## Final steps

After updating your code, thoroughly test your application to ensure everything works as expected.

If you encounter any issues during the upgrade process, refer to the Angular update guide or seek assistance from the ADF community.
