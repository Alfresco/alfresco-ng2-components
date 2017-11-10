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
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';

import { DataTableModule, PaginationModule } from '@adf/core';
import { TRANSLATION_PROVIDER } from '@adf/core';
import { UploadModule } from '../upload';

import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { DropdownBreadcrumbComponent } from './components/breadcrumb/dropdown-breadcrumb.component';
import { ContentActionListComponent } from './components/content-action/content-action-list.component';
import { ContentActionComponent } from './components/content-action/content-action.component';
import { ContentColumnListComponent } from './components/content-column/content-column-list.component';
import { ContentColumnComponent } from './components/content-column/content-column.component';
import { ContentNodeSelectorComponent } from './components/content-node-selector/content-node-selector.component';
import { DocumentListComponent } from './components/document-list.component';
import { DropdownSitesComponent } from './components/site-dropdown/sites-dropdown.component';
import { VersionListComponent } from './components/version-manager/version-list.component';
import { VersionManagerComponent } from './components/version-manager/version-manager.component';
import { VersionUploadComponent } from './components/version-manager/version-upload.component';

import { EmptyFolderContentDirective } from './components/empty-folder/empty-folder-content.directive';
import { NoPermissionContentDirective } from './components/no-permission/no-permission-content.directive';

import { ContentNodeSelectorService } from './components/content-node-selector/content-node-selector.service';
import { DocumentActionsService } from './services/document-actions.service';
import { DocumentListService } from './services/document-list.service';
import { FolderActionsService } from './services/folder-actions.service';
import { NodeActionsService } from './services/node-actions.service';

@NgModule({
    imports: [
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
        NoPermissionContentDirective,
        BreadcrumbComponent,
        DropdownSitesComponent,
        DropdownBreadcrumbComponent,
        ContentNodeSelectorComponent,
        VersionListComponent,
        VersionUploadComponent,
        VersionManagerComponent
    ],
    providers: [
        DocumentListService,
        FolderActionsService,
        DocumentActionsService,
        NodeActionsService,
        ContentNodeSelectorService,
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
        DocumentListComponent,
        ContentColumnComponent,
        ContentColumnListComponent,
        ContentActionComponent,
        ContentActionListComponent,
        EmptyFolderContentDirective,
        NoPermissionContentDirective,
        BreadcrumbComponent,
        DropdownSitesComponent,
        DropdownBreadcrumbComponent,
        ContentNodeSelectorComponent,
        VersionListComponent,
        VersionUploadComponent,
        VersionManagerComponent
    ]
})
export class DocumentListModule {}
