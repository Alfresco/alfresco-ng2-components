---
Added: v2.0.0
Status: Active
---
# Alfresco Api Service

Provides access to initialized **AlfrescoJSApi** instance.

## Basic Usage

```ts
export class MyComponent implements OnInit {

    constructor(private apiService: AlfrescoApiService) {   
    }

    ngOnInit() {
        let nodeId = 'some-node-id';
        let params = {};
        this.apiService.getInstance().nodes
            .getNodeChildren(nodeId, params)
            .then(result => console.log(result));
    }
}
```

## Events

| Name | Type | Description |
| --- | --- | --- |
| nodeUpdated | `Subject<MinimalNodeEntryEntity>` | Publish/subscribe to events related to node updates. |

## Details

**Note for developers**: _the TypeScript declaration files for Alfresco JS API
are still under development and some Alfresco APIs may not be accessed
via your favourite IDE's intellisense or TypeScript compiler. 
In case of any TypeScript type check errors you can still call any supported 
Alfresco JS api by casting the instance to `any` type like the following:_

```ts
let api: any = this.apiService.getInstance();
api.nodes.addNode('-root-', body, {});
```
