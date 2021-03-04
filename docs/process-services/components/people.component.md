---
Title: People Component
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-19
---

# [People Component](../../../lib/process-services/src/lib/people/components/people/people.component.ts "Defined in people.component.ts")

Displays users involved with a specified task

![activiti-people](../../docassets/images/activiti_people.png)

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
-   [Details](#details)
    -   [How to customize the people component behavior](#how-to-customize-the-people-component-behavior)
    -   [Involve People single click and close search](#involve-people-single-click-and-close-search)
    -   [Involve People single click without close search](#involve-people-single-click-without-close-search)
    -   [Involve People double click and close search](#involve-people-double-click-and-close-search)
    -   [Involve People double double without close search](#involve-people-double-double-without-close-search)

## Basic Usage

```html
<adf-people 
    [people]="YOUR_INVOLVED_PEOPLE_LIST" 
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-people>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| people | [`UserProcessModel`](../../core/models/user-process.model.md)`[]` | \[] | The array of User objects to display. |
| readOnly | `boolean` | false | Should the data be read-only? |
| taskId | `string` | "" | The numeric ID of the task. |

## Details

### How to customize the people component behavior

The [people component](people.component.md) provides two options to customize its behavior:

-   _involveUserAndCloseSearch_: The selected user gets added and then the search section is closed
-   _involveUserWithoutCloseSearch_: The selected user gets added without closing the search section

This makes it easy to customize the [people component](people.component.md) to involve the user via a single or double click event:

### Involve People single click and close search

```html
<adf-people #people
    (row-click)="people.involveUserAndCloseSearch()"
    [people]="YOUR_INVOLVED_PEOPLE_LIST"
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-people>
```

![involve-people-single-click-and-close-search](../../docassets/images/involve-people-single-click-and-close-search.gif)

### Involve People single click without close search

```html
<adf-people #people
    (row-click)="people.involveUserWithoutCloseSearch()"
    [people]="YOUR_INVOLVED_PEOPLE_LIST"
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-people>
```

![involve-people-single-click-without-close-search](../../docassets/images/involve-people-single-click-without-close-search.gif)

### Involve People double click and close search

```html
<adf-people #people
    (row-dblclick)="people.involveUserAndCloseSearch()"
    [people]="YOUR_INVOLVED_PEOPLE_LIST"
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-people>
```

![involve-people-double-click-and-close-search](../../docassets/images/involve-people-double-click-and-close-search.gif)

### Involve People double double without close search

```html
<adf-people #people
    (row-dblclick)="people.involveUserWithoutCloseSearch()"
    [people]="YOUR_INVOLVED_PEOPLE_LIST"
    [taskId]="YOUR_TASK_ID"
    [readOnly]="YOUR_READ_ONLY_FLAG">
</adf-people>
```

![involve-people-double-click-without-close-search](../../docassets/images/involve-people-double-click-without-close-search.gif)
