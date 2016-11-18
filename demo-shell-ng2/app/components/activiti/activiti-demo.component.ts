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
import {
    AppDefinitionRepresentationModel,
    FilterRepresentationModel,
    ActivitiApps,
    ActivitiTaskList
} from 'ng2-activiti-tasklist';
import { ActivitiProcessInstanceListComponent } from 'ng2-activiti-processlist';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {
    ObjectDataTableAdapter,
    DataSorting
} from 'ng2-alfresco-datatable';

import { FormRenderingService } from 'ng2-activiti-form';
import { /*CustomEditorComponent*/ CustomStencil01 } from './custom-editor/custom-editor.component';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'activiti-demo',
    templateUrl: './activiti-demo.component.html',
    styleUrls: ['./activiti-demo.component.css']
})
export class ActivitiDemoComponent implements AfterViewChecked {

    @ViewChild('activitiapps')
    activitiapps: ActivitiApps;

    @ViewChild('activitifilter')
    activitifilter: any;

    @ViewChild('activitidetails')
    activitidetails: any;

    @ViewChild(ActivitiTaskList)
    activititasklist: ActivitiTaskList;

    @ViewChild('activitiprocessfilter')
    activitiprocessfilter: any;

    @ViewChild(ActivitiProcessInstanceListComponent)
    activitiprocesslist: ActivitiProcessInstanceListComponent;

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

    taskFilter: FilterRepresentationModel;
    report: any;
    processFilter: FilterRepresentationModel;

    sub: Subscription;

    dataTasks: ObjectDataTableAdapter;
    dataProcesses: ObjectDataTableAdapter;

    constructor(private route: ActivatedRoute, private formRenderingService: FormRenderingService) {
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
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column'},
                {type: 'text', key: 'started', title: 'Started', cssClass: 'hidden'}
            ]
        );

        // Uncomment this line to replace all 'text' field editors with custom component
        // formRenderingService.setComponentTypeResolver('text', () => CustomEditorComponent, true);

        // Uncomment this line to map 'custom_stencil_01' to local editor component
        formRenderingService.setComponentTypeResolver('custom_stencil_01', () => CustomStencil01, true);
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

        this.changeTab('apps', 'tasks');
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

    onReportClick(event: any) {
        this.report = event;
    }

    onSuccessTaskFilterList(event: any) {
        this.taskFilter = this.activitifilter.getCurrentFilter();
    }

    onStartTaskSuccess(event: any) {
        this.activititasklist.reload();
    }

    onSuccessTaskList(event: FilterRepresentationModel) {
        this.currentTaskId = this.activititasklist.getCurrentId();
    }

    onProcessFilterClick(event: FilterRepresentationModel) {
        this.processFilter = event;
    }

    onSuccessProcessFilterList(event: any) {
        this.processFilter = this.activitiprocessfilter.getCurrentFilter();
    }

    onSuccessProcessList(event: any) {
        this.currentProcessInstanceId = this.activitiprocesslist.getCurrentId();
    }

    onTaskRowClick(taskId) {
        this.currentTaskId = taskId;
    }

    onProcessRowClick(processInstanceId) {
        this.currentProcessInstanceId = processInstanceId;
    }

    onStartProcessInstance() {
        this.activitiprocesslist.reload();
    }

    processCancelled(data: any) {
        this.currentProcessInstanceId = null;
        this.activitiprocesslist.reload();
    }

    onSuccessNewProcess(data: any) {
        this.activitiprocesslist.reload();
    }

    taskFormCompleted(data: any) {
        this.activitiprocesslist.reload();
    }

    onFormCompleted(form) {
        this.activititasklist.reload();
        this.currentTaskId = null;
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

}
