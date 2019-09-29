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
  ContentLinkModel,
  NotificationService
} from '@alfresco/adf-core';
import { Node, RelatedContentRepresentation } from '@alfresco/js-api';
import { ContentCloudNodeSelectorService } from '../../services/content-cloud-node-selector.service';
import { ProcessCloudContentService } from '../../services/process-cloud-content.service';
import { UploadCloudWidgetComponent } from '../upload-cloud.widget';

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
    static ACS_SERVICE = 'alfresco-content';

    constructor(
        public formService: FormService,
        public logger: LogService,
        public thumbnails: ThumbnailService,
        public processCloudContentService: ProcessCloudContentService,
        public contentNodeSelectorService: ContentCloudNodeSelectorService,
        notificationService: NotificationService
    ) {
        super(formService, thumbnails, processCloudContentService, notificationService, logger);
    }

    isFileSourceConfigured(): boolean {
        return !!this.field.params && !!this.field.params.fileSource;
    }

    isMultipleSourceUpload(): boolean {
        return (
            !this.field.readOnly &&
            this.isFileSourceConfigured() &&
            !this.isOnlyLocalSourceSelected()
        );
    }

    isOnlyLocalSourceSelected(): boolean {
        return (
            this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId === 'local-file'
        );
    }

    isSimpleUploadButton(): boolean {
        return (
            (this.isUploadButtonVisible() && !this.isFileSourceConfigured()) ||
            this.isOnlyLocalSourceSelected()
        );
    }

    isUploadButtonVisible(): boolean {
        return (!this.hasFile || this.multipleOption) && !this.field.readOnly;
    }

    onAttachFileChanged(event: any) {
        this.onFileChanged(event);
    }

    onRemoveAttachFile(file: File | RelatedContentRepresentation) {
        this.removeFile(file);
    }

    uploadFileFromCS() {
        this.openSelectDialog();
    }

    openSelectDialog() {
        const filesSaved: Node[] = [];

        this.contentNodeSelectorService
            .openUploadFileDialog(this.field.form.contentHost)
            .subscribe((selections: Node[]) => {
                selections.forEach(node => (node['isExternal'] = true));
                filesSaved.push(selections[0]);
                this.fixIncompatibilityFromPreviousAndNewForm(filesSaved);
            });
    }

    isContentSourceSelected(): boolean {
        return (
            this.field.params &&
            this.field.params.fileSource &&
            this.field.params.fileSource.serviceId ===
                AttachFileCloudWidgetComponent.ACS_SERVICE
        );
    }

    downloadContent(file: Node): void {
        this.processCloudContentService
            .getRawContentNode(file.id, this.field.form.contentHost)
            .subscribe(
                (blob: Blob) => {
                    this.processCloudContentService.downloadNodeContent(
                        blob,
                        file.name
                    );
                },
                () => {
                    this.logger.error(
                        'Impossible retrieve content for download'
                    );
                }
            );
    }

    onAttachFileClicked(file: ContentLinkModel) {
        this.processCloudContentService
        .getRawContentNode(file.nodeId, this.field.form.contentHost)
        .subscribe(
            (blob: Blob) => {
                file.contentBlob = blob;
                this.fileClicked(file);
            });
    }
}
