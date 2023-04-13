/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreModule, EditJsonDialogModule } from '@alfresco/adf-core';

import { MaterialModule } from '../material.module';
import { UploadModule } from '../upload/upload.module';
import { ContentPipeModule } from '../pipes/content-pipe.module';
import { SearchModule } from './../search/search.module';

import { ContentActionListComponent } from './components/content-action/content-action-list.component';
import { ContentActionComponent } from './components/content-action/content-action.component';
import { DocumentListComponent } from './components/document-list.component';

import { TrashcanNameColumnComponent } from './components/trashcan-name-column/trashcan-name-column.component';
import { LibraryStatusColumnComponent } from './components/library-status-column/library-status-column.component';
import { LibraryRoleColumnComponent } from './components/library-role-column/library-role-column.component';
import { LibraryNameColumnComponent } from './components/library-name-column/library-name-column.component';
import { NameColumnComponent } from './components/name-column/name-column.component';
import { FilterHeaderComponent } from './components/filter-header/filter-header.component';
import { FileAutoDownloadComponent } from './components/file-auto-download/file-auto-download.component';
import { ContentDirectiveModule } from '../directives/content-directive.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ContentPipeModule,
        FlexLayoutModule,
        MaterialModule,
        UploadModule,
        EditJsonDialogModule,
        SearchModule,
        ContentDirectiveModule
    ],
    declarations: [
        DocumentListComponent,
        TrashcanNameColumnComponent,
        LibraryStatusColumnComponent,
        LibraryRoleColumnComponent,
        LibraryNameColumnComponent,
        NameColumnComponent,
        ContentActionComponent,
        ContentActionListComponent,
        FilterHeaderComponent,
        FileAutoDownloadComponent
    ],
    exports: [
        DocumentListComponent,
        TrashcanNameColumnComponent,
        LibraryStatusColumnComponent,
        LibraryRoleColumnComponent,
        LibraryNameColumnComponent,
        NameColumnComponent,
        ContentActionComponent,
        ContentActionListComponent,
        FilterHeaderComponent
    ]
})
export class DocumentListModule {
}
