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
| -- | -- | -- | -- |
| providers | `string` | "ALL" | Determines which configurations are shown. Possible valid values are "ECM", "BPM" or "ALL". |

### Events

| Name | Type | Description |
| -- | -- | -- |
| bpmHostChange | `EventEmitter<string>` | Emitted when the bpm host URL is changed. |
| ecmHostChange | `EventEmitter<string>` | Emitted when the ecm host URL is changed. |
| error | `EventEmitter<string>` | Emitted when the URL is invalid. |
