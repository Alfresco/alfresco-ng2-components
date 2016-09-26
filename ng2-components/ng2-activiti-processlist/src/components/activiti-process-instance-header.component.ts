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

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ProcessInstance } from '../models/process-instance';
import { ActivitiProcessService } from './../services/activiti-process.service';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-process-instance-header',
    moduleId: __moduleName,
    templateUrl: './activiti-process-instance-header.component.html',
    styleUrls: ['./activiti-process-instance-header.component.css']
})
export class ActivitiProcessInstanceHeader {

    @Input()
    processInstance: ProcessInstance;

    @Output()
    processCancelled = new EventEmitter();

    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-tasklist/src');
        }
    }

    getStartedByFullName() {
        if (this.processInstance && this.processInstance.startedBy) {
            return (this.processInstance.startedBy.firstName && this.processInstance.startedBy.firstName !== 'null'
                    ? this.processInstance.startedBy.firstName + ' ' : '') +
                this.processInstance.startedBy.lastName;
        }
        return '';
    }

    getStartedDate() {
        return this.processInstance ? new Date(this.processInstance.started) : null;
    }

    cancelProcess() {
        this.processCancelled.emit(this.activitiProcess.cancelProcess(this.processInstance.id));
    }
}
