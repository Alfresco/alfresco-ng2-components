# Search Input

`Component`, `Standalone`

A minimalistic search input component that formats user query according to the provided fields.

```html
<app-search-input 
    [fields]="['cm:name']" 
    (changed)="onSearchQueryChanged($event)">
</app-search-input>
```

> Notes: this component does not perform search operations.
> It handles the user input, formats and produces the search query to use with `Search Query Builder` or other services. 

## Properties

- `fields` **string[]** - optional, a list of fields to use in the formatted search query, defaults to `[cm:name]`
- `value` **string** - optional, initial input value
- `label` **string** - optional, display label
- `placeholder` **string** - optional, display placeholder

## Events

- `changed` **EventEmitter\<string\>**: emits when user presses `Enter` or moves the focus out of the input area

## Examples

```html
<app-search-input 
    [fields]="['cm:name', 'cm:title', 'cm:description', 'TEXT', 'TAG']" 
    (changed)="onSearchQueryChanged($event)">
</app-search-input>
```

In the example above, the search is performed against the following fields:
`cm:name`, `cm:title`, `cm:description`, `TEXT` and `TAG`.

The Search Input is going to produce the following results for user inputs:

user types `test`  

```text
(cm:name:"test*" OR cm:title:"test*" OR cm:description:"test*" OR TEXT:"test*" OR TAG:"test*")
```

user types `*`  

```text
(cm:name:"**" OR cm:title:"**" OR cm:description:"**" OR TEXT:"**" OR TAG:"**")
```

user types `one two`

```text
(cm:name:"one*" OR cm:title:"one*" OR cm:description:"one*" OR TEXT:"one*" OR TAG:"one*") AND (cm:name:"two*" OR cm:title:"two*" OR cm:description:"two*" OR TEXT:"two*" OR TAG:"two*")
```

user types `one AND two`

```text
(cm:name:"one*" OR cm:title:"one*" OR cm:description:"one*" OR TEXT:"one*" OR TAG:"one*") AND (cm:name:"two*" OR cm:title:"two*" OR cm:description:"two*" OR TEXT:"two*" OR TAG:"two*")
```

user types `one OR two`

```text
(cm:name:"one*" OR cm:title:"one*" OR cm:description:"one*" OR TEXT:"one*" OR TAG:"one*") OR (cm:name:"two*" OR cm:title:"two*" OR cm:description:"two*" OR TEXT:"two*" OR TAG:"two*")
```
