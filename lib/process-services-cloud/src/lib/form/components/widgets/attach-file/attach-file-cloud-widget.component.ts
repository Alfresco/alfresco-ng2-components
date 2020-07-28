/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/* tslint:disable:component-selector */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormService,
  LogService,
  ThumbnailService,
  NotificationService,
  ContentLinkModel,
  TranslationService
} from '@alfresco/adf-core';
import { Node, RelatedContentRepresentation } from '@alfresco/js-api';
import { ContentCloudNodeSelectorService } from '../../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../../services/process-cloud-content.service';
import { UploadCloudWidgetComponent } from './upload-cloud.widget';

@Component({
    selector: 'adf-cloud-attach-file-cloud-widget',
    templateUrl: './attach-file-cloud-widget.component.html',
    styleUrls: ['./attach-file-cloud-widget.component.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class AttachFileCloudWidgetComponent extends UploadCloudWidgetComponent
    implements OnInit {

    typeId = 'AttachFileCloudWidgetComponent';
    rootDirectory = '-my-';

    constructor(
        formService: FormService,
        logger: LogService,
        thumbnails: ThumbnailService,
        processCloudContentService: ProcessCloudContentService,
        notificationService: NotificationService,
        private contentNodeSelectorService: ContentCloudNodeSelectorService,
        private translationService: TranslationService
    ) {
        super(formService, thumbnails, processCloudContentService, notificationService, logger);
    }

    isAlfrescoAndLocal(): boolean {
        return (
            this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'all-file-sources'
            || this.field.params.fileSource.serviceId === 'local-file'
        );
    }

    isAttachMultiple(): boolean {
        return this.field.params.multiple;
    }

    isUploadButtonVisible(): boolean {
        return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
    }

    onRemoveAttachFile(file: File | RelatedContentRepresentation | Node) {
        this.removeFile(file);
    }

    async openSelectDialog() {
        const selectedMode = this.field.params.multiple ? 'multiple' : 'single';

        if (this.isAlfrescoAndLocal()) {
            const destinationFolderPath = this.field.params.fileSource.destinationFolderPath;
            const alias = this.getAliasFromDestinationFolderPath(destinationFolderPath);
            const opts = {
                relativePath: this.getRelativePathFromDestinationFolderPath(destinationFolderPath)
            };

            if (alias && opts && opts.relativePath) {
                await this.contentNodeSelectorService.fetchNodeIdFromRelativePath(alias, opts).then((nodeId: string) => {
                    this.rootDirectory = nodeId;
                });
            } else {
                const errorMessage = this.translationService.instant('ADF_CLOUD_TASK_FORM.ERROR.INVALID_DESTINATION_FOLDER_PATH');
                this.notificationService.showError(errorMessage);
            }
        }
        this.contentNodeSelectorService
            .openUploadFileDialog(this.rootDirectory, selectedMode, this.isAlfrescoAndLocal())
            .subscribe((selections: Node[]) => {
                selections.forEach(node => (node['isExternal'] = true));
                const selectionWithoutDuplication = this.removeExistingSelection(selections);
                this.fixIncompatibilityFromPreviousAndNewForm(selectionWithoutDuplication);
            });
    }

    getAliasFromDestinationFolderPath(destinationFolderPath: string): string {
        const startOfRelativePathIndex = destinationFolderPath.indexOf('/');
        return destinationFolderPath.substring(0, startOfRelativePathIndex);
    }

    getRelativePathFromDestinationFolderPath(destinationFolderPath: string): string {
        const startOfRelativePathIndex = destinationFolderPath.indexOf('/');
        return destinationFolderPath.substring(startOfRelativePathIndex, destinationFolderPath.length);
    }

    removeExistingSelection(selections: Node[]) {
        const existingNode: Node[] = [...this.field.value || []];
        return selections.filter(opt => !existingNode.some( (node) => node.id === opt.id));
    }

    downloadContent(file: Node): void {
        this.processCloudContentService.downloadFile(
            file.id,
            this.field.form.contentHost
        );
    }

    onAttachFileClicked(nodeSelector: any) {
        nodeSelector.nodeId = nodeSelector.id;
        this.fileClicked(new ContentLinkModel(nodeSelector));
    }

    getWidgetIcon(): string {
        return this.isAlfrescoAndLocal() ? 'file_upload' : 'attach_file';
    }
}
