---
Added: v3.0.0
Status: Active
Last reviewed: 2018-18-10
---

# App List Cloud Component

Shows all deployed cloud application instances.

## Basic Usage

```html
<adf-cloud-app-list 
    [layoutType]="'GRID'">
</adf-cloud-app-list>
```

### [Transclusions](../user-guide/transclusion.md)

You can show custom content when there are no apps available by supplying an
`<adf-empty-custom-content>` section:

```html
<adf-cloud-app-list
    [layoutType]="'GRID'">
        <adf-empty-custom-content>
            No Apps present
        </adf-empty-custom-content>
</adf-cloud-app-list>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| layoutType | `string` |  | (**required**) Defines the layout of the apps. There are two possible values, "GRID" and "LIST". |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| appClick | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`ApplicationInstanceModel`](../../lib/process-services-cloud/apps-list/models/application-instance.model.ts)`>` | Emitted when an app entry is clicked. |
