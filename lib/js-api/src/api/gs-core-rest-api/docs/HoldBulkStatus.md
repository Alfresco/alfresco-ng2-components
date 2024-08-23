# HoldBulkStatus

## Properties

| Name                  | Type                                          | Description                                   | Notes                                         |
|---------------------- | --------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| **bulkStatusId**      | **string**                                    | Bulk status id                                |                                               |
| **errorsCount**       | **number**                                    | Number of errors thrown during bulk operation |                                               |
| **holdBulkOperation** | [**HoldBulkOperation**](HoldBulkOperation.md) | Specifies operation type and targeted files   |                                               |
| **processedItems**    | **number**                                    | Number of processed files                     |                                               |
| **status**            | **string**                                    | Current status of operation                   |                                               |
| **totalItems**        | **number**                                    | Number of targeted files                      |                                               |
| **startTime**         | **Date**                                      | Date and time of operation start              |                                               |
| **endTime**           | **Date**                                      | Date and time of operation end                | Is included only after operation is completed |
