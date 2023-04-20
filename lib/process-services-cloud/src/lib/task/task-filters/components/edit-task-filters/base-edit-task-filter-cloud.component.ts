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

import { OnChanges, SimpleChanges, OnInit, OnDestroy, Directive, Input, Output, EventEmitter } from '@angular/core';
import { AssignmentType, FilterOptions, TaskFilterAction, TaskFilterProperties, TaskStatusFilter } from '../../models/filter-cloud.model';
import { TaskCloudService } from './../../../services/task-cloud.service';
import { AppsProcessCloudService } from './../../../../app/services/apps-process-cloud.service';
import { DateCloudFilterType, DateRangeFilter } from '../../../../models/date-cloud-filter.model';
import moment, { Moment } from 'moment';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { debounceTime, filter, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { TranslationService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { TaskFilterDialogCloudComponent } from '../task-filter-dialog/task-filter-dialog-cloud.component';
import { MatDialog } from '@angular/material/dialog';
import { IdentityUserModel } from '../../../../people/models/identity-user.model';
import { IdentityGroupModel } from '../../../../group/models/identity-group.model';
import { MatSelectChange } from '@angular/material/select';
import { Environment } from '../../../../common/interface/environment.interface';

/* eslint-disable @typescript-eslint/naming-convention */

export interface DropdownOption {
    value: string;
    label: string;
}

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseEditTaskFilterCloudComponent<T> implements OnInit, OnChanges, OnDestroy {

    public static ACTION_SAVE = 'save';
    public static ACTION_SAVE_AS = 'saveAs';
    public static ACTION_DELETE = 'delete';
    public static APP_RUNNING_STATUS: string = 'RUNNING';
    public static APPLICATION_NAME: string = 'appName';
    public static PROCESS_DEFINITION_NAME: string = 'processDefinitionName';
    public static LAST_MODIFIED: string = 'lastModified';
    public static SORT: string = 'sort';
    public static ORDER: string = 'order';
    public static DEFAULT_ACTIONS = ['save', 'saveAs', 'delete'];
    public static FORMAT_DATE: string = 'DD/MM/YYYY';
    public static ACTIONS_DISABLED_BY_DEFAULT = [
        BaseEditTaskFilterCloudComponent.ACTION_SAVE,
        BaseEditTaskFilterCloudComponent.ACTION_DELETE
    ];

    /** (required) Name of the app. */
    @Input()
    appName: string = '';

    /** (required) ID of the task filter. */
    @Input()
    id: string;

    /** List of environments. */
    @Input()
    environmentList: Environment[] = [];

    /** processInstanceId of the task filter. */
    @Input()
    processInstanceId: string;

    /** Toggles the title. */
    @Input()
    showTitle = true;

    /** Toggles display of task filter name */
    @Input()
    showTaskFilterName = true;

    /** List of task filter properties to display. */
    @Input()
    filterProperties: string[] = [];

    /** user role. */
    @Input()
    role: string = '';

    /** Toggles the filter actions. */
    @Input()
    showFilterActions = true;

    /** List of task filter actions. */
    @Input()
    actions: string[] = BaseEditTaskFilterCloudComponent.DEFAULT_ACTIONS;

    /** List of sort properties to display. */
    @Input()
    sortProperties: string[] = [];

    /** Emitted when a filter action occurs (i.e Save, Save As, Delete). */
    @Output()
    action = new EventEmitter<TaskFilterAction>();

    protected applicationNames: DropdownOption[] = [];
    protected processDefinitionNames: DropdownOption[] = [];
    protected formHasBeenChanged = false;

    editTaskFilterForm: UntypedFormGroup;
    taskFilterProperties: TaskFilterProperties[] = [];
    taskFilterActions: TaskFilterAction[] = [];
    toggleFilterActions: boolean = false;
    selectedStatus: TaskStatusFilter;
    sortDirections: DropdownOption[] = [
        { value: 'ASC', label: 'ADF_CLOUD_TASK_FILTERS.DIRECTION.ASCENDING' },
        { value: 'DESC', label: 'ADF_CLOUD_TASK_FILTERS.DIRECTION.DESCENDING' }
    ];
    allProcessDefinitionNamesOption: DropdownOption = {
        value: '',
        label: 'ADF_CLOUD_TASK_FILTERS.STATUS.ALL'
    };

    /** Task Filter to use. */
    @Input()
    taskFilter: T;

    changedTaskFilter: T;

    /** Emitted when a task filter property changes. */
    @Output()
    filterChange = new EventEmitter<T>();

    protected onDestroy$ = new Subject<boolean>();
    isLoading: boolean = false;

    constructor(
        protected formBuilder: UntypedFormBuilder,
        protected dateAdapter: DateAdapter<Moment>,
        protected userPreferencesService: UserPreferencesService,
        protected appsProcessCloudService: AppsProcessCloudService,
        protected taskCloudService: TaskCloudService,
        protected dialog: MatDialog,
        protected translateService: TranslationService) {
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));
    }

    ngOnChanges(changes: SimpleChanges) {
        const { id } = changes;
        if (id && id.currentValue !== id.previousValue) {
            this.retrieveTaskFilterAndBuildForm();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    createFilterActions(): TaskFilterAction[] {
        return [
            {
                actionType: BaseEditTaskFilterCloudComponent.ACTION_SAVE,
                icon: 'adf:save',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.SAVE'
            },
            {
                actionType: BaseEditTaskFilterCloudComponent.ACTION_SAVE_AS,
                icon: 'adf:save-as',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.SAVE_AS'
            },
            {
                actionType: BaseEditTaskFilterCloudComponent.ACTION_DELETE,
                icon: 'delete',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.DELETE'
            }
        ];
    }

    hasFormChanged(action: TaskFilterAction): boolean {
        if (action.actionType === BaseEditTaskFilterCloudComponent.ACTION_SAVE) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === BaseEditTaskFilterCloudComponent.ACTION_SAVE_AS) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === BaseEditTaskFilterCloudComponent.ACTION_DELETE) {
            return false;
        }

        return false;
    }

    onExpand(): void {
        this.toggleFilterActions = true;
    }

    onClose(): void {
        this.toggleFilterActions = false;
    }

    isDisabledAction(action: TaskFilterAction): boolean {
        return this.isDisabledForDefaultFilters(action) ? true : this.hasFormChanged(action);
    }

    protected deepCompare(left: any, right: any): boolean {
        return JSON.stringify(left).toLowerCase() === JSON.stringify(right).toLowerCase();
    }

    /**
     * Return filter name
     *
     * @param filterName
     */
    getSanitizeFilterName(filterName: string): string {
        const nameWithHyphen = this.replaceSpaceWithHyphen(filterName.trim());
        return nameWithHyphen.toLowerCase();
    }

    private replaceSpaceWithHyphen(name: string): string {
        const regExt = new RegExp(' ', 'g');
        return name.replace(regExt, '-');
    }

    executeFilterActions(action: TaskFilterAction): void {
        if (action.actionType === BaseEditTaskFilterCloudComponent.ACTION_SAVE) {
            this.save(action);
        } else if (action.actionType === BaseEditTaskFilterCloudComponent.ACTION_SAVE_AS) {
            this.saveAs(action);
        } else if (action.actionType === BaseEditTaskFilterCloudComponent.ACTION_DELETE) {
            this.delete(action);
        }
    }

    getRunningApplications() {
        this.appsProcessCloudService
            .getDeployedApplicationsByStatus(BaseEditTaskFilterCloudComponent.APP_RUNNING_STATUS, this.role)
            .subscribe((applications) => {
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        this.applicationNames.push({ label: this.appsProcessCloudService.getApplicationLabel(application, this.environmentList), value: application.name });
                    });
                }
            });
    }

    getProcessDefinitions() {
        this.taskCloudService.getProcessDefinitions(this.appName)
            .subscribe((processDefinitions) => {
                if (processDefinitions && processDefinitions.length > 0) {
                    this.processDefinitionNames.push(this.allProcessDefinitionNamesOption);
                    processDefinitions.map((processDefinition) => {
                        this.processDefinitionNames.push({ label: processDefinition.name, value: processDefinition.name });
                    });
                }
            });
    }

    checkMandatoryActions(): void {
        if (this.actions === undefined || this.actions.length === 0) {
            this.actions = BaseEditTaskFilterCloudComponent.DEFAULT_ACTIONS;
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
            const momentDate = moment(newDateValue, BaseEditTaskFilterCloudComponent.FORMAT_DATE, true);
            const controller = this.getPropertyController(dateProperty);

            if (momentDate.isValid()) {
                controller.setValue(momentDate.toISOString(true));
                controller.setErrors(null);
            } else {
                controller.setErrors({ invalid: true });
            }
        }
    }

    onDateRangeFilterChanged(dateRange: DateRangeFilter, property: TaskFilterProperties) {
        this.editTaskFilterForm.get(property.attributes?.from).setValue(
            dateRange.startDate ? dateRange.startDate : null
        );
        this.editTaskFilterForm.get(property.attributes?.to).setValue(
            dateRange.endDate ? dateRange.endDate : null
        );
        this.editTaskFilterForm.get(property.attributes.dateType).setValue(DateCloudFilterType.RANGE);
    }

    onChangedUser(users: IdentityUserModel[], userProperty: TaskFilterProperties) {
        let selectedUsers;
        if (userProperty.selectionMode === 'single') {
            selectedUsers = users[0];
        } else {
            selectedUsers = users;
        }
        this.getPropertyController(userProperty).setValue(selectedUsers);
    }

    onAssignedUsersChange(assignedUsers: IdentityUserModel[]) {
        this.editTaskFilterForm.get('candidateGroups').setValue(undefined);
        this.editTaskFilterForm.get('assignedUsers').setValue(assignedUsers);
    }

    onAssignedGroupsChange(groups: IdentityGroupModel[]) {
        this.editTaskFilterForm.get('assignedUsers').setValue(undefined);
        this.editTaskFilterForm.get('candidateGroups').setValue(groups);
    }

    onAssignmentTypeChange(assignmentType: AssignmentType) {
        switch (assignmentType) {
            case AssignmentType.UNASSIGNED:
                this.editTaskFilterForm.get('status').setValue(TaskStatusFilter.CREATED);
                this.resetAssignmentTypeValues();
                break;
            case AssignmentType.NONE:
                this.editTaskFilterForm.get('status').setValue(TaskStatusFilter.ALL);
                this.resetAssignmentTypeValues();
                break;
            case AssignmentType.ASSIGNED_TO:
            case AssignmentType.CANDIDATE_GROUPS:
                this.editTaskFilterForm.get('status').setValue(TaskStatusFilter.ASSIGNED);
                this.resetAssignmentTypeValues();
                break;
            default:
                this.editTaskFilterForm.get('status').setValue(TaskStatusFilter.ASSIGNED);
        }
    }

    onStatusChange(status: MatSelectChange) {
        if (status.value === TaskStatusFilter.CREATED) {
            this.resetAssignmentTypeValues();
        }

        this.selectedStatus = status.value;
    }

    private resetAssignmentTypeValues() {
        this.editTaskFilterForm.get('assignedUsers').setValue(undefined);
        this.editTaskFilterForm.get('candidateGroups').setValue(undefined);
    }

    hasError(property: TaskFilterProperties): boolean {
        const controller = this.getPropertyController(property);
        return controller.errors && controller.errors.invalid;
    }

    hasLastModifiedProperty(): boolean {
        return this.filterProperties.indexOf(BaseEditTaskFilterCloudComponent.LAST_MODIFIED) >= 0;
    }

    get createSortProperties(): FilterOptions[] {
        this.checkMandatorySortProperties();

        return this.sortProperties.map((property: string) => ({ label: property, value: property }));
    }

    createAndFilterActions(): TaskFilterAction[] {
        this.checkMandatoryActions();
        return this.createFilterActions().filter(action => this.isValidAction(this.actions, action));
    }

    isValidProperty(filterProperties: string[], key: string): boolean {
        return filterProperties ? filterProperties.indexOf(key) >= 0 : true;
    }

    checkForProperty(property: string): boolean {
        return this.filterProperties ? this.filterProperties.indexOf(property) >= 0 : false;
    }

    hasSortProperty(): boolean {
        return this.filterProperties.indexOf(BaseEditTaskFilterCloudComponent.SORT) >= 0;
    }

    removeOrderProperty(filteredProperties: TaskFilterProperties[]): TaskFilterProperties[] {
        if (filteredProperties && filteredProperties.length > 0) {
            return filteredProperties.filter(property => property.key !== BaseEditTaskFilterCloudComponent.ORDER);
        }
        return [];
    }

    createAndFilterProperties() {
        this.checkMandatoryFilterProperties();

        if (this.checkForProperty(BaseEditTaskFilterCloudComponent.APPLICATION_NAME)) {
            this.applicationNames = [];
            this.getRunningApplications();
        }
        if (this.checkForProperty(BaseEditTaskFilterCloudComponent.PROCESS_DEFINITION_NAME)) {
            this.processDefinitionNames = [];
            this.getProcessDefinitions();
        }

        const defaultProperties = this.createTaskFilterProperties();
        let filteredProperties = defaultProperties.filter((filterProperty) => this.isValidProperty(this.filterProperties, filterProperty.key));

        if (!this.hasSortProperty()) {
            filteredProperties = this.removeOrderProperty(filteredProperties);
        }

        return filteredProperties;
    }

    /**
     * Check for edit task filter form changes
     */
    onFilterChange() {
        this.editTaskFilterForm.valueChanges
            .pipe(
                debounceTime(500),
                filter(() => this.isFormValid()),
                takeUntil(this.onDestroy$)
            )
            .subscribe((formValues) => {
                this.assignNewFilter(formValues);
            });
    }

    getFormControlsConfig(taskFilterProperties: TaskFilterProperties[]): any {
        const properties = taskFilterProperties.map((property) => {
            if (!!property.attributes) {
                return this.getAttributesControlConfig(property);
            } else {
                return { [property.key]: property.value };
            }
        });
        return properties.reduce(((result, current) => Object.assign(result, current)), {});
    }

    private getAttributesControlConfig(property: TaskFilterProperties) {
        return Object.values(property.attributes).reduce((result, key) => {
            result[key] = property.value[key];
            return result;
        }, {});
    }

    buildForm(taskFilterProperties: TaskFilterProperties[]) {
        this.formHasBeenChanged = false;
        this.editTaskFilterForm = this.formBuilder.group(this.getFormControlsConfig(taskFilterProperties));
        this.onFilterChange();
    }

    onDateTypeChange(dateType: DateCloudFilterType, property: TaskFilterProperties) {
        this.editTaskFilterForm.get(property.attributes.dateType).setValue(dateType);
    }

    protected retrieveTaskFilterAndBuildForm() {
        this.isLoading = true;

        this.getTaskFilterById(this.appName, this.id)
            .pipe(
                finalize(() => this.isLoading = false),
                takeUntil(this.onDestroy$)
            )
            .subscribe(response => {
                this.taskFilter = response;
                this.taskFilterProperties = this.createAndFilterProperties();
                this.taskFilterActions = this.createAndFilterActions();
                this.buildForm(this.taskFilterProperties);
            });
    }

    delete(deleteAction: TaskFilterAction): void {
        this.deleteFilter(this.taskFilter)
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

    save(saveAction: TaskFilterAction): void {
        this.updateFilter(this.changedTaskFilter)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                saveAction.filter = this.changedTaskFilter;
                this.action.emit(saveAction);
                this.formHasBeenChanged = this.deepCompare(this.changedTaskFilter, this.taskFilter);
            });
    }

    saveAs(saveAsAction: TaskFilterAction): void {
        const dialogRef = this.dialog.open(TaskFilterDialogCloudComponent, {
            data: {
                name: this.translateService.instant((this.taskFilter as any)?.name)
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
                const resultFilter: T = Object.assign({}, this.changedTaskFilter, newFilter);
                this.addFilter(resultFilter).subscribe(() => {
                    saveAsAction.filter = resultFilter;
                    this.action.emit(saveAsAction);
                });
            }
        });
    }

    checkMandatoryFilterProperties() {
        if (this.filterProperties === undefined || this.filterProperties.length === 0) {
            this.filterProperties = this.getDefaultFilterProperties();
        }
    }

    checkMandatorySortProperties(): void {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            this.sortProperties = this.getDefaultSortProperties();
        }
    }

    abstract getDefaultFilterProperties(): string[];
    abstract getDefaultSortProperties(): string[];
    abstract isDisabledForDefaultFilters(action: TaskFilterAction): boolean;
    abstract createTaskFilterProperties(): TaskFilterProperties[];
    protected abstract getTaskFilterById(appName: string, id: string);
    abstract assignNewFilter(formValues): void;

    protected abstract restoreDefaultTaskFilters(): Observable<T[]>;
    protected abstract addFilter(filterToAdd: T): Observable<any>;
    protected abstract deleteFilter(filterToDelete: T): Observable<T[]>;
    protected abstract updateFilter(filterToUpdate: T): Observable<any>;
}
