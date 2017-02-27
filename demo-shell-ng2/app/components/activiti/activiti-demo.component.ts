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

import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
    ActivitiApps,
    ActivitiFilters,
    ActivitiTaskList,
    FilterRepresentationModel,
    TaskDetailsEvent
} from 'ng2-activiti-tasklist';
import {
    ActivitiProcessFilters,
    ActivitiProcessInstanceDetails,
    ActivitiProcessInstanceListComponent,
    ActivitiStartProcessInstance,
    FilterProcessRepresentationModel,
    ProcessInstance
} from 'ng2-activiti-processlist';
import { AnalyticsReportListComponent } from 'ng2-activiti-analytics';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import {
    ObjectDataTableAdapter,
    ObjectDataRow,
    DataSorting
} from 'ng2-alfresco-datatable';
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { FormService, FormRenderingService, FormEvent, FormFieldEvent } from 'ng2-activiti-form';
import { /*CustomEditorComponent*/ CustomStencil01 } from './custom-editor/custom-editor.component';

declare var componentHandler;

const currentProcessIdNew = '__NEW__';

@Component({
    selector: 'activiti-demo',
    templateUrl: './activiti-demo.component.html',
    styleUrls: ['./activiti-demo.component.css']
})
export class ActivitiDemoComponent implements AfterViewInit {

    @ViewChild(ActivitiFilters)
    activitifilter: ActivitiFilters;

    @ViewChild(ActivitiTaskList)
    activititasklist: ActivitiTaskList;

    @ViewChild(ActivitiProcessFilters)
    activitiprocessfilter: ActivitiProcessFilters;

    @ViewChild(ActivitiProcessInstanceListComponent)
    activitiprocesslist: ActivitiProcessInstanceListComponent;

    @ViewChild(ActivitiProcessInstanceDetails)
    activitiprocessdetails: ActivitiProcessInstanceDetails;

    @ViewChild(ActivitiStartProcessInstance)
    activitiStartProcess: ActivitiStartProcessInstance;

    @ViewChild(AnalyticsReportListComponent)
    analyticsreportlist: AnalyticsReportListComponent;

    @Input()
    appId: number = null;

    layoutType: string;
    currentTaskId: string;
    currentProcessInstanceId: string;

    taskSchemaColumns: any [] = [];
    processSchemaColumns: any [] = [];

    activeTab: string = 'tasks'; // tasks|processes|reports

    taskFilter: FilterRepresentationModel;
    report: any;
    processFilter: FilterProcessRepresentationModel;

    sub: Subscription;

    dataTasks: ObjectDataTableAdapter;
    dataProcesses: ObjectDataTableAdapter;

    constructor(private elementRef: ElementRef,
                private route: ActivatedRoute,
                private apiService: AlfrescoApiService,
                private formRenderingService: FormRenderingService,
                private formService: FormService) {
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

        // Uncomment this line to replace all 'text' field editors with custom component
        // formRenderingService.setComponentTypeResolver('text', () => CustomEditorComponent, true);

        // Uncomment this line to map 'custom_stencil_01' to local editor component
        formRenderingService.setComponentTypeResolver('custom_stencil_01', () => CustomStencil01, true);

        formService.formLoaded.subscribe((e: FormEvent) => {
            console.log(`Form loaded: ${e.form.id}`);
        });

        formService.formFieldValueChanged.subscribe((e: FormFieldEvent) => {
            console.log(`Field value changed. Form: ${e.form.id}, Field: ${e.field.id}, Value: ${e.field.value}`);
        });
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let applicationId = params['appId'];
            if (applicationId && applicationId !== '0') {
                this.appId = params['appId'];
            }

            this.taskFilter = null;
            this.currentTaskId = null;
            this.processFilter = null;
            this.currentProcessInstanceId = null;
        });
        this.layoutType = ActivitiApps.LAYOUT_GRID;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onTaskFilterClick(event: FilterRepresentationModel) {
        if (event) {
            this.taskFilter = event;
        }
    }

    onReportClick(event: any) {
        this.report = event;
    }

    onSuccessTaskFilterList(event: any) {
        this.taskFilter = this.activitifilter.getCurrentFilter();
    }

    onStartTaskSuccess(event: any) {
        this.activitifilter.selectFirstFilter();
        this.taskFilter = this.activitifilter.getCurrentFilter();
        this.activititasklist.reload();
    }

    onSuccessTaskList(event: FilterRepresentationModel) {
        this.currentTaskId = this.activititasklist.getCurrentId();
    }

    onProcessFilterClick(event: FilterProcessRepresentationModel) {
        this.currentProcessInstanceId = null;
        this.processFilter = event;
    }

    onSuccessProcessFilterList() {
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

    onEditReport(name: string) {
        this.analyticsreportlist.reload();
    }

    onReportSaved() {
        this.analyticsreportlist.reload();
    }

    onReportDeleted() {
        this.analyticsreportlist.reload();
        this.selectFirstElementInReportList();
    }

    selectFirstElementInReportList() {
        if (!this.analyticsreportlist.isReportsEmpty()) {
            this.analyticsreportlist.selectReport(this.analyticsreportlist.reports[0]);
        }
    }

    navigateStartProcess() {
        this.resetProcessFilters();
        this.reloadProcessFilters();
        this.currentProcessInstanceId = currentProcessIdNew;
    }

    onStartProcessInstance(instance: ProcessInstance) {
        this.currentProcessInstanceId = instance.id;
        this.activitiStartProcess.reset();
        this.resetProcessFilters();
    }

    isStartProcessMode() {
        return this.currentProcessInstanceId === currentProcessIdNew;
    }

    processCancelled(data: any) {
        this.currentProcessInstanceId = null;
        this.activitiprocesslist.reload();
    }

    onSuccessNewProcess(data: any) {
        this.activitiprocesslist.reload();
    }

    onFormCompleted(form) {
        this.activititasklist.reload();
        this.currentTaskId = null;
    }

    onTaskCreated(data: any) {
        this.currentTaskId = data.parentTaskId;
        this.activititasklist.reload();
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }

        this.loadStencilScriptsInPageFromActiviti();
    }

    loadStencilScriptsInPageFromActiviti() {
        this.apiService.getInstance().activiti.scriptFileApi.getControllers().then(response => {
            if (response) {
                let s = document.createElement('script');
                s.type = 'text/javascript';
                s.text = response;
                this.elementRef.nativeElement.appendChild(s);
            }
        });
    }

    onProcessDetailsTaskClick(event: TaskDetailsEvent) {
        event.preventDefault();
        this.activeTab = 'tasks';
        let processTaskDataRow = new ObjectDataRow({
            id: event.value.id,
            name: event.value.name || 'No name',
            created: event.value.created
        });
        this.activitifilter.selectFilter(null);
        this.dataTasks.setRows([processTaskDataRow]);
        this.activititasklist.selectTask(event.value.id);
        this.currentTaskId = event.value.id;
    }

    private resetProcessFilters() {
        this.processFilter = null;
    }

    private reloadProcessFilters() {
        this.activitiprocessfilter.selectFilter(null);
    }

}
