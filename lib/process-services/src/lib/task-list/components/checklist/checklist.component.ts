/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskListService } from '../../services/tasklist.service';
import { TaskRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'adf-checklist',
    imports: [
        CommonModule,
        TranslatePipe,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
    ],
    templateUrl: './checklist.component.html',
    styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnChanges {
    /**
     * The id of the parent task to which subtasks are attached.
     */
    @Input()
    taskId: string;

    /**
     * Toggle readonly state of the form.
     * All form widgets will render as readonly if enabled.
     */
    @Input()
    readOnly: boolean = false;

    /** (required) The assignee id that the subtasks are assigned to. */
    @Input()
    assignee: number;

    /** Emitted when a new checklist task is created. */
    @Output()
    checklistTaskCreated = new EventEmitter<TaskRepresentation>();

    /** Emitted when a checklist task is deleted. */
    @Output()
    checklistTaskDeleted: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    @ViewChild('dialog', { static: true })
    addNewDialog: any;

    taskName: string;

    checklist: TaskRepresentation[] = [];

    constructor(private taskListService: TaskListService, private dialog: MatDialog) {}

    ngOnChanges(changes: SimpleChanges) {
        const taskId = changes['taskId'];
        if (taskId?.currentValue) {
            this.getTaskChecklist();
            return;
        }
    }

    getTaskChecklist() {
        this.checklist = [];
        if (this.taskId) {
            this.taskListService.getTaskChecklist(this.taskId).subscribe(
                (taskDetailsModel) => {
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
        const newTask = new TaskRepresentation({
            name: this.taskName,
            parentTaskId: this.taskId,
            assignee: { id: this.assignee }
        });
        this.taskListService.addTask(newTask).subscribe(
            (taskDetailsModel) => {
                this.checklist.push(taskDetailsModel);
                this.checklistTaskCreated.emit(taskDetailsModel);
                this.taskName = '';
            },
            (error) => {
                this.error.emit(error);
            }
        );
        this.cancel();
    }

    public delete(taskId: string) {
        this.taskListService.deleteTask(taskId).subscribe(
            () => {
                this.checklist = this.checklist.filter((check) => check.id !== taskId);
                this.checklistTaskDeleted.emit(taskId);
            },
            (error) => {
                this.error.emit(error);
            }
        );
    }

    public cancel() {
        this.dialog.closeAll();
        this.taskName = '';
    }
}
