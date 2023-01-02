---
Title: APS Alfresco Content Service
Added: v2.0.0
Status: Active
---

# [APS Alfresco Content Service](../../../lib/process-services/src/lib/form/services/activiti-alfresco.service.ts "Defined in activiti-alfresco.service.ts")

Gets Alfresco Repository folder content based on a Repository account configured in Alfresco Process Services (APS).

It is possible to configure multiple Alfresco Repository accounts in APS (i.e. multiple Alfresco Servers).
This service can also be used to link Alfresco content as related content in APS. 
Content such as documents and other files can be attached to Process Instances 
and Task Instances as related content.

**Note:** At the moment you must provide the `ActivitiAlfrescoContentService` class from your `NgModule` for it to work:

```ts
@NgModule({
...
  providers: [ActivitiAlfrescoContentService] 
})
```

And also import it in the way shown below.

## Importing

```ts
import { ActivitiAlfrescoContentService } from '@alfresco/adf-core';

export class SomePageComponent implements OnInit {

 constructor(private contentService: ActivitiAlfrescoContentService) {
   }
```

## Methods

#### `getAlfrescoNodes(accountId: string, folderId: string): Observable<ExternalContent>`

Get all the nodes under passed in folder node ID (e.g. 3062d73b-fe47-4040-89d2-79efae63869c) for passed in 
Alfresco Repository account ID as configured in APS: 

```ts
export class SomePageComponent implements OnInit {
 
  ngOnInit() {
    const alfRepoAccountId = 'alfresco-2';
    const folderNodeId = '3062d73b-fe47-4040-89d2-79efae63869c';
    this.contentService.getAlfrescoNodes(alfRepoAccountId, folderNodeId).subscribe( nodes => {
      console.log('Nodes: ', nodes);
      }, error => {
        console.log('Error: ', error);
      });
  }
```

In the above sample code the `alfRepoAccountId` points to an Alfresco Repository configuration in APS with ID `alfresco-2`.
The `folderNodeId` needs to identify a folder node ID in the Alfresco Repository identified by the `alfRepoAccountId`.

The response contained in `nodes` is an array with properties for each object like in this sample:

    0:
        folder: false
        id: "2223d3c2-0709-4dd7-a79b-c45571901889;1.0"
        simpleType: "pdf"
        title: "JLAN_Server_Installation_Guide.pdf"
    1:
        folder: false
        id: "900b4dc0-bfdc-4ec1-84dd-5f1f0a420066;1.0"
        simpleType: "image"
        title: "Screen Shot 2017-09-21 at 15.44.23.png"
        
    2:
        folder: true
        id: "f7010382-7b4e-4a78-bb94-9de092439230"
        simpleType: "folder"
        title: "Event More Stuff"

#### `linkAlfrescoNode(accountId: string, node: ExternalContent, siteId: string): Observable<ExternalContentLink>`

Link Alfresco content as related content in APS by passing in Alfresco node identifying the content, the Share site
that contains the content, and the Alfresco Repository account ID as configured in APS:

```ts
export class SomePageComponent implements OnInit {
 
  ngOnInit() {
    const alfRepoAccountId = 'alfresco-2';
    const siteId = 'sample-workspace'; 
    const externalContentNode = {
      id: 'da196918-1324-4e97-9d26-d28f1837a0b6',
      simpleType: 'content',
      title: 'simple.txt',
      folder: false
    }
    this.contentService.linkAlfrescoNode(alfRepoAccountId, externalContentNode, siteId).subscribe(link => {
        console.log('Link: ', link);
     }, error => {
        console.log('Error: ', error);
     });
  }
```

In the above sample code the `alfRepoAccountId` points to an Alfresco Repository configuration in APS with ID `alfresco-2`.
The `siteId` identifies an Alfresco Share site in the Alfresco Repository where the content to be linked resides.
You can get the ID for a Share site from the URL: `http://localhost:8080/share/page/site/<siteId>`.
The `externalContentNode` identifies the content that should be set up as temporary related content in APS. The 
`externalContentNode.id` points to an Alfresco node in the Share site specified with `siteId`.

The response contained in `link` looks like in this sample:

    link:
        contentAvailable: true
        created: Tue Nov 07 2017 13:18:48 GMT+0000 (GMT) {}
        createdBy: {id: 1, firstName: null, lastName: "Administrator", email: "admin@app.activiti.com"}
        id: 6006
        link:true
        mimeType: null
        name: "simple.txt"
        previewStatus: "queued"
        relatedContent: false
        simpleType: "content"
        source: "alfresco-2"
        sourceId: "da196918-1324-4e97-9d26-d28f1837a0b6@sample-workspace"
        thumbnailStatus: "queued"
