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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-checklist',
    templateUrl: './checklist.component.html',
    styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnChanges {

    /** (required) The id of the parent task to which subtasks are
     * attached.
     */
    @Input()
    taskId: string;

    /** Toggle readonly state of the form. All form widgets
     * will render as readonly if enabled.
     */
    @Input()
    readOnly: boolean = false;

    /** (required) The assignee id that the subtasks are assigned to. */
    @Input()
    assignee: string;

    /** Emitted when a new checklist task is created. */
    @Output()
    checklistTaskCreated: EventEmitter<TaskDetailsModel> = new EventEmitter<TaskDetailsModel>();

    /** Emitted when a checklist task is deleted. */
    @Output()
    checklistTaskDeleted: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('dialog')
    addNewDialog: any;

    taskName: string;

    checklist: TaskDetailsModel [] = [];

    /**
     * Constructor
     * @param auth
     * @param translate
     */
    constructor(private activitiTaskList: TaskListService,
                private dialog: MatDialog) {
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
                (taskDetailsModel: TaskDetailsModel[]) => {
                    taskDetailsModel.forEach((task) => {
                        this.checklist.push(task);
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

    showDialog() {
        this.dialog.open(this.addNewDialog, { width: '350px' });
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
        this.dialog.closeAll();
        this.taskName = '';
    }
}
