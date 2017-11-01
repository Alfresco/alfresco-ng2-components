# Comment Process model

Represents a comment added to a Process Services task or process instance.

## Details

Instances of this class are returned by the methods of the
[Comment Process service](comment-process.service.md). See the Comments API
methods in the
[Alfresco JS API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api)
for more information.

```ts
class CommentProcessModel implements CommentRepresentation {
    id: number;
    message: string;
    created: Date;
    createdBy: LightUserRepresentation;
}
```

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Comment process service](comment-process.service.md)
<!-- seealso end -->