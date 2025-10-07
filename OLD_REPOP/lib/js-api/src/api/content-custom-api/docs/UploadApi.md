# UploadApi


| Method                                    | Description         |
|-------------------------------------------|---------------------|
| [**uploadFile**](UploadApi.md#uploadFile) | upload file content |


<a name="uploadFile"></a>
# **uploadFile**
>      uploadFile(fileDefinition, relativePath: string, rootFolderId: string, nodeBody: any, opts?: any): Promise<NodeEntry | any> 


**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const fs = require('fs');
const uploadApi = new UploadApi(alfrescoApi);
const fileToUpload = fs.createReadStream('./folderA/folderB/newFile.txt');

uploadApi.uploadFile(fileToUpload).then(
    () => {
        console.log('File Uploaded in the root');
    }, 
    (error) => {
        console.log('Error during the upload' + error);
    });
```


