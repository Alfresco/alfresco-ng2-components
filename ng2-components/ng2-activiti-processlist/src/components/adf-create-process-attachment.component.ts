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
    selector: 'adf-create-process-attachment',
    styleUrls: ['./adf-create-process-attachment.component.css'],
    templateUrl: './adf-create-process-attachment.component.html'
})
export class ActivitiCreateProcessAttachmentComponent implements OnChanges {

    @Input()
    processInstanceId: string;

    @Output()
    creationError: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    contentCreated: EventEmitter<any> = new EventEmitter<any>();

    constructor(private translateService: AlfrescoTranslationService,
                private activitiContentService: ActivitiContentService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-processlist', 'assets/ng2-activiti-processlist/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['processInstanceId'] && changes['processInstanceId'].currentValue) {
            this.processInstanceId = changes['processInstanceId'].currentValue;
        }
    }

    onFileUpload(event: any) {
        let filesList: File[] = event.detail.files.map(obj => obj.file);

        for (let fileInfoObj of filesList) {
            let file: File = fileInfoObj;
            this.activitiContentService.createProcessRelatedContent(this.processInstanceId, file).subscribe(
                (res) => {
                    this.contentCreated.emit(res);
                },
                (err) => {
                    this.creationError.emit(err);
                });
        }
    }
}
