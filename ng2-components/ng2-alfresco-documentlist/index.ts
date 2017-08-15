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

import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

import { BreadcrumbComponent } from './src/components/breadcrumb/breadcrumb.component';
import { DropdownBreadcrumbComponent } from './src/components/breadcrumb/dropdown-breadcrumb.component';
import { ContentActionListComponent } from './src/components/content-action/content-action-list.component';
import { ContentActionComponent } from './src/components/content-action/content-action.component';
import { ContentColumnListComponent } from './src/components/content-column/content-column-list.component';
import { ContentColumnComponent } from './src/components/content-column/content-column.component';
import { ContentNodeSelectorComponent } from './src/components/content-node-selector/content-node-selector.component';
import { DocumentListComponent } from './src/components/document-list.component';
import { EmptyFolderContentDirective } from './src/components/empty-folder/empty-folder-content.directive';
import { DropdownSitesComponent } from './src/components/site-dropdown/sites-dropdown.component';
import { MaterialModule } from './src/material.module';

import { DocumentActionsService } from './src/services/document-actions.service';
import { DocumentListService } from './src/services/document-list.service';
import { FolderActionsService } from './src/services/folder-actions.service';
import { NodeActionsService } from './src/services/node-actions.service';

// components
export * from './src/components/document-list.component';
export * from './src/components/node.event';
export * from './src/components/content-column/content-column.component';
export * from './src/components/content-column/content-column-list.component';
export * from './src/components/content-action/content-action.component';
export * from './src/components/content-action/content-action-list.component';
export * from './src/components/empty-folder/empty-folder-content.directive';
export * from './src/components/breadcrumb/breadcrumb.component';
export * from './src/components/site-dropdown/sites-dropdown.component';

// data
export * from './src/data/share-datatable-adapter';

// services
export * from './src/services/folder-actions.service';
export * from './src/services/document-actions.service';
export * from './src/services/document-list.service';

// models
export * from './src/models/content-action.model';
export * from './src/models/document-library.model';
export * from './src/models/permissions.model';
export * from './src/models/permissions-style.model';
export * from './src/models/permissions-style.model';

export const DOCUMENT_LIST_DIRECTIVES: any[] = [
    DocumentListComponent,
    ContentColumnComponent,
    ContentColumnListComponent,
    ContentActionComponent,
    ContentActionListComponent,
    EmptyFolderContentDirective,
    BreadcrumbComponent,
    DropdownSitesComponent,
    DropdownBreadcrumbComponent,
    ContentNodeSelectorComponent
];

export const DOCUMENT_LIST_PROVIDERS: any[] = [
    DocumentListService,
    FolderActionsService,
    DocumentActionsService,
    NodeActionsService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        MaterialModule
    ],
    declarations: [
        ...DOCUMENT_LIST_DIRECTIVES
    ],
    providers: [
        ...DOCUMENT_LIST_PROVIDERS,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-documentlist',
                source: 'assets/ng2-alfresco-documentlist'
            }
        }
    ],
    entryComponents: [
        ContentNodeSelectorComponent
    ],
    exports: [
        DataTableModule,
        ...DOCUMENT_LIST_DIRECTIVES,
        MaterialModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class DocumentListModule {
    /** @deprecated in 1.8.0 */
    static forRoot(): ModuleWithProviders {
        console.log('DocumentListModule.forRoot is deprecated and will be removed in future versions');
        return {
            ngModule: DocumentListModule,
            providers: [
                ...DOCUMENT_LIST_PROVIDERS
            ]
        };
    }
}
