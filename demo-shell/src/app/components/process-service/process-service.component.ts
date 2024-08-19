/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

// eslint-disable-next-line
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination, UserProcessInstanceFilterRepresentation, ScriptFilesApi, UserTaskFilterRepresentation } from '@alfresco/js-api';
import {
    FORM_FIELD_VALIDATORS,
    FormRenderingService,
    FormService,
    AppConfigService,
    PaginationComponent,
    UserPreferenceValues,
    AlfrescoApiService,
    UserPreferencesService,
    NotificationService,
    SidebarActionMenuComponent
} from '@alfresco/adf-core';
import {
    ProcessFiltersComponent,
    ProcessInstanceListComponent,
    StartProcessInstanceComponent,
    TaskDetailsEvent,
    TaskFiltersComponent,
    TaskListComponent,
    ProcessFormRenderingService,
    APP_LIST_LAYOUT_LIST,
    ValidateDynamicTableRowEvent,
    DynamicTableRow,
    TaskDetailsComponent,
    TaskAuditDirective,
    StartTaskComponent,
    ProcessInstanceDetailsComponent,
    ProcessAuditDirective
} from '@alfresco/adf-process-services';
import { Subject } from 'rxjs';
import { PreviewService } from '../../services/preview.service';
import { CommonModule, Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TaskAttachmentsComponent } from './task-attachments.component';
import { MatButtonModule } from '@angular/material/button';
import { ProcessAttachmentsComponent } from './process-attachments.component';

const currentProcessIdNew = '__NEW__';
const currentTaskIdNew = '__NEW__';

const TASK_ROUTE = 0;
const PROCESS_ROUTE = 1;
const REPORT_ROUTE = 2;

