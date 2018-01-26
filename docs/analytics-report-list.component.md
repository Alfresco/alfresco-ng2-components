# Activiti Analytics List Component

Shows a list of all available reports

## Basic Usage

```html
<analytics-report-list
    [layoutType]="'LIST'">
</analytics-report-list>
```

### Properties

| Name | Type | Required | Default | Description |
| ---- | ---- | -------- | ------- | ----------- |
| appId | string | optional |  | The application id |
| layoutType | string | required |  | Define the layout of the apps. There are two possible values: GRID or LIST. LIST is the default value |
| selectFirst | boolean | optional | false | Change the value to true if you want to select the first item in the list as default |

### Events

| Name | Description |
| ---- | ----------- |
| success | The event is emitted when the report list is loaded |
| error | The event is emitted when an error occurs during the loading |
| reportClick | The event is emitted when the report in the list is selected |
