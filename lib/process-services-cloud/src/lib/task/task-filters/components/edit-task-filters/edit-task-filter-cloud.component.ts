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

import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil, finalize, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import moment from 'moment-es6';
import { Moment } from 'moment';

import { TaskFilterCloudModel, TaskFilterProperties, TaskFilterAction } from '../../models/filter-cloud.model';
import { TaskFilterCloudService } from '../../services/task-filter-cloud.service';
import { TaskFilterDialogCloudComponent } from '../task-filter-dialog/task-filter-dialog-cloud.component';
import { TranslationService, UserPreferencesService } from '@alfresco/adf-core';
import { AppsProcessCloudService } from '../../../../app/services/apps-process-cloud.service';
import { DateCloudFilterType } from '../../../../models/date-cloud-filter.model';
import { TaskCloudService } from '../../../services/task-cloud.service';
import { BaseEditTaskFilterCloudComponent } from './base-edit-task-filter-cloud.component';

@Component({
    selector: 'adf-cloud-edit-task-filter',
    templateUrl: './base-edit-task-filter-cloud.component.html',
    styleUrls: ['./base-edit-task-filter-cloud.component.scss']
})
export class EditTaskFilterCloudComponent extends BaseEditTaskFilterCloudComponent {

    public static DEFAULT_TASK_FILTER_PROPERTIES = ['status', 'assignee', 'sort', 'order'];
    public static DEFAULT_TASK_SORT_PROPERTIES = ['id', 'name', 'createdDate', 'priority'];
    public static DEFAULT_TASK_STATUS_PROPERTIES = [
        { label: 'ALL', value: '' },
        { label: 'CREATED', value: 'CREATED' },
        { label: 'ASSIGNED', value: 'ASSIGNED' },
        { label: 'SUSPENDED', value: 'SUSPENDED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
        { label: 'COMPLETED', value: 'COMPLETED' }
    ];

    /** Emitted when a task filter property changes. */
    @Output()
    filterChange: EventEmitter<TaskFilterCloudModel> = new EventEmitter();

    taskFilter: TaskFilterCloudModel;
    changedTaskFilter: TaskFilterCloudModel;

    constructor(
        protected formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private taskFilterCloudService: TaskFilterCloudService,
        protected dateAdapter: DateAdapter<Moment>,
        protected userPreferencesService: UserPreferencesService,
        protected appsProcessCloudService: AppsProcessCloudService,
        protected taskCloudService: TaskCloudService) {
        super(formBuilder, dateAdapter, userPreferencesService, appsProcessCloudService, taskCloudService);
    }

    assignNewFilter(formValues: TaskFilterCloudModel) {
        this.setLastModifiedToFilter(<TaskFilterCloudModel> formValues);
        this.changedTaskFilter = new TaskFilterCloudModel(Object.assign({}, this.taskFilter, formValues));
        this.formHasBeenChanged = !this.compareFilters(this.changedTaskFilter, this.taskFilter);
        this.filterChange.emit(this.changedTaskFilter);
    }

    /**
     * Fetches task filter by application name and filter id and creates filter properties, build form
     */
    retrieveTaskFilterAndBuildForm() {
        this.isLoading = true;
        this.taskFilterCloudService.getTaskFilterById(this.appName, this.id)
            .pipe(
                finalize(() => this.isLoading = false),
                takeUntil(this.onDestroy$)
            )
            .subscribe(response => {
                this.taskFilter = new TaskFilterCloudModel(response);
                this.taskFilterProperties = this.createAndFilterProperties();
                if (this.hasLastModifiedProperty()) {
                    this.taskFilterProperties = [...this.taskFilterProperties, ...this.createLastModifiedProperty()];
                }
                this.taskFilterActions = this.createAndFilterActions();
                this.buildForm(this.taskFilterProperties);
            });
    }

    checkMandatoryFilterProperties() {
        if (this.filterProperties === undefined || this.filterProperties.length === 0) {
            this.filterProperties = EditTaskFilterCloudComponent.DEFAULT_TASK_FILTER_PROPERTIES;
        }
    }

    checkMandatorySortProperties(): void {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            this.sortProperties = EditTaskFilterCloudComponent.DEFAULT_TASK_SORT_PROPERTIES;
        }
    }

