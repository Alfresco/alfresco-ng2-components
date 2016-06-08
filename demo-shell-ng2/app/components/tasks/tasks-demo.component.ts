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

import { Component, OnInit } from 'angular2/core';
import { ActivitiService } from './activiti.service';

@Component({
    selector: 'tasks-demo',
    template: `
        <h2>Tasks</h2>
        <ul>
            <li *ngFor="#task of tasks">
                {{task.name}}
            </li>
        </ul>
    `,
    providers: [ActivitiService]
})
export class TasksDemoComponent implements OnInit {

    tasks: any[];

    constructor(
        private activitiService: ActivitiService) {}

    ngOnInit() {
        this.activitiService
            .login('denys.vuika@alfresco.com', 'test')
            .then(() => {
                this.activitiService
                    .getTasks()
                    .then((tasks) => {
                        this.tasks = tasks || []
                        console.log(this.tasks);
                    });
            });
    }

}
