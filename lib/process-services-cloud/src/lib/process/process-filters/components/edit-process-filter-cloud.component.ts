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

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, filter, takeUntil, finalize, switchMap, tap } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import moment, { Moment } from 'moment';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { ProcessFilterCloudModel, ProcessFilterProperties, ProcessFilterAction, ProcessFilterOptions, ProcessSortFilterProperty } from '../models/process-filter-cloud.model';
import { TranslationService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { ProcessCloudService } from '../../services/process-cloud.service';
import { DateCloudFilterType, DateRangeFilter } from '../../../models/date-cloud-filter.model';
import { IdentityUserModel } from '../../../people/models/identity-user.model';
import { Environment } from '../../../common/interface/environment.interface';

export const PROCESS_FILTER_ACTION_SAVE = 'save';
export const PROCESS_FILTER_ACTION_SAVE_AS = 'saveAs';
export const PROCESS_FILTER_ACTION_DELETE = 'delete';
export const PROCESS_FILTER_ACTION_SAVE_DEFAULT = 'saveDefaultFilter';
export const PROCESS_FILTER_ACTION_RESTORE = 'restoreDefaultFilter';
const DEFAULT_PROCESS_FILTER_PROPERTIES = ['status', 'sort', 'order', 'lastModified'];
const DEFAULT_SORT_PROPERTIES = ['id', 'name', 'status', 'startDate'];
const DEFAULT_ACTIONS = ['save', 'saveAs', 'delete'];

export interface DropdownOption {
    value: string;
    label: string;
}

@Component({
    selector: 'adf-cloud-edit-process-filter',
    templateUrl: './edit-process-filter-cloud.component.html',
    styleUrls: ['./edit-process-filter-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditProcessFilterCloudComponent implements OnInit, OnChanges, OnDestroy {
    /** The name of the application. */
    @Input()
    appName: string = '';

    /** roles to filter the apps */
    @Input()
    role: string = '';

    /** Id of the process instance filter. */
    @Input()
    id: string;

    /** List of process filter properties to display */
    @Input()
    filterProperties = DEFAULT_PROCESS_FILTER_PROPERTIES;

    /** List of sort properties to display. */
    @Input()
    sortProperties = DEFAULT_SORT_PROPERTIES;

    /** List of sort actions. */
    @Input()
    actions = DEFAULT_ACTIONS;

    /** Environment ID of the application. */
    @Input()
    environmentId: string;

    /** List of environments. */
    @Input()
    environmentList: Environment[] = [];

    /** Toggles editing of process filter actions. */
    @Input()
    showFilterActions = true;

    /** Toggles editing of the process filter title. */
    @Input()
    showTitle = true;

    /** Toggles the appearance of the process filter name . */
    @Input()
    showProcessFilterName = true;

    /** Emitted when a process instance filter property changes. */
    @Output()
    filterChange = new EventEmitter<ProcessFilterCloudModel>();

    /** Emitted when a filter action occurs i.e Save, SaveAs, Delete. */
    @Output()
    action = new EventEmitter<ProcessFilterAction>();

    private _filter: ProcessFilterCloudModel;
    protected filterHasBeenChanged = false;

    get processFilter() {
        return this._filter;
    }

    /** Process filter */
    @Input()
    set processFilter(value: ProcessFilterCloudModel) {
        const isChanged = this.isFilterChanged(this._filter, value);

        this._filter = value;

        if (value?.appName) {
            this.appName = value.appName;
        }

        if (value?.id) {
            this.id = value.id;
        }

        if (value?.environmentId) {
            this.environmentId = value.environmentId;
        }

        this.processFilterProperties = this.createAndFilterProperties();
        this.processFilterActions = this.createAndFilterActions();

        this.buildForm(this.processFilterProperties);

        if (isChanged) {
            this.filterChange.emit(value);
        }
    }

    status: Array<DropdownOption> = [
        { value: '', label: 'ADF_CLOUD_PROCESS_FILTERS.STATUS.ALL' },
        { value: 'RUNNING', label: 'ADF_CLOUD_PROCESS_FILTERS.STATUS.RUNNING' },
        { value: 'SUSPENDED', label: 'ADF_CLOUD_PROCESS_FILTERS.STATUS.SUSPENDED' },
        { value: 'CANCELLED', label: 'ADF_CLOUD_PROCESS_FILTERS.STATUS.CANCELLED' },
        { value: 'COMPLETED', label: 'ADF_CLOUD_PROCESS_FILTERS.STATUS.COMPLETED' }
    ];
    directions: Array<DropdownOption> = [
        { value: 'ASC', label: 'ADF_CLOUD_PROCESS_FILTERS.DIRECTION.ASCENDING' },
        { value: 'DESC', label: 'ADF_CLOUD_PROCESS_FILTERS.DIRECTION.DESCENDING' }
    ];
    actionDisabledForDefault = [
        PROCESS_FILTER_ACTION_SAVE,
        PROCESS_FILTER_ACTION_DELETE
    ];
    applicationNames: any[] = [];
    allProcessDefinitionNamesOption: DropdownOption = {
        label: 'ADF_CLOUD_PROCESS_FILTERS.STATUS.ALL',
        value: ''
    };
    processDefinitionNames: any[] = [];
    editProcessFilterForm: UntypedFormGroup;
    processFilterProperties: ProcessFilterProperties[] = [];
    processFilterActions: ProcessFilterAction[] = [];
    toggleFilterActions: boolean = false;
    appVersionOptions: ProcessFilterOptions[] = [];
    initiatorOptions: IdentityUserModel[] = [];

    private onDestroy$ = new Subject<boolean>();
    isLoading: boolean = false;
    private filterChangeSub: Subscription;

    constructor(
        private formBuilder: UntypedFormBuilder,
        public dialog: MatDialog,
        private dateAdapter: DateAdapter<Moment>,
        private userPreferencesService: UserPreferencesService,
        private translateService: TranslationService,
        private processFilterCloudService: ProcessFilterCloudService,
        private appsProcessCloudService: AppsProcessCloudService,
        private processCloudService: ProcessCloudService) {
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
            this.retrieveProcessFilterAndBuildForm();
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    buildForm(processFilterProperties: ProcessFilterProperties[]) {
        this.editProcessFilterForm = this.formBuilder.group(this.getFormControlsConfig(processFilterProperties));
        this.onFilterChange();
    }

    getFormControlsConfig(processFilterProperties: ProcessFilterProperties[]): any {
        const properties = processFilterProperties.map((property) => {
            if (!!property.attributes) {
                return this.getAttributesControlConfig(property);
            } else {
                return { [property.key]: property.value };
            }
        });
        return properties.reduce(((result, current) => Object.assign(result, current)), {});
    }

    private getAttributesControlConfig(property: ProcessFilterProperties) {
        return Object.values(property.attributes).reduce((result, key) => {
            result[key] = property.value[key];
            return result;
        }, {});
    }

    /**
     * Fetches process instance filter by application name and filter id and creates filter properties, build form
     */
    retrieveProcessFilterAndBuildForm() {
        this.isLoading = true;
        this.processFilterCloudService
            .getFilterById(this.appName, this.id)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(response => {
                this.filterHasBeenChanged = false;
                this.processFilter = new ProcessFilterCloudModel(
                    Object.assign({}, response || {}, this.processFilter || {})
                );
            });
    }

    /**
     * Check process instance filter changes
     */
    onFilterChange() {
        if (this.filterChangeSub) {
            this.filterChangeSub.unsubscribe();
            this.filterChangeSub = null;
        }

        this.filterChangeSub = this.editProcessFilterForm.valueChanges
            .pipe(
                debounceTime(500),
                filter(() => this.isFormValid()),
                takeUntil(this.onDestroy$)
            )
            .subscribe((formValues: ProcessFilterCloudModel) => {
                this.setLastModifiedToFilter(formValues);

                const newValue = new ProcessFilterCloudModel(Object.assign({}, this.processFilter, formValues));
                const changed = !this.compareFilters(newValue, this.processFilter);
                this.filterHasBeenChanged = changed;

                if (changed) {
                    this._filter = newValue;
                    this.filterChange.emit(newValue);
                }
            });
    }

    createAndFilterProperties(): ProcessFilterProperties[] {
        this.checkMandatoryFilterProperties();

        if (this.filterProperties.includes('appName')) {
            this.getRunningApplications();
        }

        if (this.filterProperties.includes('processDefinitionName')) {
            this.getProcessDefinitions();
        }

        if (this.filterProperties.includes('appVersionMultiple')) {
            this.getAppVersionOptions();
        }

        if (this.filterProperties.includes('initiator')) {
            this.initiatorOptions = !!this.processFilter.initiator
                ? this.processFilter.initiator.split(',').map(username => Object.assign({}, { username }))
                : [];
        }

        const defaultProperties = this.createProcessFilterProperties(this.processFilter);
        let filteredProperties = defaultProperties.filter((filterProperty) => this.isValidProperty(this.filterProperties, filterProperty.key));

        if (!this.filterProperties.includes('sort')) {
            filteredProperties = filteredProperties.filter(property => property.key !== 'order');
        }

        if (this.filterProperties.includes('lastModified')) {
            filteredProperties = [
                ...filteredProperties,
                ...this.createLastModifiedProperty(this.processFilter)
            ];
        }

        return filteredProperties;
    }

    checkMandatoryFilterProperties() {
        if (this.filterProperties === undefined || this.filterProperties.length === 0) {
            this.filterProperties = DEFAULT_PROCESS_FILTER_PROPERTIES;
        }
    }

    private isValidProperty(filterProperties: string[], key: string): boolean {
        return filterProperties ? filterProperties.indexOf(key) >= 0 : true;
    }

    get createSortProperties(): ProcessFilterOptions[] {
        this.checkMandatorySortProperties();
        const defaultSortProperties = this.createProcessSortProperties();
        return defaultSortProperties.filter((sortProperty) => this.isValidProperty(this.sortProperties, sortProperty.key));
    }

    getAppVersionOptions() {
        this.appVersionOptions = [];

        this.processCloudService.getApplicationVersions(this.appName).subscribe((appVersions) => {
            appVersions.forEach(appVersion => {
                this.appVersionOptions.push({ label: appVersion.entry.version, value: appVersion.entry.version });
            });
        });
    }

    checkMandatorySortProperties() {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            this.sortProperties = DEFAULT_SORT_PROPERTIES;
        }
    }

    createAndFilterActions() {
        this.checkMandatoryActions();
        const actions = this.createFilterActions();
        return actions.filter((action) => this.isValidAction(this.actions, action));
    }

    checkMandatoryActions() {
        if (this.actions === undefined || this.actions.length === 0) {
            this.actions = DEFAULT_ACTIONS;
        }
    }

    private isValidAction(actions: string[], action: ProcessFilterAction): boolean {
        return actions ? actions.indexOf(action.actionType) >= 0 : true;
    }

    isFormValid(): boolean {
        return this.editProcessFilterForm.valid;
    }

    getPropertyController(property: ProcessFilterProperties): AbstractControl {
        return this.editProcessFilterForm.get(property.key);
    }

    onDateChanged(newDateValue: Moment, dateProperty: ProcessFilterProperties) {
        if (newDateValue) {
            const controller = this.getPropertyController(dateProperty);

            if (newDateValue.isValid()) {
                controller.setValue(newDateValue);
                controller.setErrors(null);
            } else {
                controller.setErrors({ invalid: true });
            }
        }
    }

    onDateTypeChange(dateType: DateCloudFilterType, property: ProcessFilterProperties) {
        this.editProcessFilterForm.get(property.attributes.dateType).setValue(dateType);
    }

    onDateRangeFilterChanged(dateRange: DateRangeFilter, property: ProcessFilterProperties) {
        this.editProcessFilterForm.get(property.attributes?.from).setValue(
            dateRange.startDate ? dateRange.startDate : null
        );
        this.editProcessFilterForm.get(property.attributes?.to).setValue(
            dateRange.endDate ? dateRange.endDate : null
        );
        this.editProcessFilterForm.get(property.attributes.dateType).setValue(DateCloudFilterType.RANGE);
    }

    onChangedUser(users: IdentityUserModel[], processProperty: ProcessFilterProperties) {
        this.getPropertyController(processProperty).setValue(users.map(user => user.username).join(','));
    }

    hasError(property: ProcessFilterProperties): boolean {
        const controller = this.getPropertyController(property);
        return controller.errors && controller.errors.invalid;
    }

    compareFilters(editedQuery: ProcessFilterCloudModel, currentQuery: ProcessFilterCloudModel): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    getRunningApplications() {
        this.applicationNames = [];

        this.appsProcessCloudService
            .getDeployedApplicationsByStatus('RUNNING', this.role)
            .subscribe((applications) => {
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        this.applicationNames.push({ label: this.appsProcessCloudService.getApplicationLabel(application, this.environmentList), value: application.name });
                    });
                }
            });
    }

    getProcessDefinitions() {
        this.processDefinitionNames = [];

        this.processCloudService.getProcessDefinitions(this.appName).subscribe((processDefinitions) => {
            if (processDefinitions && processDefinitions.length > 0) {
                this.processDefinitionNames.push(this.allProcessDefinitionNamesOption);
                processDefinitions.map((processDefinition) => {
                    this.processDefinitionNames.push({ label: processDefinition.name, value: processDefinition.name });
                });
            }
        });
    }

    executeFilterActions(event: Event, action: ProcessFilterAction): void {
        if (action.actionType === PROCESS_FILTER_ACTION_SAVE) {
            this.save(action);
        } else if (action.actionType === PROCESS_FILTER_ACTION_SAVE_AS) {
            this.saveAs(action);
        } else if (action.actionType === PROCESS_FILTER_ACTION_DELETE) {
            this.delete(action);
        } else if (action.actionType === PROCESS_FILTER_ACTION_SAVE_DEFAULT) {
            this.save(action);
        } else if (action.actionType === PROCESS_FILTER_ACTION_RESTORE) {
            this.reset(action);
        }
        event.stopPropagation();
    }

    save(saveAction: ProcessFilterAction) {
        this.processFilterCloudService
            .updateFilter(this.processFilter)
            .subscribe(() => {
                saveAction.filter = this.processFilter;
                this.filterHasBeenChanged = false;
                this.action.emit(saveAction);
            });
    }

    /**
     * Delete a process instance filter
     */
    delete(deleteAction: ProcessFilterAction) {
        this.processFilterCloudService
            .deleteFilter(this.processFilter)
            .pipe(
                filter((filters) => {
                    deleteAction.filter = this.processFilter;
                    this.action.emit(deleteAction);
                    return filters.length === 0;
                }),
                switchMap(() => this.restoreDefaultProcessFilters()))
            .subscribe(() => { });
    }

    /**
     * Save As a process instance filter
     */
    saveAs(saveAsAction: ProcessFilterAction) {
        const dialogRef = this.dialog.open(ProcessFilterDialogCloudComponent, {
            data: {
                name: this.translateService.instant(this.processFilter.name)
            },
            height: 'auto',
            minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.action === ProcessFilterDialogCloudComponent.ACTION_SAVE) {
                const filterId = Math.random().toString(36).substr(2, 9);
                const filterKey = this.getSanitizeFilterName(result.name);
                const newFilter = {
                    name: result.name,
                    icon: result.icon,
                    id: filterId,
                    key: 'custom-' + filterKey
                };
                const resultFilter: ProcessFilterCloudModel = Object.assign({}, this.processFilter, newFilter);
                this.processFilterCloudService
                    .addFilter(resultFilter)
                    .subscribe(() => {
                        saveAsAction.filter = resultFilter;
                        this.filterHasBeenChanged = false;
                        this.action.emit(saveAsAction);
                    });
            }
        });
    }

    reset(resetAction: ProcessFilterAction) {
        this.processFilterCloudService.resetProcessFilterToDefaults(this.appName, this.processFilter).pipe(
            tap((filters: ProcessFilterCloudModel[]) => {
                resetAction.filter = filters.find(defaultFilter => defaultFilter.name === this.processFilter.name) || this.processFilter;
                this.action.emit(resetAction);
            }),
            switchMap(() => this.restoreDefaultProcessFilters()))
            .subscribe(() => { });
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

    /**
     * Return name with hyphen
     *
     * @param name
     */
    replaceSpaceWithHyphen(name: string): string {
        const regExt = new RegExp(' ', 'g');
        return name.replace(regExt, '-');
    }

    restoreDefaultProcessFilters(): Observable<ProcessFilterCloudModel[]> {
        return this.processFilterCloudService.getProcessFilters(this.appName);
    }

    onExpand() {
        this.toggleFilterActions = true;
    }

    onClose() {
        this.toggleFilterActions = false;
    }

    isDisabledAction(action: ProcessFilterAction): boolean {
        return (
            this.processFilterCloudService.isDefaultFilter(this.processFilter.name) &&
            this.actionDisabledForDefault.includes(action.actionType)
        ) ? true : this.hasFilterChanged(action);
    }

    hasFilterChanged(action: ProcessFilterAction): boolean {
        return action.actionType === PROCESS_FILTER_ACTION_SAVE ||
            action.actionType === PROCESS_FILTER_ACTION_SAVE_AS ?
            !this.filterHasBeenChanged : false;
    }

    private setLastModifiedToFilter(formValues: ProcessFilterCloudModel) {
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

    private createFilterActions(): ProcessFilterAction[] {
        return [
            {
                actionType: PROCESS_FILTER_ACTION_SAVE,
                icon: 'adf:save',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE'
            },
            {
                actionType: PROCESS_FILTER_ACTION_SAVE_AS,
                icon: 'adf:save-as',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE_AS'
            },
            {
                actionType: PROCESS_FILTER_ACTION_DELETE,
                icon: 'delete',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.DELETE'
            },
            {
                actionType: PROCESS_FILTER_ACTION_SAVE_DEFAULT,
                icon: 'adf:save',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE'
            },
            {
                actionType: PROCESS_FILTER_ACTION_RESTORE,
                icon: 'settings_backup_restore',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.RESTORE'
            }
        ];
    }

    private createLastModifiedProperty(filterModel: ProcessFilterCloudModel): ProcessFilterProperties[] {
        let lastModifiedFrom;
        let lastModifiedTo;

        if (filterModel.lastModifiedFrom) {
            lastModifiedFrom = moment(filterModel.lastModifiedFrom);
        }

        if (filterModel.lastModifiedTo) {
            lastModifiedTo = moment(filterModel.lastModifiedTo);
        }

        return [
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED_DATE_FORM',
                type: 'date',
                key: 'lastModifiedFrom',
                value: lastModifiedFrom
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED_TO',
                type: 'date',
                key: 'lastModifiedTo',
                value: lastModifiedTo
            }
        ];
    }

    private createProcessSortProperties(): ProcessSortFilterProperty[] {
        return [
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.ID',
                key: 'id',
                value: 'id'
            },
            {
                label: 'EnvironmentId',
                key: 'environmentId',
                value: 'environmentId'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_NAME',
                key: 'name',
                value: 'name'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.START_DATE',
                key: 'startDate',
                value: 'startDate'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STATUS',
                key: 'status',
                value: 'status'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STARTED_BY',
                key: 'initiator',
                value: 'initiator'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_NAME',
                key: 'appName',
                value: 'appName'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_VERSION',
                key: 'appVersion',
                value: 'appVersion'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_INS_ID',
                key: 'processInstanceId',
                value: 'processInstanceId'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_ID',
                key: 'processDefinitionId',
                value: 'processDefinitionId'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_NAME',
                key: 'processDefinitionName',
                value: 'processDefinitionName'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_KEY',
                key: 'processDefinitionKey',
                value: 'processDefinitionKey'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED',
                key: 'lastModified',
                value: 'lastModified'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.BUSINESS_KEY',
                key: 'businessKey',
                value: 'businessKey'
            }
        ];
    }

    private isFilterChanged(oldValue: ProcessFilterCloudModel, newValue: ProcessFilterCloudModel): boolean {
        const oldJson = JSON.stringify(
            this.processFilterCloudService.writeQueryParams(oldValue || {}, this.filterProperties)
        );
        const newJson = JSON.stringify(
            this.processFilterCloudService.writeQueryParams(newValue || {}, this.filterProperties)
        );

        return oldJson !== newJson;
    }

    private createProcessFilterProperties(filterModel: ProcessFilterCloudModel): ProcessFilterProperties[] {
        const appVersionMultiple = [];

        if (filterModel.appVersion) {
            appVersionMultiple.push(
                Array.isArray(filterModel.appVersion)
                    ? filterModel.appVersion.map(entry => entry.toString())
                    : `${filterModel.appVersion}`
            );
        }

        return [
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: filterModel.appName || '',
                options: this.applicationNames
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_VERSION',
                type: 'number',
                key: 'appVersion',
                value: filterModel.appVersion
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_VERSION',
                type: 'multi-select',
                key: 'appVersionMultiple',
                value: appVersionMultiple,
                options: this.appVersionOptions
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_INS_ID',
                type: 'text',
                key: 'processInstanceId',
                value: filterModel.processInstanceId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_NAME',
                type: 'text',
                key: 'processName',
                value: filterModel.processName || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_NAME',
                type: 'select',
                key: 'processDefinitionName',
                value: filterModel.processDefinitionName || '',
                options: this.processDefinitionNames
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: filterModel.status || this.status[0].value,
                options: this.status
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: filterModel.processDefinitionId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_KEY',
                type: 'text',
                key: 'processDefinitionKey',
                value: filterModel.processDefinitionKey || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: filterModel.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: filterModel.order || this.directions[0].value,
                options: this.directions
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.COMPLETED_DATE',
                type: 'date',
                key: 'completedDate',
                value: filterModel.completedDate || false
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STARTED_BY',
                type: 'people',
                key: 'initiator',
                value: filterModel.initiator,
                selectionMode: 'multiple'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.COMPLETED_DATE',
                type: 'date-range',
                key: 'completedDateRange',
                attributes: { dateType: 'completedDateType', from: '_completedFrom', to: '_completedTo' },
                value: {
                    completedDateType: filterModel.completedDateType || null,
                    _completedFrom: filterModel.completedFrom || null,
                    _completedTo: filterModel.completedTo || null
                }
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STARTED_DATE',
                type: 'date-range',
                key: 'startedDateRange',
                attributes: { dateType: 'startedDateType', from: '_startFrom', to: '_startTo' },
                value: {
                    startedDateType: filterModel.startedDateType || null,
                    _startFrom: filterModel.startFrom || null,
                    _startTo: filterModel.startTo || null
                }
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.SUSPENDED_DATE',
                type: 'date-range',
                key: 'suspendedDateRange',
                attributes: { dateType: 'suspendedDateType', from: '_suspendedFrom', to: '_suspendedTo' },
                value: {
                    suspendedDateType: filterModel.suspendedDateType || null,
                    _suspendedFrom: filterModel.suspendedFrom || null,
                    _suspendedTo: filterModel.suspendedTo || null
                }
            }
        ];
    }
}
