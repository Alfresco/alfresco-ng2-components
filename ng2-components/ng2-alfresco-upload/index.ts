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

import { ModuleWithProviders, NgModule } from '@angular/core';

import { CoreModule, TRANSLATION_PROVIDER } from 'ng2-alfresco-core';
import { MaterialModule } from './src/material.module';

import { FileUploadingDialogComponent } from './src/components/file-uploading-dialog.component';
import { FileUploadingListRowComponent } from './src/components/file-uploading-list-row.component';
import { FileUploadingListComponent } from './src/components/file-uploading-list.component';
import { UploadButtonComponent } from './src/components/upload-button.component';
import { UploadDragAreaComponent } from './src/components/upload-drag-area.component';
import { FileDraggableDirective } from './src/directives/file-draggable.directive';
import { FileUploadService } from './src/services/file-uploading.service';

export * from './src/components/upload-button.component';
export * from './src/components/file-uploading-dialog.component';
export * from './src/components/upload-drag-area.component';
export * from './src/directives/file-draggable.directive';
export * from './src/components/file-uploading-list.component';
export * from './src/components/file-uploading-list-row.component';
export * from './src/models/permissions.model';
export * from './src/services/file-uploading.service';

export const UPLOAD_DIRECTIVES: any[] = [
    FileDraggableDirective,
    UploadDragAreaComponent,
    UploadButtonComponent,
    FileUploadingDialogComponent,
    FileUploadingListComponent,
    FileUploadingListRowComponent
];

export const UPLOAD_PROVIDERS: any[] = [
    FileUploadService
];

@NgModule({
    imports: [
        CoreModule,
        MaterialModule
    ],
    declarations: [
        ...UPLOAD_DIRECTIVES
    ],
    providers: [
        ...UPLOAD_PROVIDERS,
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
        ...UPLOAD_DIRECTIVES
    ]
})
export class UploadModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: UploadModule,
            providers: [
                ...UPLOAD_PROVIDERS
            ]
        };
    }
}
