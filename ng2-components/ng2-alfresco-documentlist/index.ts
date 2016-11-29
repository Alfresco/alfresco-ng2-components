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
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';

import { DocumentList } from './src/components/document-list';
import { ContentColumn } from './src/components/content-column';
import { ContentColumnList } from './src/components/content-column-list';
import { ContentAction } from './src/components/content-action';
import { ContentActionList } from './src/components/content-action-list';
import { EmptyFolderContent } from './src/components/empty-folder-content';
import { DocumentListBreadcrumb } from './src/components/breadcrumb/breadcrumb.component';

import { FolderActionsService } from './src/services/folder-actions.service';
import { DocumentActionsService } from './src/services/document-actions.service';
import { DocumentListService } from './src/services/document-list.service';

// components
export * from './src/components/document-list';
export * from './src/components/content-column';
export * from './src/components/content-column-list';
export * from './src/components/content-action';
export * from './src/components/content-action-list';
export * from './src/components/empty-folder-content';
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

export const DOCUMENT_LIST_DIRECTIVES: any[] = [
    DocumentList,
    ContentColumn,
    ContentColumnList,
    ContentAction,
    ContentActionList,
    EmptyFolderContent,
    DocumentListBreadcrumb
];

export const DOCUMENT_LIST_PROVIDERS: any[] = [
    DocumentListService,
    FolderActionsService,
    DocumentActionsService
];

@NgModule({
    imports: [
        CoreModule,
        DataTableModule
    ],
    declarations: [
        ...DOCUMENT_LIST_DIRECTIVES
    ],
    providers: [
        ...DOCUMENT_LIST_PROVIDERS
    ],
    exports: [
        DataTableModule,
        ...DOCUMENT_LIST_DIRECTIVES
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
