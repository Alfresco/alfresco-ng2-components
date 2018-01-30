# ADF Form List Component

Shows APS forms as a list.

## Basic Usage

```html
<adf-form-list
[forms]="[{ name: 'My Name', lastUpdatedByFullName: 'My User Name', lastUpdated: '2017-06-01'}]">
</adf-form-list>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| forms | `any[]` | `[]` | The array that contains the information to show inside the list.  |
