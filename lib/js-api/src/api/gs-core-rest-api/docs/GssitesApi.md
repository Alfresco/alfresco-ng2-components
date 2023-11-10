# GssitesApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createRMSite**](GssitesApi.md#createRMSite) | **POST** /gs-sites | Create the Records Management (RM) site
[**deleteRMSite**](GssitesApi.md#deleteRMSite) | **DELETE** /gs-sites/rm | Delete the Records Management (RM) site
[**getRMSite**](GssitesApi.md#getRMSite) | **GET** /gs-sites/rm | Get the Records Management (RM) site
[**updateRMSite**](GssitesApi.md#updateRMSite) | **PUT** /gs-sites/rm | Update the Records Management (RM) site


<a name="createRMSite"></a>
# **createRMSite**
> RMSiteEntry createRMSite(siteBodyCreateopts)

Create the Records Management (RM) site


Creates the RM site with the given details.

**Note:** The default site id is rm and the default site name is Records Management. The id of a site cannot be updated once the site has been created.

For example, to create an RM site named \"Records Management\" with \"Records Management Description\" as description, the following body could be used:
JSON
{
  \"title\": \"Records Management\",
  \"description\": \"Records Management Description\"
}


The creator will be added as a member with Site Manager role.

When you create the RM site, the **filePlan** structure is also created including special containers, such as containers for transfers, holds and, unfiled records.


### Example
```javascript
import GssitesApi from 'GssitesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let gssitesApi = new GssitesApi(this.alfrescoApi);

let opts = { 
  'skipAddToFavorites': true //  | Flag to indicate whether the RM site should not be added to the user's site favorites.
};

gssitesApi.createRMSite(siteBodyCreateopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **siteBodyCreate** | [**RMSiteBodyCreate**](RMSiteBodyCreate.md)| The site details | 
 **skipAddToFavorites** | **boolean**| Flag to indicate whether the RM site should not be added to the user's site favorites. | [optional] [default to false]

### Return type

[**RMSiteEntry**](RMSiteEntry.md)

<a name="deleteRMSite"></a>
# **deleteRMSite**
> deleteRMSite()

Delete the Records Management (RM) site


Deletes the RM site.


### Example
```javascript
import GssitesApi from 'GssitesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let gssitesApi = new GssitesApi(this.alfrescoApi);

gssitesApi.deleteRMSite().then(() => {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

<a name="getRMSite"></a>
# **getRMSite**
> RMSiteEntry getRMSite(opts)

Get the Records Management (RM) site


Gets information for RM site.


### Example
```javascript
import GssitesApi from 'GssitesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let gssitesApi = new GssitesApi(this.alfrescoApi);

let opts = { 
  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

gssitesApi.getRMSite(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fields** | [**string**](string.md)| A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.
 | [optional] 

### Return type

[**RMSiteEntry**](RMSiteEntry.md)

<a name="updateRMSite"></a>
# **updateRMSite**
> RMSiteEntry updateRMSite(siteBodyUpdateopts)

Update the Records Management (RM) site


Update the details for the RM site. Site Manager or other (site) admin can update title or description.

**Note**: the id, site visibility, or compliance of the RM site cannot be updated once the site has been created.


### Example
```javascript
import GssitesApi from 'GssitesApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let gssitesApi = new GssitesApi(this.alfrescoApi);

let opts = { 
  'fields':  //  | A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.

};

gssitesApi.updateRMSite(siteBodyUpdateopts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **siteBodyUpdate** | [**RMSiteBodyUpdate**](RMSiteBodyUpdate.md)| The RM site information to update. | 
 **fields** | [**string**](string.md)| A list of field names.

You can use this parameter to restrict the fields
returned within a response if, for example, you want to save on overall bandwidth.

The list applies to a returned individual
entity or entries within a collection.

If the API method also supports the **include**
parameter, then the fields specified in the **include**
parameter are returned in addition to those specified in the **fields** parameter.
 | [optional] 

### Return type

[**RMSiteEntry**](RMSiteEntry.md)

