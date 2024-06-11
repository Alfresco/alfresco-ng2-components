---
Title: Prediction Status Update Interface
Added: v6.10.0
Status: Active
Last reviewed: 2024-06-11
---

# [Prediction Status Update Interface](../../../lib/core/src/lib/prediction/interfaces/prediction-status-update.interface.ts "Defined in prediction-status-update.interface.ts")

## Basic usage

```ts
export interface PredictionStatusUpdate {
    key: string;
    previousValue?: any;
 }
```

## Properties

| Name          | Type     | Description                   |
|---------------|----------|-------------------------------|
| key           | `string` | Key of the property.          |
| previousValue | `any`    | Previous human entered value. |

## See also

-   [BaseCardViewUpdate interface](../interfaces/base-card-view-update.interface.md)
