/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, inject, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TaskFilterAction, TaskFilterCloudModel, TaskFilterProperties, TaskStatusFilter } from '../../../models/filter-cloud.model';
import { TaskFilterCloudService } from '../../../services/task-filter-cloud.service';
import { DateCloudFilterType } from '../../../../../models/date-cloud-filter.model';
import { BaseEditTaskFilterCloudComponent, DropdownOption } from '../base-edit-task-filter-cloud.component';
import { set } from 'date-fns';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { IconComponent } from '@alfresco/adf-core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateRangeFilterComponent } from '../../../../../common/date-range-filter/date-range-filter.component';
import { PeopleCloudComponent } from '../../../../../people/components/people-cloud.component';
import { TaskAssignmentFilterCloudComponent } from '../../task-assignment-filter/task-assignment-filter.component';

@Component({
    selector: 'adf-cloud-edit-task-filter',
    imports: [
        CommonModule,
        TranslateModule,
        MatExpansionModule,
        MatButtonModule,
        IconComponent,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
        MatCheckboxModule,
        DateRangeFilterComponent,
        PeopleCloudComponent,
        TaskAssignmentFilterCloudComponent
    ],
    templateUrl: './edit-task-filter-cloud.component.html',
    styleUrls: ['./edit-task-filter-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditTaskFilterCloudComponent extends BaseEditTaskFilterCloudComponent<TaskFilterCloudModel> {
    private taskFilterCloudService = inject(TaskFilterCloudService);

    constructor() {
        super();
    }

    assignNewFilter(model: TaskFilterCloudModel) {
        this.setLastModifiedToFilter(model);
        this.changedTaskFilter = new TaskFilterCloudModel(Object.assign({}, this.taskFilter, model));
        this.formHasBeenChanged = !this.deepCompare(this.changedTaskFilter, this.taskFilter);
        this.filterChange.emit(this.changedTaskFilter);
    }

    protected getTaskFilterById(appName: string, id: string) {
        return this.taskFilterCloudService.getTaskFilterById(appName, id).pipe(map((response) => new TaskFilterCloudModel(response)));
    }

    createAndFilterProperties() {
        const result = super.createAndFilterProperties();

        if (this.hasLastModifiedProperty()) {
            return [...result, ...this.createLastModifiedProperty()];
        }

        return result;
    }

    getDefaultFilterProperties(): string[] {
        return ['status', 'assignee', 'sort', 'order'];
    }

    getDefaultSortProperties(): string[] {
        return ['id', 'name', 'createdDate', 'priority'];
    }

    private setLastModifiedToFilter(formValues: TaskFilterCloudModel) {
        if (formValues.lastModifiedTo && Date.parse(formValues.lastModifiedTo.toString())) {
            const lastModifiedToFilterValue = set(new Date(formValues.lastModifiedTo), {
                hours: 23,
                minutes: 59,
                seconds: 59
            });
            formValues.lastModifiedTo = lastModifiedToFilterValue.toISOString();
        }
    }

    protected updateFilter(filterToUpdate: TaskFilterCloudModel): Observable<TaskFilterCloudModel[]> {
        return this.taskFilterCloudService.updateFilter(filterToUpdate);
    }

    protected deleteFilter(filterToDelete: TaskFilterCloudModel): Observable<TaskFilterCloudModel[]> {
        return this.taskFilterCloudService.deleteFilter(filterToDelete);
    }

    protected addFilter(filterToAdd: TaskFilterCloudModel): Observable<any> {
        return this.taskFilterCloudService.addFilter(filterToAdd).pipe(takeUntilDestroyed(this.destroyRef));
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

    private createLastModifiedProperty(): TaskFilterProperties[] {
        return [
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.LAST_MODIFIED_FROM',
                type: 'date',
                key: 'lastModifiedFrom',
                value: ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.LAST_MODIFIED_TO',
                type: 'date',
                key: 'lastModifiedTo',
                value: ''
            }
        ];
    }

    private getStatusOptions(): DropdownOption[] {
        return [
            { value: TaskStatusFilter.ALL, label: 'ADF_CLOUD_TASK_FILTERS.STATUS.ALL' },
            { value: TaskStatusFilter.CREATED, label: 'ADF_CLOUD_TASK_FILTERS.STATUS.CREATED' },
            { value: TaskStatusFilter.ASSIGNED, label: 'ADF_CLOUD_TASK_FILTERS.STATUS.ASSIGNED' },
            { value: TaskStatusFilter.SUSPENDED, label: 'ADF_CLOUD_TASK_FILTERS.STATUS.SUSPENDED' },
            { value: TaskStatusFilter.CANCELLED, label: 'ADF_CLOUD_TASK_FILTERS.STATUS.CANCELLED' },
            { value: TaskStatusFilter.COMPLETED, label: 'ADF_CLOUD_TASK_FILTERS.STATUS.COMPLETED' }
        ];
    }

    createTaskFilterProperties(): TaskFilterProperties[] {
        const statusOptions = this.getStatusOptions();
        const sortProperties = this.createSortProperties;
        return [
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: this.taskFilter.appName || '',
                options: this.applicationNames
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.TASK_ID',
                type: 'text',
                key: 'taskId',
                value: ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: this.taskFilter.status || statusOptions[0].value,
                options: statusOptions
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.ASSIGNMENT',
                type: 'text',
                key: 'assignee',
                value: this.taskFilter.assignee || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_NAME',
                type: 'select',
                key: 'processDefinitionName',
                value: this.taskFilter.processDefinitionName || '',
                options: this.processDefinitionNames
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                type: 'text',
                key: 'processInstanceId',
                value: this.processInstanceId || this.taskFilter.processInstanceId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: this.taskFilter.processDefinitionId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.TASK_NAME',
                type: 'text',
                key: 'taskName',
                value: this.taskFilter.taskName || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PARENT_TASK_ID',
                type: 'text',
                key: 'parentTaskId',
                value: this.taskFilter.parentTaskId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PRIORITY',
                type: 'select',
                key: 'priority',
                value: this.taskFilter.priority || '',
                options: this.taskCloudService.priorities
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.OWNER',
                type: 'text',
                key: 'owner',
                value: this.taskFilter.owner || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CREATED_DATE',
                type: 'date',
                key: 'createdDate',
                value: ''
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: this.taskFilter.sort || sortProperties[0].value,
                options: sortProperties
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: this.taskFilter.order || this.sortDirections[0].value,
                options: [...this.sortDirections]
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STAND_ALONE',
                type: 'checkbox',
                key: 'standalone',
                value: this.taskFilter.standalone || false
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DUE_DATE',
                type: 'date-range',
                key: 'dueDateRange',
                attributes: { dateType: 'dueDateType', from: '_dueDateFrom', to: '_dueDateTo' },
                value: {
                    dueDateType: this.taskFilter.dueDateType || null,
                    _dueDateFrom: this.taskFilter.dueDateFrom || null,
                    _dueDateTo: this.taskFilter.dueDateTo || null
                },
                dateFilterOptions: [
                    DateCloudFilterType.NO_DATE,
                    DateCloudFilterType.TODAY,
                    DateCloudFilterType.TOMORROW,
                    DateCloudFilterType.NEXT_7_DAYS,
                    DateCloudFilterType.RANGE
                ]
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.COMPLETED_DATE',
                type: 'date-range',
                key: 'completedDateRange',
                attributes: { dateType: 'completedDateType', from: '_completedFrom', to: '_completedTo' },
                value: {
                    completedDateType: this.taskFilter.completedDateType || null,
                    _completedFrom: this.taskFilter.completedFrom || null,
                    _completedTo: this.taskFilter.completedTo || null
                }
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CREATED_DATE',
                type: 'date-range',
                key: 'createdDateRange',
                attributes: { dateType: 'createdDateType', from: '_createdFrom', to: '_createdTo' },
                value: {
                    createdDateType: this.taskFilter.createdDateType || null,
                    _createdFrom: this.taskFilter.createdFrom || null,
                    _createdTo: this.taskFilter.createdTo || null
                }
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.COMPLETED_BY',
                type: 'people',
                key: 'completedBy',
                value: this.taskFilter.completedBy ? [this.taskFilter.completedBy] : null,
                selectionMode: 'single'
            },
            {
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.ASSIGNMENT',
                type: 'assignment',
                key: 'assignment',
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups' },
                value: {
                    assignedUsers: this.taskFilter.assignedUsers || [],
                    candidateGroups: this.taskFilter.candidateGroups || []
                },
                selectionMode: 'multiple'
            }
        ];
    }
}
