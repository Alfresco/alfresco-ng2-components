---
Added: v2.0.0
Status: Active
---

# People Search component

Searches users/people.

## Basic Usage

```html
<adf-people-search></adf-people-search>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| results | [`Observable<UserProcessModel[]>`](../core/user-process.model.md) |  | Parameters for displaying the list. |

### Events

| Name | Type | Description |
| -- | -- | -- |
| closeSearch | `EventEmitter<Object>` | Emitted when the "close" button is clicked. |
| searchPeople | `EventEmitter<any>` | Emitted when a search is performed with a new keyword. |
| success | [`EventEmitter<UserProcessModel>`](../core/user-process.model.md) | Emitted when a user is selected and the action button is clicked. |

## Details

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
