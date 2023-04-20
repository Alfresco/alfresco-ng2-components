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
import { MaterialModule } from '../material.module';
import { FileUploadingDialogComponent } from './components/file-uploading-dialog.component';
import { FileUploadingListRowComponent } from './components/file-uploading-list-row.component';
import { FileUploadingListComponent } from './components/file-uploading-list.component';
import { UploadButtonComponent } from './components/upload-button.component';
import { UploadVersionButtonComponent } from './components/upload-version-button.component';
import { UploadDragAreaComponent } from './components/upload-drag-area.component';
import { FileUploadErrorPipe } from './pipes/file-upload-error.pipe';
import { CoreModule } from '@alfresco/adf-core';
import { FileDraggableDirective } from './directives/file-draggable.directive';
import { ToggleIconDirective } from './directives/toggle-icon.directive';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        MaterialModule,
        A11yModule
    ],
    declarations: [
        FileDraggableDirective,
        UploadDragAreaComponent,
        UploadButtonComponent,
        UploadVersionButtonComponent,
        FileUploadingDialogComponent,
        FileUploadingListComponent,
        FileUploadingListRowComponent,
        FileUploadErrorPipe,
        ToggleIconDirective
    ],
    exports: [
        FileDraggableDirective,
        UploadDragAreaComponent,
        UploadButtonComponent,
        UploadVersionButtonComponent,
        FileUploadingDialogComponent,
        FileUploadingListComponent,
        FileUploadingListRowComponent,
        FileUploadErrorPipe,
        ToggleIconDirective
    ]
})
export class UploadModule {}
