# Search Results component



<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [Basic usage](#basic-usage)
  * [Properties](#properties)
  * [Events](#events)
- [Details](#details)

<!-- tocstop -->

<!-- markdown-toc end -->

## Basic usage

```html
<adf-search 
    [searchTerm]="searchTerm"
    (resultLoaded)="showSearchResult($event)">
</adf-search>
```

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| searchTerm | string | | Search term to use when executing the search. Updating this value will run a new search and update the results  |
| rootNodeId | string | "-root-" | NodeRef or node name where the search should start. |
| resultType | string | | Node type to filter search results by, e.g. 'cm:content', 'cm:folder' if you want only the files. |
| maxResults | number  | 20 | Maximum number of results to show in the search. |
| resultSort | string  | | Criteria to sort search results by, must be one of "name" , "modifiedAt" or "createdAt" |
| displayWith | function | | Function that maps an option's value to its display value in the trigger |

### Events

| Name | Description |
| --- | --- |
| resultLoaded | Emitted when search results have fully loaded |

## Details

### Customise Search Results
You have to add a template that will be shown when the results are loaded.

```html
<adf-search [searchTerm]="searchTerm">
    <ng-template let-result>
        <ul>
            <li *ngFor="let item of result?.list?.entries">
                {{ item?.entry.name }}
            </li>
        </ul>
    </ng-template>
</adf-search>
```
The results are provided via the [$implicit variable of angular2](https://angular.io/api/common/NgTemplateOutlet) and can be accessed via the sugar sintax 'let-yourChosenName'. As per example above the result will be something like : 

![adf-search-control](docassets/images/search-component-simple-template.png)

But you can define even a more complex template : 

```html
<adf-search class="adf-search-result-autocomplete"
            [rootNodeId]="liveSearchRoot"
            [resultType]="liveSearchResultType"
            [resultSort]="liveSearchResultSort"
            [maxResults]="liveSearchMaxResults">
    <ng-template let-data>
        <mat-list *ngIf="isSearchBarActive()" id="autocomplete-search-result-list">
            <mat-list-item
                *ngFor="let item of data?.list?.entries; let idx = index"
                id="result_option_{{idx}}"
                [tabindex]="0"
                (focus)="onFocus($event)"
                (blur)="onBlur($event)"
                class="adf-search-autocomplete-item"
                (click)="elementClicked(item)"
                (keyup.enter)="elementClicked(item)">
                <mat-icon mat-list-icon>
                    <img [src]="getMimeTypeIcon(item)" />
                </mat-icon>
                    <h4 mat-line id="result_name_{{idx}}"
                        *ngIf="highlight; else elseBlock"
                        class="adf-search-fixed-text"
                        [innerHtml]="item.entry.name | highlight: searchTerm">
                        {{ item?.entry.name }}</h4>
                    <ng-template #elseBlock>
                        <h4 class="adf-search-fixed-text" mat-line id="result_name_{{idx}}" [innerHtml]="item.entry.name"></h4>
                    </ng-template>
                    <p mat-line class="adf-search-fixed-text"> {{item?.entry.createdByUser.displayName}} </p>
            </mat-list-item>
            <mat-list-item
                id="search_no_result"
                *ngIf="data?.list?.entries.length === 0">
                <p mat-line class="adf-search-fixed-text">{{ 'SEARCH.RESULTS.NONE' | translate:{searchTerm: searchTerm} }}</p>
            </mat-list-item>
        </mat-list>
    </ng-template>
</adf-search>
```

Which will look like :

![adf-search-control](docassets/images/search-component-complex-template.png)


### Attach an input field to the search
You can also attach your input field to the adf-search component via the trigger [searchAutocomplete]

```html
<input type="text" [searchAutocomplete]="search">

<adf-search #search="searchAutocomplete">
    <ng-template let-result>
        <span *ngFor="let item of result?.list?.entries">
            {{ item?.entry.name }}
        </span>
    </ng-template>
</adf-search>        
```
In this way it is possible to fetch the results from the word typed into the input text straight into the adf-search component via the custom template variable.