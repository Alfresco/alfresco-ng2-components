---
Title: Upgrading from ADF v4.0 to v4.1
---

# Upgrading from ADF v4.0 to v4.1

This guide explains how to upgrade your ADF v4.0 project to work with v4.1.

Do not skip this task, if you want your application to be updated to a most recent version of ADF. 
Upgrades of multiple versions of ADF cannot be done in one step only, but should follow the chain of sequential updates. 

**Note:** the steps described below might involve making changes
to your code. If you are working with a versioning system then you should
commit any changes you are currently working on. If you aren't using versioning
then be sure to make a backup copy of your project before going ahead with the
upgrade.

## Header Filters for Document List Components

We released a new feature called Header Filters in ADF 4.0. It would allow users to filter the content of a folder by its columns properties. While this feature was working we noticed it was hard to implement. That is way we came up with a new way of enabling this feature.

You will need to update your code to overcome this breaking change.

ADF 4.0 implementation
```html
<adf-document-list 
    currentFolderId="-my-">
               <adf-custom-header-filter-template *ngIf="enableCustomHeaderFilter">
                    <ng-template let-col>
                        <adf-search-header [col]="col"              
                                           [value]="paramValues"
                                           [currentFolderNodeId]="currentFolderId"
                                           [sorting]="filterSorting"
                                           [maxItems]="pagination.maxItems"
                                           [skipCount]="pagination.skipCount"
                                           (update)="onFilterUpdate($event)"
                                           (clear)="onAllFilterCleared()"
                                           (selection)="onFilterSelected($event)">
                        </adf-search-header>
                    </ng-template>
                </adf-custom-header-filter-template>
</adf-document-list>
```
ADF 4.1 implementation
```html
<adf-document-list 
    currentFolderId="-my-" 
    [headerFilters]="true">
</adf-document-list>
```

This is all you'll need to set it up in your app. Alternatively, you can also pass an initial value to the filters and listen to filter selection changes.

```html
<adf-document-list 
    currentFolderId="-my-" 
    [headerFilters]="true"
    [filterValue]="paramValues"
    (filterSelection)="onFilterSelected($event)">
</adf-document-list>
```
