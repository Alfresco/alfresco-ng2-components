# DiscoveryApi

All URIs are relative to *https://localhost/alfresco/api*

| Method                                                                   | HTTP request       | Description                |
|--------------------------------------------------------------------------|--------------------|----------------------------|
| [**getRepositoryInformation**](DiscoveryApi.md#getRepositoryInformation) | **GET** /discovery | Get repository information |

<a name="getRepositoryInformation"></a>
## getRepositoryInformation
> DiscoveryEntry getRepositoryInformation()

Get repository information

**Note:** this endpoint is available in Alfresco 5.2 and newer versions.

Retrieves the capabilities and detailed version information from the repository.

**Example**

```javascript
import { AlfrescoApi, DiscoveryApi} from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi({
    hostEcm: 'http://127.0.0.1:8080'
});

const discoveryApi = new DiscoveryApi(alfrescoApi);

discoveryApi.getRepositoryInformation().then(
    (data) => {
      console.log('API called successfully. Returned data: ' + data);
    }, 
    (error) => {
        console.error(error);
    });
```

### Return type

[**DiscoveryEntry**](DiscoveryEntry.md)

