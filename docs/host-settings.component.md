# Host settings component

Validates the URLs for ACS and APS and saves them in the user's local storage

![Host settings](docassets/images/host-settings-component.png)

## Basic Usage 

```html
<adf-host-settings>
</adf-breadcrumb>
```

### Properties

| Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| providers | string | ALL | Possible valid values are ECM, BPM or ALL. It indicate which URL configurations show  |


### Events

| Name | Returned Type | Description |
| --- | --- | --- |
| error | string | emitted when the url inserted is wrong   |

