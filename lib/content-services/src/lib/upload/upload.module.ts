/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule } from '@angular/core';
import { FileUploadingDialogComponent } from './components/file-uploading-dialog.component';
import { FileUploadingListRowComponent } from './components/file-uploading-list-row.component';
import { FileUploadingListComponent } from './components/file-uploading-list.component';
import { UploadButtonComponent } from './components/upload-button.component';
import { UploadVersionButtonComponent } from './components/upload-version-button.component';
import { UploadDragAreaComponent } from './components/upload-drag-area.component';
import { FileUploadErrorPipe } from './pipes/file-upload-error.pipe';
import { FileDraggableDirective } from './directives/file-draggable.directive';
import { ToggleIconDirective } from './directives/toggle-icon.directive';

export const CONTENT_UPLOAD_DIRECTIVES = [
    FileUploadErrorPipe,
    FileDraggableDirective,
    ToggleIconDirective,
    UploadDragAreaComponent,
    UploadButtonComponent,
    UploadVersionButtonComponent,
    FileUploadingListRowComponent,
    FileUploadingListComponent,
    FileUploadingDialogComponent
] as const;

/** @deprecated use `...CONTENT_UPLOAD_DIRECTIVES` instead or import standalone components directly */
@NgModule({
    imports: [...CONTENT_UPLOAD_DIRECTIVES],
    exports: [...CONTENT_UPLOAD_DIRECTIVES]
})
export class UploadModule {}
