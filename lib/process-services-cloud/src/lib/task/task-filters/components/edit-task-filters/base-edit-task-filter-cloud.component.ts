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

import { OnChanges, SimpleChanges, OnInit, OnDestroy, Directive, Input, Output, EventEmitter } from '@angular/core';
import { FilterOptions, TaskFilterAction, TaskFilterProperties } from '../../models/filter-cloud.model';
import { TaskCloudService } from './../../../services/task-cloud.service';
import { AppsProcessCloudService } from './../../../../app/services/apps-process-cloud.service';
import { ApplicationInstanceModel } from './../../../../app/models/application-instance.model';
import { ProcessDefinitionCloud } from './../../../../models/process-definition-cloud.model';
import { DateCloudFilterType, DateRangeFilter } from '../../../../models/date-cloud-filter.model';
import moment, { Moment } from 'moment';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { IdentityGroupModel, IdentityUserModel, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class BaseEditTaskFilterCloudComponent implements OnInit, OnChanges, OnDestroy {

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
    public static DIRECTIONS = [
        { label: 'ASC', value: 'ASC' },
        { label: 'DESC', value: 'DESC' }
    ];
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
    action: EventEmitter<TaskFilterAction> = new EventEmitter();

    protected applicationNames: any[] = [];
    protected processDefinitionNames: any[] = [];
    protected formHasBeenChanged = false;
    editTaskFilterForm: FormGroup;
    taskFilterProperties: TaskFilterProperties[] = [];
    taskFilterActions: TaskFilterAction[] = [];
    toggleFilterActions: boolean = false;
    allProcessDefinitionNamesOption = { label: 'All', value: '' };

    protected onDestroy$ = new Subject<boolean>();
    isLoading: boolean = false;

    constructor(
        protected formBuilder: FormBuilder,
        protected dateAdapter: DateAdapter<Moment>,
        protected userPreferencesService: UserPreferencesService,
        protected appsProcessCloudService: AppsProcessCloudService,
        protected taskCloudService: TaskCloudService) {
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

    createFilterActions(): TaskFilterAction[] {
        return [
            new TaskFilterAction({
                actionType: BaseEditTaskFilterCloudComponent.ACTION_SAVE,
                icon: 'save',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.SAVE'
            }),
            new TaskFilterAction({
                actionType: BaseEditTaskFilterCloudComponent.ACTION_SAVE_AS,
                icon: 'adf:save-as',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.SAVE_AS'
            }),
            new TaskFilterAction({
                actionType: BaseEditTaskFilterCloudComponent.ACTION_DELETE,
                icon: 'delete',
                tooltip: 'ADF_CLOUD_EDIT_TASK_FILTER.TOOL_TIP.DELETE'
            })
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

    isDateType(property: TaskFilterProperties): boolean {
        return property.type === 'date';
    }

    isDateRangeType(property: TaskFilterProperties): boolean {
        return property.type === 'date-range';
    }

    isUserSelectType(property: TaskFilterProperties): boolean {
        return property.type === 'people';
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

    isAssignmentType(property: TaskFilterProperties): boolean {
        return property.type === 'assignment';
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

            if (momentDate.isValid()) {
                this.getPropertyController(dateProperty).setValue(momentDate.toISOString(true));
                this.getPropertyController(dateProperty).setErrors(null);
            } else {
                this.getPropertyController(dateProperty).setErrors({ invalid: true });
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

    onAssignedChange(assignedValue: IdentityUserModel) {
        this.editTaskFilterForm.get('candidateGroups').setValue([]);
        this.editTaskFilterForm.get('assignee').setValue(assignedValue?.username);
    }

    onAssignedGroupsChange(groups: IdentityGroupModel[]) {
        this.editTaskFilterForm.get('assignee').setValue(null);
        this.editTaskFilterForm.get('candidateGroups').setValue(groups);
    }

    hasError(property: TaskFilterProperties): boolean {
        return this.getPropertyController(property).errors && this.getPropertyController(property).errors.invalid;
    }

    hasLastModifiedProperty(): boolean {
        return this.filterProperties.indexOf(BaseEditTaskFilterCloudComponent.LAST_MODIFIED) >= 0;
    }

    get createSortProperties(): FilterOptions[] {
        this.checkMandatorySortProperties();
        const sortProperties = this.sortProperties.map((property: string) => {
            return <FilterOptions> { label: property.charAt(0).toUpperCase() + property.slice(1), value: property };
        });
        return sortProperties;
    }

    createAndFilterActions(): TaskFilterAction[] {
        this.checkMandatoryActions();
        return this.createFilterActions().filter(action => this.isValidAction(this.actions, action));
    }

    isValidProperty(filterProperties: string[], filterProperty: any): boolean {
        return filterProperties ? filterProperties.indexOf(filterProperty.key) >= 0 : true;
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
        let filteredProperties = defaultProperties.filter((filterProperty: TaskFilterProperties) => this.isValidProperty(this.filterProperties, filterProperty));

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
                debounceTime(200),
                filter(() => this.isFormValid()),
                takeUntil(this.onDestroy$)
            )
            .subscribe((formValues) => {
                this.assignNewFilter(formValues);
            });
    }

    getFormControlsConfig(taskFilterProperties: TaskFilterProperties[]): any {
        const properties = taskFilterProperties.map((property: TaskFilterProperties) => {
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

    abstract save(action: TaskFilterAction): void;
    abstract saveAs(action: TaskFilterAction): void;
    abstract delete(action: TaskFilterAction): void;
    abstract checkMandatorySortProperties(): void;
    abstract checkMandatoryFilterProperties(): void;
    abstract isDisabledForDefaultFilters(action: TaskFilterAction): boolean;
    abstract createTaskFilterProperties(): TaskFilterProperties[];
    abstract retrieveTaskFilterAndBuildForm(): void;
    abstract assignNewFilter(formValues): void;

}
