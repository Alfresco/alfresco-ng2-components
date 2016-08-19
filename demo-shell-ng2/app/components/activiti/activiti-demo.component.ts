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

import { Component, AfterViewChecked, ViewChild } from '@angular/core';
import { ALFRESCO_TASKLIST_DIRECTIVES } from 'ng2-activiti-tasklist';
import { ActivitiForm } from 'ng2-activiti-form';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'activiti-demo',
    templateUrl: './activiti-demo.component.html',
    styleUrls: ['./activiti-demo.component.css'],
    directives: [ALFRESCO_TASKLIST_DIRECTIVES, ActivitiForm]
})
export class ActivitiDemoComponent implements AfterViewChecked {

    currentChoice: string = 'task-list';

    @ViewChild('activitidetails')
    activitidetails: any;

    @ViewChild('activititasklist')
    activititasklist: any;

    currentTaskId: string;

    schemaColumn: any [] = [];

    taskFilter: any;

    setChoice($event) {
        this.currentChoice = $event.target.value;
    }

    isProcessListSelected() {
        return this.currentChoice === 'process-list';
    }

    isTaskListSelected() {
        return this.currentChoice === 'task-list';
    }

    constructor() {
        console.log('Activiti demo component');
        this.schemaColumn = [
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true}
            // {type: 'text', key: 'created', title: 'Created', sortable: true}
        ];
    }

    onFilterClick(event: any) {
        this.taskFilter = event;
        this.activititasklist.load(this.taskFilter);
    }

    onRowClick(taskId) {
        this.currentTaskId = taskId;
        this.activitidetails.loadDetails(this.currentTaskId);
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

}
