# Site model

Provides information about a site in a Content Services repository.

## Details

`SiteModel` is returned by methods from the [Sites Api service](sites.service.md).
Also, the
[`getSite`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitesApi.md#getSite)
and
[`getSites`](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/SitesApi.md#getSites) pages in the Alfresco JS API docs have further information about this API.

```ts
class SiteModel {
    role: string;
    visibility: string;
    guid: string;
    description: string;
    id: string;
    preset: string;
    title: string;
    contents: SiteContentsModel[] = [];
    members: SiteMembersModel[] = [];
    pagination: Pagination;
}

class SiteContentsModel {
    id: string;
    folderId: string;
}

class SiteMembersModel {
    role: string;
    firstName: string;
    emailNotificationsEnabled: boolean = false;
    company: any;
    id: string;
    enable: boolean = false;
    email: string;
}
```

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Sites api service](sites.service.md)
<!-- seealso end -->