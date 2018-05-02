---
Added: v2.0.0
Status: Active
Last reviewed: 2018-04-13
---

# Alfresco Api Service

Provides access to an initialized **AlfrescoJSApi** instance.

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

## Class members

### Methods

-   `getInstance(): AlfrescoApi`<br/>

    -   **Returns** `AlfrescoApi` - 

-   `load(): Promise<void>`<br/>

    -   **Returns** `Promise<void>` - 

-   `reset(): Promise<void>`<br/>

    -   **Returns** `Promise<void>` -

## Details

**Note for developers**: The TypeScript declaration files for the Alfresco JS API
are still under development and some Alfresco APIs may not be accessible
via your IDE's intellisense or TypeScript compiler. 
To avoid these TypeScript type check errors, you can call any supported 
Alfresco JS api by casting the instance to the `any` type as in the following example:

```ts
let api: any = this.apiService.getInstance();
api.nodes.addNode('-root-', body, {});
```
