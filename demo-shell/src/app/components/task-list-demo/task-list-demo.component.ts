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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * distributed under the License is distributed on an "AS IS" BASIS,
 * limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { NotificationService } from '@alfresco/adf-core';
import { debounceTime } from 'rxjs/operators';

@Component({
    templateUrl: './task-list-demo.component.html',
    styleUrls: [`./task-list-demo.component.scss`],
})

export class TaskListDemoComponent implements OnInit {

    defaultAppId: number;

    taskListForm: FormGroup;

    errorMessage: string;

    appId: number;

    id: string;

    processDefinitionId: string;

    processInstanceId: string;

    state: string;

    assignment: string;

    name: string;

    sort: string;

    start: number;

    includeProcessInstance: boolean;

    assignmentOptions = [
        {value: 'assignee', title: 'Assignee'},
        {value: 'candidate', title: 'Candidate'}
    ];

    includeProcessInstanceOptions = [
        {value: 'include', title: 'Include'},
        {value: 'exclude', title: 'Exclude'}
    ];

    stateOptions = [
        {value: 'all', title: 'All'},
        {value: 'active', title: 'Active'},
        {value: 'completed', title: 'Completed'}
    ];

    sortOptions = [
        {value: 'created-asc', title: 'Created (asc)'},
        {value: 'created-desc', title: 'Created (desc)'},
        {value: 'due-asc', title: 'Due (asc)'},
        {value: 'due-desc', title: 'Due (desc)'}
    ];

    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.defaultAppId = +params['id'];
                } else {
                    this.defaultAppId = 0;
                }
            });
        }

        this.appId = this.defaultAppId;
        this.errorMessage = 'Insert App Id';

        this.buildForm();
    }

    buildForm() {
        this.taskListForm = this.formBuilder.group({
            taskAppId: new FormControl(this.defaultAppId, [Validators.required, Validators.pattern('^[0-9]*$')]),
            taskName: new FormControl(''),
            taskId: new FormControl(''),
            taskProcessDefinitionId: new FormControl(''),
            taskProcessInstanceId: new FormControl(''),
            taskAssignment: new FormControl(''),
            taskState: new FormControl(''),
            taskSort: new FormControl(''),
            taskStart: new FormControl('', [Validators.pattern('^[0-9]*$')]),
            taskIncludeProcessInstance: new FormControl('')
        });

        this.taskListForm.valueChanges
            .pipe(
                debounceTime(500)
            )
            .subscribe(taskFilter => {
                if (this.isFormValid()) {
                    this.filterTasks(taskFilter);
                }
        });
    }

    filterTasks(taskFilter: any) {
        this.appId = taskFilter.taskAppId;
        this.id = taskFilter.taskId;
        this.processDefinitionId = taskFilter.taskProcessDefinitionId;
        this.processInstanceId = taskFilter.taskProcessInstanceId;
        this.name = taskFilter.taskName;
        this.assignment = taskFilter.taskAssignment;
        this.state = taskFilter.taskState;
        this.sort = taskFilter.taskSort;
        this.start = taskFilter.taskStart;

        this.includeProcessInstance = taskFilter.taskIncludeProcessInstance === 'include';
    }

    onError($event) {
        const errorMessage = JSON.parse($event.message).message;
        this.notificationService.openSnackMessageAction(errorMessage, 'Reset', 5000).onAction().subscribe(() => {
           this.resetTaskForm();
        });
    }

    resetTaskForm() {
        this.taskListForm.reset();
    }

    isFormValid() {
        return this.taskListForm && this.taskListForm.dirty && this.taskListForm.valid;
    }

    get taskAppId(): AbstractControl {
        return this.taskListForm.get('taskAppId');
    }

    get taskId(): AbstractControl {
        return this.taskListForm.get('taskId');
    }

    get taskProcessDefinitionId(): AbstractControl {
        return this.taskListForm.get('taskProcessDefinitionId');
    }

    get taskProcessInstanceId(): AbstractControl {
        return this.taskListForm.get('taskProcessInstanceId');
    }

    get taskName(): AbstractControl {
        return this.taskListForm.get('taskName');
    }

    get taskAssignment(): AbstractControl {
        return this.taskListForm.get('taskAssignment');
    }

    get taskState(): AbstractControl {
        return this.taskListForm.get('taskState');
    }

    get taskSort(): AbstractControl {
        return this.taskListForm.get('taskSort');
    }

    get taskIncludeProcessInstance(): AbstractControl {
        return this.taskListForm.get('taskIncludeProcessInstance');
    }

    get taskStart(): AbstractControl {
        return this.taskListForm.get('taskStart');
    }
}
