# Filter model

Contains classes related to filters in Process Services.

## Details

You can find more information about the usage of these classes in the
[APS Rest API docs](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api)
and in various ADF docs (see the [See Also](#see-also) section for links).

```ts
class AppDefinitionRepresentationModel {
    defaultAppId: string;
    deploymentId: string;
    name: string;
    description: string;
    theme: string;
    icon: string;
    id: number;
    modelId: number;
    tenantId: number;
}

class FilterParamsModel {
    id: string;
    name: string;
    index: number;
}

class FilterRepresentationModel implements UserTaskFilterRepresentation {
    id: number;
    appId: number;
    name: string;
    recent: boolean;
    icon: string;
    filter: FilterParamRepresentationModel;
    index: number;
}

class FilterParamRepresentationModel {
    processDefinitionId: string;
    processDefinitionKey: string;
    name: string;
    state: string;
    sort: string;
    assignment: string;
    dueAfter: Date;
    dueBefore: Date;
}

class TaskQueryRequestRepresentationModel implements TaskQueryRequestRepresentation {
    appDefinitionId: string;
    processInstanceId: string;
    processDefinitionId: string;
    text: string;
    assignment: string;
    state: string;
    start: string;
    sort: string;
    page: number;
    size: number;
}
```

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Process filters component](process-filters.component.md)
- [Task filters component](task-filters.component.md)
- [Apps process service](apps-process.service.md)
<!-- seealso end -->