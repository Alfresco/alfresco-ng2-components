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

import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService, ContentService } from 'ng2-alfresco-core';
import { ActivitiContentService } from 'ng2-activiti-form';

@Component({
    selector: 'adf-process-attachment-list',
    styleUrls: ['./adf-process-attachment-list.component.css'],
    templateUrl: './adf-process-attachment-list.component.html'
})
export class ActivitiProcessAttachmentListComponent implements OnChanges {

    @Input()
    processInstanceId: string;

    @Output()
    attachmentClick = new EventEmitter();

    @Output()
    success = new EventEmitter();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    attachments: any[] = [];

    constructor(private translateService: AlfrescoTranslationService,
                private activitiContentService: ActivitiContentService,
                private contentService: ContentService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-processlist', 'assets/ng2-activiti-processlist');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['processInstanceId'] && changes['processInstanceId'].currentValue) {
            this.loadAttachmentsByProcessInstanceId(changes['processInstanceId'].currentValue);
        }
    }

    reset () {
        this.attachments = [];
    }

    private loadAttachmentsByProcessInstanceId(processInstanceId: string) {
        if (processInstanceId) {
            this.reset();
            this.activitiContentService.getProcessRelatedContent(processInstanceId).subscribe(
                (res: any) => {
                    res.data.forEach(content => {
                        this.attachments.push({
                            id: content.id,
                            name: content.name,
                            created: content.created,
                            createdBy: content.createdBy.firstName + ' ' + content.createdBy.lastName,
                            icon: this.activitiContentService.getMimeTypeIcon(content.mimeType)
                        });
                    });
                    this.success.emit(this.attachments);
                },
                (err) => {
                    this.error.emit(err);
                });
        }
    }

    private deleteAttachmentById(contentId: string) {
        if (contentId) {
            this.activitiContentService.deleteRelatedContent(contentId).subscribe(
                (res: any) => {
                    this.attachments = this.attachments.filter(content => {
                        return content.id !== contentId;
                    });
                },
                (err) => {
                    this.error.emit(err);
                });
        }
    }

    isEmpty(): boolean {
        return this.attachments && this.attachments.length === 0;
    }

    onShowRowActionsMenu(event: any) {
        let viewAction = {
            title: 'View',
            name: 'view'
        };

        let removeAction = {
            title: 'Remove',
            name: 'remove'
        };

        let downloadAction = {
            title: 'Download',
            name: 'download'
        };

        event.value.actions = [
            viewAction,
            removeAction,
            downloadAction
        ];
    }

    onExecuteRowAction(event: any) {
        let args = event.value;
        let action = args.action;
        if (action.name === 'view') {
            this.emitDocumentContent(args.row.obj);
        } else if (action.name === 'remove') {
            this.deleteAttachmentById(args.row.obj.id);
        } else if (action.name === 'download') {
            this.downloadContent(args.row.obj);
        }
    }

    openContent(event: any): void {
        let content = event.value.obj;
        this.emitDocumentContent(content);
    }

    emitDocumentContent(content: any) {
        this.activitiContentService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => {
                content.contentBlob = blob;
                this.attachmentClick.emit(content);
            },
            (err) => {
                this.error.emit(err);
            }
        );
    }

    downloadContent(content: any): void {
        this.activitiContentService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => this.contentService.downloadBlob(blob, content.name),
            (err) => {
                this.error.emit(err);
            }
        );
    }
}
