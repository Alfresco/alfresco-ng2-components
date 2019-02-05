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

import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { TaskFilterCloudModel, TaskFilterProperties, FilterOptions, TaskFilterAction } from './../models/filter-cloud.model';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { MatDialog, DateAdapter } from '@angular/material';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';
import { TranslationService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { debounceTime, filter } from 'rxjs/operators';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { ApplicationInstanceModel } from '../../../app/models/application-instance.model';
import moment from 'moment-es6';
import { Moment } from 'moment';

@Component({
    selector: 'adf-cloud-edit-task-filter',
    templateUrl: './edit-task-filter-cloud.component.html',
    styleUrls: ['./edit-task-filter-cloud.component.scss']
})
export class EditTaskFilterCloudComponent implements OnInit, OnChanges {

    public static ACTION_SAVE = 'save';
    public static ACTION_SAVE_AS = 'saveAs';
    public static ACTION_DELETE = 'delete';
    public static APP_RUNNING_STATUS: string = 'RUNNING';
    public static MIN_VALUE = 1;
    public static APPLICATION_NAME: string = 'appName';
    public static LAST_MODIFIED: string = 'lastModified';
    public static SORT: string = 'sort';
    public static ORDER: string = 'order';
    public static DEFAULT_TASK_FILTER_PROPERTIES = ['status', 'assignee', 'sort', 'order'];
    public static DEFAULT_SORT_PROPERTIES = ['id', 'name', 'createdDate', 'priority'];
    public static DEFAULT_ACTIONS = ['save', 'saveAs', 'delete'];
    public FORMAT_DATE: string = 'DD/MM/YYYY';

    /** (required) Name of the app. */
    @Input()
    appName: string;

    /** (required) ID of the task filter. */
    @Input()
    id: string;

    /** List of task filter properties to display. */
    @Input()
    filterProperties: string[] = EditTaskFilterCloudComponent.DEFAULT_TASK_FILTER_PROPERTIES;

    /** List of sort properties to display. */
    @Input()
    sortProperties: string[] = EditTaskFilterCloudComponent.DEFAULT_SORT_PROPERTIES;

    /** List of task filter actions. */
    @Input()
    actions: string[] = EditTaskFilterCloudComponent.DEFAULT_ACTIONS;

    /** Toggles the filter actions. */
    @Input()
    showFilterActions = true;

    /** Toggles the title. */
    @Input()
    showTitle = true;

    /** Emitted when a task filter property changes. */
    @Output()
    filterChange: EventEmitter<TaskFilterCloudModel> = new EventEmitter();

    /** Emitted when a filter action occurs (i.e Save, Save As, Delete). */
    @Output()
    action: EventEmitter<TaskFilterAction> = new EventEmitter();

    taskFilter: TaskFilterCloudModel;
    changedTaskFilter: TaskFilterCloudModel;

    status = [
        { label: 'ALL', value: '' },
        { label: 'CREATED', value: 'CREATED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
        { label: 'ASSIGNED', value: 'ASSIGNED' },
        { label: 'SUSPENDED', value: 'SUSPENDED' },
        { label: 'COMPLETED', value: 'COMPLETED' },
        { label: 'DELETED', value: 'DELETED' }
    ];

    directions = [
        { label: 'ASC', value: 'ASC' },
        { label: 'DESC', value: 'DESC' }
    ];

    applicationNames: any[] = [];
    dateFilter: any[] = [];
    formHasBeenChanged = false;
    editTaskFilterForm: FormGroup;
    taskFilterProperties: TaskFilterProperties[] = [];
    taskFilterActions: TaskFilterAction[] = [];
    toggleFilterActions: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private taskFilterCloudService: TaskFilterCloudService,
        private dateAdapter: DateAdapter<Moment>,
        private userPreferencesService: UserPreferencesService,
        private appsProcessCloudService: AppsProcessCloudService) {
    }

    ngOnInit() {
        this.userPreferencesService.select(UserPreferenceValues.Locale).subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.taskFilterProperties = this.createAndFilterProperties();
            this.taskFilterActions = this.createAndFilterActions();
            this.buildForm(this.taskFilterProperties);
        }
    }

    retrieveTaskFilter(): TaskFilterCloudModel {
        return new TaskFilterCloudModel(this.taskFilterCloudService.getTaskFilterById(this.appName, this.id));
    }

    buildForm(taskFilterProperties: TaskFilterProperties[]) {
        this.formHasBeenChanged = false;
        this.editTaskFilterForm = this.formBuilder.group(this.getFormControlsConfig(taskFilterProperties));
        this.onFilterChange();
    }

    getFormControlsConfig(taskFilterProperties: TaskFilterProperties[]): any {
        const properties = taskFilterProperties.map((property: TaskFilterProperties) => {
            return { [property.key]: property.value };
        });
        return properties.reduce(((result, current) => Object.assign(result, current)), {});
    }

    /**
     * Check for edit task filter form changes
     */
    onFilterChange() {
        this.editTaskFilterForm.valueChanges
            .pipe(debounceTime(500),
                filter(() => this.isFormValid()))
            .subscribe((formValues: TaskFilterCloudModel) => {
                this.changedTaskFilter = new TaskFilterCloudModel(Object.assign({}, this.taskFilter, formValues));
                this.formHasBeenChanged = !this.compareFilters(this.changedTaskFilter, this.taskFilter);
                this.filterChange.emit(this.changedTaskFilter);
            });
    }

    createAndFilterProperties(): TaskFilterProperties[] {
        this.checkMandatoryFilterProperties();

        if (this.checkForApplicationNameProperty()) {
            this.applicationNames = [];
            this.getRunningApplications();
        }

        this.taskFilter = this.retrieveTaskFilter();
        const defaultProperties = this.createTaskFilterProperties(this.taskFilter);
        let filteredProperties = defaultProperties.filter((filterProperty: TaskFilterProperties) => this.isValidProperty(this.filterProperties, filterProperty));

        if (!this.hasSortProperty()) {
            filteredProperties = this.removeOrderProperty(filteredProperties);
        }

        if (this.hasLastModifiedProperty()) {
            filteredProperties = [...filteredProperties, ...this.createLastModifiedProperty()];
        }

        return filteredProperties;
    }

    checkMandatoryFilterProperties() {
        if (this.filterProperties === undefined || this.filterProperties.length === 0) {
            this.filterProperties = EditTaskFilterCloudComponent.DEFAULT_TASK_FILTER_PROPERTIES;
        }
    }

    private isValidProperty(filterProperties: string[], filterProperty: any): boolean {
        return filterProperties ? filterProperties.indexOf(filterProperty.key) >= 0 : true;
    }

    checkForApplicationNameProperty(): boolean {
        return this.filterProperties ? this.filterProperties.indexOf(EditTaskFilterCloudComponent.APPLICATION_NAME) >= 0 : false;
    }

    hasSortProperty(): boolean {
        return this.filterProperties.indexOf(EditTaskFilterCloudComponent.SORT) >= 0;
    }

    removeOrderProperty(filteredProperties: TaskFilterProperties[]) {
        if (filteredProperties && filteredProperties.length > 0) {
            const propertiesWithOutOrderProperty = filteredProperties.filter((property: TaskFilterProperties) => { return property.key !== EditTaskFilterCloudComponent.ORDER; });
            return propertiesWithOutOrderProperty;
        }
    }

    hasLastModifiedProperty(): boolean {
        return this.filterProperties.indexOf(EditTaskFilterCloudComponent.LAST_MODIFIED) >= 0;
    }

    createSortProperties(): any {
        this.checkMandatorySortProperties();
        const sortProperties = this.sortProperties.map((property: string) => {
            return <FilterOptions> { label: property.charAt(0).toUpperCase() + property.slice(1), value: property };
        });
        return sortProperties;
    }

    checkMandatorySortProperties() {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            this.sortProperties = EditTaskFilterCloudComponent.DEFAULT_SORT_PROPERTIES;
        }
    }

    createAndFilterActions() {
        this.checkMandatoryActions();
        const allActions = this.createFilterActions();
        return allActions.filter((action: TaskFilterAction) => this.isValidAction(this.actions, action));
    }

    checkMandatoryActions() {
        if (this.actions === undefined || this.actions.length === 0) {
            this.actions = EditTaskFilterCloudComponent.DEFAULT_ACTIONS;
        }
    }

    private isValidAction(actions: string[], action: any): boolean {
        return actions ? actions.indexOf(action.actionType) >= 0 : true;
    }

    isFormValid(): boolean {
        return this.editTaskFilterForm.valid;
    }

    getPropertyController(property: TaskFilterProperties): AbstractControl {
        return this.editTaskFilterForm.get(property.key);
    }

    onDateChanged(newDateValue: any, dateProperty: TaskFilterProperties) {
        if (newDateValue) {
            let momentDate = moment(newDateValue, this.FORMAT_DATE, true);

            if (momentDate.isValid()) {
                this.getPropertyController(dateProperty).setValue(momentDate.toDate());
                this.getPropertyController(dateProperty).setErrors(null);
            } else {
                this.getPropertyController(dateProperty).setErrors({invalid: true});
            }
        }
    }

    hasError(property: TaskFilterProperties): boolean {
        return this.getPropertyController(property).errors && this.getPropertyController(property).errors.invalid;
    }

    /**
     * Check if both filters are same
     */
    compareFilters(editedQuery, currentQuery): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    getRunningApplications() {
        this.appsProcessCloudService.getDeployedApplicationsByStatus(EditTaskFilterCloudComponent.APP_RUNNING_STATUS)
            .subscribe((applications: ApplicationInstanceModel[]) => {
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        this.applicationNames.push({ label: application.name, value: application.name });
                    });
                }
            });
    }

    executeFilterActions(action: TaskFilterAction): void {
        if (action.actionType === EditTaskFilterCloudComponent.ACTION_SAVE) {
            this.save(action);
        } else if (action.actionType === EditTaskFilterCloudComponent.ACTION_SAVE_AS) {
            this.saveAs(action);
        } else if (action.actionType === EditTaskFilterCloudComponent.ACTION_DELETE) {
            this.delete(action);
        }
    }

    save(saveAction: TaskFilterAction) {
        this.taskFilterCloudService.updateFilter(this.changedTaskFilter);
        saveAction.filter = this.changedTaskFilter;
        this.action.emit(saveAction);
        this.formHasBeenChanged = this.compareFilters(this.changedTaskFilter, this.taskFilter);
    }

    delete(deleteAction: TaskFilterAction) {
        this.taskFilterCloudService.deleteFilter(this.taskFilter);
        deleteAction.filter = this.taskFilter;
        this.action.emit(deleteAction);
    }

    saveAs(saveAsAction: TaskFilterAction) {
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
                const resultFilter = Object.assign({}, this.changedTaskFilter, newFilter);
                this.taskFilterCloudService.addFilter(resultFilter);
                saveAsAction.filter = resultFilter;
                this.action.emit(saveAsAction);

            }
        });
    }

    getSanitizeFilterName(filterName): string {
        const nameWithHyphen = this.replaceSpaceWithHyphen(filterName.trim());
        return nameWithHyphen.toLowerCase();
    }

    replaceSpaceWithHyphen(name) {
        const regExt = new RegExp(' ', 'g');
        return name.replace(regExt, '-');
    }

    showActions(): boolean {
        return this.showFilterActions;
    }

    onExpand(event: any) {
        this.toggleFilterActions = true;
    }

    onClose(event: any) {
        this.toggleFilterActions = false;
    }

    isDateType(property: TaskFilterProperties): boolean {
        return property.type === 'date';
    }

    isSelectType(property: TaskFilterProperties): boolean {
        return property.type === 'select';
    }

    isTextType(property: TaskFilterProperties): boolean {
        return property.type === 'text';
    }

    isCheckBoxType(property: TaskFilterProperties): boolean {
        return property.type === 'checkbox';
    }

    hasFormChanged(action: any): boolean {
        if (action.actionType === EditTaskFilterCloudComponent.ACTION_SAVE) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditTaskFilterCloudComponent.ACTION_SAVE_AS) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditTaskFilterCloudComponent.ACTION_DELETE) {
            return false;
        }
    }

    createFilterActions(): TaskFilterAction[] {
        return [
            new TaskFilterAction({
                actionType: EditTaskFilterCloudComponent.ACTION_SAVE,
                icon: 'save',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.SAVE'
            }),
            new TaskFilterAction({
                actionType: EditTaskFilterCloudComponent.ACTION_SAVE_AS,
                icon: 'unarchive',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.SAVE_AS'
            }),
            new TaskFilterAction({
                actionType: EditTaskFilterCloudComponent.ACTION_DELETE,
                icon: 'delete',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.DELETE'
            })
        ];
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

    createTaskFilterProperties(currentTaskFilter: TaskFilterCloudModel): TaskFilterProperties[] {
        return [
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: currentTaskFilter.appName || '',
                options: this.applicationNames
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: currentTaskFilter.status || this.status[0].value,
                options: this.status
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.ASSIGNMENT',
                type: 'text',
                key: 'assignee',
                value: currentTaskFilter.assignee || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: currentTaskFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties()
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: currentTaskFilter.order || this.directions[0].value,
                options: this.directions
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                type: 'text',
                key: 'processInstanceId',
                value: currentTaskFilter.processInstanceId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: currentTaskFilter.processDefinitionId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.TASK_NAME',
                type: 'text',
                key: 'taskName',
                value: currentTaskFilter.taskName || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PARENT_TASK_ID',
                type: 'text',
                key: 'parentTaskId',
                value: currentTaskFilter.parentTaskId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PRIORITY',
                type: 'text',
                key: 'priority',
                value: currentTaskFilter.priority || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.OWNER',
                type: 'text',
                key: 'owner',
                value: currentTaskFilter.owner || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DUE_DATE',
                type: 'date',
                key: 'dueDate',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STAND_ALONE',
                type: 'checkbox',
                key: 'standAlone',
                value: currentTaskFilter.standAlone || false
            })
        ];
    }
}
