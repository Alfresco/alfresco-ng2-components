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

import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { TaskFilterCloudModel, FilterActionType, TaskFilterProperties } from './../models/filter-cloud.model';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { MatDialog } from '@angular/material';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';
import { TranslationService } from '@alfresco/adf-core';
import { debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'adf-cloud-edit-task-filter',
  templateUrl: './edit-task-filter-cloud.component.html',
  styleUrls: ['./edit-task-filter-cloud.component.scss']
})
export class EditTaskFilterCloudComponent implements OnChanges {

    public static ACTION_SAVE = 'SAVE';
    public static ACTION_SAVE_AS = 'SAVE_AS';
    public static ACTION_DELETE = 'DELETE';
    public static MIN_VALUE = 1;

    /** Name of the app. */
    @Input()
    appName: string;

    /** ID of the task filter. */
    @Input()
    id: string;

    @Input()
    filterProperties = ['state', 'assignment', 'sort', 'order', 'page', 'size']; // default ['state', 'assignment', 'sort', 'order']

    @Input()
    showFilterActions = true ;

    /** Emitted when a task filter property changes. */
    @Output()
    filterChange: EventEmitter<TaskFilterCloudModel> = new EventEmitter();

    /** Emitted when a filter action occurs (i.e Save, Save As, Delete). */
    @Output()
    action: EventEmitter<FilterActionType> = new EventEmitter();

    taskFilter: TaskFilterCloudModel;
    changedTaskFilter: TaskFilterCloudModel;

    columns = [
        {value: 'id', label: 'ID'},
        {value: 'name', label: 'NAME'},
        {value: 'createdDate', label: 'Created Date'},
        {value: 'priority', label: 'PRIORITY'},
        {value: 'processDefinitionId', label: 'PROCESS DEFINITION ID'}
      ];

    status = [
        {label: 'ALL', value: ''},
        {label: 'CREATED', value: 'CREATED'},
        {label: 'CANCELLED', value: 'CANCELLED'},
        {label: 'ASSIGNED', value: 'ASSIGNED'},
        {label: 'SUSPENDED', value: 'SUSPENDED'},
        {label: 'COMPLETED', value: 'COMPLETED'},
        {label: 'DELETED', value: 'DELETED'}
    ];

    directions = [{label: 'ASC', value: 'ASC'}, {label: 'DESC', value: 'DESC'}];

