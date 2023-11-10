# GroupsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                                          | HTTP request                                         | Description                 |
|-----------------------------------------------------------------|------------------------------------------------------|-----------------------------|
| [createGroup](#createGroup)                                     | **POST** /groups                                     | Create a group              |
| [createGroupMembership](#createGroupMembership)                 | **POST** /groups/{groupId}/members                   | Create a group membership   |
| [deleteGroup](#deleteGroup)                                     | **DELETE** /groups/{groupId}                         | Delete a group              |
| [deleteGroupMembership](#deleteGroupMembership)                 | **DELETE** /groups/{groupId}/members/{groupMemberId} | Delete a group membership   |
| [getGroup](#getGroup)                                           | **GET** /groups/{groupId}                            | Get group details           |
| [listGroupMemberships](#listGroupMemberships)                   | **GET** /groups/{groupId}/members                    | List memberships of a group |
| [listGroupMembershipsForPerson](#listGroupMembershipsForPerson) | **GET** /people/{personId}/groups                    | List group memberships      |
| [listGroups](#listGroups)                                       | **GET** /groups                                      | List groups                 |
| [updateGroup](#updateGroup)                                     | **PUT** /groups/{groupId}                            | Update group details        |

## createGroup

Create a group

> this endpoint is available in **Alfresco 5.2.1** and newer versions.
> You must have admin rights to create a group.

Create a group.

The group id must start with \"GROUP\\_\". If this is omitted it will be added automatically.
This format is also returned when listing groups or group memberships. It should be noted
that the other group-related operations also expect the id to start with \"GROUP\\_\".

If one or more parentIds are specified then the group will be created and become a member
of each of the specified parent groups.

If no parentIds are specified then the group will be created as a root group.

The group will be created in the **APP.DEFAULT** and **AUTH.ALF** zones.

**Parameters**

| Name                | Type                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|---------------------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **groupBodyCreate** | [GroupBodyCreate](#GroupBodyCreate) | The group to create.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| opts.include        | string[]                            | Returns additional information about the group. The following optional fields can be requested: `parentIds`, `zones`                                                                                                                                                                                                                                                                                                                    |
| opts.fields         | string[]                            | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [GroupEntry](#GroupEntry)

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);

const payload = {};
const opts = {};

groupsApi.createGroup(payload, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## createGroupMembership

Create a group membership

> this endpoint is available in **Alfresco 5.2.1** and newer versions.
> You must have admin rights to create a group membership.

Create a group membership (for an existing person or group) within a group **groupId**.
If the added group was previously a root group then it becomes a non-root group since it now has a parent.

It is an error to specify an **id** that does not exist.

**Parameters**

| Name                          | Type                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------------------|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **groupId**                   | string                                                  | The identifier of a group.                                                                                                                                                                                                                                                                                                                                                                                                              | 
| **groupMembershipBodyCreate** | [GroupMembershipBodyCreate](#GroupMembershipBodyCreate) | The group membership to add (person or sub-group).                                                                                                                                                                                                                                                                                                                                                                                      | 
| opts.fields                   | string[]                                                | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [GroupMemberEntry](#GroupMemberEntry)

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);

const groupMembershipBodyCreate = {};
const opts = {};

groupsApi.createGroupMembership(`<groupId>`, groupMembershipBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteGroup

Delete a group

> this endpoint is available in **Alfresco 5.2.1** and newer versions.
> You must have admin rights to delete a group.

The option to cascade delete applies this recursively to any hierarchy of group members.
In this case, removing a group member does not delete the person or subgroup itself.
If a removed subgroup no longer has any parent groups then it becomes a root group.

**Parameters**

| Name         | Type    | Description                                                           | Notes            |
|--------------|---------|-----------------------------------------------------------------------|------------------|
| **groupId**  | string  | The identifier of a group.                                            |                  |
| opts.cascade | boolean | If **true** then the delete will be applied in cascade to sub-groups. | default to false |

**Example**

```javascript
import { AlfrescoApi, GroupsApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);

const opts = { 
  cascade: true
};

groupsApi.deleteGroup(`<groupId>`, opts).then(() => {
  console.log('API called successfully.');
});
```

## deleteGroupMembership

Delete a group membership

> this endpoint is available in **Alfresco 5.2.1** and newer versions.
> You must have admin rights to delete a group membership.

Delete group member **groupMemberId** (person or subgroup) from group **groupId**.

Removing a group member does not delete the person or subgroup itself.
If a removed subgroup no longer has any parent groups then it becomes a root group.

**Parameters**

| Name          | Type   | Description                          |
|---------------|--------|--------------------------------------|
| groupId       | string | The identifier of a group.           |
| groupMemberId | string | The identifier of a person or group. |

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);

groupsApi.deleteGroupMembership(`<groupId>`, `<groupMemberId>`).then(() => {
  console.log('API called successfully.');
});
```

## getGroup

Get group details

> this endpoint is available in **Alfresco 5.2.1** and newer versions.

You can use the **include** parameter to return additional information.

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **groupId**  | string   | The identifier of a group.                                                                                                                                                                                                                                                                                                                                                                                                              | 
| opts.include | string[] | Returns additional information about the group. The following optional fields can be requested: `parentIds`, `zones`                                                                                                                                                                                                                                                                                                                    | 
| opts.fields  | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [GroupEntry](#GroupEntry)

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);

const opts = {};

groupsApi.getGroup(`<groupId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listGroupMemberships

List memberships of a group

> this endpoint is available in **Alfresco 5.2.1** and newer versions.

Gets a list of the group memberships for the group **groupId**.
You can use the **where** parameter to filter the returned groups by **memberType**.

Example to filter by **memberType**, use any one of:

```text
(memberType='GROUP')
(memberType='PERSON')
```

The default sort order for the returned list is for group members to be sorted by ascending displayName.
You can override the default by using the **orderBy** parameter. You can specify one of the following fields in the **orderBy** parameter:

* id
* displayName

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **groupId**    | string   | The identifier of a group.                                                                                                                                                                                                                                                                                                                                                                                                                                       | 
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.where     | string   | A string to restrict the returned objects by using a predicate.                                                                                                                                                                                                                                                                                                                                                                                                  |                | 
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                |

**Return type**: [GroupMemberPaging](#GroupMemberPaging)

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);
const opts = { };

groupsApi.listGroupMemberships(`<groupId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listGroupMembershipsForPerson

List group memberships

> this endpoint is available in **Alfresco 5.2.1** and newer versions.

Gets a list of group membership information for person **personId**.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

You can use the **include** parameter to return additional information.

You can use the **where** parameter to filter the returned groups by **isRoot**. For example, the following **where**
clause will return just the root groups:
 
```text
(isRoot=true)
```
 
The **where** parameter can also be used to filter by ***zone***. This may be combined with isRoot to narrow
a result set even further. For example, the following where clause will only return groups belonging to the
`MY.ZONE` zone.

```text
where=(zones in ('MY.ZONE'))
``` 

This may be combined with the isRoot filter, as shown below:

```text 
where=(isRoot=false AND zones in ('MY.ZONE'))
```

 ***Note:*** restrictions include

 * AND is the only supported operator when combining isRoot and zones filters
 * Only one zone is supported by the filter
 * The quoted zone name must be placed in parentheses — a 400 error will result if these are omitted.

 The default sort order for the returned list is for groups to be sorted by ascending displayName.
 You can override the default by using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:

* id
* displayName

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **personId**   | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.include   | string[] | Returns additional information about the group. The following optional fields can be requested: `parentIds`, `zones`                                                                                                                                                                                                                                                                                                                                             |                |
| opts.where     | string   | A string to restrict the returned objects by using a predicate.                                                                                                                                                                                                                                                                                                                                                                                                  |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                |

**Return type**: [GroupPaging](#GroupPaging)

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);
const opts = {};

groupsApi.listGroupMembershipsForPerson(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listGroups

List groups

> this endpoint is available in **Alfresco 5.2.1** and newer versions.

Gets a list of groups.

You can use the **include** parameter to return additional information.

You can use the **where** parameter to filter the returned groups by **isRoot**. For example, the following **where**
clause will return just the root groups:

```text
(isRoot=true)
```

The **where** parameter can also be used to filter by ***zone***. This may be combined with isRoot to narrow
a result set even further. For example, the following where clause will only return groups belonging to the
`MY.ZONE` zone.

```text
where=(zones in ('MY.ZONE'))
```

This may be combined with the isRoot filter, as shown below:

```text
where=(isRoot=false AND zones in ('MY.ZONE'))
```

***Note:*** restrictions include

* AND is the only supported operator when combining isRoot and zones filters
* Only one zone is supported by the filter
* The quoted zone name must be placed in parentheses — a 400 error will result if these are omitted.

The default sort order for the returned list is for groups to be sorted by ascending displayName.
You can override the default by using the **orderBy** parameter. You can specify one of the following fields in the **orderBy** parameter:

* id
* displayName

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.include   | string[] | Returns additional information about the group. The following optional fields can be requested: `parentIds`, `zones`                                                                                                                                                                                                                                                                                                                                             |                |
| opts.where     | string   | A string to restrict the returned objects by using a predicate.                                                                                                                                                                                                                                                                                                                                                                                                  |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                | 

**Return type**: [GroupPaging](#GroupPaging)

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);

const opts = {};

groupsApi.listGroups(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## updateGroup

Update group details

> this endpoint is available in **Alfresco 5.2.1** and newer versions.
> You must have admin rights to update a group.

**Parameters**

| Name                | Type                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|---------------------|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **groupId**         | string                              | The identifier of a group.                                                                                                                                                                                                                                                                                                                                                                                                              | 
| **groupBodyUpdate** | [GroupBodyUpdate](#GroupBodyUpdate) | The group information to update.                                                                                                                                                                                                                                                                                                                                                                                                        | 
| opts.include        | string[]                            | Returns additional information about the group. The following optional fields can be requested: `parentIds`, `zones`                                                                                                                                                                                                                                                                                                                    | 
| opts.fields         | string[]                            | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [GroupEntry](#GroupEntry)

**Example**

```javascript
import { AlfrescoApi, GroupsApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const groupsApi = new GroupsApi(alfrescoApi);
const groupBodyUpdate = {};
const opts = {};

groupsApi.updateGroup(`<groupId>`, groupBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models 

## GroupMemberPaging

**Properties**

| Name | Type                                            |
|------|-------------------------------------------------|
| list | [GroupMemberPagingList](#GroupMemberPagingList) |

## GroupMemberPagingList

**Properties**

| Name       | Type                                    |
|------------|-----------------------------------------|
| pagination | [Pagination](Pagination.md)             |
| entries    | [GroupMemberEntry[]](#GroupMemberEntry) |

## GroupMemberEntry

**Properties**

| Name  | Type                          |
|-------|-------------------------------|
| entry | [GroupMember](GroupMember.md) |

## GroupBodyCreate

**Properties**

| Name        | Type     |
|-------------|----------|
| id          | string   |
| displayName | string   |
| parentIds   | string[] |

## GroupMembershipBodyCreate

**Properties**

| Name       | Type   |
|------------|--------|
| id         | string |
| memberType | string |


### GroupMembershipBodyCreate.MemberTypeEnum

* `GROUP` (value: `'GROUP'`)
* `PERSON` (value: `'PERSON'`)

## GroupBodyUpdate

**Properties**

| Name        | Type   |
|-------------|--------|
| displayName | string |

## GroupPaging

**Properties**

| Name | Type                                |
|------|-------------------------------------|
| list | [GroupPagingList](#GroupPagingList) |


## GroupPagingList

**Properties**

| Name       | Type                        |
|------------|-----------------------------|
| pagination | [Pagination](Pagination.md) |
| entries    | [GroupEntry[]](#GroupEntry) |

## GroupEntry

**Properties**

| Name      | Type              |
|-----------|-------------------|
| **entry** | [Group](Group.md) |

