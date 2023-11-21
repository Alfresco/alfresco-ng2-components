# SecurityControlSettingsApi

All URIs are relative to *https://localhost/alfresco/api/-default-/public/gs/versions/1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getSecurityControlSetting**](SecurityControlSettingsApi.md#getSecurityControlSetting) | **GET** /security-control-settings/{securityControlSettingKey} | Get security control setting value
[**updateSecurityControlSetting**](SecurityControlSettingsApi.md#updateSecurityControlSetting) | **PUT** /security-control-settings/{securityControlSettingKey} | Update security control setting value


<a name="getSecurityControlSetting"></a>
# **getSecurityControlSetting**
> SecurityControlSettingEntry getSecurityControlSetting(securityControlSettingKey)

Get security control setting value

Gets the value for a selected **securityControlSettingKey**.

### Example
```javascript
import SecurityControlSettingsApi from 'SecurityControlSettingsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let securitycontrolsettingsApi = new SecurityControlSettingsApi(this.alfrescoApi);


securitycontrolsettingsApi.getSecurityControlSetting(securityControlSettingKey).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **securityControlSettingKey** | **string**| The key for the security control setting. You can use one of the following settings:
* -declassificationTimeFrame- for the declassification time frame value set in alfresco-global.properties file
 | 

### Return type

[**SecurityControlSettingEntry**](SecurityControlSettingEntry.md)

<a name="updateSecurityControlSetting"></a>
# **updateSecurityControlSetting**
> SecurityControlSettingEntry updateSecurityControlSetting(securityControlSettingKeysecurityControlSettingValue)

Update security control setting value

Updates the value of a selected **securityControlSettingKey**.

### Example
```javascript
import SecurityControlSettingsApi from 'SecurityControlSettingsApi';
import { AlfrescoApi } from '@alfresco/js-api';

this.alfrescoApi = new AlfrescoApi();
this.alfrescoApi.setConfig({
    hostEcm: 'http://127.0.0.1:8080'
});

let securitycontrolsettingsApi = new SecurityControlSettingsApi(this.alfrescoApi);


securitycontrolsettingsApi.updateSecurityControlSetting(securityControlSettingKeysecurityControlSettingValue).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **securityControlSettingKey** | **string**| The key for the security control setting. You can use one of the following settings:
* -declassificationTimeFrame- for the declassification time frame value set in alfresco-global.properties file
 | 
 **securityControlSettingValue** | [**SecurityControlSettingBody**](SecurityControlSettingBody.md)| The new value for the security control setting. This can be a string or number, depending on the setting key. | 

### Return type

[**SecurityControlSettingEntry**](SecurityControlSettingEntry.md)

