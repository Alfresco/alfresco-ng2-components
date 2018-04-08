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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableModule, PaginationModule, ToolbarModule } from '@alfresco/adf-core';

import { MaterialModule } from '../material.module';
import { UploadModule } from '../upload/upload.module';

import { ContentActionListComponent } from './components/content-action/content-action-list.component';
import { ContentActionComponent } from './components/content-action/content-action.component';
import { ContentColumnListComponent } from './components/content-column/content-column-list.component';
import { ContentColumnComponent } from './components/content-column/content-column.component';
import { DocumentListComponent } from './components/document-list.component';

import { EmptyFolderContentDirective } from './components/empty-folder/empty-folder-content.directive';
import { NoPermissionContentDirective } from './components/no-permission/no-permission-content.directive';

import { DocumentActionsService } from './services/document-actions.service';
import { DocumentListService } from './services/document-list.service';
import { FolderActionsService } from './services/folder-actions.service';
import { NodeActionsService } from './services/node-actions.service';
import { CustomResourcesService } from './services/custom-resources.service';

@NgModule({
    imports: [
        ToolbarModule,
        CommonModule,
        DataTableModule,
        FlexLayoutModule,
        MaterialModule,
        UploadModule,
        TranslateModule,
        PaginationModule
    ],
    declarations: [
        DocumentListComponent,
        ContentColumnComponent,
        ContentColumnListComponent,
        ContentActionComponent,
        ContentActionListComponent,
        EmptyFolderContentDirective,
        NoPermissionContentDirective
    ],
    providers: [
        DocumentListService,
        FolderActionsService,
        DocumentActionsService,
        NodeActionsService,
        CustomResourcesService
    ],
    exports: [
        DocumentListComponent,
        ContentColumnComponent,
        ContentColumnListComponent,
        ContentActionComponent,
        ContentActionListComponent,
        EmptyFolderContentDirective,
        NoPermissionContentDirective
    ]
})
export class DocumentListModule {}