@Component({
    selector: 'app-process-service',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        SidebarActionMenuComponent,
        MatIconModule,
        MatMenuModule,
        TaskFiltersComponent,
        TaskListComponent,
        PaginationComponent,
        TaskDetailsComponent,
        TaskAuditDirective,
        TaskAttachmentsComponent,
        StartTaskComponent,
        ProcessFiltersComponent,
        ProcessInstanceListComponent,
        ProcessInstanceDetailsComponent,
        ProcessAuditDirective,
        MatButtonModule,
        ProcessAttachmentsComponent,
        StartProcessInstanceComponent
    ],
    templateUrl: './process-service.component.html',
    styleUrls: ['./process-service.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: FormRenderingService, useClass: ProcessFormRenderingService }]
})
export class ProcessServiceComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('activitiFilter')
    activitiFilter: TaskFiltersComponent;

    @ViewChild('taskListPagination')
    taskListPagination: PaginationComponent;

    @ViewChild('taskList')
    taskList: TaskListComponent;

    @ViewChild('activitiProcessFilter')
    activitiProcessFilter: ProcessFiltersComponent;

    @ViewChild('processList')
    processList: ProcessInstanceListComponent;

    @ViewChild('activitiStartProcess')
    activitiStartProcess: StartProcessInstanceComponent;

    @Input()
    appId: number = null;

    filterSelected: any = null;

    @Output()
    changePageSize = new EventEmitter<Pagination>();

    private tabs = { tasks: 0, processes: 1, reports: 2 };

    layoutType: string;
    currentTaskId: string;
    currentProcessInstanceId: string;

    taskPage = 0;
    processPage = 0;
    paginationPageSize = 0;

    defaultProcessDefinitionName: string;
    defaultProcessName: string;
    defaultTaskName: string;

    activeTab: number = this.tabs.tasks; // tasks|processes|reports

    taskFilter: UserTaskFilterRepresentation;
    processFilter: UserProcessInstanceFilterRepresentation;
    blobFile: any;
    flag = true;

    presetColumn = 'default';

    applicationId: number;
    processDefinitionName: string;

    fieldValidators = [...FORM_FIELD_VALIDATORS];

    private onDestroy$ = new Subject<boolean>();
    private scriptFileApi: ScriptFilesApi;

    constructor(
        private elementRef: ElementRef,
        private route: ActivatedRoute,
        private router: Router,
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private previewService: PreviewService,
        formService: FormService,
        private location: Location,
        private notificationService: NotificationService,
        private preferenceService: UserPreferencesService
    ) {
        this.scriptFileApi = new ScriptFilesApi(this.apiService.getInstance());
        this.defaultProcessName = this.appConfigService.get<string>('adf-start-process.name');
        this.defaultProcessDefinitionName = this.appConfigService.get<string>('adf-start-process.processDefinitionName');
        this.defaultTaskName = this.appConfigService.get<string>('adf-start-task.name');
        this.processDefinitionName = this.defaultProcessDefinitionName;

        this.preferenceService
            .select(UserPreferenceValues.PaginationSize)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((pageSize) => {
                this.paginationPageSize = pageSize;
            });

        formService.validateDynamicTableRow
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((validateDynamicTableRowEvent: ValidateDynamicTableRowEvent) => {
                const row: DynamicTableRow = validateDynamicTableRowEvent.row;
                if (row?.value && row.value.name === 'admin') {
                    validateDynamicTableRowEvent.summary.isValid = false;
                    validateDynamicTableRowEvent.summary.message = 'Sorry, wrong value. You cannot use "admin".';
                    validateDynamicTableRowEvent.preventDefault();
                }
            });

        formService.formContentClicked.pipe(takeUntil(this.onDestroy$)).subscribe((content) => {
            this.showContentPreview(content);
        });
    }

    ngOnInit() {
        if (this.router.url.includes('processes')) {
            this.activeTab = this.tabs.processes;
        }
        this.route.params.subscribe((params) => {
            const applicationId = params['appId'];

            this.filterSelected = params['filterId'] ? { id: +params['filterId'] } : { index: 0 };

            if (applicationId && applicationId !== '0') {
                this.appId = params['appId'];
                this.applicationId = this.appId;
            }

            this.taskFilter = null;
            this.currentTaskId = null;
            this.processFilter = null;
            this.currentProcessInstanceId = null;
        });
        this.layoutType = APP_LIST_LAYOUT_LIST;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onTaskFilterClick(filter: UserTaskFilterRepresentation): void {
        this.applyTaskFilter(filter);
        this.taskPage = 0;
    }

    onTabChange(event: any): void {
        const index = event.index;
        if (index === TASK_ROUTE) {
            this.relocateLocationToTask();
        } else if (index === PROCESS_ROUTE) {
            this.relocateLocationToProcess();
            if (this.processList) {
                this.processList.reload();
            }
        } else if (index === REPORT_ROUTE) {
            this.relocateLocationToReport();
        }
    }

    onChangePageSize(event: Pagination): void {
        this.preferenceService.paginationSize = event.maxItems;
        this.changePageSize.emit(event);
    }

    onSuccessTaskFilterList(): void {
        this.applyTaskFilter(this.activitiFilter.getCurrentFilter());
    }

    applyTaskFilter(filter: UserTaskFilterRepresentation) {
        this.taskFilter = Object.assign({ /* empty */ }, filter);

        if (filter && this.taskList) {
            this.taskList.hasCustomDataSource = false;
        }
        this.relocateLocationToTask();
    }

    onStartTaskSuccess(event: any): void {
        this.activitiFilter.selectFilterWithTask(event.id);
        this.currentTaskId = event.id;
    }

    onCancelStartTask() {
        this.currentTaskId = null;
        this.reloadTaskFilters();
    }

    onSuccessTaskList() {
        this.currentTaskId = this.taskList.getCurrentId();
    }

    onProcessFilterChange(event: UserProcessInstanceFilterRepresentation): void {
        this.processFilter = event;
        this.resetProcessPaginationPage();
        this.relocateLocationToProcess();
    }

    resetProcessPaginationPage() {
        this.processPage = 0;
    }

    onSuccessProcessFilterList(): void {
        this.processFilter = this.activitiProcessFilter.getCurrentFilter();
    }

    onSuccessProcessList(): void {
        this.currentProcessInstanceId = this.processList.getCurrentId();
    }

    onTaskRowClick(taskId: string): void {
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

    onProcessRowClick(processInstanceId: string): void {
        this.currentProcessInstanceId = processInstanceId;
    }

    navigateStartProcess(): void {
        this.currentProcessInstanceId = currentProcessIdNew;
    }

    navigateStartTask(): void {
        this.currentTaskId = currentTaskIdNew;
    }

    onStartProcessInstance(instanceId: string): void {
        this.currentProcessInstanceId = instanceId;
        this.activitiStartProcess.reset();
        this.activitiProcessFilter.selectRunningFilter();
    }

    onCancelProcessInstance() {
        this.currentProcessInstanceId = null;
        this.reloadProcessFilters();
    }

    onStartProcessError(event: any) {
        this.notificationService.showError(event.message);
    }

    isStartProcessMode(): boolean {
        return this.currentProcessInstanceId === currentProcessIdNew;
    }

    isStartTaskMode(): boolean {
        return this.currentTaskId === currentTaskIdNew;
    }

    processCancelled(): void {
        this.currentProcessInstanceId = null;
        this.processList.reload();
    }

    onFormCompleted(): void {
        this.currentTaskId = null;
        if (this.taskListPagination) {
            this.taskPage = this.taskListPagination.current - 1;
        }
        if (!this.taskList) {
            this.navigateToProcess();
        } else {
            this.taskList.hasCustomDataSource = false;
            this.taskList.reload();
        }
    }

    navigateToProcess(): void {
        this.router.navigate([`/activiti/apps/${this.appId}/processes/`]);
    }

    relocateLocationToProcess(): void {
        this.location.go(`/activiti/apps/${this.appId || 0}/processes/${this.processFilter ? this.processFilter.id : 0}`);
    }

    relocateLocationToTask(): void {
        this.location.go(`/activiti/apps/${this.appId || 0}/tasks/${this.taskFilter ? this.taskFilter.id : 0}`);
    }

    relocateLocationToReport(): void {
        this.location.go(`/activiti/apps/${this.appId || 0}/report/`);
    }

    onContentClick(content: any): void {
        this.showContentPreview(content);
    }

    private showContentPreview(content: any) {
        if (content.contentBlob) {
            this.previewService.showBlob(content.name, content.contentBlob);
        } else {
            this.previewService.showResource(content.sourceId.split(';')[0]);
        }
    }

    onTaskCreated(data: any): void {
        this.currentTaskId = data.parentTaskId;
        this.taskList.reload();
    }

    onTaskDeleted(): void {
        this.taskList.reload();
    }

    ngAfterViewInit() {
        this.loadStencilScriptsInPageFromProcessService();
    }

    private loadStencilScriptsInPageFromProcessService() {
        this.scriptFileApi.getControllers().then((response) => {
            if (response) {
                const stencilScript = document.createElement('script');
                stencilScript.type = 'text/javascript';
                stencilScript.text = response;
                this.elementRef.nativeElement.appendChild(stencilScript);
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
        const processTaskDataRow: any = {
            id: taskId,
            name: event.value.name || 'No name',
            created: event.value.created
        };

        if (this.taskList) {
            this.taskList.setCustomDataSource([processTaskDataRow]);
            this.taskList.selectTask(taskId);
        }
        this.currentTaskId = taskId;
    }

    private reloadProcessFilters(): void {
        this.activitiProcessFilter.selectFilter(this.activitiProcessFilter.getCurrentFilter());
    }

    private reloadTaskFilters(): void {
        this.activitiFilter.selectFilter(this.activitiFilter.getCurrentFilter());
    }

    onAssignTask() {
        this.taskList.reload();
        this.currentTaskId = null;
    }
}
