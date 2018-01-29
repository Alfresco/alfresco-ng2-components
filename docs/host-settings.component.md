# Host settings component

Validates the URLs for ACS and APS and saves them in the user's local storage

![Host settings](docassets/images/host-settings-component.png)

## Basic Usage

```html
<adf-host-settings>
</adf-breadcrumb>
```

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| providers | `string` | Determines which configurations are shown. Possible valid values are "ECM", "BPM" or "ALL". <br/> Default value: `'ALL'` |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | `EventEmitter<string>` | Emitted when the URL is invalid. |
