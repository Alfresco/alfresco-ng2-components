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
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { TaskDetailsModel } from 'ng2-activiti-tasklist';
import { Observable, Observer } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { ProcessInstance } from '../models/process-instance.model';

declare let componentHandler: any;
declare let dialogPolyfill: any;

@Component({
    selector: 'activiti-process-instance-tasks',
    moduleId: module.id,
    templateUrl: './activiti-process-instance-tasks.component.html',
    styleUrls: ['./activiti-process-instance-tasks.component.css']
})
export class ActivitiProcessInstanceTasks implements OnInit, OnChanges {

    @Input()
    processInstanceDetails: ProcessInstance;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    taskFormCompleted = new EventEmitter();

    activeTasks: TaskDetailsModel[] = [];
    completedTasks: TaskDetailsModel[] = [];

    private taskObserver: Observer<TaskDetailsModel>;
    private completedTaskObserver: Observer<TaskDetailsModel>;

    task$: Observable<TaskDetailsModel>;
    completedTask$: Observable<TaskDetailsModel>;

    message: string;

    selectedTaskId: string;

    processId: string;

    @ViewChild('dialog')
    dialog: any;

    @ViewChild('startDialog')
    startDialog: any;

    @ViewChild('taskdetails')
    taskdetails: any;

    constructor(private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {
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

    public load(processId: string) {
        this.loadActive(processId);
        this.loadCompleted(processId);
    }

    public loadActive(processId: string) {
        this.activeTasks = [];
        if (processId) {
            this.activitiProcess.getProcessTasks(processId, null).subscribe(
                (res: TaskDetailsModel[]) => {
                    res.forEach((task) => {
                        this.taskObserver.next(task);
                    });
                },
                (err) => {
                    console.log(err);
                }
            );
        } else {
            this.activeTasks = [];
        }
    }

    public loadCompleted(processId: string) {
        this.completedTasks = [];
        if (processId) {
            this.activitiProcess.getProcessTasks(processId, 'completed').subscribe(
                (res: TaskDetailsModel[]) => {
                    res.forEach((task) => {
                        this.completedTaskObserver.next(task);
                    });
                },
                (err) => {
                    console.log(err);
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
            console.error(`ProcessListInstanceTask: error parsing date ${value} to format ${format}`);
        }
    }

    public clickTask($event: any, task: TaskDetailsModel) {
        this.selectedTaskId = task.id;
        this.showDialog();
    }

    public clickStartTask() {
        this.processId = this.processInstanceDetails.id;
        this.showStartDialog();
    }

    public showStartDialog() {
        if (!this.startDialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.startDialog.nativeElement);
        }

        if (this.startDialog) {
            this.startDialog.nativeElement.showModal();
        }
    }

    public showDialog() {
        if (!this.dialog.nativeElement.showModal) {
            dialogPolyfill.registerDialog(this.dialog.nativeElement);
        }
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public closeSartDialog() {
        if (this.startDialog) {
            this.startDialog.nativeElement.close();
        }
    }

    private closeDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
        this.selectedTaskId = null;
    }

    public onTaskFormCompleted() {
        this.closeDialog();
        this.load(this.processInstanceDetails.id);
        this.taskFormCompleted.emit(this.processInstanceDetails.id);
    }

    public onRefreshClicked() {
        this.load(this.processInstanceDetails.id);
    }
}
