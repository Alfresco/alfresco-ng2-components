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

import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService, AlfrescoAuthenticationService, AlfrescoPipeTranslate } from 'ng2-alfresco-core';
import { ActivitiProcessService } from './../services/activiti-process.service';
import { TaskDetailsModel } from '../models/task-details.model';
import { ALFRESCO_TASKLIST_DIRECTIVES } from 'ng2-activiti-tasklist';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

declare let componentHandler: any;
declare let __moduleName: string;

@Component({
    selector: 'activiti-process-instance-tasks',
    moduleId: __moduleName,
    templateUrl: './activiti-process-instance-tasks.component.html',
    styleUrls: ['./activiti-process-instance-tasks.component.css'],
    providers: [ActivitiProcessService],
    directives: [ ALFRESCO_TASKLIST_DIRECTIVES ],
    pipes: [ AlfrescoPipeTranslate ]

})
export class ActivitiProcessInstanceTasks implements OnInit {

    @Input()
    processId: string;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    taskFormCompletedEmitter = new EventEmitter();

    activeTasks: TaskDetailsModel[] = [];
    completedTasks: TaskDetailsModel[] = [];

    private taskObserver: Observer<TaskDetailsModel>;
    private completedTaskObserver: Observer<TaskDetailsModel>;

    task$: Observable<TaskDetailsModel>;
    completedTask$: Observable<TaskDetailsModel>;

    message: string;

    selectedTaskId: string;

    @ViewChild('dialog')
    dialog: any;

    @ViewChild('taskdetails')
    taskdetails: any;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param activitiProcess
     */
    constructor(private auth: AlfrescoAuthenticationService,
                private translate: AlfrescoTranslationService,
                private activitiProcess: ActivitiProcessService) {

        if (translate) {
            translate.addTranslationFolder('node_modules/ng2-activiti-processlist/src');
        }

        this.task$ = new Observable<TaskDetailsModel>(observer =>  this.taskObserver = observer).share();
        this.completedTask$ = new Observable<TaskDetailsModel>(observer =>  this.completedTaskObserver = observer).share();

    }

    ngOnInit() {
        this.task$.subscribe((task: TaskDetailsModel) => {
            this.activeTasks.push(task);
        });
        this.completedTask$.subscribe((task: TaskDetailsModel) => {
            this.completedTasks.push(task);
        });

        if (this.processId) {
            this.load(this.processId);
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

    getUserFullName(user: any) {
        if (user) {
            return (user.firstName && user.firstName !== 'null'
                    ? user.firstName + ' ' : '') +
                user.lastName;
        }
        return '';
    }

    public clickTask($event: any, task: TaskDetailsModel) {
        this.selectedTaskId = task.id;
        this.taskdetails.loadDetails(task.id);
        this.showDialog();
    }

    public showDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.showModal();
        }
    }

    public cancelDialog() {
        this.closeDialog();
    }

    private closeDialog() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
    }

    public taskFormCompleted() {
        this.closeDialog();
        this.load(this.processId);
        this.taskFormCompletedEmitter.emit(this.processId);
    }

    public onRefreshClicked() {
        this.load(this.processId);
    }
}
