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

import { NgModule } from '@angular/core';

import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { MaterialModule } from '../material.module';

import { FileUploadingDialogComponent } from './components/file-uploading-dialog.component';
import { FileUploadingListRowComponent } from './components/file-uploading-list-row.component';
import { FileUploadingListComponent } from './components/file-uploading-list.component';
import { UploadButtonComponent } from './components/upload-button.component';
import { UploadDragAreaComponent } from './components/upload-drag-area.component';

import { FileDraggableDirective } from './directives/file-draggable.directive';

@NgModule({
    imports: [
        CoreModule,
        MaterialModule
    ],
    declarations: [
        FileDraggableDirective,
        UploadDragAreaComponent,
        UploadButtonComponent,
        FileUploadingDialogComponent,
        FileUploadingListComponent,
        FileUploadingListRowComponent
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-upload',
                source: 'assets/ng2-alfresco-upload'
            }
        }
    ],
    exports: [
        FileDraggableDirective,
        UploadDragAreaComponent,
        UploadButtonComponent,
        FileUploadingDialogComponent,
        FileUploadingListComponent,
        FileUploadingListRowComponent
    ]
})
export class UploadModule {}
