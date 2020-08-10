---
Title: Process name pipe
Added: v3.9.0
Status: Active
Last reviewed: 2020-06-02
---

# [Process name pipe](../../../lib/process-services/src/lib/pipes/process-name.pipe.ts "Defined in process-name.pipe.ts")

When an identifier is specified, the input will be transformed replacing the identifiers with the values of the selected process definition provided.

## Basic Usage

processNamePipe.transform('Example - %{processDefinition} - %{datetime}', new ProcessDefinitionRepresentation({ name: 'upload-passport'}));

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| processNameFormat | string | undefined | The process name format including the preferred identifiers to be used |
| selectedProcessDefinition | [`ProcessDefinitionRepresentation`](https://github.com/Alfresco/alfresco-js-api/blob/develop/src/api/activiti-rest-api/docs/ProcessDefinitionRepresentation.md) | undefined | (optional) The selected process definition |

## Details

The pipe offers a convenient way to format a process name using a process name format template.

The supported identifiers that can be used in the process name format are the following:

-   %{processDefinition}
-   %{datetime}

When the %{processDefinition} identifier is used, the selected process definition provided
will be added and positioned in the same place as the identifier.

When the %{datetime} identifier is used, the current datetime will be added and positioned in the same place as the identifier.

Important Notes:

-   All the identifiers are case-insensitive.
-   The identifiers can be used in any position (beginning, middle, end, custom).
-   The identifiers can NOT be used more than once each in the same processNameFormat (The second occurrence of each identifier will be ignored
    and handled as a plain string).

#### Result

```ts
processNamePipe.transform('Example - %{processDefinition} - %{datetime}', new ProcessDefinitionRepresentation({ name: 'upload-passport'}));
//Returns 'Example - upload passport - June 02, 2020, 12:00:00 AM'
```
