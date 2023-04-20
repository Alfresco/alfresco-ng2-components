/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { LogService } from '@alfresco/adf-core';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaskDetailsEvent } from '../../task-list';

import { ProcessInstance } from '../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { ProcessInstanceHeaderComponent } from './process-instance-header.component';
import { ProcessInstanceTasksComponent } from './process-instance-tasks.component';

@Component({
    selector: 'adf-process-instance-details',
    templateUrl: './process-instance-details.component.html',
    styleUrls: ['./process-instance-details.component.css']
})
export class ProcessInstanceDetailsComponent implements OnChanges {

    /** (required) The numeric ID of the process instance to display. */
    @Input()
    processInstanceId: string;

    @ViewChild('processInstanceHeader')
    processInstanceHeader: ProcessInstanceHeaderComponent;

    @ViewChild('processInstanceTasks')
    tasksList: ProcessInstanceTasksComponent;

    /** Toggles whether to show or hide the title. */
    @Input()
    showTitle: boolean = true;

    /** Toggles whether to show or hide the refresh button. */
    @Input()
    showRefreshButton: boolean = true;

    /** Emitted when the current process is cancelled by the user from within the component. */
    @Output()
    processCancelled = new EventEmitter<any>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /** Emitted when a task is clicked. */
    @Output()
    taskClick = new EventEmitter<TaskDetailsEvent>();

    /** Emitted when the "show diagram" button is clicked. */
    @Output()
    showProcessDiagram = new EventEmitter<any>();

    processInstanceDetails: ProcessInstance;

    /**
     * Constructor
     *
     * @param translate Translation service
     * @param activitiProcess   Process service
     */
    constructor(private activitiProcess: ProcessService,
                private logService: LogService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const processInstanceId = changes['processInstanceId'];
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
     * Reset the task detail
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

    getProcessNameOrDescription(dateFormat: string): string {
        let name = '';
        if (this.processInstanceDetails) {
            name = this.processInstanceDetails.name ||
                this.processInstanceDetails.processDefinitionName + ' - ' + this.getFormatDate(this.processInstanceDetails.started, dateFormat);
        }
        return name;
    }

    getFormatDate(value: any, format: string): any {
        const datePipe = new DatePipe('en-US');
        try {
            return datePipe.transform(value, format);
        } catch (err) {
            this.logService.error(`ProcessListInstanceHeader: error parsing date ${value} to format ${format}`);
        }
    }

    onShowProcessDiagram() {
        this.showProcessDiagram.emit({value: this.processInstanceId});
    }

}
