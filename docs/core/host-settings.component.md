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
</adf-breadcrumb>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| providers | `string` | `'ALL'` | Determines which configurations are shown. Possible valid values are "ECM", "BPM" or "ALL".  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | `EventEmitter<string>` | Emitted when the URL is invalid. |
| ecmHostChange | `EventEmitter<string>` | Emitted when the ECM host url is changed. |
| bpmHostChange | `EventEmitter<string>` | Emitted when the BPM host url is changed. |
