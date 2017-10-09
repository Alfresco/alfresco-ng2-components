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

// tslint:disable-next-line:adf-file-name
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from 'alfresco-js-api';
import { AnalyticsReportListComponent } from 'ng2-activiti-analytics';
import {
    DynamicTableRow, FORM_FIELD_VALIDATORS, FormEvent, FormFieldEvent, FormRenderingService,
    FormService, ValidateDynamicTableRowEvent
} from 'ng2-activiti-form';
import {
    FilterProcessRepresentationModel,
    ProcessFiltersComponent,
    ProcessInstance,
    ProcessInstanceDetailsComponent,
    ProcessInstanceListComponent,
    StartProcessInstanceComponent
} from 'ng2-activiti-processlist';
import {
    AppsListComponent,
    FilterRepresentationModel,
    TaskDetailsComponent,
    TaskDetailsEvent,
    TaskFiltersComponent,
    TaskListComponent,
    TaskListService
} from 'ng2-activiti-tasklist';
import { AlfrescoApiService } from 'ng2-alfresco-core';
import {
    DataSorting,
    ObjectDataRow,
    ObjectDataTableAdapter
} from 'ng2-alfresco-datatable';
import { Subscription } from 'rxjs/Rx';
import { /*CustomEditorComponent*/ CustomStencil01 } from './custom-editor/custom-editor.component';
import { DemoFieldValidator } from './demo-field-validator';

const currentProcessIdNew = '__NEW__';
const currentTaskIdNew = '__NEW__';

