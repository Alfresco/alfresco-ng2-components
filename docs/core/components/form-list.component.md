---
Title: Form List Component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-20
---

# [Form List Component](../../../lib/core/form/components/form-list.component.ts "Defined in form-list.component.ts")

Shows forms as a list.

## Basic Usage

```html
<adf-form-list
[forms]="[{ name: 'My Name', lastUpdatedByFullName: 'My User Name', lastUpdated: '2017-06-01'}]">
</adf-form-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| forms | `any[]` | \[] | The array that contains the information to show inside the list. |
