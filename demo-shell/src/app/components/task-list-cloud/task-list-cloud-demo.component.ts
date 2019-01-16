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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { LogService } from '@alfresco/adf-core';

@Component({
    templateUrl: './task-list-cloud-demo.component.html',
    styleUrls: [`./task-list-cloud-demo.component.scss`]
})

export class TaskListCloudDemoComponent implements OnInit {

    taskListForm: FormGroup;

    appName: string;
    defaultAppName: string;
    id: string;
    landingTaskId: string;
    parentTaskId: string;
    processDefinitionId: string;
    processInstanceId: string;
    status: string;
    assignee: string;
    name: string;
    createdDate: string;
    dueDate: string;
    selectionMode: string;
    multiSelection: boolean = false;

    statusOptions = [
        {value: '', title: 'All'},
        {value: 'CREATED', title: 'Created'},
        {value: 'CANCELLED', title: 'Cancelled'},
        {value: 'ASSIGNED', title: 'Assigned'},
        {value: 'SUSPENDED', title: 'Suspended'},
        {value: 'COMPLETED', title: 'Completed'},
        {value: 'DELETED', title: 'Deleted'}
    ];

    selectionModeOptions = [
        {value: 'none', title: 'None'},
        {value: 'single', title: 'Single'},
        {value: 'multiple', title: 'Multiple'}
    ];

    constructor(
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private logService: LogService) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['appName']) {
                    this.defaultAppName = params['appName'];
                }
            });
        }

        this.appName = this.defaultAppName;

        this.buildForm();
    }

    buildForm() {
        this.taskListForm = this.formBuilder.group({
            taskAppName: new FormControl(this.defaultAppName),
            taskCreatedDate: new FormControl(''),
            taskDueDate: new FormControl(''),
            taskAssignee: new FormControl(''),
            taskId: new FormControl(''),
            taskName: new FormControl(''),
            taskLandingTaskId: new FormControl(''),
            taskParentTaskId: new FormControl(''),
            taskSelectionMode: new FormControl(''),
            taskStatus: new FormControl(''),
            taskProcessDefinitionId: new FormControl(''),
            taskProcessInstanceId: new FormControl('')

        });

        this.taskListForm.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe((taskFilter) => {
                if (this.isFormValid()) {
                    this.filterTasks(taskFilter);
                }
            });
    }

    filterTasks(taskFilter: any) {
        this.appName = taskFilter.taskAppName;
        this.createdDate = taskFilter.taskCreatedDate.toString();
        this.dueDate = taskFilter.taskDueDate.toString();
        this.name = taskFilter.taskName;
        this.id = taskFilter.taskId;
        this.processDefinitionId = taskFilter.taskProcessDefinitionId;
        this.processInstanceId = taskFilter.taskProcessInstanceId;
        this.landingTaskId = taskFilter.taskLandingTaskId;
        this.parentTaskId = taskFilter.taskParentTaskId;
        this.status = taskFilter.taskStatus;
        this.selectionMode = taskFilter.taskSelectionMode;
        this.assignee = taskFilter.taskAssignee;
    }

    resetTaskForm() {
        this.taskListForm.reset();
        this.resetParameters();
    }

    resetParameters() {
        this.appName = '';
        this.createdDate = '';
        this.dueDate = '';
        this.name = '';
        this.id = '';
        this.processDefinitionId = '';
        this.processInstanceId = '';
        this.landingTaskId = '';
        this.parentTaskId = '';
        this.selectionMode = '';
        this.status = '';
        this.assignee = '';
    }

    isFormValid() {
        return this.taskListForm && this.taskListForm.dirty && this.taskListForm.valid;
    }

    toggleMultiselect() {
        this.multiSelection = !this.multiSelection;
    }

    showSelectedRows(rows: any) {

        const selectedRows = rows.map((row) => {
            return row.obj.entry;
        });
        this.logService.log(selectedRows);
    }

    get taskAppName(): AbstractControl {
        return this.taskListForm.get('appName');
    }

    get taskDueDate(): AbstractControl {
        return this.taskListForm.get('taskDueDate');
    }

    get taskCreatedDate(): AbstractControl {
        return this.taskListForm.get('taskCreatedDate');
    }

    get taskAssignee(): AbstractControl {
        return this.taskListForm.get('taskAssignee');
    }

    get taskId(): AbstractControl {
        return this.taskListForm.get('taskId');
    }

    get taskName(): AbstractControl {
        return this.taskListForm.get('taskName');
    }

    get taskLandingTaskId(): AbstractControl {
        return this.taskListForm.get('taskLandingTaskId');
    }

    get taskSelectionMode(): AbstractControl {
        return this.taskListForm.get('taskSelectionMode');
    }

    get taskStatus(): AbstractControl {
        return this.taskListForm.get('taskStatus');
    }

    get taskProcessDefinitionId(): AbstractControl {
        return this.taskListForm.get('taskProcessDefinitionId');
    }

    get taskProcessInstanceId(): AbstractControl {
        return this.taskListForm.get('taskProcessInstanceId');
    }

    get taskParentTaskId(): AbstractControl {
        return this.taskListForm.get('taskParentTaskId');
    }
}
