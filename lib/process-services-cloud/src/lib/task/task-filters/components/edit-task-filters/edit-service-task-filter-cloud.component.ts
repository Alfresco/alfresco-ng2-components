/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Moment } from 'moment';

import { TaskFilterProperties, TaskFilterAction, ServiceTaskFilterCloudModel } from '../../models/filter-cloud.model';
import { TranslationService, UserPreferencesService } from '@alfresco/adf-core';
import { AppsProcessCloudService } from '../../../../app/services/apps-process-cloud.service';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { ServiceTaskFilterCloudService } from '../../services/service-task-filter-cloud.service';
import { BaseEditTaskFilterCloudComponent, DropdownOption } from './base-edit-task-filter-cloud.component';

@Component({
    selector: 'adf-cloud-edit-service-task-filter',
    templateUrl: './base-edit-task-filter-cloud.component.html',
    styleUrls: ['./base-edit-task-filter-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditServiceTaskFilterCloudComponent extends BaseEditTaskFilterCloudComponent<ServiceTaskFilterCloudModel> {
    constructor(
        formBuilder: UntypedFormBuilder,
        dialog: MatDialog,
        translateService: TranslationService,
        private serviceTaskFilterCloudService: ServiceTaskFilterCloudService,
        dateAdapter: DateAdapter<Moment>,
        userPreferencesService: UserPreferencesService,
        appsProcessCloudService: AppsProcessCloudService,
        taskCloudService: TaskCloudService) {
        super(formBuilder, dateAdapter, userPreferencesService, appsProcessCloudService, taskCloudService, dialog, translateService);
    }

    assignNewFilter(model: ServiceTaskFilterCloudModel) {
        this.changedTaskFilter = { ...this.taskFilter, ...model };
        this.formHasBeenChanged = !this.deepCompare(this.changedTaskFilter, this.taskFilter);
        this.filterChange.emit(this.changedTaskFilter);
    }

    protected getTaskFilterById(appName: string, id: string) {
        return this.serviceTaskFilterCloudService.getTaskFilterById(appName, id);
    }

    getDefaultFilterProperties(): string[] {
        return ['appName', 'activityName', 'status', 'sort', 'order'];
    }

    getDefaultSortProperties(): string[] {
        return ['id', 'activityName', 'startedDate', 'completedDate'];
    }

    protected updateFilter(filterToUpdate: ServiceTaskFilterCloudModel) {
        return this.serviceTaskFilterCloudService.updateFilter(filterToUpdate);
    }

    protected deleteFilter(filterToDelete: ServiceTaskFilterCloudModel): Observable<ServiceTaskFilterCloudModel[]> {
        return this.serviceTaskFilterCloudService.deleteFilter(filterToDelete);
    }

    protected addFilter(filterToAdd: ServiceTaskFilterCloudModel): Observable<any> {
        return this.serviceTaskFilterCloudService
            .addFilter(filterToAdd)
            .pipe(takeUntil(this.onDestroy$));
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

    private getStatusOptions(): DropdownOption[] {
        return [
            { value: '', label: 'ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.ALL' },
            { value: 'STARTED', label: 'ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.STARTED' },
            { value: 'COMPLETED', label: 'ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.COMPLETED' },
            { value: 'CANCELLED', label: 'ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.CANCELLED' },
            { value: 'ERROR', label: 'ADF_CLOUD_SERVICE_TASK_FILTERS.STATUS.ERROR' }
        ];
    }

    createTaskFilterProperties(): TaskFilterProperties[] {
        const statusOptions = this.getStatusOptions();

        return [
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: this.taskFilter.appName || '',
                options: this.applicationNames
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SERVICE_TASK_ID',
                type: 'text',
                key: 'serviceTaskId',
                value: this.taskFilter.serviceTaskId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ELEMENT_ID',
                type: 'text',
                key: 'elementId',
                value: this.taskFilter.elementId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ACTIVITY_NAME',
                type: 'text',
                key: 'activityName',
                value: this.taskFilter.activityName || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ACTIVITY_TYPE',
                type: 'text',
                key: 'activityType',
                value: this.taskFilter.activityType || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: this.taskFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: this.taskFilter.order || this.sortDirections[0].value,
                options: [...this.sortDirections]
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: this.taskFilter.status || statusOptions[0].value,
                options: statusOptions
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.STARTED_DATE',
                type: 'date',
                key: 'startedDate',
                value: this.taskFilter.completedDate || false
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.COMPLETED_DATE',
                type: 'date',
                key: 'completedDate',
                value: this.taskFilter.completedDate || false
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                type: 'text',
                key: 'processInstanceId',
                value: this.processInstanceId || this.taskFilter.processInstanceId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: this.taskFilter.processDefinitionId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SERVICE_NAME',
                type: 'text',
                key: 'serviceName',
                value: this.taskFilter.serviceName || ''
            }
        ];
    }
}
