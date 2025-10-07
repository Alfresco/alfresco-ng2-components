# DataSourcesApi

All URIs are relative to */activiti-app/api*

| Method                            | HTTP request                            | Description      |
|-----------------------------------|-----------------------------------------|------------------|
| [getDataSources](#getDataSources) | **GET** /enterprise/editor/data-sources | Get data sources |

# getDataSources

Get data sources

**Parameters**

| Name     | Type   |
|----------|--------|
| tenantId | number |

**Return type**: [ResultListDataRepresentationDataSourceRepresentation](#ResultListDataRepresentationDataSourceRepresentation)

**Example**

```javascript
import { AlfrescoApi, DataSourcesApi } from '@alfresco/js-api';

const alfrescoApi = new AlfrescoApi(/*..*/);
const dataSourcesApi = new DataSourcesApi(alfrescoApi);

const opts = {
    tenantId: 789
};

datasourcesApi.getDataSources(opts).then((data) => {
    console.log('API called successfully. Returned data: ' + data);
});
```

# Models

## ResultListDataRepresentationDataSourceRepresentation

**Properties**

| Name  | Type                                                    |
|-------|---------------------------------------------------------|
| data  | [DataSourceRepresentation[]](#DataSourceRepresentation) |
| size  | number                                                  |
| start | number                                                  |
| total | number                                                  |

## DataSourceRepresentation

**Properties**

| Name     | Type                                                              |
|----------|-------------------------------------------------------------------|
| config   | [DataSourceConfigRepresentation](#DataSourceConfigRepresentation) |
| id       | number                                                            |
| name     | string                                                            |
| tenantId | number                                                            |

## DataSourceConfigRepresentation

**Properties**

| Name        | Type   |
|-------------|--------|
| driverClass | string |
| jdbcUrl     | string |
| password    | string |
| username    | string |




