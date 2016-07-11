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
import { ActivitiService } from './activiti.service';
import {
    ALFRESCO_DATATABLE_DIRECTIVES,
    ObjectDataTableAdapter
} from 'ng2-alfresco-datatable';

import {
    AlfrescoAuthenticationService
} from 'ng2-alfresco-core';

@Component({
    selector: 'tasks-demo',
    template: `
        <div class="container">
            <alfresco-datatable [data]="tasks"></alfresco-datatable>
        </div>
    `,
    directives: [ALFRESCO_DATATABLE_DIRECTIVES],
    providers: [ActivitiService],
    styles: [':host > .container { padding: 10px; }']
})
export class TasksDemoComponent implements OnInit {

    tasks: ObjectDataTableAdapter;

    constructor(
        private activitiService: ActivitiService,
        private auth: AlfrescoAuthenticationService) {}

    ngOnInit() {
        if (this.auth.isLoggedIn('BPM')) {
            this.activitiService
                .getTasks()
                .then((data) => {
                    let tasks = data || [];
                    console.log(tasks);
                    this.loadTasks(tasks);
                });
        } else {
            console.error('User unauthorized');
        }

    }

    private loadTasks(tasks: any[]) {
        tasks = tasks.map(t => {
            t.name = t.name || 'Nameless task';
            if (t.name.length > 50) {
                t.name = t.name.substring(0, 50) + '...';
            }
            return t;
        });

        this.tasks = new ObjectDataTableAdapter(tasks, [
            { type: 'text', key: 'id', title: 'Id'},
            { type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true },
            { type: 'text', key: 'formKey', title: 'Form Key', sortable: true },
            { type: 'text', key: 'created', title: 'Created', sortable: true }
        ]);
    }

}
