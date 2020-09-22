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

import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, filter, takeUntil, finalize, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import moment from 'moment-es6';
import { Moment } from 'moment';

import { TaskFilterCloudModel, TaskFilterProperties, FilterOptions, TaskFilterAction, ServiceTaskFilterCloudModel, TaskType } from './../models/filter-cloud.model';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';
import { TranslationService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { ApplicationInstanceModel } from '../../../app/models/application-instance.model';
import { DateCloudFilterType, DateRangeFilter } from '../../../models/date-cloud-filter.model';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { TaskCloudService } from '../../services/task-cloud.service';

@Component({
    selector: 'adf-cloud-edit-task-filter',
    templateUrl: './edit-task-filter-cloud.component.html',
    styleUrls: ['./edit-task-filter-cloud.component.scss']
})
export class EditTaskFilterCloudComponent implements OnInit, OnChanges, OnDestroy {

    public static ACTION_SAVE = 'save';
    public static ACTION_SAVE_AS = 'saveAs';
    public static ACTION_DELETE = 'delete';
    public static APP_RUNNING_STATUS: string = 'RUNNING';
    public static APPLICATION_NAME: string = 'appName';
    public static PROCESS_DEFINITION_NAME: string = 'processDefinitionName';
    public static LAST_MODIFIED: string = 'lastModified';
    public static SORT: string = 'sort';
    public static ORDER: string = 'order';
    public static DEFAULT_TASK_FILTER_PROPERTIES = ['status', 'assignee', 'sort', 'order'];
    public static DEFAULT_SERVICE_TASK_FILTER_PROPERTIES = ['appName', 'activityName', 'status', 'sort', 'order'];
    public static DEFAULT_USER_TASK_SORT_PROPERTIES = ['id', 'name', 'createdDate', 'priority'];
    public static DEFAULT_SERVICE_TASK_SORT_PROPERTIES = ['id', 'name', 'startedDate', 'completedDate'];
    public static DEFAULT_ACTIONS = ['save', 'saveAs', 'delete'];
    public FORMAT_DATE: string = 'DD/MM/YYYY';

    /** (required) Name of the app. */
    @Input()
    appName: string = '';

    /** user role. */
    @Input()
    role: string = '';

    /** (required) ID of the task filter. */
    @Input()
    id: string;

    /** List of task filter properties to display. */
    @Input()
    filterProperties: string[] = [];

    /** List of sort properties to display. */
    @Input()
    sortProperties: string[] = [];

    /** List of task filter actions. */
    @Input()
    actions: string[] = EditTaskFilterCloudComponent.DEFAULT_ACTIONS;

    /** Toggles the filter actions. */
    @Input()
    showFilterActions = true;

    /** Toggles the title. */
    @Input()
    showTitle = true;

    /** Toggles display of task filter name */
    @Input()
    showTaskFilterName = true;

    /** Task type: userTask | serviceTask */
    @Input()
    taskType = 'userTask';

    /** Emitted when a task filter property changes. */
    @Output()
    filterChange: EventEmitter<TaskFilterCloudModel | ServiceTaskFilterCloudModel> = new EventEmitter();

    /** Emitted when a filter action occurs (i.e Save, Save As, Delete). */
    @Output()
    action: EventEmitter<TaskFilterAction> = new EventEmitter();

    taskFilter: TaskFilterCloudModel | ServiceTaskFilterCloudModel;
    changedTaskFilter: TaskFilterCloudModel | ServiceTaskFilterCloudModel;

    userTaskStatus = [
        { label: 'ALL', value: '' },
        { label: 'CREATED', value: 'CREATED' },
        { label: 'ASSIGNED', value: 'ASSIGNED' },
        { label: 'SUSPENDED', value: 'SUSPENDED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
        { label: 'COMPLETED', value: 'COMPLETED' }
    ];

    serviceTaskStatus = [
        { label: 'ALL', value: '' },
        { label: 'STARTED', value: 'STARTED' },
        { label: 'COMPLETED', value: 'COMPLETED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
        { label: 'ERROR', value: 'ERROR' }
    ];

    directions = [
        { label: 'ASC', value: 'ASC' },
        { label: 'DESC', value: 'DESC' }
    ];
    actionDisabledForDefault = [
        EditTaskFilterCloudComponent.ACTION_SAVE,
        EditTaskFilterCloudComponent.ACTION_DELETE
    ];
    allProcessDefinitionNamesOption = { label: 'All', value: '' };

    private applicationNames: any[] = [];
    private processDefinitionNames: any[] = [];
    private formHasBeenChanged = false;
    editTaskFilterForm: FormGroup;
    taskFilterProperties: TaskFilterProperties[] = [];
    taskFilterActions: TaskFilterAction[] = [];
    toggleFilterActions: boolean = false;

    private onDestroy$ = new Subject<boolean>();
    isLoading: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private taskFilterCloudService: TaskFilterCloudService,
        private dateAdapter: DateAdapter<Moment>,
        private userPreferencesService: UserPreferencesService,
        private appsProcessCloudService: AppsProcessCloudService,
        private taskCloudService: TaskCloudService) {
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));
    }

    ngOnChanges(changes: SimpleChanges) {
        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.retrieveTaskFilterAndBuildForm();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    buildForm(taskFilterProperties: TaskFilterProperties[]) {
        this.formHasBeenChanged = false;
        this.editTaskFilterForm = this.formBuilder.group(this.getFormControlsConfig(taskFilterProperties));
        this.onFilterChange();
    }

    getFormControlsConfig(taskFilterProperties: TaskFilterProperties[]): any {
        const properties = taskFilterProperties.map((property: TaskFilterProperties) => {
            if (!property.rangeKeys) {
                return { [property.key]: property.value };
            } else {
                return {
                    [property.rangeKeys.from]: property.value[property.rangeKeys.from],
                    [property.rangeKeys.to]: property.value[property.rangeKeys.to]
                };
            }
        });
        return properties.reduce(((result, current) => Object.assign(result, current)), {});
    }

    /**
     * Check for edit task filter form changes
     */
    onFilterChange() {
        this.editTaskFilterForm.valueChanges
            .pipe(
                debounceTime(200),
                filter(() => this.isFormValid()),
                takeUntil(this.onDestroy$)
            )
            .subscribe((formValues: TaskFilterCloudModel | ServiceTaskFilterCloudModel) => {
                if (this.taskType === TaskType.UserTask) {
                    this.setLastModifiedToFilter(<TaskFilterCloudModel> formValues);
                    this.changedTaskFilter = new TaskFilterCloudModel(Object.assign({}, this.taskFilter, formValues));
                } else {
                    this.changedTaskFilter = new ServiceTaskFilterCloudModel(Object.assign({}, this.taskFilter, formValues));
                }

                this.formHasBeenChanged = !this.compareFilters(this.changedTaskFilter, this.taskFilter);
                this.filterChange.emit(this.changedTaskFilter);
            });
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
                if (this.taskType === TaskType.ServiceTask) {
                    this.taskFilter = new ServiceTaskFilterCloudModel(response);
                } else {
                    this.taskFilter = new TaskFilterCloudModel(response);
                }
                this.taskFilterProperties = this.createAndFilterProperties();
                this.taskFilterActions = this.createAndFilterActions();
                this.buildForm(this.taskFilterProperties);
            });
    }

    createAndFilterProperties() {
        this.checkMandatoryFilterProperties();

        if (this.checkForProperty(EditTaskFilterCloudComponent.APPLICATION_NAME)) {
            this.applicationNames = [];
            this.getRunningApplications();
        }
        if (this.checkForProperty(EditTaskFilterCloudComponent.PROCESS_DEFINITION_NAME)) {
            this.processDefinitionNames = [];
            this.getProcessDefinitions();
        }

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
            if (this.taskType === TaskType.ServiceTask) {
                this.filterProperties = EditTaskFilterCloudComponent.DEFAULT_SERVICE_TASK_FILTER_PROPERTIES;
            } else {
                this.filterProperties = EditTaskFilterCloudComponent.DEFAULT_TASK_FILTER_PROPERTIES;
            }
        }
    }

    private isValidProperty(filterProperties: string[], filterProperty: any): boolean {
        return filterProperties ? filterProperties.indexOf(filterProperty.key) >= 0 : true;
    }

    checkForProperty(property: string): boolean {
        return this.filterProperties ? this.filterProperties.indexOf(property) >= 0 : false;
    }

    hasSortProperty(): boolean {
        return this.filterProperties.indexOf(EditTaskFilterCloudComponent.SORT) >= 0;
    }

    removeOrderProperty(filteredProperties: TaskFilterProperties[]): TaskFilterProperties[] {
        if (filteredProperties && filteredProperties.length > 0) {
            return filteredProperties.filter(property => property.key !== EditTaskFilterCloudComponent.ORDER);
        }
        return [];
    }

    hasLastModifiedProperty(): boolean {
        return this.filterProperties.indexOf(EditTaskFilterCloudComponent.LAST_MODIFIED) >= 0;
    }

    get createSortProperties(): any {
        this.checkMandatorySortProperties();
        const sortProperties = this.sortProperties.map((property: string) => {
            return <FilterOptions> { label: property.charAt(0).toUpperCase() + property.slice(1), value: property };
        });
        return sortProperties;
    }

    checkMandatorySortProperties(): void {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            if (this.taskType === TaskType.ServiceTask) {
                this.sortProperties = EditTaskFilterCloudComponent.DEFAULT_SERVICE_TASK_SORT_PROPERTIES;
            } else {
                this.sortProperties = EditTaskFilterCloudComponent.DEFAULT_USER_TASK_SORT_PROPERTIES;
            }
        }
    }

    createAndFilterActions(): TaskFilterAction[] {
        this.checkMandatoryActions();
        return this.createFilterActions()
            .filter(action => this.isValidAction(this.actions, action));
    }

    checkMandatoryActions(): void {
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
            const momentDate = moment(newDateValue, this.FORMAT_DATE, true);

            if (momentDate.isValid()) {
                this.getPropertyController(dateProperty).setValue(momentDate.toDate());
                this.getPropertyController(dateProperty).setErrors(null);
            } else {
                this.getPropertyController(dateProperty).setErrors({ invalid: true });
            }
        }
    }

    onDateRangeFilterChanged(dateRange: DateRangeFilter, property: TaskFilterProperties) {
        this.editTaskFilterForm.get(property.rangeKeys.from).setValue(
            dateRange.startDate ? dateRange.startDate.toISOString() : null
        );
        this.editTaskFilterForm.get(property.rangeKeys.to).setValue(
            dateRange.endDate ? dateRange.endDate.toISOString() : null
        );
    }

    hasError(property: TaskFilterProperties): boolean {
        return this.getPropertyController(property).errors && this.getPropertyController(property).errors.invalid;
    }

    /**
     * Return true if both filters are same
     * @param editedQuery, @param currentQuery
     */
    compareFilters(
        editedQuery: TaskFilterCloudModel | ServiceTaskFilterCloudModel,
        currentQuery: TaskFilterCloudModel | ServiceTaskFilterCloudModel
    ): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    getRunningApplications() {
        this.appsProcessCloudService
            .getDeployedApplicationsByStatus(EditTaskFilterCloudComponent.APP_RUNNING_STATUS, this.role)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((applications: ApplicationInstanceModel[]) => {
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        this.applicationNames.push({ label: application.name, value: application.name });
                    });
                }
            });
    }

    getProcessDefinitions() {
        this.taskCloudService.getProcessDefinitions(this.appName)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((processDefinitions: ProcessDefinitionCloud[]) => {
            if (processDefinitions && processDefinitions.length > 0) {
                this.processDefinitionNames.push(this.allProcessDefinitionNamesOption);
                processDefinitions.map((processDefinition) => {
                    this.processDefinitionNames.push({ label: processDefinition.name, value: processDefinition.name });
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
                const resultFilter: TaskFilterCloudModel | ServiceTaskFilterCloudModel = Object.assign({}, this.changedTaskFilter, newFilter);
                this.taskFilterCloudService.addFilter(resultFilter)
                    .pipe(takeUntil(this.onDestroy$)).subscribe(() => {
                        saveAsAction.filter = resultFilter;
                        this.action.emit(saveAsAction);
                    });
            }
        });
    }

    /**
     * Return filter name
     * @param filterName
     */
    getSanitizeFilterName(filterName: string): string {
        const nameWithHyphen = this.replaceSpaceWithHyphen(filterName.trim());
        return nameWithHyphen.toLowerCase();
    }

    /**
     * Return name with hyphen
     * @param name
     */
    replaceSpaceWithHyphen(name: string): string {
        const regExt = new RegExp(' ', 'g');
        return name.replace(regExt, '-');
    }

    restoreDefaultTaskFilters(): Observable<TaskFilterCloudModel[] | ServiceTaskFilterCloudModel[]> {
        return this.taskFilterCloudService.getTaskListFilters(this.appName);
    }

    showActions(): boolean {
        return this.showFilterActions;
    }

    onExpand(): void {
        this.toggleFilterActions = true;
    }

    onClose(): void {
        this.toggleFilterActions = false;
    }

    isDateType(property: TaskFilterProperties): boolean {
        return property.type === 'date';
    }

    isDateRangeType(property: TaskFilterProperties): boolean {
        return property.type === 'date-range';
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

    isDisabledAction(action: TaskFilterAction): boolean {
        return this.isDisabledForDefaultFilters(action) ? true : this.hasFormChanged(action);
    }

    isDisabledForDefaultFilters(action: TaskFilterAction): boolean {
        return (
            this.taskFilterCloudService.isDefaultFilter(this.taskFilter.name) &&
            this.actionDisabledForDefault.includes(action.actionType)
        );
    }

    hasFormChanged(action: TaskFilterAction): boolean {
        if (action.actionType === EditTaskFilterCloudComponent.ACTION_SAVE) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditTaskFilterCloudComponent.ACTION_SAVE_AS) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditTaskFilterCloudComponent.ACTION_DELETE) {
            return false;
        }

        return false;
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

    createServiceTaskFilterProperties(currentTaskFilter: ServiceTaskFilterCloudModel): TaskFilterProperties[] {
        return [
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: currentTaskFilter.appName || '',
                options: this.applicationNames
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SERVICE_TASK_ID',
                type: 'text',
                key: 'serviceTaskId',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ELEMENT_ID',
                type: 'text',
                key: 'elementId',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ACTIVITY_NAME',
                type: 'text',
                key: 'activityName',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.ACTIVITY_TYPE',
                type: 'text',
                key: 'activityType',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: currentTaskFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: currentTaskFilter.order || this.directions[0].value,
                options: this.directions
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: currentTaskFilter.status || this.serviceTaskStatus[0].value,
                options: this.serviceTaskStatus
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.STARTED_DATE',
                type: 'date',
                key: 'startedDate',
                value: currentTaskFilter.completedDate || false
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.COMPLETED_DATE',
                type: 'date',
                key: 'completedDate',
                value: currentTaskFilter.completedDate || false
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.PROCESS_INSTANCE_ID',
                type: 'text',
                key: 'processInstanceId',
                value: currentTaskFilter.processInstanceId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: currentTaskFilter.processDefinitionId || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_SERVICE_TASK_FILTER.LABEL.SERVICE_NAME',
                type: 'text',
                key: 'serviceName',
                value: currentTaskFilter.serviceName || ''
            })
        ];
    }

    createUserTaskFilterProperties(currentTaskFilter: TaskFilterCloudModel): TaskFilterProperties[] {
        return [
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: currentTaskFilter.appName || '',
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
                value: currentTaskFilter.status || this.userTaskStatus[0].value,
                options: this.userTaskStatus
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.ASSIGNMENT',
                type: 'text',
                key: 'assignee',
                value: currentTaskFilter.assignee || ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.PROCESS_DEF_NAME',
                type: 'select',
                key: 'processDefinitionName',
                value: currentTaskFilter.processDefinitionName || '',
                options: this.processDefinitionNames
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
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.CREATED_DATE',
                type: 'date',
                key: 'createdDate',
                value: ''
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: currentTaskFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: currentTaskFilter.order || this.directions[0].value,
                options: this.directions
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.STAND_ALONE',
                type: 'checkbox',
                key: 'standalone',
                value: currentTaskFilter.standalone || false
            }),
            new TaskFilterProperties({
                label: 'ADF_CLOUD_EDIT_TASK_FILTER.LABEL.DUE_DATE',
                type: 'date-range',
                key: 'dueDate',
                rangeKeys: { from: 'dueDateFrom', to: 'dueDateTo'},
                value: currentTaskFilter.dueDate || false,
                dateFilterOptions: [
                    DateCloudFilterType.NO_DATE,
                    DateCloudFilterType.TOMORROW,
                    DateCloudFilterType.NEXT_7_DAYS,
                    DateCloudFilterType.RANGE
                ]
            })
        ];
    }

    createTaskFilterProperties(currentTaskFilter: TaskFilterCloudModel | ServiceTaskFilterCloudModel): TaskFilterProperties[] {
        if (this.taskType === TaskType.ServiceTask) {
            return this.createServiceTaskFilterProperties(<ServiceTaskFilterCloudModel> currentTaskFilter);
        } else {
            return this.createUserTaskFilterProperties(<TaskFilterCloudModel> currentTaskFilter);
        }
    }
}
