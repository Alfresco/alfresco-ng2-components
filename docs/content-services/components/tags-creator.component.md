---
Title: Tags Creator component
Added: v6.0.0-A.3
Status: Active
Last reviewed: 2023-03-27
---

# [Tags Creator component](../../../lib/content-services/src/lib/tag/tags-creator/tags-creator.component.ts "Defined in tags-creator.component.ts")

Allows to create multiple tags. That component contains input and two lists. Top list is all created tags, bottom list is searched tags based on input's value. 

## Basic Usage

```html
<adf-tags-creator
    [(tagNameControlVisible)]="tagNameControlVisible"
    (tagsChange)="tags = $event"
    [mode]="tagsCreatorMode">
</adf-tags-creator>
```

## Class members

### Properties

| Name                  | Type              | Default value | Description                                                                                                                         |
|-----------------------|-------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------|
| mode                  | `TagsCreatorMode` |               | Create mode if only new tags can be created or Create And Assign mode if new tags can be created and existing tags can be selected. |
| disabledTagsRemoving  | `boolean`         | false         | False if tags can be removed from top list, true otherwise.                                                                         |
| tags                  | `string[]`        |               | Default top list.                                                                                                                   |
| tagNameControlVisible | `boolean`         | false         | True if input should be visible, false otherwise.                                                                                   |                                                                              |

### Events

| Name                              | Type                                                                   | Description                                      |
|-----------------------------------|------------------------------------------------------------------------|--------------------------------------------------|
| existingTagsPanelVisibilityChange | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>`  | Emitted when bottom list is showing or hiding.   |
| tagsChange                        | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string[]>` | Emitted when tags in top list are changed.       |
| tagNameControlVisibleChange       | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<boolean>`  | Emitted when input is showing or hiding.         |

