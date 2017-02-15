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

import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable, Observer } from 'rxjs/Rx';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { TaskDetailsModel, TaskDetailsEvent } from 'ng2-activiti-tasklist';
import { ProcessInstance } from '../models/process-instance.model';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-process-instance-tasks',
    templateUrl: './activiti-process-instance-tasks.component.html',
    styleUrls: ['./activiti-process-instance-tasks.component.css']
})
export class ActivitiProcessInstanceTasks implements OnInit, OnChanges {

    @Input()
    processInstanceDetails: ProcessInstance;

    @Input()
    showRefreshButton: boolean = true;

    activeTasks: TaskDetailsModel[] = [];
    completedTasks: TaskDetailsModel[] = [];

    private taskObserver: Observer<TaskDetailsModel>;
    private completedTaskObserver: Observer<TaskDetailsModel>;

    task$: Observable<TaskDetailsModel>;
    completedTask$: Observable<TaskDetailsModel>;

    message: string;
    processId: string;

    @ViewChild('dialog')
    dialog: any;

    @ViewChild('startDialog')
    startDialog: any;

    @ViewChild('taskdetails')
    taskdetails: any;

    @Output()
    taskClick: EventEmitter<TaskDetailsEvent> = new EventEmitter<TaskDetailsEvent>();

    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService,
                private logService: LogService) {
        if (translate) {
            translate.addTranslationFolder('ng2-activiti-processlist', 'node_modules/ng2-activiti-processlist/src');
        }

        this.task$ = new Observable<TaskDetailsModel>(observer => this.taskObserver = observer).share();
        this.completedTask$ = new Observable<TaskDetailsModel>(observer => this.completedTaskObserver = observer).share();
    }

    ngOnInit() {
        this.task$.subscribe((task: TaskDetailsModel) => {
            this.activeTasks.push(task);
        });
        this.completedTask$.subscribe((task: TaskDetailsModel) => {
            this.completedTasks.push(task);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let processInstanceDetails = changes['processInstanceDetails'];
        if (processInstanceDetails && processInstanceDetails.currentValue) {
            this.load(processInstanceDetails.currentValue.id);
        }
    }

    load(processId: string) {
        this.loadActive(processId);
        this.loadCompleted(processId);
    }

    loadActive(processId: string) {
        this.activeTasks = [];
        if (processId) {
            this.activitiProcess.getProcessTasks(processId, null).subscribe(
                (res: TaskDetailsModel[]) => {
                    res.forEach((task) => {
                        this.taskObserver.next(task);
                    });
                },
                (err) => {
                    this.logService.error(err);
                }
            );
        } else {
            this.activeTasks = [];
        }
    }

    loadCompleted(processId: string) {
        this.completedTasks = [];
        if (processId) {
            this.activitiProcess.getProcessTasks(processId, 'completed').subscribe(
                (res: TaskDetailsModel[]) => {
                    res.forEach((task) => {
                        this.completedTaskObserver.next(task);
                    });
                },
                (err) => {
                    this.logService.error(err);
                }
            );
        } else {
            this.completedTasks = [];
        }
    }

    hasStartFormDefined(): boolean {
        return this.processInstanceDetails && this.processInstanceDetails.startFormDefined === true;
    }

    getUserFullName(user: any) {
        if (user) {
            return (user.firstName && user.firstName !== 'null'
                    ? user.firstName + ' ' : '') +
                user.lastName;
        }
        return 'Nobody';
    }

    getFormatDate(value, format: string) {
        let datePipe = new DatePipe('en-US');
        try {
            return datePipe.transform(value, format);
        } catch (err) {
            this.logService.error(`ProcessListInstanceTask: error parsing date ${value} to format ${format}`);
        }
    }

    clickTask($event: any, task: TaskDetailsModel) {
        let args = new TaskDetailsEvent(task);
        this.taskClick.emit(args);
    }

    clickStartTask() {
        this.processId = this.processInstanceDetails.id;
        this.showStartDialog();
    }

    showStartDialog() {
        if (!this.startDialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.startDialog.nativeElement);
        }

        if (this.startDialog) {
            this.startDialog.nativeElement.showModal();
        }
    }

    closeSartDialog() {
        if (this.startDialog) {
            this.startDialog.nativeElement.close();
        }
    }

    onRefreshClicked() {
        this.load(this.processInstanceDetails.id);
    }
}
