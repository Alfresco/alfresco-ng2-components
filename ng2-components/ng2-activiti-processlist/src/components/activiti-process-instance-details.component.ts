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

import { Component, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { ActivitiProcessInstanceHeader } from './activiti-process-instance-header.component';
import { ActivitiProcessInstanceTasks } from './activiti-process-instance-tasks.component';
import { ProcessInstance } from '../models/process-instance.model';

declare let componentHandler: any;

@Component({
    selector: 'activiti-process-instance-details',
    moduleId: module.id,
    templateUrl: './activiti-process-instance-details.component.html',
    styleUrls: ['./activiti-process-instance-details.component.css']
})
export class ActivitiProcessInstanceDetails implements OnChanges {

    @Input()
    processInstanceId: string;

    @ViewChild(ActivitiProcessInstanceHeader)
    processInstanceHeader: ActivitiProcessInstanceHeader;

    @ViewChild(ActivitiProcessInstanceTasks)
    tasksList: ActivitiProcessInstanceTasks;

    @Input()
    showTitle: boolean = true;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    processCancelled: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    taskFormCompleted: EventEmitter<any> = new EventEmitter<any>();

    processInstanceDetails: ProcessInstance;

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiProcess   Process service
     */
    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/src');
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
                }
            );
        }
    }

    bubbleTaskFormCompleted(data: any) {
        this.taskFormCompleted.emit(data);
    }

    isRunning(): boolean {
        return this.processInstanceDetails && !this.processInstanceDetails.ended;
    }

    cancelProcess() {
        this.activitiProcess.cancelProcess(this.processInstanceId).subscribe(
            (data) => {
                this.processCancelled.emit(data);
            }, (err) => {
                console.error(err);
            });
    }
}
