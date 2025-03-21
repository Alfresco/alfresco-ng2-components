---
Title: Upgrading from ADF v5.0 to v6.0
---

# Upgrading from ADF v6.0 to v6.9

This guide provides instructions on how to upgrade your v6.0.0 ADF projects to v6.9.0.

## Before you begin

Always perform upgrades on "clean" project state, backup your changes or make a project backup.

```shell
# Recommended clean up
nx reset && rm -rf .angular .nx dist node_modules nxcache tmp
```

## .env file

If you are using .env file, make sure to update it with the latest configuration:

```yaml
APP_CONFIG_OAUTH2_HOST="<oauth2_host>"
APP_CONFIG_ENABLE_MOBILE_APP_SWITCH=false
APP_CONFIG_PLUGIN_AOS=true
APP_CONFIG_PLUGIN_CONTENT_SERVICE=true
APP_CONFIG_PLUGIN_FOLDER_RULES=true
APP_CONFIG_ENABLE_DOWNLOAD_PROMPT=false
APP_CONFIG_ENABLE_DOWNLOAD_PROMPT_REMINDERS=false
APP_CONFIG_DOWNLOAD_PROMPT_DELAY=30
APP_CONFIG_DOWNLOAD_PROMPT_REMINDER_DELAY=30
APP_CONFIG_ENABLE_FILE_AUTO_DOWNLOAD=false
APP_CONFIG_FILE_AUTO_DOWNLOAD_SIZE_THRESHOLD_IN_MB=10
```

> [!IMPORTANT]
> The configuration values are for migration purposes only.
> Please refer to the documentation for more details on the configuration settings and values.

## Library versions

Update the `package.json` file with the latest library versions:

- Angular: 14.1.3
- Alfresco Component Libraries: 6.9.0
- Alfresco JS-API: 7.6.1

```json
{
    "dependencies": {
        "@alfresco/adf-core": "6.9.0",
        "@alfresco/adf-content-services": "6.9.0",
        "@alfresco/adf-process-services-cloud": "6.9.0",
        "@alfresco/adf-insights": "6.9.0",
        "@alfresco/js-api": "7.6.1"
    }
}
```

> [!NOTE]  
> You can also refer to the Alfresco Content Application [4.4.1 release](https://github.com/Alfresco/alfresco-content-app/blob/4.4.1/package.json) for the latest version of the libraries.

### Remove old dependencies

```json
{
    "dependencies": {
        "@angular/material-moment-adapter": "14.1.3",
        "@mat-datetimepicker/moment": "^9.0.68",
        "moment": "^2.29.4",
        "moment-es6": "1.0.0",
        "@angular/flex-layout": "^14.0.0-beta.40"
    }
}
```

### Add extra dependencies

```json
{
    "dependencies": {
        "@angular/material-date-fns-adapter": "14.1.3",
        "date-fns": "^2.30.0"
    }
}
```

Reinstall your dependencies and make initial build

```sh
npm i --legacy-peer-deps
npm run build
```

### Update code

If you are using the `@alfresco/js-api` library, make sure to update the code according to the latest version:

| Before                 | After              |
|------------------------|--------------------|
| MinimalNodeEntity      | NodeEntry          |
| SiteBody               | SiteBodyCreate     |
| MinimalNodeEntryEntity | Node               |
| MinimalNode            | Node               |
| PathInfoEntity         | PathInfo           |
| SiteBody               | SiteBodyCreate     |
| FavoriteBody           | FavoriteBodyCreate |
| PathElementEntity      | PathElement        |

#### NullInjectorError: No provider for RedirectAuthService!

If you are facing the `NullInjectorError: No provider for RedirectAuthService!` error, make sure to add the `AuthModule` to the `AppModule`:

```typescript
import { AuthModule } from '@alfresco/adf-core';

@NgModule({
    imports: [
        // other imports
        AuthModule.forRoot({ useHash: true })
    ]
})
export class AppModule {}
```

For the development purposes, you may want to update the `app.config.json`:

```json5
{
    "oauth2": {
        // other configurations
        "skipIssuerCheck": true,
        "strictDiscoveryDocumentValidation": false
    }
}
```

### Document List component

For document list components, remove the `display` property if used:

```html
[display]="documentDisplayMode$ | async"
```

## Final steps

After you have updated the code, make sure to test your application thoroughly to ensure that everything is working as expected.

You can build and run your application using the following commands:

```sh
npm run build
npm start content-ce
```
