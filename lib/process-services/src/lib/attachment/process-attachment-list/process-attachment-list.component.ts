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

import {
    DataColumnComponent,
    DataColumnListComponent,
    DataTableComponent,
    DownloadService,
    EmptyListComponent,
    LoadingContentTemplateDirective,
    NoContentTemplateDirective,
    ThumbnailService
} from '@alfresco/adf-core';
import {
    AfterContentInit,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { ProcessContentService } from '../../form/services/process-content.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'adf-process-attachment-list',
    imports: [
        CommonModule,
        TranslatePipe,
        MatProgressSpinnerModule,
        DataTableComponent,
        NoContentTemplateDirective,
        EmptyListComponent,
        DataColumnListComponent,
        DataColumnComponent,
        LoadingContentTemplateDirective
    ],
    styleUrls: ['./process-attachment-list.component.scss'],
    templateUrl: './process-attachment-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProcessAttachmentListComponent implements OnChanges, AfterContentInit {
    @ContentChild(EmptyListComponent)
    emptyTemplate: EmptyListComponent;

    /** (**required**) The ID of the process instance to display. */
    @Input({ required: true })
    processInstanceId: string;

    /** Disable/Enable read-only mode for attachment list. */
    @Input()
    disabled: boolean = false;

    /**
     * Emitted when the attachment is double-clicked or the
     * view option is selected from the context menu by the user from
     * within the component. Returns a Blob representing the object
     * that was clicked.
     */
    @Output()
    attachmentClick = new EventEmitter();

    /**
     * Emitted when the attachment list has fetched all the attachments.
     * Returns a list of attachments.
     */
    @Output()
    success = new EventEmitter();

    /**
     * Emitted when the attachment list is not able to fetch the attachments
     * (eg, following a network error).
     */
    @Output()
    error = new EventEmitter<any>();

    hasCustomTemplate: boolean = false;

    attachments: any[] = [];
    isLoading: boolean = false;

    constructor(
        private processContentService: ProcessContentService,
        private downloadService: DownloadService,
        private thumbnailService: ThumbnailService,
        private ngZone: NgZone
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['processInstanceId']?.currentValue) {
            this.loadAttachmentsByProcessInstanceId(changes['processInstanceId'].currentValue);
        }
    }

    ngAfterContentInit() {
        if (this.emptyTemplate) {
            this.hasCustomTemplate = true;
        }
    }

    reset() {
        this.attachments = [];
    }

    reload(): void {
        this.ngZone.run(() => {
            this.loadAttachmentsByProcessInstanceId(this.processInstanceId);
        });
    }

    add(content: any): void {
        this.ngZone.run(() => {
            this.attachments.push({
                id: content.id,
                name: content.name,
                created: content.created,
                createdBy: content.createdBy.firstName + ' ' + content.createdBy.lastName,
                icon: this.thumbnailService.getMimeTypeIcon(content.mimeType)
            });
        });
    }

    onShowRowActionsMenu(event: any) {
        const viewAction = {
            title: 'ADF_PROCESS_LIST.MENU_ACTIONS.VIEW_CONTENT',
            name: 'view'
        };

        const removeAction = {
            title: 'ADF_PROCESS_LIST.MENU_ACTIONS.REMOVE_CONTENT',
            name: 'remove'
        };

        const downloadAction = {
            title: 'ADF_PROCESS_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT',
            name: 'download'
        };

        event.value.actions = [viewAction, downloadAction];

        if (!this.disabled) {
            event.value.actions.splice(1, 0, removeAction);
        }
    }

    onExecuteRowAction(event: any) {
        const args = event.value;
        const action = args.action;
        if (action.name === 'view') {
            this.emitDocumentContent(args.row.obj);
        } else if (action.name === 'remove') {
            this.deleteAttachmentById(args.row.obj.id);
        } else if (action.name === 'download') {
            this.downloadContent(args.row.obj);
        }
    }

    openContent(event: any): void {
        const content = event.value.obj;
        this.emitDocumentContent(content);
    }

    emitDocumentContent(content: any) {
        this.processContentService.getContentPreview(content.id).subscribe(
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
        this.processContentService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => this.downloadService.downloadBlob(blob, content.name),
            (err) => {
                this.error.emit(err);
            }
        );
    }

    private loadAttachmentsByProcessInstanceId(processInstanceId: string) {
        if (processInstanceId) {
            this.reset();
            this.isLoading = true;
            const isRelatedContent = 'true';
            this.processContentService.getProcessRelatedContent(processInstanceId, { isRelatedContent }).subscribe(
                (res) => {
                    res.data.forEach((content) => {
                        this.attachments.push({
                            id: content.id,
                            name: content.name,
                            created: content.created,
                            createdBy: content.createdBy.firstName + ' ' + content.createdBy.lastName,
                            icon: this.thumbnailService.getMimeTypeIcon(content.mimeType)
                        });
                    });
                    this.success.emit(this.attachments);
                    this.isLoading = false;
                },
                (err) => {
                    this.error.emit(err);
                    this.isLoading = false;
                }
            );
        }
    }

    private deleteAttachmentById(contentId: number) {
        if (contentId) {
            this.processContentService.deleteRelatedContent(contentId).subscribe(
                () => {
                    this.attachments = this.attachments.filter((content) => content.id !== contentId);
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }
}
