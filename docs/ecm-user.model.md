# Ecm User model

Contains information about a Content Services user.

## Details

Instances of this class are returned by the methods of the
[Ecm User service](ecm-user.service.md). It implements the `Person`
interface, which is defined in the
[Alfresco JS API](https://github.com/Alfresco/alfresco-js-api/blob/master/src/alfresco-core-rest-api/docs/Person.md).

```ts
class EcmUserModel implements Person {
    id: string;
    firstName: string;
    lastName: string;
    fullNameDisplay: string;
    description: string;
    avatarId: string;
    email: string;
    skypeId: string;
    googleId: string;
    instantMessageId: string;
    jobTitle: string;
    location: string;
    company: EcmCompanyModel;
    mobile: string;
    telephone: string;
    statusUpdatedAt: Date;
    userStatus: string;
    enabled: boolean;
    emailNotificationsEnabled: boolean;
}
```

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Ecm user service](ecm-user.service.md)
- [People content service](people-content.service.md)
- [Bpm user model](bpm-user.model.md)
<!-- seealso end -->