    formHasBeenChanged = false;
    editTaskFilterForm: FormGroup;
    taskFilterProperties: any[] = [];
    toggleFilterActions: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private taskFilterCloudService: TaskFilterCloudService) {
        }

    ngOnChanges(changes: SimpleChanges) {
        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.retrieveTaskFilter();
            this.buildForm();
            this.initTaskFilterProperties();
        }
    }

    buildForm() {
        this.formHasBeenChanged = false;
        this.editTaskFilterForm = this.formBuilder.group({
            state: this.taskFilter.state,
            appName: this.taskFilter.appName,
            processDefinitionId: this.taskFilter.processDefinitionId,
            assignment: this.taskFilter.assignment,
            sort: this.taskFilter.sort,
            order: this.taskFilter.order,
            dueAfter: '',
            dueBefore: '',
            page: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(EditTaskFilterCloudComponent.MIN_VALUE)]),
            size: new FormControl('', [Validators.pattern('^[0-9]*$'), Validators.min(EditTaskFilterCloudComponent.MIN_VALUE)]),
            processInstanceId: '',
            category: '',
            claimedDateFrom: '',
            claimedDateTo: '',
            createdDateFrom: '',
            createdDateTo: '',
            dueDateFrom: '',
            dueDateTo: '',
            formKey: '',
            taskName: '',
            parentTaskId: '',
            priority: '',
            serviceFullName: '',
            serviceName: '',
            standAlone: ''
        });
        this.onFilterChange();
    }

    retrieveTaskFilter() {
        this.taskFilter = this.taskFilterCloudService.getTaskFilterById(this.appName, this.id);
    }

    /**
     * Check for edit task filter form changes
     */
    onFilterChange() {
        this.editTaskFilterForm.valueChanges
            .pipe(debounceTime(300))
            .subscribe((formValues: TaskFilterCloudModel) => {
            this.changedTaskFilter = new TaskFilterCloudModel(Object.assign({}, this.taskFilter, formValues));
            this.formHasBeenChanged = !this.compareFilters(this.changedTaskFilter, this.taskFilter);
            this.filterChange.emit(this.changedTaskFilter);
        });
    }

    /**
     * Check if both filters are same
     */
    compareFilters(editedQuery, currentQuery): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    onSave() {
        this.taskFilterCloudService.updateFilter(this.changedTaskFilter);
        this.action.emit({actionType: EditTaskFilterCloudComponent.ACTION_SAVE, id: this.changedTaskFilter.id});
    }

    onDelete() {
        this.taskFilterCloudService.deleteFilter(this.taskFilter);
        this.action.emit({actionType: EditTaskFilterCloudComponent.ACTION_DELETE, id: this.taskFilter.id});
    }

    onSaveAs() {
        const dialogRef = this.dialog.open(TaskFilterDialogCloudComponent, {
            data: {
                name: this.translateService.instant(this.taskFilter.name)
            },
            height: 'auto',
            minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe( (result) => {
            if (result && result.action === TaskFilterDialogCloudComponent.ACTION_SAVE) {
                const filterId = Math.random().toString(36).substr(2, 9);
                const filterKey = this.getSanitizeFilterName(result.name);
                const newFilter = {
                                    name: result.name,
                                    icon: result.icon,
                                    id: filterId,
                                    key: 'custom-' + filterKey
                                };
                const filter = Object.assign({}, this.changedTaskFilter, newFilter);
                this.taskFilterCloudService.addFilter(filter);
                this.action.emit({actionType: EditTaskFilterCloudComponent.ACTION_SAVE_AS, id: filter.id});
            }
        });
    }

    getSanitizeFilterName(filterName) {
        const nameWithHyphen = this.replaceSpaceWithHyphen(filterName.trim());
        return nameWithHyphen.toLowerCase();
    }

    replaceSpaceWithHyphen(name) {
        const regExt = new RegExp(' ', 'g');
        return name.replace(regExt, '-');
    }

    onExpand() {
        this.toggleFilterActions = true;
    }

    onClose() {
        this.toggleFilterActions = false;
    }

    initTaskFilterProperties() {
        if (this.filterProperties && this.filterProperties.length > 0) {
            const defaultProperties = this.defaultTaskFilterProperties();
            this.taskFilterProperties = defaultProperties.filter((filterProperty) => this.isValidSelection(this.filterProperties, filterProperty));
        }
    }

    private isValidSelection(filterProperties: string[], filterProperty: any): boolean {
        return filterProperties ? filterProperties.indexOf(filterProperty.key) >= 0 : true;
    }

    defaultTaskFilterProperties() {
        return [
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'state',
                options: of(this.status)
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.ASSIGNMENT',
                type: 'text',
                key: 'assignment'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.APP_NAME',
                type: 'text',
                key: 'appName'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.COLUMN',
                type: 'select',
                key: 'sort',
                options: of(this.columns)
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                options: of(this.directions)
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                type: 'text',
                key: 'processInstanceId'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.SIZE',
                type: 'text',
                key: 'size'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PAGE',
                type: 'text',
                key: 'page'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DUE_AFTER',
                type: 'date',
                key: 'dueAfter'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DUE_BEFORE',
                type: 'date',
                key: 'dueBefore'
            }),

            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CATEGORY',
                type: 'text',
                key: 'category'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CLAIMED_DATE_FROM',
                type: 'date',
                key: 'claimedDateFrom'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CLAIMED_DATE_TO',
                type: 'date',
                key: 'claimedDateTo'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CREATED_DATE_FORM',
                type: 'date',
                key: 'createdDateFrom'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CREATED_DATE_TO',
                type: 'date',
                key: 'createdDateTo'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.FORM_KEY',
                type: 'text',
                key: 'formKey'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.NAME',
                type: 'text',
                key: 'taskName'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PARENT_TASK_ID',
                type: 'text',
                key: 'parentTaskId'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PRIORITY',
                type: 'text',
                key: 'priority'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.SERVICE_FULL_NAME',
                type: 'text',
                key: 'serviceFullName'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.SERVICE_NAME',
                type: 'text',
                key: 'serviceName'
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STAND_ALONE',
                type: 'text',
                key: 'standAlone'
            })
        ];
    }

    isDateType(property: TaskFilterProperties) {
        return property.type === 'date';
    }

    isSelectType(property: TaskFilterProperties) {
        return property.type === 'select';
    }

    isTextType(property: TaskFilterProperties) {
        return property.type === 'text';
    }
}
