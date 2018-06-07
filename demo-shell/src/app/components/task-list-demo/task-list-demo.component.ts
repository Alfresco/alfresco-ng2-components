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
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
    templateUrl: './task-list-demo.component.html',
    styleUrls: [`./task-list-demo.component.scss`],
})

export class TaskListDemoComponent implements OnInit{

    appId: number;

    processDefinitionId: string;

    state: string;

    assignment: string;

    name: string;

    sort: string;

    taskListForm: FormGroup;

    constructor(private route: ActivatedRoute, 
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                if (params['id']) {
                    this.appId = +params['id'];
                } else {
                    this.appId = 0;
                }
            });
        }

        this.buildForm();
    }

    buildForm() {
        this.taskListForm = this.formBuilder.group({
            taskName: '',
            taskProcessDefinitionId: '',
            taskAssignment: '',
            taskState: '',
            taskSort: ''
        });

        this.taskListForm.valueChanges
            .debounceTime(500)
            .subscribe(taskFilter => {
                this.filterTasks(taskFilter);
        });
    }

    filterTasks(taskFilter: any) {
        this.processDefinitionId = taskFilter.taskProcessDefinitionId;
        this.name = taskFilter.taskName;
        this.assignment = taskFilter.taskAssignment;
        this.state = taskFilter.taskState;
        this.sort = taskFilter.taskSort;
    }

    resetTaskForm() {
        this.taskListForm.reset();
    }

}