---
Title: Group Service
Added: v6.6.0
Status: Active
Last reviewed: 2024-02-07
---

# [Group Service](../../../lib/content-services/src/lib/group/services/group.service.ts "Defined in group.service.ts")

Manages groups.

## Class members

### Methods

-   **getGroup**(id: `string`, opts?: [`ContentIncludeQuery`](../../../lib/js-api/src/api/content-rest-api/api/types.ts)): [`Observable`](https://rxjs.dev/guide/observable)`<`[`GroupEntry`](../../../lib/js-api/src/api/content-rest-api/model/groupEntry.ts)`>`<br/>
    Returns group for specified id.
    -   _id:_ `string` - id of group to return.
    -   _opts:_ [`ContentIncludeQuery`](../../../lib/js-api/src/api/content-rest-api/api/types.ts) - additional query parameters.
    -   **Returns** [`Observable`](https://rxjs.dev/guide/observable)`<`[`GroupEntry`](../../../lib/js-api/src/api/content-rest-api/model/groupEntry.ts)`>` - group for specified id.
-   **updateGroup**(group: [`Group`](../../../lib/js-api/src/api/content-rest-api/docs/Group.md), opts?: [`ContentIncludeQuery`](../../../lib/js-api/src/api/content-rest-api/api/types.ts)): [`Observable`](https://rxjs.dev/guide/observable)`<`[`GroupEntry`](../../../lib/js-api/src/api/content-rest-api/model/groupEntry.ts)`>`<br/>
    Updates specified group.
    -   _group:_ [`Group`](../../../lib/js-api/src/api/content-rest-api/docs/Group.md) - group to update.
    -   _opts:_ [`ContentIncludeQuery`](../../../lib/js-api/src/api/content-rest-api/api/types.ts) - additional query parameters.
    -   **Returns** [`Observable`](https://rxjs.dev/guide/observable)`<`[`GroupEntry`](../../../lib/js-api/src/api/content-rest-api/model/groupEntry.ts)`>` - updated group.
