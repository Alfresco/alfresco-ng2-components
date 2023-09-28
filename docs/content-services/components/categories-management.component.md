---
Title: Categories management component
Added: v6.0.0-A.3
Status: Active
Last reviewed: 2023-04-07
---

# [Categories management component](../../../lib/content-services/src/lib/category/categories-management/categories-management.component.ts "Defined in categories-management.component.ts")

Component allows to both assign/unassign categories to content and create multiple categories depending on selected mode. In assign mode component is composed of: list of categories that will be assigned to a file, input to search for existing categories that user can select and second list under the input containing existing categories that node can be assigned to. In crud mode component is composed of: list of categories that will be created, input to type a name of category that will be created and a list of categories existing under a given parent, in this mode existing categories are not selectable.

## Basic Usage

```html
<adf-categories-management
    [(categoryNameControlVisible)]="categoryControlVisible"
    [disableRemoval]="saving"
    [categories]="categories"
    [parentId]="parentId"
    [managementMode]="categoriesManagementMode"
    [classifiableChanged]="classifiableChanged"
    (categoriesChange)="storeCategoriesToAssign($event)">
</adf-categories-management>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| categories | [`Category`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Category.md)[] | [] | List of categories to assign/create. |
| categoryNameControlVisible | `boolean` | false | Determines if category name control is visible. |
| classifiableChanged | [`Observable<void>`](https://rxjs.dev/guide/observable) | | (optional) Observable emitting when `classifiable` aspect changes for a given node. |
| disableRemoval | `boolean` | false | Determines if categories assigned/created can be unassigned/removed from the list. |
| managementMode | `CategoriesManagementMode` | | Management mode determines if component works in assign/unassign mode or create mode. |
| parentId | `string` | | (optional) ID of a parent category that new categories will be created under. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| categoriesChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`Category`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/content-rest-api/docs/Category.md)`>` | Emitted when categories list changes. |
| categoryNameControlVisibleChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>` | Emitted when category name control visibility changes. |
