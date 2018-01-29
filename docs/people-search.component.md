# People Search component

Searches users/people.

## Basic Usage

```html
<adf-people-search></adf-people-search>
```

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| results | `Observable<any[]>` | The parameters to show people list.  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| searchPeople | `EventEmitter<any>` | Emitted when a search is performed with a new keyword. |
| success | `EventEmitter<any>` | Emitted when a user is selected and the action button is clicked. |
| closeSearch | `EventEmitter<{}>` | Emitted when the "close" button is clicked. |

## Details

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
