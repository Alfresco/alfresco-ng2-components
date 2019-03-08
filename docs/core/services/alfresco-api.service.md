---
Title: Alfresco Api Service
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-17
---

# [Alfresco Api Service](../../../lib/core/services/alfresco-api.service.ts "Defined in alfresco-api.service.ts")

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

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| contentApi | [`ContentApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/content.api.ts) |  | (Read only) Accesses the Content API |
| nodesApi | [`NodesApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/nodes.api.ts) |  | (Read only) Accesses the Nodes API |
| renditionsApi | [`RenditionsApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/renditions.api.ts) |  | (Read only) Accesses the Renditions API |
| sharedLinksApi | `SharedLinksApi` |  | (Read only) Accesses the Shared Links API |
| sitesApi | [`SitesApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/sites.api.ts) |  | (Read only) Accesses the Sites API |
| favoritesApi | [`FavoritesApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/favorites.api.ts) |  | (Read only) Accesses the Favorites API |
| peopleApi | [`PeopleApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/people.api.ts) |  | (Read only) Accesses the People API |
| searchApi | [`SearchApi`](../../../node_modules/@alfresco/js-api/src/api/search-rest-api/api/search.api.ts) |  | (Read only) Accesses the [Search](../../../node_modules/@alfresco/js-api/src/api-legacy/legacy.ts) API |
| versionsApi | [`VersionsApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/versions.api.ts) |  | (Read only) Accesses the Versions API |
| classesApi | [`ClassesApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/classes.api.ts) |  | (Read only) Accesses the Classes API |
| groupsApi | [`GroupsApi`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/api/groups.api.ts) |  | (Read only) Accesses the Groups API |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| nodeUpdated | [`Subject`](http://reactivex.io/documentation/subject.html)`<`[`Node`](../../../node_modules/@alfresco/js-api/src/api/content-rest-api/model/node.ts)`>` | Emitted when a node updates. |

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
