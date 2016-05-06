/**
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

import {UploadDragAreaComponent} from './src/components/upload-drag-area.component';
import {FileDraggableDirective} from './src/directives/file-draggable.directive';
import {UploadButtonComponent} from './src/components/upload-button.component';

/**
 * ng2-alfresco-upload, provide components to upload files to alfresco repository.
 *
 * Components provided:
 *         - A set of buttons to upload files:
 *           <alfresco-upload-button [showDialogUpload]="boolean"
 *                                   [showUdoNotificationBar]="boolean"
 *                                   [uploadFolders]="boolean"
 *                                   [multipleFiles]="boolean"
 *                                   [acceptedFilesType]="string">
 *           </alfresco-upload-button>
 *
 *         - Drag and drop area to upload files:
 *           <alfresco-upload-drag-area [showDialogUpload]="boolean" ></alfresco-upload-drag-area>
 */

export * from './src/components/upload-button.component';
export * from './src/components/upload-drag-area.component';
export * from './src/services/upload.service';
export * from './src/directives/file-draggable.directive';

export default {
    component: [UploadDragAreaComponent, UploadButtonComponent],
    directives: [FileDraggableDirective]
}

export const ALFRESCO_ULPOAD_COMPONENT: [any] = [
    UploadDragAreaComponent,
    UploadButtonComponent,
    FileDraggableDirective
];
