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

import { Component, AfterViewChecked, ViewChild, Input } from '@angular/core';
import { ALFRESCO_TASKLIST_DIRECTIVES,
    AppDefinitionRepresentationModel,
    FilterRepresentationModel,
    UserTaskFilterRepresentationModel
} from 'ng2-activiti-tasklist';
import { ACTIVITI_PROCESSLIST_DIRECTIVES } from 'ng2-activiti-processlist';
import { ActivitiForm } from 'ng2-activiti-form';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'activiti-demo',
    templateUrl: './activiti-demo.component.html',
    styleUrls: ['./activiti-demo.component.css'],
    directives: [ALFRESCO_TASKLIST_DIRECTIVES, ACTIVITI_PROCESSLIST_DIRECTIVES, ActivitiForm]
})
export class ActivitiDemoComponent implements AfterViewChecked {

    currentChoice: string = 'task-list';

    @ViewChild('activitifilter')
    activitifilter: any;

    @ViewChild('activitidetails')
    activitidetails: any;

    @ViewChild('activititasklist')
    activititasklist: any;

    @ViewChild('activitiprocesslist')
    activitiprocesslist: any;

    @ViewChild('activitiprocessdetails')
    activitiprocessdetails: any;

    currentTaskId: string;
    currentProcessInstanceId: string;

    taskSchemaColumns: any [] = [];
    processSchemaColumns: any [] = [];

    taskFilter: any;
    processFilter: any;

    sub: Subscription;

    @Input()
    appId: number;

    setChoice($event) {
        this.currentChoice = $event.target.value;
    }

    isProcessListSelected() {
        return this.currentChoice === 'process-list';
    }

    isTaskListSelected() {
        return this.currentChoice === 'task-list';
    }

    constructor(private route: ActivatedRoute) {
        this.taskSchemaColumns = [
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true}
            // {type: 'text', key: 'created', title: 'Created', sortable: true}
        ];
        this.processSchemaColumns = [
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true}
        ];
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.appId = params['appId'];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onAppClick(app: AppDefinitionRepresentationModel) {
        this.appId = app.id;
        this.taskFilter = null;
        this.currentTaskId = null;

        this.processFilter = null;
        this.currentProcessInstanceId = null;
    }

    onTaskFilterClick(event: FilterRepresentationModel) {
        this.taskFilter = event;
    }

    onSuccessTaskList(event: UserTaskFilterRepresentationModel) {
        this.currentTaskId = this.activititasklist.getCurrentTaskId();
    }

    onProcessFilterClick(event: any) {
        this.processFilter = event;
    }

    onSuccessProcessList(event: any) {
        this.currentProcessInstanceId = this.activitiprocesslist.getCurrentProcessId();
    }

    onTaskRowClick(taskId) {
        this.currentTaskId = taskId;
    }

    onProcessRowClick(processInstanceId) {
        this.currentProcessInstanceId = processInstanceId;
    }

    processCancelled(data: any) {
        this.currentProcessInstanceId = null;
        this.activitiprocesslist.reload();
    }

    taskFormCompleted(data: any) {
        this.activitiprocesslist.reload();
    }

    onFormCompleted(form) {
        this.activititasklist.load(this.taskFilter);
        this.currentTaskId = null;
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

}
