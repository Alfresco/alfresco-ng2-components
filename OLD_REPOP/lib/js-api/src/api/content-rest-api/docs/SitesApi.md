# SitesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                                                        | HTTP request                                                          | Description                       |
|-------------------------------------------------------------------------------|-----------------------------------------------------------------------|-----------------------------------|
| [listSiteGroups](#listSiteGroups)                                             | **GET** /sites/{siteId}/group-members                                 | List group membership for site    |
| [approveSiteMembershipRequest](#approveSiteMembershipRequest)                 | **POST** /sites/{siteId}/site-membership-requests/{inviteeId}/approve | Approve a site membership request |
| [createSite](#createSite)                                                     | **POST** /sites                                                       | Create a site                     |
| [createSiteMembership](#createSiteMembership)                                 | **POST** /sites/{siteId}/members                                      | Create a site membership          |
| [createSiteMembershipRequestForPerson](#createSiteMembershipRequestForPerson) | **POST** /people/{personId}/site-membership-requests                  | Create a site membership request  |
| [deleteSite](#deleteSite)                                                     | **DELETE** /sites/{siteId}                                            | Delete a site                     |
| [deleteSiteMembership](#deleteSiteMembership)                                 | **DELETE** /sites/{siteId}/members/{personId}                         | Delete a site membership          |
| [deleteSiteMembershipForPerson](#deleteSiteMembershipForPerson)               | **DELETE** /people/{personId}/sites/{siteId}                          | Delete a site membership          |
| [deleteSiteMembershipRequestForPerson](#deleteSiteMembershipRequestForPerson) | **DELETE** /people/{personId}/site-membership-requests/{siteId}       | Delete a site membership request  |
| [getSite](#getSite)                                                           | **GET** /sites/{siteId}                                               | Get a site                        |
| [getSiteContainer](#getSiteContainer)                                         | **GET** /sites/{siteId}/containers/{containerId}                      | Get a site container              |
| [getSiteMembership](#getSiteMembership)                                       | **GET** /sites/{siteId}/members/{personId}                            | Get a site membership             |
| [getSiteMembershipForPerson](#getSiteMembershipForPerson)                     | **GET** /people/{personId}/sites/{siteId}                             | Get a site membership             |
| [getSiteMembershipRequestForPerson](#getSiteMembershipRequestForPerson)       | **GET** /people/{personId}/site-membership-requests/{siteId}          | Get a site membership request     |
| [getSiteMembershipRequests](#getSiteMembershipRequests)                       | **GET** /site-membership-requests                                     | Get site membership requests      |
| [listSiteContainers](#listSiteContainers)                                     | **GET** /sites/{siteId}/containers                                    | List site containers              |
| [listSiteMembershipRequestsForPerson](#listSiteMembershipRequestsForPerson)   | **GET** /people/{personId}/site-membership-requests                   | List site membership requests     |
| [listSiteMemberships](#listSiteMemberships)                                   | **GET** /sites/{siteId}/members                                       | List site memberships             |
| [listSiteMembershipsForPerson](#listSiteMembershipsForPerson)                 | **GET** /people/{personId}/sites                                      | List site memberships             |
| [listSites](#listSites)                                                       | **GET** /sites                                                        | List sites                        |
| [rejectSiteMembershipRequest](#rejectSiteMembershipRequest)                   | **POST** /sites/{siteId}/site-membership-requests/{inviteeId}/reject  | Reject a site membership request  |
| [updateSite](#updateSite)                                                     | **PUT** /sites/{siteId}                                               | Update a site                     |
| [updateSiteMembership](#updateSiteMembership)                                 | **PUT** /sites/{siteId}/members/{personId}                            | Update a site membership          |
| [updateSiteMembershipRequestForPerson](#updateSiteMembershipRequestForPerson) | **PUT** /people/{personId}/site-membership-requests/{siteId}          | Update a site membership request  |

## listSiteGroups

List group membership for site

> this endpoint is available in **Alfresco 7.0.0** and newer versions.

**Parameters**

| Name       | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **siteId** | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |                |
| skipCount  | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| maxItems   | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| fields     | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |


**Return type**: [SiteGroupPaging](#SiteGroupPaging)

## approveSiteMembershipRequest

Approve a site membership request

**Parameters**

| Name                            | Type                                                      | Description                                                                       |
|---------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------------|
| **siteId**                      | string                                                    | The identifier of a site.                                                         |
| **inviteeId**                   | string                                                    | The invitee user name.                                                            |
| opts.siteMembershipApprovalBody | [SiteMembershipApprovalBody](#SiteMembershipApprovalBody) | Accepting a request to join, optionally, allows assignment of a role to the user. |

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);

const opts = { 
  siteMembershipApprovalBody: {}
};

sitesApi.approveSiteMembershipRequest(`<siteId>`, `<inviteeId>`, opts).then(() => {
  console.log('API called successfully.');
});
```

## createSite

Create a site

> this endpoint is available in **Alfresco 5.2** and newer versions.

Creates a default site with the given details.  Unless explicitly specified, the site id will be generated
from the site title. The site id must be unique and only contain alphanumeric and/or dash characters.

> the id of a site cannot be updated once the site has been created.

For example, to create a public site called "Marketing" the following body could be used:

```json
{
  "title": "Marketing",
  "visibility": "PUBLIC"
}
```

The creation of the (surf) configuration files required by Share can be skipped via the **skipConfiguration** query parameter.

> if skipped then such a site will **not** work within Share.

The addition of the site to the user's site favorites can be skipped via the **skipAddToFavorites** query parameter.

The creator will be added as a member with Site Manager role.

When you create a site, a container called **documentLibrary** is created for you in the new site.
This container is the root folder for content stored in the site.

**Parameters**

| Name                    | Type                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **siteBodyCreate**      | [SiteBodyCreate](#SiteBodyCreate) | The site details                                                                                                                                                                                                                                                                                                                                                                                                                        |
| opts.skipConfiguration  | boolean                           | Flag to indicate whether the Share-specific (surf) configuration files for the site should not be created.                                                                                                                                                                                                                                                                                                                              |
| opts.skipAddToFavorites | boolean                           | Flag to indicate whether the site should not be added to the user's site favorites.                                                                                                                                                                                                                                                                                                                                                     |
| opts.fields             | string[]                          | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. | 

**Return type**: [SiteEntry](SiteEntry.md)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const siteBodyCreate = {};
const opts = {};

sitesApi.createSite(siteBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## createSiteMembership

Create a site membership

You can set the **role** to one of four types:

* SiteConsumer
* SiteCollaborator
* SiteContributor
* SiteManager

**Note:** You can create more than one site membership by
specifying a list of people in the JSON body like this:

```json
[
  {
    "role": "SiteConsumer",
    "id": "joe"
  },
  {
    "role": "SiteConsumer",
    "id": "fred"
  }
]
```

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

```json
{
  "list": {
    "pagination": {
      "count": 2,
      "hasMoreItems": false,
      "totalItems": 2,
      "skipCount": 0,
      "maxItems": 100
    },
    "entries": [
      {
        "entry": {
        }
      },
      {
        "entry": {
        }
      }
    ]
  }
}
```

**Parameters**

| Name                         | Type                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|------------------------------|-------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **siteId**                   | **string**                                            | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **siteMembershipBodyCreate** | [SiteMembershipBodyCreate](#SiteMembershipBodyCreate) | The person to add and their role                                                                                                                                                                                                                                                                                                                                                                                                        |
| opts.fields                  | string[]                                              | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteMemberEntry](#SiteMemberEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const siteMembershipBodyCreate = {};
const opts = {};

sitesApi.createSiteMembership(`<siteId>`, siteMembershipBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## createSiteMembershipRequestForPerson

Create a site membership request

Create a site membership request for yourself on the site with the identifier of **id**, specified in the JSON body.
The result of the request differs depending on the type of site.

* For a **public** site, you join the site immediately as a SiteConsumer.
* For a **moderated** site, your request is added to the site membership request list. The request waits for approval from the Site Manager.
* You cannot request membership of a **private** site. Members are invited by the site administrator.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

> You can create site membership requests for more than one site by specifying a list of sites in the JSON body like this:

```json
[
  {
    "message": "Please can you add me",
    "id": "test-site-1",
    "title": "Request for test site 1"
  },
  {
    "message": "Please can you add me",
    "id": "test-site-2",
    "title": "Request for test site 2"
  }
]
```

If you specify a list as input, then a paginated list rather than an entry is returned in the response body. For example:

```json
{
  "list": {
    "pagination": {
      "count": 2,
      "hasMoreItems": false,
      "totalItems": 2,
      "skipCount": 0,
      "maxItems": 100
    },
    "entries": [
      {
        "entry": {
        }
      },
      {
        "entry": {
        }
      }
    ]
  }
}
```

**Parameters**

| Name                                | Type                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------------------------|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**                        | string                                                              | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **siteMembershipRequestBodyCreate** | [SiteMembershipRequestBodyCreate](#SiteMembershipRequestBodyCreate) | Site membership request details                                                                                                                                                                                                                                                                                                                                                                                                         |
| opts.fields                         | string[]                                                            | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteMembershipRequestEntry](#SiteMembershipRequestEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const siteMembershipRequestBodyCreate = {};
const opts = {};

sitesApi.createSiteMembershipRequestForPerson(`<personId>`, siteMembershipRequestBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteSite

Delete a site

> this endpoint is available in **Alfresco 5.2** and newer versions.

**Parameters**

| Name           | Type    | Description                                                                               |
|----------------|---------|-------------------------------------------------------------------------------------------|
| **siteId**     | string  | The identifier of a site.                                                                 |
| opts.permanent | boolean | Flag to indicate whether the site should be permanently deleted i.e. bypass the trashcan. |

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);

const opts = { 
  permanent: true 
};

sitesApi.deleteSite(`<siteId>`, opts).then(() => {
  console.log('API called successfully.');
});
```

## deleteSiteMembership

Delete a site membership

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type   | Description                 |
|--------------|--------|-----------------------------|
| **siteId**   | string | The identifier of a site.   |
| **personId** | string | The identifier of a person. |

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);

sitesApi.deleteSiteMembership(`<siteId>`, `<personId>`).then(() => {
  console.log('API called successfully.');
});
```

## deleteSiteMembershipForPerson

Delete a site membership

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type   | Description                 |
|--------------|--------|-----------------------------|
| **personId** | string | The identifier of a person. |
| **siteId**   | string | The identifier of a site.   |

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);

sitesApi.deleteSiteMembershipForPerson(`<personId>`, `<siteId>`).then(() => {
  console.log('API called successfully.');
});
```

## deleteSiteMembershipRequestForPerson

Delete a site membership request

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type   | Description                 |
|--------------|--------|-----------------------------|
| **personId** | string | The identifier of a person. |
| **siteId**   | string | The identifier of a site.   |


**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);

sitesApi.deleteSiteMembershipRequestForPerson(`<personId>`, `<siteId>`).then(() => {
  console.log('API called successfully.');
});
```

## getSite

Get a site

You can use the **relations** parameter to include one or more related
entities in a single response and so reduce network traffic.

The entity types in Alfresco are organized in a tree structure.
The **sites** entity has two children, **containers** and **members**.
The following relations parameter returns all the container and member
objects related to the site **siteId**:

- containers
- members

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **siteId**     | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| opts.relations | string[] | Use the relations parameter to include one or more related entities in a single response.                                                                                                                                                                                                                                                                                                                                               |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteEntry](SiteEntry.md)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.getSite(`<siteId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSiteContainer

Get a site container

**Parameters**

| Name            | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **siteId**      | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **containerId** | string   | The unique identifier of a site container.                                                                                                                                                                                                                                                                                                                                                                                              |
| opts.fields     | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteContainerEntry](#SiteContainerEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.getSiteContainer(`<siteId>`, `<containerId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSiteMembership

Get a site membership

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **siteId**   | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **personId** | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| opts.fields  | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteMemberEntry](#SiteMemberEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.getSiteMembership(`<siteId>`, `<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSiteMembershipForPerson

Get a site membership

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type   | Description                 |
|--------------|--------|-----------------------------|
| **personId** | string | The identifier of a person. |
| **siteId**   | string | The identifier of a site.   |

**Return type**: [SiteRoleEntry](#SiteRoleEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);

sitesApi.getSiteMembershipForPerson(`<personId>`, `<siteId>`).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSiteMembershipRequestForPerson

Gets the site membership request for site **siteId** for person **personId**, if one exists.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId** | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **siteId**   | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| opts.fields  | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteMembershipRequestEntry](#SiteMembershipRequestEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.getSiteMembershipRequestForPerson(`<personId>`, `<siteId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getSiteMembershipRequests

Get the list of site membership requests the user can action.

You can use the **where** parameter to filter the returned site membership requests by **siteId**. For example:

```text
(siteId=mySite)
```

The **where** parameter can also be used to filter by ***personId***. For example:

```text
where=(personId=person)
```

This may be combined with the siteId filter, as shown below:

```text
where=(siteId=mySite AND personId=person))
```

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.where     | string   | A string to restrict the returned objects by using a predicate.                                                                                                                                                                                                                                                                                                                                                                         |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [SiteMembershipRequestWithPersonPaging](#SiteMembershipRequestWithPersonPaging)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.getSiteMembershipRequests(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listSiteContainers

List site containers

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **siteId**     | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                | 

**Return type**: [SiteContainerPaging](#SiteContainerPaging)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.listSiteContainers(`<siteId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listSiteMembershipRequestsForPerson

List site membership requests

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **personId** | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |                |
| skipCount    | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| maxItems     | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| fields       | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [SiteMembershipRequestPaging](#SiteMembershipRequestPaging)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.listSiteMembershipRequestsForPerson(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listSiteMemberships

List site memberships

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             | Notes          |
|----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **siteId**     | string   | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                    | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                       | default to 100 |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |                |

**Return type**: [SiteMemberPaging](#SiteMemberPaging)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.listSiteMemberships(`<siteId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listSiteMembershipsForPerson

List site memberships

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

You can use the **where** parameter to filter the returned sites by **visibility** or site **preset**.

Example to filter by **visibility**, use any one of:

```text
(visibility='PRIVATE')
(visibility='PUBLIC')
(visibility='MODERATED')
```

Example to filter by site **preset**:

```text
(preset='site-dashboard')
```

The default sort order for the returned list is for sites to be sorted by ascending title.
You can override the default by using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:

* id
* title
* role

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **personId**   | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                                                      |                |
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.relations | string[] | Use the relations parameter to include one or more related entities in a single response.                                                                                                                                                                                                                                                                                                                                                                        |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                |
| opts.where     | string   | A string to restrict the returned objects by using a predicate.                                                                                                                                                                                                                                                                                                                                                                                                  |                |

**Return type**: [SiteRolePaging](#SiteRolePaging)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.listSiteMembershipsForPerson(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listSites

Gets a list of sites in this repository.

You can use the **where** parameter to filter the returned sites by **visibility** or site **preset**.

Example to filter by **visibility**, use any one of:

```text
(visibility='PRIVATE')
(visibility='PUBLIC')
(visibility='MODERATED')
```

Example to filter by site **preset**:

```text
(preset='site-dashboard')
```

The default sort order for the returned list is for sites to be sorted by ascending title.
You can override the default by using the **orderBy** parameter. You can specify one or more of the following fields in the **orderBy** parameter:

* id
* title
* description

You can use the **relations** parameter to include one or more related
entities in a single response and so reduce network traffic.

The entity types in Alfresco are organized in a tree structure.
The **sites** entity has two children, **containers** and **members**.
The following relations parameter returns all the container and member
objects related to each site:

- containers
- members

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.relations | string[] | Use the relations parameter to include one or more related entities in a single response.                                                                                                                                                                                                                                                                                                                                                                        |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                |
| opts.where     | string   | A string to restrict the returned objects by using a predicate.                                                                                                                                                                                                                                                                                                                                                                                                  |                |

**Return type**: [SitePaging](SitePaging.md)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const opts = {};

sitesApi.listSites(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## rejectSiteMembershipRequest

Reject a site membership request.

**Parameters**

| Name                             | Type                                                        | Description                                                               |
|----------------------------------|-------------------------------------------------------------|---------------------------------------------------------------------------|
| **siteId**                       | string                                                      | The identifier of a site.                                                 |
| **inviteeId**                    | string                                                      | The invitee user name.                                                    |
| opts.siteMembershipRejectionBody | [SiteMembershipRejectionBody](#SiteMembershipRejectionBody) | Rejecting a request to join, optionally, allows the inclusion of comment. |

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);

const opts = { 
  siteMembershipRejectionBody: {}
};

sitesApi.rejectSiteMembershipRequest(`<siteId>`, `<inviteeId>`, opts).then(() => {
  console.log('API called successfully.');
});
```

## updateSite

Update a site

> this endpoint is available in **Alfresco 5.2** and newer versions.

Update the details for the given site **siteId**. 
Site Manager or otherwise a (site) admin can update title, description or visibility.

> the id of a site cannot be updated once the site has been created.

**Parameters**

| Name               | Type                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **siteId**         | string                            | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **siteBodyUpdate** | [SiteBodyUpdate](#SiteBodyUpdate) | The site information to update.                                                                                                                                                                                                                                                                                                                                                                                                         |
| opts.fields        | string[]                          | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteEntry](SiteEntry.md)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const siteBodyUpdate = {};
const opts = {};

sitesApi.updateSite(siteId, siteBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## updateSiteMembership

Update a site membership

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

You can set the **role** to one of four types:

* SiteConsumer
* SiteCollaborator
* SiteContributor
* SiteManager

**Parameters**

| Name                         | Type                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|------------------------------|-------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **siteId**                   | string                                                | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **personId**                 | string                                                | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **siteMembershipBodyUpdate** | [SiteMembershipBodyUpdate](#SiteMembershipBodyUpdate) | The persons new role                                                                                                                                                                                                                                                                                                                                                                                                                    |
| opts.fields                  | string[]                                              | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteMemberEntry](#SiteMemberEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const siteMembershipBodyUpdate = {};
const opts = {};

sitesApi.updateSiteMembership(`<siteId>`, `<personId>`, siteMembershipBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## updateSiteMembershipRequestForPerson

Update a site membership request

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name                                | Type                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|-------------------------------------|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**                        | string                                                              | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **siteId**                          | string                                                              | The identifier of a site.                                                                                                                                                                                                                                                                                                                                                                                                               |
| **siteMembershipRequestBodyUpdate** | [SiteMembershipRequestBodyUpdate](#SiteMembershipRequestBodyUpdate) | The new message to display                                                                                                                                                                                                                                                                                                                                                                                                              |
| opts.fields                         | string[]                                                            | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [SiteMembershipRequestEntry](#SiteMembershipRequestEntry)

**Example**

```javascript
import { AlfrescoApi, SitesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const sitesApi = new SitesApi(alfrescoApi);
const siteMembershipRequestBodyUpdate = {};
const opts = {};

sitesApi.updateSiteMembershipRequestForPerson(`<personId>`, `<siteId>`, siteMembershipRequestBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## SiteMembershipApprovalBody

**Properties**

| Name     | Type   |
|----------|--------|
| **role** | string |

## SiteRolePaging

| Name     | Type                                      |
|----------|-------------------------------------------|
| **list** | [SiteRolePagingList](#SiteRolePagingList) |

## SiteRolePagingList

**Properties**

| Name           | Type                              |
|----------------|-----------------------------------|
| **pagination** | [Pagination](Pagination.md)       |
| **entries**    | [SiteRoleEntry[]](#SiteRoleEntry) |


## SiteRoleEntry

**Properties**

| Name      | Type                  |
|-----------|-----------------------|
| **entry** | [SiteRole](#SiteRole) |

## SiteRole

**Properties**

| Name     | Type            |
|----------|-----------------|
| **site** | [Site](Site.md) |
| **id**   | string          |
| **guid** | string          |
| **role** | string          |

### SiteRole.RoleEnum

* `SiteConsumer` (value: `'SiteConsumer'`)
* `SiteCollaborator` (value: `'SiteCollaborator'`)
* `SiteContributor` (value: `'SiteContributor'`)
* `SiteManager` (value: `'SiteManager'`)

## SiteMembershipRequestPaging

**Properties**

| Name | Type                                                                |
|------|---------------------------------------------------------------------|
| list | [SiteMembershipRequestPagingList](#SiteMembershipRequestPagingList) |

## SiteMembershipRequestPagingList

**Properties**

| Name           | Type                                                        |
|----------------|-------------------------------------------------------------|
| **pagination** | [Pagination](Pagination.md)                                 |
| **entries**    | [SiteMembershipRequestEntry[]](#SiteMembershipRequestEntry) |

## SiteMembershipRequestEntry

**Properties**

| Name      | Type                                            |
|-----------|-------------------------------------------------|
| **entry** | [SiteMembershipRequest](#SiteMembershipRequest) |

## SiteMembershipRequest

**Properties**

| Name          | Type            |
|---------------|-----------------|
| **id**        | string          |
| **createdAt** | Date            |
| **site**      | [Site](Site.md) |
| message       | string          |

## SiteMembershipBodyUpdate

**Properties**

| Name     | Type   |
|----------|--------|
| **role** | string |

### SiteMembershipBodyUpdate.RoleEnum

* `SiteConsumer` (value: `'SiteConsumer'`)
* `SiteCollaborator` (value: `'SiteCollaborator'`)
* `SiteContributor` (value: `'SiteContributor'`)
* `SiteManager` (value: `'SiteManager'`)

## SiteMembershipBodyCreate

**Properties**

| Name     | Type   |
|----------|--------|
| **role** | string |
| **id**   | string |

### SiteMembershipBodyCreate.RoleEnum

* `SiteConsumer` (value: `'SiteConsumer'`)
* `SiteCollaborator` (value: `'SiteCollaborator'`)
* `SiteContributor` (value: `'SiteContributor'`)
* `SiteManager` (value: `'SiteManager'`)

## SiteBodyUpdate

**Properties**

| Name        | Type   |
|-------------|--------|
| title       | string |
| description | string |
| visibility  | string |

### SiteBodyUpdate.VisibilityEnum

* `PRIVATE` (value: `'PRIVATE'`)
* `MODERATED` (value: `'MODERATED'`)
* `PUBLIC` (value: `'PUBLIC'`)

## SiteBodyCreate

**Properties**

| Name           | Type   |
|----------------|--------|
| id             | string |
| **title**      | string |
| description    | string |
| **visibility** | string |

### SiteBodyCreate.VisibilityEnum

* `PUBLIC` (value: `'PUBLIC'`)
* `PRIVATE` (value: `'PRIVATE'`)
* `MODERATED` (value: `'MODERATED'`)

## SiteContainerPaging

**Properties**

| Name | Type                                                |
|------|-----------------------------------------------------|
| list | [SiteContainerPagingList](#SiteContainerPagingList) |

## SiteContainerPagingList

**Properties**

| Name           | Type                                        |
|----------------|---------------------------------------------|
| **pagination** | [Pagination](Pagination.md)                 |
| **entries**    | [SiteContainerEntry[]](#SiteContainerEntry) |

## SiteContainerEntry

**Properties**

| Name      | Type                            |
|-----------|---------------------------------|
| **entry** | [SiteContainer](#SiteContainer) |

## SiteContainer

**Properties**

| Name         | Type   |
|--------------|--------|
| **id**       | string |
| **folderId** | string |

## SiteMembershipRequestBodyCreate

**Properties**

| Name    | Type       | Description                                                                                                                                                                                                                                          |
|---------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| message | **string** |                                                                                                                                                                                                                                                      |
| **id**  | **string** |                                                                                                                                                                                                                                                      |
| title   | **string** |                                                                                                                                                                                                                                                      |
| client  | **string** | Optional client name used when sending an email to the end user, defaults to \"share\" if not provided. **Note:** The client must be registered before this API can send an email. **Note:** This is available in Alfresco 7.0.0 and newer versions. |


## SiteMembershipRequestBodyUpdate

**Properties**

| Name    | Type   |
|---------|--------|
| message | string |

## SiteMembershipRejectionBody

**Properties**

| Name    | Type   |
|---------|--------|
| comment | string |

## SiteMembershipRequestWithPersonPaging

**Properties**

| Name | Type                                                                                    |
|------|-----------------------------------------------------------------------------------------|
| list | [SiteMembershipRequestWithPersonPagingList](#SiteMembershipRequestWithPersonPagingList) |

## SiteMembershipRequestWithPersonPagingList

**Properties**

| Name           | Type                                                                            |
|----------------|---------------------------------------------------------------------------------|
| **pagination** | [Pagination](Pagination.md)                                                     |
| **entries**    | [SiteMembershipRequestWithPersonEntry[]](#SiteMembershipRequestWithPersonEntry) |


## SiteMembershipRequestWithPersonEntry

**Properties**

| Name      | Type                                                                |
|-----------|---------------------------------------------------------------------|
| **entry** | [SiteMembershipRequestWithPerson](#SiteMembershipRequestWithPerson) |

## SiteMembershipRequestWithPerson

**Properties**

| Name          | Type                |
|---------------|---------------------|
| **id**        | string              |
| **createdAt** | Date                |
| **site**      | [Site](Site.md)     |
| **person**    | [Person](Person.md) |
| message       | **string**          |

## SiteMemberPaging

**Properties**

| Name | Type                                          |
|------|-----------------------------------------------|
| list | [SiteMemberPagingList](#SiteMemberPagingList) |

## SiteMemberPagingList

**Properties**

| Name           | Type                                  |
|----------------|---------------------------------------|
| **pagination** | [Pagination](Pagination.md)           |
| **entries**    | [SiteMemberEntry[]](#SiteMemberEntry) |

## SiteMemberEntry

**Properties**

| Name      | Type                      |
|-----------|---------------------------|
| **entry** | [SiteMember](#SiteMember) |


## SiteMember

**Properties**

| Name            | Type                |
|-----------------|---------------------|
| **id**          | string              |
| **person**      | [Person](Person.md) |
| **role**        | string              |
| isMemberOfGroup | boolean             |

### SiteMember.RoleEnum

* `SiteConsumer` (value: `'SiteConsumer'`)
* `SiteCollaborator` (value: `'SiteCollaborator'`)
* `SiteContributor` (value: `'SiteContributor'`)
* `SiteManager` (value: `'SiteManager'`)

## SiteGroupPaging

**Properties**

| Name | Type                                        |
|------|---------------------------------------------|
| list | [SiteGroupPagingList](#SiteGroupPagingList) |

## SiteGroupPagingList

**Properties**

| Name           | Type                                |
|----------------|-------------------------------------|
| **pagination** | [Pagination](Pagination.md)         |
| **entries**    | [SiteGroupEntry[]](#SiteGroupEntry) |

## SiteGroupEntry

**Properties**

| Name      | Type                    |
|-----------|-------------------------|
| **entry** | [SiteGroup](#SiteGroup) |

## SiteGroup

**Properties**

| Name      | Type                          |
|-----------|-------------------------------|
| **id**    | string                        |
| **group** | [GroupMember](GroupMember.md) |
| **role**  | string                        |

### Enum: SiteGroup.RoleEnum

* `SiteConsumer` (value: `'SiteConsumer'`)
* `SiteCollaborator` (value: `'SiteCollaborator'`)
* `SiteContributor` (value: `'SiteContributor'`)
* `SiteManager` (value: `'SiteManager'`)

