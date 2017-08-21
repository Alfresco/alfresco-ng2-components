/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, SearchService, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { DocumentListModule } from 'ng2-alfresco-documentlist';
import { SearchAutocompleteComponent } from './src/components/search-autocomplete.component';
import { SearchControlComponent } from './src/components/search-control.component';
import { SearchComponent } from './src/components/search.component';

// services
export { SearchOptions, SearchService } from 'ng2-alfresco-core';
export * from './src/components/search.component';
export * from './src/components/search-control.component';
export * from './src/components/search-autocomplete.component';

// Old Deprecated export
import { SearchService as AlfrescoSearchService } from 'ng2-alfresco-core';
import { SearchAutocompleteComponent as AlfrescoSearchAutocompleteComponent } from './src/components/search-autocomplete.component';
import { SearchControlComponent as AlfrescoSearchControlComponent } from './src/components/search-control.component';
import { SearchComponent as AlfrescoSearchComponent } from './src/components/search.component';
export { SearchService as AlfrescoSearchService } from 'ng2-alfresco-core';
export { SearchComponent as AlfrescoSearchComponent } from './src/components/search.component';
export { SearchControlComponent as AlfrescoSearchControlComponent } from './src/components/search-control.component';
export { SearchAutocompleteComponent as AlfrescoSearchAutocompleteComponent } from './src/components/search-autocomplete.component';

export const ALFRESCO_SEARCH_DIRECTIVES: [any] = [
    SearchComponent,
    SearchControlComponent,
    SearchAutocompleteComponent,

    // Old Deprecated export
    AlfrescoSearchComponent,
    AlfrescoSearchControlComponent,
    AlfrescoSearchAutocompleteComponent
];

export const ALFRESCO_SEARCH_PROVIDERS: [any] = [
    SearchService,

    // Old Deprecated export
    AlfrescoSearchService
];

@NgModule({
    imports: [
        DocumentListModule.forRoot(),
        CoreModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        ...ALFRESCO_SEARCH_DIRECTIVES
    ],
    providers: [
        ...ALFRESCO_SEARCH_PROVIDERS,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-search',
                source: 'assets/ng2-alfresco-search'
            }
        }
    ],
    exports: [
        ...ALFRESCO_SEARCH_DIRECTIVES
    ]
})
export class SearchModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SearchModule,
            providers: [
                ...ALFRESCO_SEARCH_PROVIDERS
            ]
        };
    }
}
