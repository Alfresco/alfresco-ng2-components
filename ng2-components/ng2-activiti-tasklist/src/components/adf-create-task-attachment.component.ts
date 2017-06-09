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
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiContentService } from 'ng2-activiti-form';

@Component({
    selector: 'adf-create-task-attachment',
    styleUrls: ['./adf-create-task-attachment.component.css'],
    templateUrl: './adf-create-task-attachment.component.html'
})
export class ActivitiCreateTaskAttachmentComponent implements OnChanges {

    @Input()
    taskId: string;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translateService: AlfrescoTranslationService,
                private activitiContentService: ActivitiContentService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'node_modules/ng2-activiti-tasklist/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['taskId'] && changes['taskId'].currentValue) {
            this.taskId = changes['taskId'].currentValue;
        }
    }

    onFileUpload(event: any) {
        let files: File[] = event.detail.files;

        for (let i = 0; i < files.length; i++) {
            let file: File = files[i];
            this.activitiContentService.createTaskRelatedContent(this.taskId, file).subscribe(
                (res) => {
                    this.success.emit(res);
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }
}
