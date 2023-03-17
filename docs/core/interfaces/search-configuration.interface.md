---
Title: Search Configuration interface
Added: v2.1.0
Status: Active
---

# [Search Configuration interface](../../../lib/content-services/src/lib/common/interfaces/search-configuration.interface.ts "Defined in search-configuration.interface.ts")

Provides fine control of parameters to a search.

## Methods

`generateQueryBody(searchTerm: string, maxResults: string, skipCount: string): QueryBody`<br/>
Generates a QueryBody object with custom search parameters.

## Details

The interface defines a service that generates a custom
[QueryBody](https://github.com/Alfresco/alfresco-js-api/blob/1.6.0/src/alfresco-search-rest-api/docs/QueryBody.md)
object. This object can then be supplied to a search operation to refine the search parameters.

A standard implementation, the
[Search Configuration service](../services/search-configuration.service.md) is provided in the ADF Core library
source. This works fine in most cases but if you need to, you can implement your own service, as
described below.

### How to use the interface

1.  Implement the service class

    Create your own service class to implement the [`SearchConfigurationInterface`](../../core/interfaces/search-configuration.interface.md). This defines the
    the `generateQueryBody` method that returns the QueryBody object. See the
    [QueryBody](https://github.com/Alfresco/alfresco-js-api/blob/1.6.0/src/alfresco-search-rest-api/docs/QueryBody.md)
    page in the Alfresco JS API for further details about the options this object provides.

    An example implementation is given below:

    ```ts
    import { QueryBody } from '@alfresco/js-api';
    import { SearchConfigurationInterface } from '@alfresco/adf-core';

    export class TestSearchConfigurationService implements SearchConfigurationInterface {

        constructor() {
        }

        public generateQueryBody(searchTerm: string, maxResults: string, skipCount: string): QueryBody {
            const defaultQueryBody: QueryBody = {
                query: {
                    query: searchTerm ? `${searchTerm}* OR name:${searchTerm}*` : searchTerm
                },
                include: ['path', 'allowableOperations'],
                paging: {
                    maxItems: maxResults,
                    skipCount: skipCount
                },
                filterQueries: [
                    { query: "TYPE:'cm:folder'" },
                    { query: 'NOT cm:creator:System' }]
            };

            return defaultQueryBody;
        }
    }
    ```

2.  Provide your service class to the module

    Once you have created your service class, you must inform the component to use it instead
    of the default one. This is easily done using the component providers:

    ```ts
        import { SearchService, SearchConfigurationService } from '@alfresco/adf-core';
        import { TestSearchConfigurationService } from './search-config-test.service';

        @Component({
            selector: 'app-search-extended-component',
            templateUrl: './search-extended.component.html',
            styleUrls: ['./search-extended.component.scss'],
            encapsulation: ViewEncapsulation.None,
            providers: [
                { provide: SearchConfigurationService, useClass: TestSearchConfigurationService },
                SearchService
            ]
        })
    ```

    You also need to add the [`SearchService`](../../core/services/search.service.md) as a provider to avoid overriding the module instance. This component will have his own instance of the [`SearchService`](../../core/services/search.service.md) that will use the class you have provided
    as its configuration.

## See also

-   [Search component](../../content-services/components/search.component.md)
-   [Search configuration service](../services/search-configuration.service.md)
