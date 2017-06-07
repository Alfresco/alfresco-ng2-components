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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { MdMenuModule, MdButtonModule, MdIconModule } from '@angular/material';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

import { DocumentListComponent } from './src/components/document-list.component';
import { ContentColumnComponent } from './src/components/content-column/content-column.component';
import { ContentColumnListComponent } from './src/components/content-column/content-column-list.component';
import { ContentActionComponent } from './src/components/content-action/content-action.component';
import { ContentActionListComponent } from './src/components/content-action/content-action-list.component';
import { EmptyFolderContentComponent } from './src/components/empty-folder/empty-folder-content.component';
import { DocumentListBreadcrumbComponent } from './src/components/breadcrumb/breadcrumb.component';

import { FolderActionsService } from './src/services/folder-actions.service';
import { DocumentActionsService } from './src/services/document-actions.service';
import { DocumentListService } from './src/services/document-list.service';

// components
export * from './src/components/document-list.component';
export * from './src/components/node.event';
export * from './src/components/content-column/content-column.component';
export * from './src/components/content-column/content-column-list.component';
export * from './src/components/content-action/content-action.component';
export * from './src/components/content-action/content-action-list.component';
export * from './src/components/empty-folder/empty-folder-content.component';
export * from './src/components/breadcrumb/breadcrumb.component';

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

export const DOCUMENT_LIST_DIRECTIVES: any[] = [
    DocumentListComponent,
    ContentColumnComponent,
    ContentColumnListComponent,
    ContentActionComponent,
    ContentActionListComponent,
    EmptyFolderContentComponent,
    DocumentListBreadcrumbComponent
];

export const DOCUMENT_LIST_PROVIDERS: any[] = [
    DocumentListService,
    FolderActionsService,
    DocumentActionsService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule,
        MdMenuModule,
        MdButtonModule,
        MdIconModule
    ],
    declarations: [
        ...DOCUMENT_LIST_DIRECTIVES
    ],
    providers: [
        ...DOCUMENT_LIST_PROVIDERS
    ],
    exports: [
        DataTableModule,
        ...DOCUMENT_LIST_DIRECTIVES,
        MdMenuModule,
        MdButtonModule,
        MdIconModule
    ]
})
export class DocumentListModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DocumentListModule,
            providers: [
                ...DOCUMENT_LIST_PROVIDERS
            ]
        };
    }
}
