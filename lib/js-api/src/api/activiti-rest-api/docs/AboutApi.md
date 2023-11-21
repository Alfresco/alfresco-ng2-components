# AboutApi

All URIs are relative to */activiti-app/api*

| Method                          | HTTP request                    | Description                 |
|---------------------------------|---------------------------------|-----------------------------|
| [getAppVersion](#getAppVersion) | **GET** /enterprise/app-version | Get server type and version |


# getAppVersion

Get server type and version

Provides information about the running Alfresco Process Services Suite. 
The response payload object has the properties type, majorVersion, minorVersion, revisionVersion and edition.

**Return type**: **Map<string, string>**

**Example**

```javascript
import { AlfrescoApi, AboutApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const aboutApi = new AboutApi(alfrescoApi);

aboutApi.getAppVersion().then((data) => {
  console.log('API called successfully. Returned data: ' + data);
});
```
