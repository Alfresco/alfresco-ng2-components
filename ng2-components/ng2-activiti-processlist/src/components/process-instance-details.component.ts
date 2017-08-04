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

import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaskDetailsEvent } from 'ng2-activiti-tasklist';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';

import { ProcessInstance } from '../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { ProcessInstanceHeaderComponent } from './process-instance-header.component';
import { ProcessInstanceTasksComponent } from './process-instance-tasks.component';

@Component({
    selector: 'adf-process-instance-details, activiti-process-instance-details',
    templateUrl: './process-instance-details.component.html',
    styleUrls: ['./process-instance-details.component.css']
})
export class ProcessInstanceDetailsComponent implements OnChanges {

    @Input()
    processInstanceId: string;

    @ViewChild(ProcessInstanceHeaderComponent)
    processInstanceHeader: ProcessInstanceHeaderComponent;

    @ViewChild(ProcessInstanceTasksComponent)
    tasksList: ProcessInstanceTasksComponent;

    @Input()
    showTitle: boolean = true;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    processCancelled: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    taskClick: EventEmitter<TaskDetailsEvent> = new EventEmitter<TaskDetailsEvent>();

    processInstanceDetails: ProcessInstance;

    @Output()
    showProcessDiagram: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Constructor
     * @param translate Translation service
     * @param activitiProcess   Process service
     */
    constructor(translate: AlfrescoTranslationService,
                private activitiProcess: ProcessService,
                private logService: LogService) {

        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'assets/ng2-activiti-processlist');
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

    isRunning(): boolean {
        return this.processInstanceDetails && !this.processInstanceDetails.ended;
    }

    isDiagramDisabled(): boolean {
        return !this.isRunning() ? true : undefined;
    }

    cancelProcess() {
        this.activitiProcess.cancelProcess(this.processInstanceId).subscribe(
            (data) => {
                this.processCancelled.emit(data);
            }, (err) => {
                this.error.emit(err);
            });
    }

    // bubbles (taskClick) event
    onTaskClicked(event: TaskDetailsEvent) {
        this.taskClick.emit(event);
    }

    getProcessNameOrDescription(dateFormat): string {
        let name = '';
        if (this.processInstanceDetails) {
            name = this.processInstanceDetails.name ||
                this.processInstanceDetails.processDefinitionName + ' - ' + this.getFormatDate(this.processInstanceDetails.started, dateFormat);
        }
        return name;
    }

    getFormatDate(value, format: string) {
        let datePipe = new DatePipe('en-US');
        try {
            return datePipe.transform(value, format);
        } catch (err) {
            this.logService.error(`ProcessListInstanceHeader: error parsing date ${value} to format ${format}`);
        }
    }

    onShowProcessDiagram(processInstanceId: any) {
        this.showProcessDiagram.emit({value: this.processInstanceId});
    }

}
