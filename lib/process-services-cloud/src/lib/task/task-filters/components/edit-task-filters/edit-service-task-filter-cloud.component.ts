/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, OnChanges, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil, finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Moment } from 'moment';

import { TaskFilterProperties, TaskFilterAction, ServiceTaskFilterCloudModel } from '../../models/filter-cloud.model';
import { TaskFilterDialogCloudComponent } from '../task-filter-dialog/task-filter-dialog-cloud.component';
import { TranslationService, UserPreferencesService } from '@alfresco/adf-core';
import { AppsProcessCloudService } from '../../../../app/services/apps-process-cloud.service';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { ServiceTaskFilterCloudService } from '../../services/service-task-filter-cloud.service';
import { BaseEditTaskFilterCloudComponent } from './base-edit-task-filter-cloud.component';

@Component({
    selector: 'adf-cloud-edit-service-task-filter',
    templateUrl: './base-edit-task-filter-cloud.component.html',
    styleUrls: ['./base-edit-task-filter-cloud.component.scss']
})
export class EditServiceTaskFilterCloudComponent extends BaseEditTaskFilterCloudComponent implements OnInit, OnChanges, OnDestroy {

    public static DEFAULT_TASK_FILTER_PROPERTIES = ['appName', 'activityName', 'status', 'sort', 'order'];
    public static DEFAULT_TASK_SORT_PROPERTIES = ['id', 'name', 'startedDate', 'completedDate'];
    public static DEFAULT_TASK_STATUS_PROPERTIES = [
        { label: 'ALL', value: '' },
        { label: 'STARTED', value: 'STARTED' },
        { label: 'COMPLETED', value: 'COMPLETED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
        { label: 'ERROR', value: 'ERROR' }
    ];

    /** Emitted when a task filter property changes. */
    @Output()
    filterChange: EventEmitter<ServiceTaskFilterCloudModel> = new EventEmitter();

    taskFilter: ServiceTaskFilterCloudModel;
    changedTaskFilter: ServiceTaskFilterCloudModel;

    constructor(
        protected formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private serviceTaskFilterCloudService: ServiceTaskFilterCloudService,
        protected dateAdapter: DateAdapter<Moment>,
        protected userPreferencesService: UserPreferencesService,
        protected appsProcessCloudService: AppsProcessCloudService,
        protected taskCloudService: TaskCloudService) {
        super(formBuilder, dateAdapter, userPreferencesService, appsProcessCloudService, taskCloudService);
    }

    ngOnInit() {
       super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    assignNewFilter(formValues: ServiceTaskFilterCloudModel) {
        this.changedTaskFilter = new ServiceTaskFilterCloudModel(Object.assign({}, this.taskFilter, formValues));
        this.formHasBeenChanged = !this.compareFilters(this.changedTaskFilter, this.taskFilter);
        this.filterChange.emit(this.changedTaskFilter);
    }

    /**
     * Fetches task filter by application name and filter id and creates filter properties, build form
     */
    retrieveTaskFilterAndBuildForm() {
        this.isLoading = true;
        this.serviceTaskFilterCloudService.getTaskFilterById(this.appName, this.id)
            .pipe(
                finalize(() => this.isLoading = false),
                takeUntil(this.onDestroy$)
            )
            .subscribe(response => {
                this.taskFilter = new ServiceTaskFilterCloudModel(response);
                this.taskFilterProperties = this.createAndFilterProperties();
                this.taskFilterActions = this.createAndFilterActions();
                this.buildForm(this.taskFilterProperties);
            });
    }

    checkMandatoryFilterProperties() {
        if (this.filterProperties === undefined || this.filterProperties.length === 0) {
            this.filterProperties = EditServiceTaskFilterCloudComponent.DEFAULT_TASK_FILTER_PROPERTIES;
        }
    }

    checkMandatorySortProperties(): void {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            this.sortProperties = EditServiceTaskFilterCloudComponent.DEFAULT_TASK_SORT_PROPERTIES;
        }
    }

    /**
     * Return true if both filters are same
     * @param editedQuery, @param currentQuery
     */
    compareFilters(
        editedQuery: ServiceTaskFilterCloudModel,
        currentQuery: ServiceTaskFilterCloudModel
    ): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    save(saveAction: TaskFilterAction): void {
        this.serviceTaskFilterCloudService
            .updateFilter(this.changedTaskFilter)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                saveAction.filter = this.changedTaskFilter;
                this.action.emit(saveAction);
                this.formHasBeenChanged = this.compareFilters(this.changedTaskFilter, this.taskFilter);
            });
    }

    delete(deleteAction: TaskFilterAction): void {
        this.serviceTaskFilterCloudService
            .deleteFilter(this.taskFilter)
            .pipe(
                filter((filters) => {
                    deleteAction.filter = this.taskFilter;
                    this.action.emit(deleteAction);
                    return filters.length === 0;
                }),
                switchMap(() => this.restoreDefaultTaskFilters()),
                takeUntil(this.onDestroy$))
            .subscribe(() => { });
    }

    saveAs(saveAsAction: TaskFilterAction): void {
        const dialogRef = this.dialog.open(TaskFilterDialogCloudComponent, {
            data: {
                name: this.translateService.instant(this.taskFilter.name)
            },
            height: 'auto',
            minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.action === TaskFilterDialogCloudComponent.ACTION_SAVE) {
                const filterId = Math.random().toString(36).substr(2, 9);
                const filterKey = this.getSanitizeFilterName(result.name);
                const newFilter = {
                    name: result.name,
                    icon: result.icon,
                    id: filterId,
                    key: 'custom-' + filterKey
                };
                const resultFilter: ServiceTaskFilterCloudModel = Object.assign({}, this.changedTaskFilter, newFilter);
                this.serviceTaskFilterCloudService.addFilter(resultFilter)
                    .pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                        saveAsAction.filter = resultFilter;
                        this.action.emit(saveAsAction);
                    });
            }
        });
    }

    isDisabledForDefaultFilters(action: TaskFilterAction): boolean {
        return (
            this.serviceTaskFilterCloudService.isDefaultFilter(this.taskFilter.name) &&
            EditServiceTaskFilterCloudComponent.ACTIONS_DISABLED_BY_DEFAULT.includes(action.actionType)
        );
    }

    restoreDefaultTaskFilters(): Observable<ServiceTaskFilterCloudModel[]> {
        return this.serviceTaskFilterCloudService.getTaskListFilters(this.appName);
    }

    createTaskFilterProperties(): TaskFilterProperties[] {
        return [
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: this.taskFilter.appName || '',
                options: this.applicationNames
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SERVICE_TASK_ID',
                type: 'text',
                key: 'serviceTaskId',
                value: this.taskFilter.serviceTaskId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ELEMENT_ID',
                type: 'text',
                key: 'elementId',
                value: this.taskFilter.elementId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ACTIVITY_NAME',
                type: 'text',
                key: 'activityName',
                value: this.taskFilter.activityName || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ACTIVITY_TYPE',
                type: 'text',
                key: 'activityType',
                value: this.taskFilter.activityType || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: this.taskFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: this.taskFilter.order || EditServiceTaskFilterCloudComponent.DIRECTIONS[0].value,
                options: EditServiceTaskFilterCloudComponent.DIRECTIONS
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: this.taskFilter.status || EditServiceTaskFilterCloudComponent.DEFAULT_TASK_STATUS_PROPERTIES[0].value,
                options: EditServiceTaskFilterCloudComponent.DEFAULT_TASK_STATUS_PROPERTIES
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.STARTED_DATE',
                type: 'date',
                key: 'startedDate',
                value: this.taskFilter.completedDate || false
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.COMPLETED_DATE',
                type: 'date',
                key: 'completedDate',
                value: this.taskFilter.completedDate || false
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                type: 'text',
                key: 'processInstanceId',
                value: this.taskFilter.processInstanceId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: this.taskFilter.processDefinitionId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SERVICE_NAME',
                type: 'text',
                key: 'serviceName',
                value: this.taskFilter.serviceName || ''
            })
        ];
    }
}
