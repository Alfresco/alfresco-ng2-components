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

import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiContentService } from 'ng2-activiti-form';

@Component({
    selector: 'adf-task-attachment-list',
    styleUrls: ['./adf-task-attachment-list.component.css'],
    templateUrl: './adf-task-attachment-list.component.html'
})
export class TaskAttachmentListComponent implements OnChanges {

    @Input()
    taskId: string;

    @Output()
    attachmentClick = new EventEmitter();

    attachments: any[] = [];

    constructor(private translateService: AlfrescoTranslationService,
                private activitiContentService: ActivitiContentService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['taskId'] && changes['taskId'].currentValue) {
            this.loadAttachmentsByTaskId(this.taskId);
        }
    }

    reset () {
        this.attachments = [];
    }

    private loadAttachmentsByTaskId(taskId: string) {
        if (taskId) {
            this.reset();
            this.activitiContentService.getTaskRelatedContent(taskId).subscribe(
                (res: any) => {
                    res.data.forEach(content => {
                        this.attachments.push({
                            id: content.id,
                            name: content.name,
                            created: content.created,
                            createdBy: content.createdBy.firstName + ' ' + content.createdBy.lastName
                        });
                    });

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
                });
        }
    }

    isEmpty(): boolean {
        return this.attachments && this.attachments.length === 0;
    }

    onShowRowActionsMenu(event: any) {
        let myAction = {
            title: 'Delete',
            name: 'delete'
        };
        event.value.actions = [
            myAction
        ];
    }

    onExecuteRowAction(event: any) {
        let args = event.value;
        let action = args.action;
        if (action.name === 'delete') {
            this.deleteAttachmentById(args.row.obj.id);
        }
    }

    private openContent(event: any): void {
        let content = event.value.obj;
        this.activitiContentService.getFileRawContent(content.id).subscribe(
            (blob: Blob) => {
                content.contentBlob = blob;
                this.attachmentClick.emit(content);
            }
        );
    }

}
