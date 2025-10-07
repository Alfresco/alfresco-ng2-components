---
Title: Form cloud custom outcomes component
Added: v3.2.0
Status: Active
Last reviewed: 2019-04-12
---

# [Form cloud custom outcomes component](../../../lib/process-services-cloud/src/lib/form/components/form-cloud-custom-outcomes.component.ts "Defined in form-cloud-custom-outcomes.component.ts")

Supplies custom outcome buttons to be included in [Form cloud component](form-cloud.component.md).

![](../../docassets/images/form-cloud-custom-outcomes.component.png)

## Basic Usage

```html
<adf-cloud-form>
    <adf-cloud-form-custom-outcomes>
        <button mat-button (click)="onCustomOutcome1()">
            Custom-outcome-1
        </button>
        <button mat-button (click)="onCustomOutcome2()">
            Custom-outcome-2
        </button>
        <button mat-button (click)="onCustomOutcome3()">
            Custom-outcome-3
        </button>
    </adf-cloud-form-custom-outcomes>
</adf-cloud-form>
```

## See Also

-   [Form cloud component](form-cloud.component.md)