    private setLastModifiedToFilter(formValues: TaskFilterCloudModel) {
        if (formValues.lastModifiedTo && Date.parse(formValues.lastModifiedTo.toString())) {
            const lastModifiedToFilterValue = moment(formValues.lastModifiedTo);
            lastModifiedToFilterValue.set({
                hour: 23,
                minute: 59,
                second: 59
            });
            formValues.lastModifiedTo = lastModifiedToFilterValue.toDate();
        }
    }

    /**
     * Return true if both filters are same
     * @param editedQuery, @param currentQuery
     */
    compareFilters(
        editedQuery: TaskFilterCloudModel,
        currentQuery: TaskFilterCloudModel
    ): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    save(saveAction: TaskFilterAction): void {
        this.taskFilterCloudService
            .updateFilter(this.changedTaskFilter)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                saveAction.filter = this.changedTaskFilter;
                this.action.emit(saveAction);
                this.formHasBeenChanged = this.compareFilters(this.changedTaskFilter, this.taskFilter);
            });
    }

    delete(deleteAction: TaskFilterAction): void {
        this.taskFilterCloudService
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
                const resultFilter: TaskFilterCloudModel = Object.assign({}, this.changedTaskFilter, newFilter);
                this.taskFilterCloudService.addFilter(resultFilter)
                    .pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                        saveAsAction.filter = resultFilter;
                        this.action.emit(saveAsAction);
                    });
            }
        });
    }

    isDisabledForDefaultFilters(action: TaskFilterAction): boolean {
        return (
            this.taskFilterCloudService.isDefaultFilter(this.taskFilter.name) &&
            EditTaskFilterCloudComponent.ACTIONS_DISABLED_BY_DEFAULT.includes(action.actionType)
        );
    }

    restoreDefaultTaskFilters(): Observable<TaskFilterCloudModel[]> {
        return this.taskFilterCloudService.getTaskListFilters(this.appName);
    }

    createLastModifiedProperty(): TaskFilterProperties[] {
        return [
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.LAST_MODIFIED_FROM',
                type: 'date',
                key: 'lastModifiedFrom',
                value: ''
            }),

            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.LAST_MODIFIED_TO',
                type: 'date',
                key: 'lastModifiedTo',
                value: ''
            })
        ];
    }

    createTaskFilterProperties(): TaskFilterProperties[] {
        return [
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: this.taskFilter.appName || '',
                options: this.applicationNames
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.TASK_ID',
                type: 'text',
                key: 'taskId',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: this.taskFilter.status || EditTaskFilterCloudComponent.DEFAULT_TASK_STATUS_PROPERTIES[0].value,
                options: EditTaskFilterCloudComponent.DEFAULT_TASK_STATUS_PROPERTIES
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.ASSIGNMENT',
                type: 'text',
                key: 'assignee',
                value: this.taskFilter.assignee || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_NAME',
                type: 'select',
                key: 'processDefinitionName',
                value: this.taskFilter.processDefinitionName || '',
                options: this.processDefinitionNames
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                type: 'text',
                key: 'processInstanceId',
                value: this.taskFilter.processInstanceId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: this.taskFilter.processDefinitionId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.TASK_NAME',
                type: 'text',
                key: 'taskName',
                value: this.taskFilter.taskName || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PARENT_TASK_ID',
                type: 'text',
                key: 'parentTaskId',
                value: this.taskFilter.parentTaskId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PRIORITY',
                type: 'text',
                key: 'priority',
                value: this.taskFilter.priority || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.OWNER',
                type: 'text',
                key: 'owner',
                value: this.taskFilter.owner || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CREATED_DATE',
                type: 'date',
                key: 'createdDate',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: this.taskFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: this.taskFilter.order || EditTaskFilterCloudComponent.DIRECTIONS[0].value,
                options: EditTaskFilterCloudComponent.DIRECTIONS
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STAND_ALONE',
                type: 'checkbox',
                key: 'standalone',
                value: this.taskFilter.standalone || false
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DUE_DATE',
                type: 'date-range',
                key: 'dueDate',
                attributes: { dateType: 'dueDateType', from: '_dueDateFrom', to: '_dueDateTo'},
                value: {
                    dueDateType: this.taskFilter.dueDateType || null,
                    _dueDateFrom: this.taskFilter.dueDateFrom || null,
                    _dueDateTo: this.taskFilter.dueDateTo || null
                },
                dateFilterOptions: [
                    DateCloudFilterType.NO_DATE,
                    DateCloudFilterType.TOMORROW,
                    DateCloudFilterType.NEXT_7_DAYS,
                    DateCloudFilterType.RANGE
                ]
            })
        ];
    }
}
