# WebscriptApi


Method | HTTP request | Description
------------- | ------------- | -------------
[**executeWebScript**](WebscriptApi.md#executeWebScript) | | execute WebScript


<a name="executeWebScript"></a>
# **executeWebScript**
>  executeWebScript(httpMethod, scriptPath, scriptArgs, contextRoot, servicePath)


For mor information about web scripts read the [Wiki](https://wiki.alfresco.com/wiki/Web_Scripts) and the [Wiki with Web ScriptsExamples](https://wiki.alfresco.com/wiki/Web_Scripts_Examples)

>  Anatomy of a Web Script URI  **http(s)://(host):(port)/(contextPath)/(servicePath)/(scriptPath)?(scriptArgs)**
A Web Script is simply a service bound to a URI which responds to HTTP methods such as GET, POST, PUT and DELETE. While using the same underlying code, there are broadly two kinds of Web Scripts.

### Parameters
Name | Type | Description  | Notes|
------------- | ------------- | ------------- | -------------
**httpMethod**  | **String**| possible value GET, POST, PUT and DELETE ||
**scriptPath**  | **String**|path to Web Script (as defined by Web Script)||
**scriptArgs**  | **String**|arguments to pass to Web Script ||
**contextRoot** | **String**|path where application is deployed default value 'alfresco'||
**servicePath** | **String**|path where Web Script service is mapped default value 'service'||
**postBody** |  **Object**|post body||

### Example

```javascript

//Call a GET on a Web Scripts available at the following URIs: http://127.0.01:8080/alfresco/service/mytasks

this.alfrescoJsApi.core.webscriptApi.executeWebScript('GET', 'mytasks').then(function (data) {
   console.log('Data received form http://127.0.01:8080/alfresco/service/mytasks' + data);    
}, function (error) {
   console.log('Error' + error);
});
        
//Call a GET on a Web Scripts available at the following URIs: http://127.0.01:8080/share/service/mytasks

this.alfrescoJsApi.core.webscriptApi.executeWebScript('GET', 'mytasks', null, 'share').then(function (data) {
   console.log('Data received form http://127.0.01:8080/share/service/mytasks' + data);    
}, function (error) {
   console.log('Error' + error);
});

//Call a GET on a Web Scripts available at the following URIs: http://127.0.01:8080/share/differentServiceSlug/mytasks

this.alfrescoJsApi.core.webscriptApi.executeWebScript('GET', 'mytasks', null, 'share', 'differentServiceSlug').then(function (data) {
   console.log('Data received form http://127.0.01:8080/share/differentServiceSlug/mytasks' + data);    
}, function (error) {
   console.log('Error' + error);
});
        
```

