# Bpm User model

Contains information about a Process Services user.

## Details

Instances of this class are returned by the methods of the
[Bpm User service](bpm-user.service.md). It implements the
`UserRepresentation` interface, which is defined in the
[Alfresco JS API]h(ttps://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-activiti-rest-api/docs/UserRepresentation.md).

```ts
class BpmUserModel implements UserRepresentation {
    apps: any;
    capabilities: string[];
    company: string;
    created: Date;
    email: string;
    externalId: string;
    firstName: string;
    lastName: string;
    fullname: string;
    fullNameDisplay: string;
    groups: any;
    id: string;
    lastUpdate: Date;
    latestSyncTimeStamp: Date;
    password: string;
    pictureId: number;
    status: string;
    tenantId: number;
    tenantName: string;
    tenantPictureId: number;
    type: string;
}
```

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Bpm user service](bpm-user.service.md)
- [Ecm user model](ecm-user.model.md)
- [People process service](people-process.service.md)
<!-- seealso end -->