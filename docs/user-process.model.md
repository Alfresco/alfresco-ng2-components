# User Process model

Represents a Process Services user.

## Details

This class contains basic information about a Process Services user and
is used throughout ADF to identify and list users (eg, to assign them to
a task or to list them in search results).

```ts
class UserProcessModel implements LightUserRepresentation {
    id?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    pictureId?: number = null;
}
```

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [People process service](people-process.service.md)
<!-- seealso end -->