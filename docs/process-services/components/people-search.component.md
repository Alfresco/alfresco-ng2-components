---
Title: People Search component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-14
---

# [People Search component](../../../lib/process-services/src/lib/people/components/people-search/people-search.component.ts "Defined in people-search.component.ts")

Searches users/people.

## Basic Usage

```html
<adf-people-search></adf-people-search>
```

### [Transclusions](../../user-guide/transclusion.md)

You can provide a title for the search header and a label for the action button using
special sub-components in the body of the `<adf-people-search>` element:

```html
<adf-people-search ...>
    <header-title>Custom title</header-title>
    <action-button-label>Custom label</action-button-label>
</adf-people-search>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| --- | --- | --- | --- |
| results | [`Observable`](http://reactivex.io/documentation/observable.html)`<`[`UserProcessModel`](../../core/models/user-process.model.md)`[]>` |  | Parameters for displaying the list. |

### Events

| Name | Type | Description |
| --- | --- | --- |
| closeSearch | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when the "close" button is clicked. |
| searchPeople | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when a search is performed with a new keyword. |
| success | `EventEmitter<UserProcessModel>` | Emitted when a user is selected and the action button is clicked. |

## Details

Usage example:

<!-- {% raw %} -->

```html
<adf-people-search
       (searchPeople)="searchUser($event)"
       (success)="involveUser($event)"
       (closeSearch)="onCloseSearch()"
       [results]="peopleSearch$">
           <header-title>{{ 'TASK_DETAILS.LABELS.ADD_PEOPLE' | translate }}</header-title>
           <action-button-label>{{ 'PEOPLE.ADD_USER' | translate }}</action-button-label>
</adf-people-search>
```

<!-- {% endraw %} -->
