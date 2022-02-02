/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import moment from 'moment-es6';
import { Subject } from 'rxjs';

const DEFAULT_SIZE = 20;

@Component({
    selector: 'app-task-list-demo',
    templateUrl: './task-list-demo.component.html',
    styleUrls: [`./task-list-demo.component.scss`]
})

export class TaskListDemoComponent implements OnInit, OnDestroy {
    taskListForm: FormGroup;

    errorMessage: string;
    minValue = 1;

    appId: number;
    defaultAppId: number;
    id: string;
    processDefinitionId: string;
    processInstanceId: string;
    state: string;
    assignment: string;
    name: string;
    sort: string;
    start: number;
    size: number = DEFAULT_SIZE;
    page: number = 0;
    dueAfter: string;
    dueBefore: string;

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

    private onDestroy$ = new Subject<boolean>();

    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.defaultAppId = +params['id'];
                }
            });
        }

        this.appId = this.defaultAppId;
        this.errorMessage = 'Insert App Id';

        this.buildForm();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    buildForm() {
        this.taskListForm = this.formBuilder.group({
            taskAppId: new FormControl(this.defaultAppId, [Validators.pattern('^[0-9]*$')]),
            taskName: new FormControl(''),
            taskId: new FormControl(''),
            taskProcessDefinitionId: new FormControl(''),
            taskProcessInstanceId: new FormControl(''),
            taskAssignment: new FormControl(''),
            taskState: new FormControl(''),
            taskSort: new FormControl(''),
            taskSize: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            taskPage: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            taskDueAfter: new FormControl(''),
            taskDueBefore: new FormControl(''),
            taskStart: new FormControl('', [Validators.pattern('^[0-9]*$')]),
            taskIncludeProcessInstance: new FormControl('')
        });

        this.taskListForm.valueChanges
            .pipe(
                debounceTime(500),
                takeUntil(this.onDestroy$)
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
        this.dueAfter = this.setDueAfterFilter(taskFilter.taskDueAfter);
        this.dueBefore = taskFilter.taskDueBefore;

        if (taskFilter.taskSize) {
            this.size = parseInt(taskFilter.taskSize, 10);
        }

        if (taskFilter.taskPage) {
            const pageValue = parseInt(taskFilter.taskPage, 10);
            this.page = pageValue > 0 ? pageValue - 1 : pageValue;
        } else {
            this.page = 0;
        }

        this.includeProcessInstance = taskFilter.taskIncludeProcessInstance === 'include';
    }

    setDueAfterFilter(date): string {
        const dueDateFilter = moment(date);
        dueDateFilter.set({
            hour: 23,
            minute: 59,
            second: 59
        });
        return dueDateFilter.toString();
    }

    resetTaskForm() {
        this.taskListForm.reset();
        this.resetQueryParameters();
    }

    resetQueryParameters() {
        this.appId = null;
        this.id = null;
        this.processDefinitionId = null;
        this.processInstanceId = null;
        this.name = null;
        this.assignment = null;
        this.state = null;
        this.sort = null;
        this.start = null;
        this.size = DEFAULT_SIZE;
        this.page = null;
        this.dueAfter = null;
        this.dueBefore = null;
    }

    isFormValid() {
        return this.taskListForm && this.taskListForm.dirty && this.taskListForm.valid;
    }

    private getControl<T extends AbstractControl>(key: string): T {
        return this.taskListForm.get(key) as T;
    }

    get taskAppId(): FormControl {
        return this.getControl<FormControl>('taskAppId');
    }

    get taskId(): FormControl {
        return this.getControl<FormControl>('taskId');
    }

    get taskProcessDefinitionId(): FormControl {
        return this.getControl<FormControl>('taskProcessDefinitionId');
    }

    get taskProcessInstanceId(): FormControl {
        return this.getControl<FormControl>('taskProcessInstanceId');
    }

    get taskName(): FormControl {
        return this.getControl<FormControl>('taskName');
    }

    get taskAssignment(): FormControl {
        return this.getControl<FormControl>('taskAssignment');
    }

    get taskState(): FormControl {
        return this.getControl<FormControl>('taskState');
    }

    get taskSort(): FormControl {
        return this.getControl<FormControl>('taskSort');
    }

    get taskIncludeProcessInstance(): FormControl {
        return this.getControl<FormControl>('taskIncludeProcessInstance');
    }

    get taskStart(): FormControl {
        return this.getControl<FormControl>('taskStart');
    }

    get taskSize(): FormControl {
        return this.getControl<FormControl>('taskSize');
    }

    get taskPage(): FormControl {
        return this.getControl<FormControl>('taskPage');
    }

    get taskDueAfter(): FormControl {
        return this.getControl<FormControl>('taskDueAfter');
    }

    get taskDueBefore(): FormControl {
        return this.getControl<FormControl>('taskDueBefore');
    }
}
