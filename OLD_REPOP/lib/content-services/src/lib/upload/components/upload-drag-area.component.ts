/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { EXTENDIBLE_COMPONENT, FileInfo, FileUtils, NotificationService } from '@alfresco/adf-core';
import { Component, forwardRef, ViewEncapsulation, inject } from '@angular/core';
import { NodeAllowableOperationSubject } from '../../interfaces/node-allowable-operation-subject.interface';
import { UploadBase } from './base-upload/upload-base';
import { AllowableOperationsEnum } from '../../common/models/allowable-operations.enum';
import { ContentService } from '../../common/services/content.service';
import { FileModel } from '../../common/models/file.model';
import { Node } from '@alfresco/js-api';
import { FileDraggableDirective } from '../directives/file-draggable.directive';

@Component({
    selector: 'adf-upload-drag-area',
    imports: [FileDraggableDirective],
    templateUrl: './upload-drag-area.component.html',
    styleUrls: ['./upload-drag-area.component.scss'],
    host: { class: 'adf-upload-drag-area' },
    viewProviders: [{ provide: EXTENDIBLE_COMPONENT, useExisting: forwardRef(() => UploadDragAreaComponent) }],
    encapsulation: ViewEncapsulation.None
})
export class UploadDragAreaComponent extends UploadBase implements NodeAllowableOperationSubject {
    private notificationService = inject(NotificationService);
    private contentService = inject(ContentService);

    /**
     * Method called when files are dropped in the drag area.
     *
     * @param files - files dropped in the drag area.
     */
    onFilesDropped(files: File[]): void {
        if (!this.disabled && files.length) {
            this.uploadFiles(files);
        }
    }

    /**
     * Called when a folder are dropped in the drag area
     *
     * @param folder - name of the dropped folder
     */
    onFolderEntityDropped(folder: any): void {
        if (!this.disabled && folder.isDirectory) {
            FileUtils.flatten(folder).then((filesInfo) => {
                this.uploadFilesInfo(filesInfo);
            });
        }
    }

    /**
     * Show undo notification bar.
     *
     * @param latestFilesAdded - files in the upload queue enriched with status flag and xhr object.
     */
    showUndoNotificationBar(latestFilesAdded: FileModel[]) {
        const messageTranslate = this.translationService.instant('FILE_UPLOAD.MESSAGES.PROGRESS');
        const actionTranslate = this.translationService.instant('FILE_UPLOAD.ACTION.UNDO');

        this.notificationService
            .openSnackMessageAction(messageTranslate, actionTranslate)
            .onAction()
            .subscribe(() => {
                this.uploadService.cancelUpload(...latestFilesAdded);
            });
    }

    /**
     * Check if content is droppable
     *
     * @returns `true` or `false` considering the component options and node permissions
     */
    isDroppable(): boolean {
        return !this.disabled;
    }

    /**
     * Handles 'upload-files' events raised by child components.
     *
     * @param event DOM event
     */
    onUploadFiles(event: CustomEvent) {
        event.stopPropagation();
        event.preventDefault();

        const node: Node = event.detail.data.obj.entry;
        const files: FileInfo[] = event.detail?.files || [];

        const isAllowed: boolean = this.isTargetNodeFolder(node)
            ? this.contentService.hasAllowableOperations(node, AllowableOperationsEnum.CREATE)
            : this.contentService.hasAllowableOperations(node, AllowableOperationsEnum.UPDATE);

        if (isAllowed) {
            if (!this.isTargetNodeFolder(node) && files.length === 1) {
                this.updateFileVersion.emit(event);
            } else {
                if (this.isTargetNodeFolder(node)) {
                    files.forEach((file) => (file.relativeFolder = node.name ? node.name.concat(file.relativeFolder) : file.relativeFolder));
                }
                if (files?.length > 0) {
                    this.uploadFilesInfo(files);
                }
            }
        }
    }

    private isTargetNodeFolder(node: Node): boolean {
        return !!node?.isFolder;
    }
}
