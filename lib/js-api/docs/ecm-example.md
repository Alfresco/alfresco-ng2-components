<!-- markdown-toc start - Don't edit this section.  npm run toc to generate it-->

<!-- toc -->

- [ECM](#ecm)
  * [Get Node  content](#get-node--content)
  * [Get File or Folder Info](#get-file-or-folder-info)
  * [Get Folder Children Info](#get-folder-children-info)
  * [Create Folder](#create-folder)
  * [Upload File](#upload-file)
  * [Events Upload File](#events-upload-file)
  * [Delete File or Folder](#delete-file-or-folder)
  * [Delete File or Folder Permanent](#delete-file-or-folder-permanent)
  * [Get thumbnail Url](#get-thumbnail-url)
  * [Get preview Url](#get-preview-url)
  * [Get content Url](#get-content-url)
  * [Custom web scripts call](#custom-web-scripts-call)

<!-- tocstop -->

<!-- markdown-toc end -->

# ECM

A complete list of all the ECM methods is available here: [Content API](../src/api/content-rest-api/README.md).
Below you can find some common examples.

## Get Node Content

```javascript
NodesApi.getFileContent(nodeId, opts)
```

Returns the file content of the node with identifier **nodeId**.

**Example**

```javascript
const fs = require('fs');

const alfrescoApi = new AlfrescoApi(/*...*/);
const nodesApi = new NodesApi(alfrescoApi);
const nodeId = '80a94ac8-3ece-47ad-864e-5d939424c47c';

nodesApi.getNodeContent(nodeId).then(
    (data) => {
        fs.writeFile('./test/grass.jpg', data, (error) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log('The file was saved!');
        });
    }, 
    (error) => {
        console.error(error);
    });
```

## Get a Node Info

```javascript
NodesApi.getNodeInfo(nodeId, opts)
```

Get information for the File/Folder with the identifier nodeId.
You can also use one of these well-known aliases: `-my-`, `-shared-` or `-root-` as `nodeId` value.

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const nodeId = '80a94ac8-3ece-47ad-864e-5d939424c47c';
const nodesApi = new NodesApi(alfrescoApi);

nodesApi.getNode(nodeId, opts).then( 
    (nodeEntry) => {
        console.log('This is the name' + nodeEntry.entry.name );
    },
    (error) => {
        console.log('This node does not exist');
    });
```
## Get Folder Children Info

```javascript
NodesApi.getNodeChildren(fileOrFolderId, opts)
```

Minimal information for each child is returned by default.

You can use the include parameter to return additional information.
returns a promise with the Info about the children of the node if resolved and `{error}` if rejected.

You can also use one of these well-known aliases: `-my-`, `-shared-` or `-root-` as `nodeId` value.

**Example**:

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const nodeId = '80a94ac8-3ece-47ad-864e-5d939424c47c';
const nodesApi = new NodesApi(alfrescoApi);

nodesApi.listNodeChildren(nodeId, opts).then( 
    (data) => {
        console.log(
            'The number of children in this folder are ' + data.list.pagination.count
        );
    },
    (error) => {
        console.log('This node does not exist');
    });
```
## Create Folder

```javascript
NodesApi.addNode(nodeId, nodeBody, opts)
```
 
Returns a promise that is resolved if the folder is created and `{error}` if rejected.

You can also use one of these well-known aliases: `-my-`, `-shared-` or `-root-`  as `nodeId` value.

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const nodesApi = new NodesApi(alfrescoApi);

const nodeBody = {
    'name': 'newFolderName',
    'nodeType': 'cm:folder',
    'relativePath': relativePath
};

nodesApi.addNode('-root-', nodeBody).then( 
    (data) => {
        console.log('The folder is created in root');
    },
    (error) => {    
        console.log('Error in creation of this folder or folder already exist' + error);
    });
```

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const nodesApi = new NodesApi(alfrescoApi);

const nodeBody = {
    'name': 'newFolderName',
    'nodeType': 'cm:folder',
    'relativePath': 'folderA/folderB'
};

nodesApi.addNode('-root-', nodeBody).then( 
    (data) => {
        console.log('The folder is created in  folderA/folderB from root');
    },
    (error) => {    
        console.log('Error in creation of this folder or folder already exist' + error);
    });
```

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const nodesApi = new NodesApi(alfrescoApi);

const nodeBody = {
    'name': 'newFolderName',
    'nodeType': 'cm:folder',
    'relativePath': 'folderA/folderB'
};
const parentFolder = '80a94ac8-3ece-47ad-864e-5d939424c47c'

nodesApi.addNode(parentFolder, nodeBody).then( 
    (data) => {
        console.log('The folder is created in  folderA/folderB from parentFolder:' + parentFolder);
    },
    (error) => {    
        console.log('Error in creation of this folder or folder already exist' + error);
    });
```

**CreateFolder With Auto Rename**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const nodesApi = new NodesApi(this.alfrescoApi);

const nodeBody = {
    name: 'newFolderName',
    nodeType: 'cm:folder',
    autoRename: true,
    relativePath: 'folderA/folderB'
};

nodesApi.addNode('-root-', nodeBody).then( 
    (data) => {
        console.log('The folder is created in root');
    },
    (error) => {    
        console.log('Error in creation of this folder or folder already exist' + error);
    });
```

## Upload File

```javascript
UploadApi.uploadFile(fileDefinition, relativePath, nodeId, nodeBody, opts)
```

Returns a promise that is resolved if the file is successful uploaded and `{error}` if rejected.

The `fileDefinition` provides information about files and allows JavaScript to access their content.

**Web**

File Definition are generally retrieved from a FileList object returned as a result of a user selecting files using the `<input>` element

**Node**

File Definition are generally retrieved from a read stream

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const fs = require('fs');

const fileToUpload = fs.createReadStream('./folderA/folderB/newFile.txt');
const uploadApi = new UploadApi(alfrescoApi);

uploadApi.uploadFile(fileToUpload).then(
    () => {
        console.log('File Uploaded in the root');
    }, 
    (error) => {
        console.log('Error during the upload' + error);
    });

uploadApi.uploadFile(fileToUpload, null, null, null, { autoRename: true })
    .then(() => {
        console.log('File Uploaded in the root');
    }, (error) => {
        console.log('Error during the upload' + error);
    });

uploadApi.uploadFile(fileToUpload, 'folderX/folderY/folderZ')
    .then(() => {
        console.log('File Uploaded in the from root folderX/folderY/folderZ');
    }, (error) => {
        console.log('Error during the upload' + error);
    });

const parentFolder = '80a94ac8-3ece-47ad-864e-5d939424c47c';

uploadApi.uploadFile(fileToUpload, 'folderX/folderY/folderZ', parentFolder )
    .then(() => {
        console.log('File Uploaded in the from parentFolder ' + parentFolder + ' n folderX/folderY/folderZ');
    }, (error) => {
        console.log('Error during the upload' + error);
    });
```

The default behaviour of the Upload API will not create any thumbnail.

In order to create a thumbnail you have to perform to pass the parameter `{renditions: 'doclib'}` as in the example below.
This parameter will basically perform also a call to the Rendition API.

For more information about the Rendition API :

* [Rendition API](../src/api/content-rest-api/docs/RenditionsApi.md)
* [Rendition service Wiki](https://wiki.alfresco.com/wiki/Rendition_Service)

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const fs = require('fs');

const fileToUpload = fs.createReadStream('./folderA/folderB/newFile.txt');
const uploadApi = new UploadApi(alfrescoApi);

uploadApi.uploadFile(fileToUpload, null, null, null, {renditions: 'doclib'})
    .then(() => {
        console.log('File Uploaded in the root');
    }, (error) => {
        console.log('Error during the upload' + error);
    });
```

To abort a file uploading:

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const fs = require('fs');

const fileToUpload = fs.createReadStream('./folderA/folderB/newFile.txt');
const uploadApi = new UploadApi(alfrescoApi);

const promiseUpload = uploadApi.uploadFile(fileToUpload)
    .once('abort', function () {
        console.log('File Uploaded aborted');
    });

promiseUpload.abort();
```

### Upload File Events

The `uploadFile` is also an `EventEmitter` which you can register to listen to any of the following event types:

* progress
* success
* abort
* error
* unauthorized

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const fs = require('fs');

const fileToUpload = fs.createReadStream('./folderA/folderB/newFile.txt');
const uploadApi = new UploadApi(alfrescoApi);

uploadApi.uploadFile(fileToUpload)
    .on('progress', (progress) => {
        console.log( 'Total :' + progress.total );
        console.log( 'Loaded :' + progress.loaded );
        console.log( 'Percent :' + progress.percent );
    })
    .on('success', () => {
        console.log( 'Your File is uploaded');
    })
    .on('abort', () => {
        console.log( 'Upload Aborted');
    })
    .on('error', () => {
        console.log( 'Error during the upload');
    })
    .on('unauthorized', () => {
        console.log('You are unauthorized');
    })
```

## Delete a Node

```javascript
NodesApi.deleteNode(fileOrFolderId, opts)
```

Delete File/Folder with the identifier nodeId, if the nodeId is a folder, then its children are also deleted.
Deleted nodes are moved to the trash bin, and it is still possible to recover them.

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const fileOrFolderId = '80a94ac8-3ece-47ad-864e-5d939424c47c';
const nodesApi = new NodesApi(alfrescoApi);

nodesApi.deleteNode(fileOrFolderId).then(
    (data) => {
        console.log('The file/folder is deleted');
    }, 
    (error) => {
        console.log('This node does not exist');
    });
```

### Delete a Node Permanently

```javascript
NodesApi.deleteNode(fileOrFolderId, { permanent: true })
```

Delete File/Folder with the identifier nodeId, if the nodeId is a folder, then its children are also deleted.
It will not be possible to recover the files after this call.

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const fileOrFolderId = '80a94ac8-3ece-47ad-864e-5d939424c47c';
const nodesApi = new NodesApi(alfrescoApi);

nodesApi.deleteNode(fileOrFolderId, { permanent: true }).then(
    (data) => {
        console.log('The file/folder is deleted');
    }, 
    (error) => {
        console.log('This node does not exist');
    });
```

## Get Thumbnail Url

```javascript
ContentApi.getDocumentThumbnailUrl(documentId)
```

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const contentApi = new ContentApi(alfrescoApi);

const thumbnailUrl = contentApi.getDocumentThumbnailUrl('1a0b110f-1e09-4ca2-b367-fe25e4964a4');
```

## Get Preview Url

```javascript
ContentApi.getDocumentPreviewUrl(documentId)
```

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const contentApi = new ContentApi(alfrescoApi);

const previewUrl = contentApi.getDocumentPreviewUrl('1a0b110f-1e09-4ca2-b367-fe25e4964a4');
```

## Get Content Url

```javascript
ContentApi.getContentUrl(documentId)
```

**Example**

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const contentApi = new ContentApi(alfrescoApi);

const contentUrl = contentApi.getContentUrl('1a0b110f-1e09-4ca2-b367-fe25e4964a4');
```

## Custom WebScript Calls

For mor information about web scripts read the [Wiki](https://wiki.alfresco.com/wiki/Web_Scripts) and the [Wiki with Web ScriptsExamples](https://wiki.alfresco.com/wiki/Web_Scripts_Examples)

```javascript
executeWebScript(httpMethod, scriptPath, scriptArgs, contextRoot, servicePath, postBody)
```

Anatomy of a Web Script URI: 

```text
http(s)://(host):(port)/(contextPath)/(servicePath)/(scriptPath)?(scriptArgs)
```

A Web Script is simply a service bound to a URI which responds to HTTP methods such as GET, POST, PUT and DELETE.
While using the same underlying code, there are broadly two kinds of Web Scripts.

**Parameters**

| Name            | Description                                                     |
|-----------------|-----------------------------------------------------------------|
| **httpMethod**  | possible value GET, POST, PUT and DELETE                        |
| **scriptPath**  | path to Web Script (as defined by Web Script)                   |
| **scriptArgs**  | arguments to pass to Web Script                                 |
| **contextRoot** | path where application is deployed default value 'alfresco'     |
| **servicePath** | path where Web Script service is mapped default value 'service' |
| **postBody**    | post body                                                       |

```javascript
const alfrescoApi = new AlfrescoApi(/*...*/);
const webscriptApi = new WebscriptApi(alfrescoApi);

// Call a GET on a Web Scripts available at the following URIs: http://127.0.01:8080/alfresco/service/mytasks

webscriptApi.executeWebScript('GET', 'mytasks').then( 
    (data) => {
        console.log('Data received form http://127.0.01:8080/alfresco/service/mytasks' + data);
    },  
    (error) => {   
        console.log('Error' + error);
    });

// Call a GET on a Web Scripts available at the following URIs: http://127.0.01:8080/share/service/mytasks

webscriptApi.executeWebScript('GET', 'mytasks', null, 'share').then( 
    (data)=> {
        console.log('Data received form http://127.0.01:8080/share/service/mytasks' + data);
    },  
    (error)=> {
        console.log('Error' + error);
    });

// Call a GET on a Web Scripts available at the following URIs: http://127.0.01:8080/share/differentServiceSlug/mytasks

webscriptApi.executeWebScript('GET', 'mytasks', null, 'share', 'differentServiceSlug').then( 
    (data)=> {
        console.log('Data received form http://127.0.01:8080/share/differentServiceSlug/mytasks' + data);
    },  
    (error) => {
        console.log('Error' + error);
    });
```
