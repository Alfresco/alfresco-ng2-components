---
Title: User Representation interface
Added: v6.0.0
Status: Active
Last reviewed: 2022-12-06
---

# [User Representation interface](lib/core/src/lib/interfaces/user-representation.interface.ts "Defined in user-representation.interface.ts")

## Definition

```ts
export interface UserRepresentation {
    apps?: LightAppRepresentation[];
    capabilities?: string[];
    company?: string;
    created?: Date;
    email?: string;
    externalId?: string;
    firstName?: string;
    fullname?: string;
    groups?: GroupRepresentation[];
    id?: number;
    lastName?: string;
    lastUpdate?: Date;
    latestSyncTimeStamp?: Date;
    password?: string;
    pictureId?: number;
    primaryGroup?: GroupRepresentation;
    status?: string;
    tenantId?: number;
    tenantName?: string;
    tenantPictureId?: number;
    type?: string;
}
```

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**apps** | [**LightAppRepresentation[]**](lib/core/src/lib/interfaces/user-representation.interface.ts) |  | [optional] [default to null]
**capabilities** | **string[]** |  | [optional] [default to null]
**company** | **string** |  | [optional] [default to null]
**created** | **Date** |  | [optional] [default to null]
**email** | **string** |  | [optional] [default to null]
**externalId** | **string** |  | [optional] [default to null]
**firstName** | **string** |  | [optional] [default to null]
**fullname** | **string** |  | [optional] [default to null]
**groups** | [**GroupRepresentation[]**](lib/core/src/lib/interfaces/user-representation.interface.ts) |  | [optional] [default to null]
**id** | **number** |  | [optional] [default to null]
**lastName** | **string** |  | [optional] [default to null]
**lastUpdate** | **Date** |  | [optional] [default to null]
**latestSyncTimeStamp** | **Date** |  | [optional] [default to null]
**password** | **string** |  | [optional] [default to null]
**pictureId** | **number** |  | [optional] [default to null]
**primaryGroup** | [**GroupRepresentation**](lib/core/src/lib/interfaces/user-representation.interface.ts) |  | [optional] [default to null]
**status** | **string** |  | [optional] [default to null]
**tenantId** | **number** |  | [optional] [default to null]
**tenantName** | **string** |  | [optional] [default to null]
**tenantPictureId** | **number** |  | [optional] [default to null]
**type** | **string** |  | [optional] [default to null]

## See also

-   [Authentication service](../services/authentication.service.md)