@Component({
    selector: 'adf-activiti-demo',
    templateUrl: './activiti-demo.component.html',
    styleUrls: ['./activiti-demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ActivitiDemoComponent implements AfterViewInit, OnDestroy, OnInit {

    @ViewChild(TaskFiltersComponent)
    activitifilter: TaskFiltersComponent;

    @ViewChild(TaskListComponent)
    taskList: TaskListComponent;

    @ViewChild(ProcessFiltersComponent)
    activitiprocessfilter: ProcessFiltersComponent;

    @ViewChild(ProcessInstanceListComponent)
    processList: ProcessInstanceListComponent;

    @ViewChild(ProcessInstanceDetailsComponent)
    activitiprocessdetails: ProcessInstanceDetailsComponent;

    @ViewChild(TaskDetailsComponent)
    activitidetails: TaskDetailsComponent;

    @ViewChild(StartProcessInstanceComponent)
    activitiStartProcess: StartProcessInstanceComponent;

    @ViewChild(AnalyticsReportListComponent)
    analyticsreportlist: AnalyticsReportListComponent;

    @Input()
    appId: number = null;

    fileShowed: boolean = false;
    selectFirstReport: boolean = false;

    private tabs = { tasks: 0, processes: 1, reports: 2 };

    content: Blob;
    contentName: string;

    layoutType: string;
    currentTaskId: string;
    currentProcessInstanceId: string;

    taskSchemaColumns: any[] = [];
    taskPagination: Pagination = {
        skipCount: 0,
        maxItems: 10,
        totalItems: 0
    };
    taskPage: number = 0;
    processSchemaColumns: any[] = [];

    activeTab: number = this.tabs.tasks; // tasks|processes|reports

    taskFilter: FilterRepresentationModel;
    report: any;
    processFilter: FilterProcessRepresentationModel;

    sub: Subscription;
    blobFile: any;
    flag: boolean = true;

    dataTasks: ObjectDataTableAdapter;
    dataProcesses: ObjectDataTableAdapter;

    fieldValidators = [
        ...FORM_FIELD_VALIDATORS,
        new DemoFieldValidator()
    ];

    constructor(private elementRef: ElementRef,
                private route: ActivatedRoute,
                private router: Router,
                private taskListService: TaskListService,
                private apiService: AlfrescoApiService,
                formRenderingService: FormRenderingService,
                formService: FormService) {
        this.dataTasks = new ObjectDataTableAdapter();
        this.dataTasks.setSorting(new DataSorting('created', 'desc'));

        this.dataProcesses = new ObjectDataTableAdapter(
            [],
            [
                { type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true },
                { type: 'text', key: 'started', title: 'Started', cssClass: 'hidden', sortable: true }
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

        formService.validateDynamicTableRow.subscribe(
            (e: ValidateDynamicTableRowEvent) => {
                const row: DynamicTableRow = e.row;
                if (row && row.value && row.value.name === 'admin') {
                    e.summary.isValid = false;
                    e.summary.text = 'Sorry, wrong value. You cannot use "admin".';
                    e.preventDefault();
                }
            }
        );

        // Uncomment this block to see form event handling in action
        /*
        formService.formEvents.subscribe((event: Event) => {
            console.log('Event fired:' + event.type);
            console.log('Event Target:' + event.target);
        });
        */
    }

    onPrevPage(pagination: Pagination): void {
        this.taskPagination.skipCount = pagination.skipCount;
        this.taskPage--;
    }

    onNextPage(pagination: Pagination): void {
        this.taskPagination.skipCount = pagination.skipCount;
        this.taskPage++;
    }

    onChangePageSize(pagination: Pagination): void {
        const { skipCount, maxItems } = pagination;
        this.taskPage = this.currentPage(skipCount, maxItems);
        this.taskPagination.maxItems = maxItems;
        this.taskPagination.skipCount = skipCount;
    }

    onChangePageNumber(pagination: Pagination): void {
        const { maxItems, skipCount } = pagination;
        this.taskPage = this.currentPage(skipCount, maxItems);
        this.taskPagination.maxItems = maxItems;
        this.taskPagination.skipCount = skipCount;
    }

    currentPage(skipCount: number, maxItems: number): number {
        return (skipCount && maxItems) ? Math.floor(skipCount / maxItems) : 0;
    }

    ngOnInit() {
        this.taskListService.tasksList$.subscribe(
            (tasks) => {
                this.taskPagination = { count: tasks.data.length, maxItems: this.taskPagination.maxItems, skipCount: this.taskPagination.skipCount, totalItems: tasks.total };
                console.log({ count: tasks.data.length, maxItems: this.taskPagination.maxItems, skipCount: this.taskPagination.skipCount, totalItems: tasks.total });
            }, (err) => {
                console.log('err' +  err);
            });

        if (this.router.url.includes('processes')) {
            this.activeTab = this.tabs.processes;
        }
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
        this.layoutType = AppsListComponent.LAYOUT_GRID;

    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.taskListService.tasksList$.subscribe();
    }

    onTaskFilterClick(filter: FilterRepresentationModel): void {
        this.applyTaskFilter(filter);
    }

    onReportClick(event: any): void {
        this.report = event;
    }

    onSuccessTaskFilterList(event: any): void {
        this.applyTaskFilter(this.activitifilter.getCurrentFilter());
    }

    applyTaskFilter(filter: FilterRepresentationModel) {
        this.taskFilter = filter;
        if (filter && this.taskList) {
            this.taskList.hasCustomDataSource = false;
        }
    }

    onStartTaskSuccess(event: any): void {
        this.activitifilter.selectFilterWithTask(event.id);
        this.currentTaskId = event.id;
    }

    onCancelStartTask() {
        this.currentTaskId = null;
        this.reloadTaskFilters();
    }

    onSuccessTaskList(event: FilterRepresentationModel) {
        this.currentTaskId = this.taskList.getCurrentId();
    }

    onProcessFilterClick(event: FilterProcessRepresentationModel): void {
        this.currentProcessInstanceId = null;
        this.processFilter = event;
    }

    onSuccessProcessFilterList(): void {
        this.processFilter = this.activitiprocessfilter.getCurrentFilter();
    }

    onSuccessProcessList(event: any): void {
        this.currentProcessInstanceId = this.processList.getCurrentId();
    }

    onTaskRowClick(taskId): void {
        this.currentTaskId = taskId;
    }

    onTaskRowDblClick(event: CustomEvent) {
        const taskId = event.detail.value.obj.id;
        this.currentTaskId = taskId;
    }

    onProcessRowDblClick(event: CustomEvent) {
        const processInstanceId = event.detail.value.obj.id;
        this.currentProcessInstanceId = processInstanceId;
    }

    onProcessRowClick(processInstanceId): void {
        this.currentProcessInstanceId = processInstanceId;
    }

    onEditReport(name: string): void {
        this.analyticsreportlist.reload();
    }

    onReportSaved(reportId): void {
        this.analyticsreportlist.reload(reportId);
    }

    onReportDeleted(): void {
        this.analyticsreportlist.reload();
        this.analyticsreportlist.selectReport(null);
    }

    navigateStartProcess(): void {
        this.resetProcessFilters();
        this.reloadProcessFilters();
        this.currentProcessInstanceId = currentProcessIdNew;
    }

    navigateStartTask(): void {
        this.resetTaskFilters();
        this.reloadTaskFilters();
        this.currentTaskId = currentTaskIdNew;
    }

    onStartProcessInstance(instance: ProcessInstance): void {
        this.currentProcessInstanceId = instance.id;
        this.activitiStartProcess.reset();
        this.activitiprocessfilter.selectRunningFilter();
    }

    onCancelProcessInstance() {
        this.currentProcessInstanceId = null;
        this.reloadProcessFilters();
    }

    isStartProcessMode(): boolean {
        return this.currentProcessInstanceId === currentProcessIdNew;
    }

    isStartTaskMode(): boolean {
        return this.currentTaskId === currentTaskIdNew;
    }

    processCancelled(data: any): void {
        this.currentProcessInstanceId = null;
        this.processList.reload();
    }

    onSuccessNewProcess(data: any): void {
        this.processList.reload();
    }

    onFormCompleted(form): void {
        this.currentTaskId = null;
        this.taskPagination.totalItems--;
        const { skipCount, maxItems, totalItems } = this.taskPagination;
        if (totalItems > 0 && (skipCount >= totalItems)) {
            this.taskPagination.skipCount -= maxItems;
        }
        this.taskPage = this.currentPage(this.taskPagination.skipCount, maxItems);
        this.taskList.reload();
    }

    onFormContentClick(content: any): void {
        this.fileShowed = true;
        this.content = content.contentBlob;
        this.contentName = content.name;
    }

    onAuditClick(event: any) {
        console.log(event);
    }

    onAuditError(event: any): void {
        console.error('My custom error message' + event);
    }

    onTaskCreated(data: any): void {
        this.currentTaskId = data.parentTaskId;
        this.taskList.reload();
    }

    onTaskDeleted(data: any): void {
        this.taskList.reload();
    }

    ngAfterViewInit() {
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

    onShowProcessDiagram(event: any): void {
        this.router.navigate(['/activiti/apps/' + this.appId + '/diagram/' + event.value]);
    }

    onProcessDetailsTaskClick(event: TaskDetailsEvent): void {
        event.preventDefault();
        this.activeTab = this.tabs.tasks;

        const taskId = event.value.id;
        const processTaskDataRow = new ObjectDataRow({
            id: taskId,
            name: event.value.name || 'No name',
            created: event.value.created
        });
        this.activitifilter.selectFilter(null);
        if (this.taskList) {
            this.taskList.setCustomDataSource([processTaskDataRow]);
            this.taskList.selectTask(taskId);
        }
        this.currentTaskId = taskId;
    }

    private resetProcessFilters(): void {
        this.processFilter = null;
    }

    private resetTaskFilters(): void {
        this.taskFilter = null;
    }

    private reloadProcessFilters(): void {
        this.activitiprocessfilter.selectFilter(this.activitiprocessfilter.getCurrentFilter());
    }

    private reloadTaskFilters(): void {
        this.activitifilter.selectFilter(this.activitifilter.getCurrentFilter());
    }

    onRowClick(event): void {
        console.log(event);
    }

    onRowDblClick(event): void {
        console.log(event);
    }

    isTaskCompleted(): boolean {
        return this.activitidetails.isCompletedTask();
    }

    onAssignTask() {
        this.taskList.reload();
        this.currentTaskId = null;
    }
}
