# PeopleApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/alfresco/versions/1*

| Method                                        | HTTP request                                       | Description             |
|-----------------------------------------------|----------------------------------------------------|-------------------------|
| [createPerson](#createPerson)                 | **POST** /people                                   | Create person           |
| [deleteAvatarImage](#deleteAvatarImage)       | **DELETE** /people/{personId}/avatar               | Delete avatar image     |
| [getAvatarImage](#getAvatarImage)             | **GET** /people/{personId}/avatar                  | Get avatar image        |
| [getPerson](#getPerson)                       | **GET** /people/{personId}                         | Get a person            |
| [listPeople](#listPeople)                     | **GET** /people                                    | List people             |
| [requestPasswordReset](#requestPasswordReset) | **POST** /people/{personId}/request-password-reset | Request password reset  |
| [resetPassword](#resetPassword)               | **POST** /people/{personId}/reset-password         | Reset password          |
| [updateAvatarImage](#updateAvatarImage)       | **PUT** /people/{personId}/avatar                  | Update avatar image     |
| [getAvatarImageUrl](#getAvatarImageUrl)       | **(local)**                                        | Returns avatar image url|
| [updatePerson](#updatePerson)                 | **PUT** /people/{personId}                         | Update person           |

## createPerson

Create person

> this endpoint is available in **Alfresco 5.2** and newer versions.  
> You must have admin rights to create a person.

Create a person.

If applicable, the given person's login access can also be optionally disabled.

You can set custom properties when you create a person:

```json
{
  "id": "abeecher",
  "firstName": "Alice",
  "lastName": "Beecher",
  "displayName": "Alice Beecher",
  "email": "abeecher@example.com",
  "password": "secret",
  "properties":
  {
    "my:property": "The value"
  }
}
```

> setting properties of type d:content and d:category are not supported.


**Parameters**

| Name                 | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personBodyCreate** | [PersonBodyCreate](#PersonBodyCreate) | The person details.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| opts.fields          | string[]                              | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [PersonEntry](PersonEntry.md)

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const personBodyCreate = {};
const opts = {};

peopleApi.createPerson(personBodyCreate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## deleteAvatarImage

Deletes the avatar image related to person.

> this endpoint is available in **Alfresco 5.2.2** and newer versions.  
> You must be the person or have admin rights to update a person's avatar.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type   | Description                 |
|--------------|--------|-----------------------------|
| **personId** | string | The identifier of a person. |

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);

peopleApi.deleteAvatarImage(`<personId>`).then(() => {
  console.log('API called successfully.');
});
```

## getAvatarImage

Get avatar image

> this endpoint is available in **Alfresco 5.2.2** and newer versions.

Gets the avatar image related to the person **personId**. If the person has no related avatar then
the **placeholder** query parameter can be optionally used to request a placeholder image to be returned.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name                 | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|----------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**         | string  | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| opts.attachment      | boolean | **true** (default) enables a web browser to download the file as an attachment. **false** means a web browser may preview the file in a new tab or window, but not download the file. You can only set this parameter to **false** if the content type of the file is in the supported list; for example, certain image files and PDF files. If the content type is not supported for preview, then a value of **false**  is ignored, and the attachment will be returned in the response. |
| opts.ifModifiedSince | Date    | Only returns the content if it has been modified since the date provided. Use the date format defined by HTTP. For example, `Wed, 09 Mar 2016 16:56:34 GMT`.                                                                                                                                                                                                                                                                                                                               |
| opts.placeholder     | boolean | If **true** (default) and there is no avatar for this **personId** then the placeholder image is returned, rather than a 404 response.                                                                                                                                                                                                                                                                                                                                                     |

**Return type**: Blob

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const opts = {};

peopleApi.getAvatarImage(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## getPerson

Gets information for the person

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name         | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|--------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId** | string   | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| opts.fields  | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [PersonEntry](PersonEntry.md)

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const opts = {};

peopleApi.getPerson(`<personId>`, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## listPeople

List people

> this endpoint is available in **Alfresco 5.2** and newer versions.

You can use the **include** parameter to return any additional information.

The default sort order for the returned list is for people to be sorted by ascending id.
You can override the default by using the **orderBy** parameter.

You can use any of the following fields to order the results:

* id
* firstName
* lastName

**Parameters**

| Name           | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Notes          |
|----------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| opts.skipCount | number   | The number of entities that exist in the collection before those included in this list. If not supplied then the default value is 0.                                                                                                                                                                                                                                                                                                                             | default to 0   |
| opts.maxItems  | number   | The maximum number of items to return in the list. If not supplied then the default value is 100.                                                                                                                                                                                                                                                                                                                                                                | default to 100 |
| opts.orderBy   | string[] | A string to control the order of the entities returned in a list. You can use the **orderBy** parameter to sort the list by one or more fields. Each field has a default sort order, which is normally ascending order. Read the API method implementation notes above to check if any fields used in this method have a descending default search order. To sort the entities in a specific order, you can use the **ASC** and **DESC** keywords for any field. |                |
| opts.include   | string[] | Returns additional information about the person. The following optional fields can be requested: `properties`, `aspectNames`, `capabilities`                                                                                                                                                                                                                                                                                                                     |                |
| opts.fields    | string[] | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.                          |                |

**Return type**: [PersonPaging](PersonPaging.md)

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const opts = {};

peopleApi.listPeople(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

## requestPasswordReset

Request password reset

> this endpoint is available in **Alfresco 5.2.1** and newer versions.  
> No authentication is required to call this endpoint.

Initiates the reset password workflow to send an email with reset password instruction to the user's registered email.

The client is mandatory in the request body. For example:

```json
{
  "client": "myClient"
}
```

**Note:** The client must be registered before this API can send an email. See [server documentation]. However, out-of-the-box
share is registered as a default client, so you could pass **share** as the client name:

```json
{
  "client": "share"
}
```

**Parameters**

| Name           | Type                      | Description                                          |
|----------------|---------------------------|------------------------------------------------------|
| **personId**   | **string**                | The identifier of a person.                          |
| **clientBody** | [ClientBody](#ClientBody) | The client name to send email with app-specific url. |

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const clientBody = {};

peopleApi.requestPasswordReset(`<personId>`, clientBody).then(() => {
  console.log('API called successfully.');
});
```

## resetPassword

Resets user's password

> this endpoint is available in **Alfresco 5.2.1** and newer versions.  
> No authentication is required to call this endpoint.

The password, id and key properties are mandatory in the request body. For example:

```json
{
  "password":"newPassword",
  "id":"activiti$10",
  "key":"4dad6d00-0daf-413a-b200-f64af4e12345"
}
```

**Parameters**

| Name                  | Type                                    | Description                 |
|-----------------------|-----------------------------------------|-----------------------------|
| **personId**          | string                                  | The identifier of a person. |
| **passwordResetBody** | [PasswordResetBody](#PasswordResetBody) | The reset password details  |

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const passwordResetBody = {};

peopleApi.resetPassword(`<personId>`, passwordResetBody).then(() => {
  console.log('API called successfully.');
});
```

## updateAvatarImage

Updates the avatar image related to the person

> this endpoint is available in **Alfresco 5.2.2** and newer versions.  
> You must be the person or have admin rights to update a person's avatar.

The request body should be the binary stream for the avatar image. The content type of the file
should be an image file. This will be used to generate an "avatar" thumbnail rendition.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

**Parameters**

| Name                  | Type   | Description                 |
|-----------------------|--------|-----------------------------|
| **personId**          | string | The identifier of a person. |
| **contentBodyUpdate** | string | The binary content          |

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const contentBodyUpdate = {};

peopleApi.updateAvatarImage(`<personId>`, contentBodyUpdate).then(() => {
  console.log('API called successfully.');
});
```

## getAvatarImageUrl

Returns the direct URL to the avatar image of the specified person.

> this is a local utility method that builds a direct URL to the avatar image, including the current authentication ticket to allow secure access.
> it does not make a network request — it only returns the constructed URL.

You can use the -me- string in place of <personId> to specify the currently authenticated user.

This method is useful for displaying profile images using direct <img> tags or background image URLs.

**Parameters**

| Name         | Type   | Description                 |
| ------------ | ------ | --------------------------- |
| **personId** | string | The identifier of a person. |

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);

const avatarUrl = peopleApi.getAvatarImageUrl('<personId>');
console.log('Avatar URL:', avatarUrl);
```

## updatePerson

Update the given person's details.

> this endpoint is available in **Alfresco 5.2** and newer versions.  
> You must have admin rights to update a person — unless updating your own details.

You can use the `-me-` string in place of `<personId>` to specify the currently authenticated user.

If applicable, the given person's login access can also be optionally disabled or re-enabled.

If you are changing your password, as a non-admin user, then the existing password must also
be supplied (using the oldPassword field in addition to the new password value).

Admin users cannot be disabled by setting enabled to false.

Non-admin users may not disable themselves.

You can set custom properties when you update a person:

```json
{
  "firstName": "Alice",
  "properties":
  {
    "my:property": "The value"
  }
}
```

> setting properties of type d:content and d:category are not supported.

**Parameters**

| Name                 | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------------|---------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **personId**         | string                                | The identifier of a person.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **personBodyUpdate** | [PersonBodyUpdate](#PersonBodyUpdate) | The person details.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| opts.fields          | string[]                              | A list of field names. You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth. The list applies to a returned individual entity or entries within a collection. If the API method also supports the **include** parameter, then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter. |

**Return type**: [PersonEntry](PersonEntry.md)

**Example**

```javascript
import { AlfrescoApi, PeopleApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const peopleApi = new PeopleApi(alfrescoApi);
const personBodyUpdate = {};
const opts = {};

peopleApi.updatePerson(`<personId>`, personBodyUpdate, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## PersonBodyCreate

**Properties**

| Name                      | Type                  | Description |
|---------------------------|-----------------------|-------------|
| **id**                    | string                |             |
| **firstName**             | string                |             |
| lastName                  | string                |             |
| description               | string                |             |
| **email**                 | string                |             |
| skypeId                   | string                |             |
| googleId                  | string                |             |
| instantMessageId          | string                |             |
| jobTitle                  | string                |             |
| location                  | string                |             |
| company                   | [Company](Company.md) |             |
| mobile                    | string                |             |
| telephone                 | string                |             |
| userStatus                | string                |             |
| enabled                   | boolean               |             |
| emailNotificationsEnabled | boolean               |             |
| **password**              | string                |             |
| aspectNames               | string[]              |             |
| properties                | any                   |             |

## PersonBodyUpdate

**Properties**

| Name                      | Type                  |
|---------------------------|-----------------------|
| firstName                 | string                |
| lastName                  | string                |
| description               | string                |
| email                     | string                |
| skypeId                   | string                |
| googleId                  | string                |
| instantMessageId          | string                |
| jobTitle                  | string                |
| location                  | string                |
| company                   | [Company](Company.md) |
| mobile                    | string                |
| telephone                 | string                |
| userStatus                | string                |
| enabled                   | boolean               |
| emailNotificationsEnabled | boolean               |
| password                  | string                |
| oldPassword               | string                |
| aspectNames               | string[]              |
| properties                | any                   |

## ClientBody

**Properties**

| Name   | Type   | Description     |
|--------|--------|-----------------|
| client | string | the client name |

## PasswordResetBody

**Properties**

| Name         | Type   | Description                                           |
|--------------|--------|-------------------------------------------------------|
| **password** | string | the new password                                      |
| **id**       | string | the workflow id provided in the reset password email  |
| **key**      | string | the workflow key provided in the reset password email |




