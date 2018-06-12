---
Added: v2.0.0
Status: Active
---

# Host settings component

Validates the URLs for ACS and APS and saves them in the user's local storage

![Host settings](../docassets/images/host-settings-component.png)

## Basic Usage

```html
<adf-host-settings>
</adf-host-settings>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| providers | `array` |  | Tell the component which provider option are available. Possible valid values are "ECM" (Content), "BPM" (Process) , "ALL" (Content and Process), 'OAUTH2' SSO . |

### Events

| Name | Type | Description |
| -- | -- | -- |
| bpmHostChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the bpm host URL is changed. **Deprecated:** in 2.4.0 |
| ecmHostChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when the ecm host URL is changed. **Deprecated:** in 2.4.0 |
| error | `EventEmitter<string>` | Emitted when the URL is invalid. |
