# [Form Definition Selector Cloud](../../../lib/process-services-cloud/src/lib/form/components/form-definition-selector-cloud.component.ts "Defined in form-definition-selector-cloud.component.ts")

Allows one form to be selected.

## Basic Usage

```html
<adf-cloud-form-definition-selector
    [appName]="'simple-app'"
    (selectForm)="onFormSelect($event)">
</adf-cloud-form-definition-selector>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | Name of the application. If specified, this shows the users who have access to the app. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| selectForm | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string>` | Emitted when a form is selected. |
