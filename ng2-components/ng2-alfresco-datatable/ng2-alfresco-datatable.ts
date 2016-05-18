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

import { DataTableComponent } from './src/components/datatable.component';
import { DataColumnComponent } from './src/components/data-column.component';
import { DataColumnListComponent } from './src/components/data-column-list.component';
import { DataActionComponent } from './src/components/data-action.component';
import { DataActionListComponent } from './src/components/data-action-list.component';

import { FolderActionsService } from './src/services/folder-actions.service';
import { DocumentActionsService } from './src/services/document-actions.service';
import { AlfrescoService } from './src/services/alfresco.service';

// components
export * from './src/components/datatable.component';
export * from './src/components/data-column.component';
export * from './src/components/data-column-list.component';
export * from './src/components/data-action.component';
export * from './src/components/data-action-list.component';

// models
export * from './src/models/data-action.model';
export * from './src/models/data-column.model';
export * from './src/models/column-sorting.model';

// services
export * from './src/services/folder-actions.service';
export * from './src/services/document-actions.service';
export * from './src/services/alfresco.service';


export const ALFRESCO_DATATABLE_DIRECTIVES: [any] = [
    DataTableComponent,
    DataColumnComponent,
    DataColumnListComponent,
    DataActionComponent,
    DataActionListComponent
];

export const ALFRESCO_DATATABLE_PROVIDERS: [any] = [
    AlfrescoService,
    FolderActionsService,
    DocumentActionsService
];
