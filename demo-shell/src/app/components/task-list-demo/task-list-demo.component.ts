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
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
    templateUrl: './task-list-demo.component.html',
    styleUrls: [`./task-list-demo.component.scss`],
})

export class TaskListDemoComponent implements OnInit {

    defaultAppId: number;

    taskListForm: FormGroup;

    errorMessage: string;

    constructor(private route: ActivatedRoute,
                private formBuilder: FormBuilder) {
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

        this.errorMessage = 'Insert App Id';

        this.buildForm();

    }

    buildForm() {


        this.taskListForm = this.formBuilder.group({
            appId: new FormControl(this.defaultAppId, Validators.required),
            taskName: new FormControl(''),
            taskProcessDefinitionId: new FormControl(''),
            taskAssignment: new FormControl(''),
            taskState: new FormControl(''),
            taskSort: new FormControl('')
        });

        this.taskListForm.valueChanges
            .debounceTime(500)
            .subscribe(taskFilter => {
                this.filterTasks(taskFilter);
        });
    }

    filterTasks(taskFilter: any) {
        this.appId = taskFilter.appId;
        this.processDefinitionId = taskFilter.taskProcessDefinitionId;
        this.name = taskFilter.taskName;
        this.assignment = taskFilter.taskAssignment;
        this.state = taskFilter.taskState;
        this.sort = taskFilter.taskSort;
    }

    resetTaskForm() {
        this.taskListForm.reset();
    }


    // get appIds() { return this.taskListForm.get('appId'); }
}
