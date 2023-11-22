# Calling Custom Endpoints

Content service and process service has two different clients:

- AlfrescoJsApi.ProcessClient
- AlfrescoJsApi.ContentClient

Both clients expose a method ***callApi**

```typescript
function callApi(
    path: string,
    httpMethod: string,
    pathParams?: any,
    queryParams?: any,
    headerParams?: any,
    formParams?: any,
    bodyParam?: any,
    contentTypes?: string[],
    accepts?: string[],
    returnType?: any,
    contextRoot?: string,
    responseType?: string
): Promise<any> {};
```

If you want call your custom rest point in one of those two service use the corresponding client.

**Example**

```javascript
alfrescoJsApi.bpmClient.callApi(
    '/api/enterprise/app-version', 'GET',
    {}, {}, {}, {}, {}, ['application/json'], ['application/json'], {'String': 'String'}
)
 ```