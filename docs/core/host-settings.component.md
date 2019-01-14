---
Title: Host settings component
Added: v2.0.0
Status: Internal
Last reviewed: 2018-09-13
---

# [Host settings component](../../lib/core/settings/host-settings.component.ts "Defined in host-settings.component.ts")

Validates the URLs for ACS and APS and saves them in the user's local storage

**Note:** this is an internal component and is not meant to be used in production.

![Host settings](https://github.com/Alfresco/alfresco-ng2-components/blob/development/docs/docassets/images/host-settings-component.png)

## Basic Usage

```html
<adf-host-settings>
</adf-host-settings>
```

```ts
@NgModule({
 providers: [
        { provide: AppConfigService, useClass: DebugAppConfigService },
    ]
)]
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| providers | `string[]` |  | Tells the component which provider options are available. Possible valid values are "ECM" (Content), "BPM" (Process) , "ALL" (Content and Process), 'OAUTH2' SSO. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| bpmHostChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | (**Deprecated:** in 2.4.0) Emitted when the bpm host URL is changed. |
| cancel | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when the user cancels the changes. |
| ecmHostChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | (**Deprecated:** in 2.4.0) Emitted when the ecm host URL is changed. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the URL is invalid. |
| success | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when the changes are successfully applied. |
