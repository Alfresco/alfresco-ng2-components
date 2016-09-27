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

import { Component, Input, ViewChild, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { ActivitiProcessInstanceHeader } from './activiti-process-instance-header.component';
import { ActivitiProcessInstanceTasks } from './activiti-process-instance-tasks.component';
import { ActivitiComments } from './activiti-comments.component';
import { ProcessInstance } from '../models/process-instance';


declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-process-instance-details',
    moduleId: __moduleName,
    templateUrl: './activiti-process-instance-details.component.html',
    styleUrls: ['./activiti-process-instance-details.component.css']
})
export class ActivitiProcessInstanceDetails implements OnInit, OnChanges {

    @Input()
    processInstanceId: string;

    @ViewChild('activitiprocessheader')
    processInstanceHeader: ActivitiProcessInstanceHeader;

    @ViewChild('activitiprocesstasks')
    tasksList: ActivitiProcessInstanceTasks;

    @ViewChild('activitiprocesscomments')
    commentsList: ActivitiComments;

    @Input()
    showTitle: boolean = true;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    processCancelledEmitter = new EventEmitter();

    @Output()
    taskFormCompletedEmitter = new EventEmitter();

    processInstanceDetails: ProcessInstance;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param activitiProcess
     */
    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }
    }

    ngOnInit() {
        if (this.processInstanceId) {
            this.load(this.processInstanceId);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let processInstanceId = changes['processInstanceId'];
        if (processInstanceId && !processInstanceId.currentValue) {
            this.reset();
            return;
        }
        if (processInstanceId && processInstanceId.currentValue) {
            this.load(processInstanceId.currentValue);
            return;
        }
    }

    /**
     * Reset the task detail to undefined
     */
    reset() {
        this.processInstanceDetails = null;
    }

    load(processId: string) {
        if (processId) {
            this.activitiProcess.getProcess(processId).subscribe(
                (res: ProcessInstance) => {
                    this.processInstanceDetails = res;
                    if (this.processInstanceDetails) {
                        if (this.tasksList) {
                            this.tasksList.load(this.processInstanceDetails.id);
                        }
                    }
                }
            );
        }
    }

    processCancelled(data: any) {
        this.processCancelledEmitter.emit(data);
    }

    taskFormCompleted(data: any) {
        this.taskFormCompletedEmitter.emit(data);
    }
}
