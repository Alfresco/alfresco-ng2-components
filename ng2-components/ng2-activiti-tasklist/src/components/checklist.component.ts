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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { Observable, Observer } from 'rxjs/Rx';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';

declare let dialogPolyfill: any;

@Component({
    selector: 'adf-checklist, activiti-checklist',
    templateUrl: './checklist.component.html',
    styleUrls: ['./checklist.component.css'],
    providers: [TaskListService]
})
export class ChecklistComponent implements OnInit, OnChanges {

    @Input()
    taskId: string;

    @Input()
    readOnly: boolean = false;

    @Input()
    assignee: string;

    @Output()
    checklistTaskCreated: EventEmitter<TaskDetailsModel> = new EventEmitter<TaskDetailsModel>();

    @Output()
    checklistTaskDeleted: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    dialog: any;

    taskName: string;

    checklist: TaskDetailsModel [] = [];

    private taskObserver: Observer<TaskDetailsModel>;
    task$: Observable<TaskDetailsModel>;

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(translateService: AlfrescoTranslationService,
                private activitiTaskList: TaskListService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
        this.task$ = new Observable<TaskDetailsModel>(observer => this.taskObserver = observer).share();
    }

    ngOnInit() {
        this.task$.subscribe((task: TaskDetailsModel) => {
            this.checklist.push(task);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        let taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.getTaskChecklist(taskId.currentValue);
            return;
        }
    }

    public getTaskChecklist(taskId: string) {
        this.checklist = [];
        if (this.taskId) {
            this.activitiTaskList.getTaskChecklist(this.taskId).subscribe(
                (res: TaskDetailsModel[]) => {
                    res.forEach((task) => {
                        this.taskObserver.next(task);
                    });
                },
                (error) => {
                    this.error.emit(error);
                }
            );
        } else {
            this.checklist = [];
        }
    }

    public showDialog() {
        if (this.dialog) {
            if (!this.dialog.nativeElement.showModal) {
                dialogPolyfill.registerDialog(this.dialog.nativeElement);
            }
            this.dialog.nativeElement.showModal();
        }
    }

    public add() {
        let newTask = new TaskDetailsModel({
            name: this.taskName,
            parentTaskId: this.taskId,
            assignee: { id: this.assignee }
        });
        this.activitiTaskList.addTask(newTask).subscribe(
            (res: TaskDetailsModel) => {
                this.checklist.push(res);
                this.checklistTaskCreated.emit(res);
                this.taskName = '';
            },
            (error) => {
                this.error.emit(error);
            }
        );
        this.cancel();
    }

    public delete(taskId: string) {
        this.activitiTaskList.deleteTask(taskId).subscribe(
            () => {
                this.checklist = this.checklist.filter(check => check.id !== taskId);
                this.checklistTaskDeleted.emit(taskId);
            },
            (error) => {
                this.error.emit(error);
            });
    }

    public cancel() {
        if (this.dialog) {
            this.dialog.nativeElement.close();
        }
        this.taskName = '';
    }
}
