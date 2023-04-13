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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import moment from 'moment';
import { Subject } from 'rxjs';

const DEFAULT_SIZE = 20;

@Component({
    selector: 'app-task-list-demo',
    templateUrl: './task-list-demo.component.html',
    styleUrls: [`./task-list-demo.component.scss`]
})

export class TaskListDemoComponent implements OnInit, OnDestroy {
    taskListForm: UntypedFormGroup;

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
                private formBuilder: UntypedFormBuilder) {
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
            taskAppId: new UntypedFormControl(this.defaultAppId, [Validators.pattern('^[0-9]*$')]),
            taskName: new UntypedFormControl(''),
            taskId: new UntypedFormControl(''),
            taskProcessDefinitionId: new UntypedFormControl(''),
            taskProcessInstanceId: new UntypedFormControl(''),
            taskAssignment: new UntypedFormControl(''),
            taskState: new UntypedFormControl(''),
            taskSort: new UntypedFormControl(''),
            taskSize: new UntypedFormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            taskPage: new UntypedFormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(this.minValue)]),
            taskDueAfter: new UntypedFormControl(''),
            taskDueBefore: new UntypedFormControl(''),
            taskStart: new UntypedFormControl('', [Validators.pattern('^[0-9]*$')]),
            taskIncludeProcessInstance: new UntypedFormControl('')
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

    get taskAppId(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskAppId');
    }

    get taskId(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskId');
    }

    get taskProcessDefinitionId(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskProcessDefinitionId');
    }

    get taskProcessInstanceId(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskProcessInstanceId');
    }

    get taskName(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskName');
    }

    get taskAssignment(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskAssignment');
    }

    get taskState(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskState');
    }

    get taskSort(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskSort');
    }

    get taskIncludeProcessInstance(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskIncludeProcessInstance');
    }

    get taskStart(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskStart');
    }

    get taskSize(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskSize');
    }

    get taskPage(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskPage');
    }

    get taskDueAfter(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskDueAfter');
    }

    get taskDueBefore(): UntypedFormControl {
        return this.getControl<UntypedFormControl>('taskDueBefore');
    }
}
