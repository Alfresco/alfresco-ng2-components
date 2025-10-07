---
Title: Node Counter directive
Added: v4.4.0
Status: Active
Last reviewed: 2021-04-15
---

# [Node Counter directive](../../../lib/content-services/src/lib/directives/node-counter.directive.ts "Defined in node-counter.directive.ts")

Appends a counter to an element.

## Basic Usage

```html
<adf-toolbar>
    <adf-toolbar-title [adf-node-counter]="getSelectedCount()">
        ...
    </adf-toolbar-title>
</adf-toolbar>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| counter | `number` |  | Number to display in the counter badge |
