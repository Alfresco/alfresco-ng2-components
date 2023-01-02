---
Title: Infinite Select Scroll directive
Added: v4.3.0
Status: Active
Last reviewed: 2020-01-14
---

# [Infinite Select Scroll](../../../lib/core/src/lib/directives/infinite-select-scroll.directive.ts "Defined in infinite-select-scroll.directive.ts")

Load more options to select component if API returns more items

## Basic Usage

```html
<mat-select
    adf-infinite-select-scroll
    (scrollEnd)="load()">
    <mat-option *ngFor="let option of options">
        {{ option }}
    </mat-option>
</mat-select>`
```

## Class members

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| scrollEnd | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Event>` | Emitted when scroll reaches the last item. |
