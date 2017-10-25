# Activiti Analytics List Component

The component shows the list of all the available reports

<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic Usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic Usage

```html
<analytics-report-list
    [layoutType]="'LIST'">
</analytics-report-list>
```

### Properties

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| appId | string | optional | | The application id |
| layoutType | string | required | | Define the layout of the apps. There are two possible values: GRID or LIST. LIST is the default value|
| selectFirst | boolean | optional | false | Change the value to true if you want to select the first item in the list as default|

### Events

| Name | Description |
| --- | --- |
| success | The event is emitted when the report list is loaded |
| error | The event is emitted when an error occurs during the loading |
| reportClick | The event is emitted when the report in the list is selected |
