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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskListService } from 'ng2-activiti-tasklist';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ProcessService } from './../services/process.service';

@Component({
    selector: 'adf-process-instance-comments, activiti-process-instance-comments',
    templateUrl: './process-comments.component.html',
    styleUrls: ['./process-comments.component.css'],
    providers: [{provide: TaskListService, useClass: ProcessService}]
})
export class ProcessCommentsComponent {

    @Input()
    processInstanceId: string;

    @Input()
    readOnly: boolean = true;

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Constructor
     * @param translate Translation service
     */
    constructor(translate: AlfrescoTranslationService) {
        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'assets/ng2-activiti-processlist');
        }
    }

    onError(error: any) {
        this.error.emit(error);
    }
}
