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
    UserTaskFilterRepresentationModel,
    ActivitiApps
} from 'ng2-activiti-tasklist';
import { ACTIVITI_PROCESSLIST_DIRECTIVES } from 'ng2-activiti-processlist';
import { ActivitiForm } from 'ng2-activiti-form';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {
    ObjectDataTableAdapter,
    DataSorting
} from 'ng2-alfresco-datatable';

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

    @ViewChild('activitiapps')
    activitiapps: ActivitiApps;

    @ViewChild('activitifilter')
    activitifilter: any;

    @ViewChild('activitidetails')
    activitidetails: any;

    @ViewChild('activititasklist')
    activititasklist: any;

    @ViewChild('activitiprocessfilter')
    activitiprocessfilter: any;

    @ViewChild('activitiprocesslist')
    activitiprocesslist: any;

    @ViewChild('activitiprocessdetails')
    activitiprocessdetails: any;

    @ViewChild('tabmain')
    tabMain: any;

    @ViewChild('tabheader')
    tabHeader: any;

    @Input()
    appId: number;

    layoutType: string;
    currentTaskId: string;
    currentProcessInstanceId: string;

    taskSchemaColumns: any [] = [];
    processSchemaColumns: any [] = [];

    taskFilter: any;
    processFilter: any;

    sub: Subscription;

    dataTasks: ObjectDataTableAdapter;
    dataProcesses: ObjectDataTableAdapter;

    isProcessListSelected() {
        return this.currentChoice === 'process-list';
    }

    isTaskListSelected() {
        return this.currentChoice === 'task-list';
    }

    constructor(private route: ActivatedRoute) {
        this.dataTasks = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                {type: 'text', key: 'created', title: 'Created', cssClass: 'hidden', sortable: true}
            ]
        );
        this.dataTasks.setSorting(new DataSorting('created', 'desc'));

        this.dataProcesses = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                {type: 'text', key: 'started', title: 'Started', cssClass: 'hidden', sortable: true}
            ]
        );
        this.dataProcesses.setSorting(new DataSorting('started', 'desc'));
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.appId = params['appId'];
        });
        this.layoutType = ActivitiApps.LAYOUT_GRID;
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

        this.changeTab('apps','tasks');
    }

    changeTab(origin: string, destination: string) {
        this.tabMain.nativeElement.children[origin].classList.remove('is-active');
        this.tabMain.nativeElement.children[destination].classList.add('is-active');

        this.tabHeader.nativeElement.children[`${origin}-header`].classList.remove('is-active');
        this.tabHeader.nativeElement.children[`${destination}-header`].classList.add('is-active');
    }

    onTaskFilterClick(event: FilterRepresentationModel) {
        this.taskFilter = event;
    }

    onSuccessTaskFilterList(event: any) {
        this.taskFilter = this.activitifilter.getCurrentFilter();
    }

    onSuccessTaskList(event: UserTaskFilterRepresentationModel) {
        this.currentTaskId = this.activititasklist.getCurrentTaskId();
    }

    onProcessFilterClick(event: any) {
        this.processFilter = event;
    }

    onSuccessProcessFilterList(event: any) {
        this.processFilter = this.activitiprocessfilter.getCurrentFilter();
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
