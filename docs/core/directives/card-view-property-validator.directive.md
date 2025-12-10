---
Title: CardViewPropertyValidator directive
Added: v8.3.0
Status: Active
Last reviewed: 2025-12-10
---

# [CardViewPropertyValidator directive](../../../lib/core/src/lib/card-view/directives/card-view-property-validator.directive.ts "Defined in card-view-property-validator.directive.ts")

Checks validators defined on property.

## Basic Usage

```html
<input
    adf-card-view-property-validator
    [property]="property"
    (validated)="onValidation($event)"/>
```

## Class members

### Properties

| Name     | Type                                                                                              | Default value | Description                                         |
|----------|---------------------------------------------------------------------------------------------------|---------------|-----------------------------------------------------|
| property | [`CardViewBaseItemModel`](../../../lib/core/src/lib/card-view/models/card-view-baseitem.model.ts) |               | Property for which validations should be triggered. |

### Events

| Name      | Type                                                                   | Description                                                                      |
|-----------|------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| validated | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<string[]>` | Emitted after validation. Emits list of errors or empty array if input is valid. |
