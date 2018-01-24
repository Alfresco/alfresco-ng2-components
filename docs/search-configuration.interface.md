# Search Configuration interface

Provides fine control of parameters to a search.

## Methods

`generateQueryBody(searchTerm: string, maxResults: string, skipCount: string): QueryBody`<br/>
Generates a QueryBody object with custom search parameters.

## Details

The interface defines a service that generates a custom
[QueryBody](https://github.com/Alfresco/alfresco-js-api/blob/1.6.0/src/alfresco-search-rest-api/docs/QueryBody.md)
object. This object can then be supplied to a search operation to refine the search parameters.

### How to use the interface

1.  Implement the service class

    Create your own service class to implement the SearchConfigurationInterface. This defines the
    the `generateQueryBody` method that returns the QueryBody object. See the
    [QueryBody](https://github.com/Alfresco/alfresco-js-api/blob/1.6.0/src/alfresco-search-rest-api/docs/QueryBody.md)
    page in the Alfresco JS API for further details about the options this object provides.

    A standard implementation called `SearchConfigurationService` is provided in the ADF Core library
    source. This can be used in its own right or adapted to your specific needs.

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

    You also need to add the SearchService as a provider to avoid overriding the module instance. This component will have his own instance of the SearchService that will use the class you have provided
    as its configuration.

## See also

-   [Search component](search.component.md)
