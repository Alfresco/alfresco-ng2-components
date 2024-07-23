# BulkHoldAddResponse

## Basic usage

```ts
export interface BulkHoldAddResponse {
    bulkStatusId: string;
    totalItems: number;
}
```

## Properties

| Name             | Type       | Default value | Description                              |
| ---------------- | ---------- | ------------- | ---------------------------------------- |
| **bulkStatusId** | **string** |               | Indentifier of Bulk Status               |
| **totalItems**   | **number** | **0**         | Amount of total nodes assigned to a hold |
