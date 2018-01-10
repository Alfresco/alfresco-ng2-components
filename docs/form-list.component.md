# ADF Form List Component

Shows APS forms as a list.

## Basic Usage

```html
<adf-form-list
[forms]="[{ name: 'My Name', lastUpdatedByFullName: 'My User Name', lastUpdated: '2017-06-01'}]">
</adf-form-list>
```

### Properties

The recommended set of properties can be found in the following table:

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| forms | any |  | The array that contains the information to show inside the list. |
