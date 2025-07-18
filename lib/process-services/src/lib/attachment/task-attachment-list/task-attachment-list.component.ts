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
    EmptyListHeaderDirective,
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'adf-task-attachment-list',
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        DataTableComponent,
        EmptyListHeaderDirective,
        TranslatePipe,
        DataColumnListComponent,
        DataColumnComponent,
        LoadingContentTemplateDirective,
        EmptyListComponent,
        NoContentTemplateDirective
    ],
    styleUrls: ['./task-attachment-list.component.scss'],
    templateUrl: './task-attachment-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TaskAttachmentListComponent implements OnChanges, AfterContentInit {
    @ContentChild(EmptyListComponent)
    emptyTemplate: EmptyListComponent;

    /** (**required**) The ID of the task to display. */
    @Input({ required: true })
    taskId: string;

    /** Disable/Enable read only mode for attachment list. */
    @Input()
    disabled: boolean = false;

    /**
     * Emitted when the attachment is double-clicked or a view
     * option is selected from the context menu by the user from within the component.
     * Returns a Blob representing the clicked object.
     */
    @Output()
    attachmentClick = new EventEmitter();

    /**
     * Emitted when the attachment list has fetched all the attachments.
     * Returns a list of attachments.
     */
    @Output()
    success = new EventEmitter();

    /** Emitted when an error occurs while fetching the attachments. */
    @Output()
    error = new EventEmitter<any>();

    hasCustomTemplate: boolean = false;

    attachments: any[] = [];
    isLoading: boolean = false;

    constructor(
        private activitiContentService: ProcessContentService,
        private downloadService: DownloadService,
        private thumbnailService: ThumbnailService,
        private ngZone: NgZone
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['taskId']?.currentValue) {
            this.loadAttachmentsByTaskId(changes['taskId'].currentValue);
        }
    }

    ngAfterContentInit() {
        if (this.emptyTemplate) {
            this.hasCustomTemplate = true;
        }
    }

    reset(): void {
        this.attachments = [];
    }

    reload(): void {
        this.ngZone.run(() => {
            this.loadAttachmentsByTaskId(this.taskId);
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

    deleteAttachmentById(contentId: number) {
        if (contentId) {
            this.activitiContentService.deleteRelatedContent(contentId).subscribe(
                () => {
                    this.attachments = this.attachments.filter((content) => content.id !== contentId);
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }

    onShowRowActionsMenu(event: any) {
        const viewAction = {
            title: 'ADF_TASK_LIST.MENU_ACTIONS.VIEW_CONTENT',
            name: 'view'
        };

        const removeAction = {
            title: 'ADF_TASK_LIST.MENU_ACTIONS.REMOVE_CONTENT',
            name: 'remove'
        };

        const downloadAction = {
            title: 'ADF_TASK_LIST.MENU_ACTIONS.DOWNLOAD_CONTENT',
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
        this.activitiContentService.getContentPreview(content.id).subscribe(
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
            (blob: Blob) => this.downloadService.downloadBlob(blob, content.name),
            (err) => {
                this.error.emit(err);
            }
        );
    }

    private loadAttachmentsByTaskId(taskId: string) {
        if (taskId) {
            this.isLoading = true;
            this.reset();
            const isRelatedContent = 'true';
            this.activitiContentService.getTaskRelatedContent(taskId, { isRelatedContent }).subscribe(
                (res) => {
                    const attachList = [];
                    res.data.forEach((content) => {
                        attachList.push({
                            id: content.id,
                            name: content.name,
                            created: content.created,
                            createdBy: content.createdBy.firstName + ' ' + content.createdBy.lastName,
                            icon: this.thumbnailService.getMimeTypeIcon(content.mimeType)
                        });
                    });
                    this.attachments = attachList;
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
}
