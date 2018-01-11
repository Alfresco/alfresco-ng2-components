# People Search component

Searches users/people.

## Basic Usage

```html
<adf-people-search></adf-people-search>
```

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| results | Observable&lt;User\[]> | The params to show people list |

### Events

| Name | Description |
| ---- | ----------- |
| searchPeople | Raised when the search people with new keyword |
| success | Raised when select the user and click action button |
| closeSearch | Raised when click the clse button |

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
