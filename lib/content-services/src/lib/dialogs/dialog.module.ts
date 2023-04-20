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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@alfresco/adf-core';

import { MaterialModule } from '../material.module';
import { FolderDialogComponent } from './folder.dialog';
import { NodeLockDialogComponent } from './node-lock.dialog';
import { ConfirmDialogComponent } from './confirm.dialog';
import { MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { LibraryDialogComponent } from './library/library.dialog';
import { ContentDirectiveModule } from '../directives';
import { DownloadZipDialogModule } from './download-zip/download-zip.dialog.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        MatMomentDatetimeModule,
        MatDatetimepickerModule,
        ContentDirectiveModule,
        DownloadZipDialogModule
    ],
    declarations: [
        FolderDialogComponent,
        NodeLockDialogComponent,
        ConfirmDialogComponent,
        LibraryDialogComponent
    ],
    exports: [
        FolderDialogComponent,
        NodeLockDialogComponent,
        ConfirmDialogComponent,
        LibraryDialogComponent
    ]
})
export class DialogModule {}
