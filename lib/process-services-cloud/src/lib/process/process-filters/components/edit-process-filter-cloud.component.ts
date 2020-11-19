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

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, filter, takeUntil, finalize, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { ProcessFilterCloudModel, ProcessFilterProperties, ProcessFilterAction, ProcessFilterOptions, ProcessSortFilterProperty } from '../models/process-filter-cloud.model';
import { IdentityUserModel, TranslationService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { ProcessCloudService } from '../../services/process-cloud.service';
import { DateCloudFilterType, DateRangeFilter } from '../../../models/date-cloud-filter.model';
import { ApplicationVersionModel } from '../../../models/application-version.model';

@Component({
    selector: 'adf-cloud-edit-process-filter',
    templateUrl: './edit-process-filter-cloud.component.html',
    styleUrls: ['./edit-process-filter-cloud.component.scss']
})
export class EditProcessFilterCloudComponent implements OnInit, OnChanges, OnDestroy {

    public static ACTION_SAVE = 'save';
    public static ACTION_SAVE_AS = 'saveAs';
    public static ACTION_DELETE = 'delete';
    public static DEFAULT_PROCESS_FILTER_PROPERTIES = ['status', 'sort', 'order', 'lastModified'];
    public static DEFAULT_SORT_PROPERTIES = ['id', 'name', 'status', 'startDate'];
    public static DEFAULT_ACTIONS = ['save', 'saveAs', 'delete'];
    public DATE_FORMAT: string = 'DD/MM/YYYY';

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
    filterProperties: string[] = EditProcessFilterCloudComponent.DEFAULT_PROCESS_FILTER_PROPERTIES;

    /** List of sort properties to display. */
    @Input()
    sortProperties: string[] = EditProcessFilterCloudComponent.DEFAULT_SORT_PROPERTIES;

    /** List of sort actions. */
    @Input()
    actions: string[] = EditProcessFilterCloudComponent.DEFAULT_ACTIONS;

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

    processFilter: ProcessFilterCloudModel;
    changedProcessFilter: ProcessFilterCloudModel;

    status = [
        { label: 'ALL', value: '' },
        { label: 'RUNNING', value: 'RUNNING' },
        { label: 'SUSPENDED', value: 'SUSPENDED' },
        { label: 'CANCELLED', value: 'CANCELLED' },
        { label: 'COMPLETED', value: 'COMPLETED' }
    ];

    directions = [{ label: 'ASC', value: 'ASC' }, { label: 'DESC', value: 'DESC' }];
    actionDisabledForDefault = [
        EditProcessFilterCloudComponent.ACTION_SAVE,
        EditProcessFilterCloudComponent.ACTION_DELETE
    ];
    applicationNames: any[] = [];
    allProcessDefinitionNamesOption = { label: 'All', value: '' };
    processDefinitionNames: any[] = [];
    formHasBeenChanged = false;
    editProcessFilterForm: FormGroup;
    processFilterProperties: ProcessFilterProperties[] = [];
    processFilterActions: ProcessFilterAction[] = [];
    toggleFilterActions: boolean = false;
    appVersionOptions: ProcessFilterOptions[];

    private onDestroy$ = new Subject<boolean>();
    isLoading: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
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
        this.removeAppVersionDuplication();

        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.retrieveProcessFilterAndBuildForm();
        }
    }

    removeAppVersionDuplication() {
        if (this.filterProperties.includes('appVersion') && this.filterProperties.includes('appVersionMultiple')) {
            const appVersionIndex = this.filterProperties.indexOf('appVersion');
            this.filterProperties.splice(appVersionIndex, 1);
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    buildForm(processFilterProperties: ProcessFilterProperties[]) {
        this.formHasBeenChanged = false;
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
            .pipe(
                finalize(() => this.isLoading = false),
                takeUntil(this.onDestroy$)
            )
            .subscribe(response => {
                this.processFilter = new ProcessFilterCloudModel(response);
                this.processFilterProperties = this.createAndFilterProperties();
                this.processFilterActions = this.createAndFilterActions();
                this.buildForm(this.processFilterProperties);
            });
    }

    /**
     * Check process instance filter changes
     */
    onFilterChange() {
        this.editProcessFilterForm.valueChanges
            .pipe(
                debounceTime(200),
                filter(() => this.isFormValid()),
                takeUntil(this.onDestroy$)
            )
            .subscribe((formValues: ProcessFilterCloudModel) => {
                this.setLastModifiedToFilter(formValues);
                this.changedProcessFilter = new ProcessFilterCloudModel(Object.assign({}, this.processFilter, formValues));
                this.formHasBeenChanged = !this.compareFilters(this.changedProcessFilter, this.processFilter);
                this.filterChange.emit(this.changedProcessFilter);
            });
    }

    createAndFilterProperties(): ProcessFilterProperties[] {
        this.checkMandatoryFilterProperties();
        if (this.checkForProperty('appName')) {
            this.applicationNames = [];
            this.getRunningApplications();
        }
        if (this.checkForProperty('processDefinitionName')) {
            this.processDefinitionNames = [];
            this.getProcessDefinitions();
        }
        if (this.checkForProperty('appVersionMultiple')) {
            this.appVersionOptions = [];
            this.getAppVersionOptions();
        }
        const defaultProperties = this.createProcessFilterProperties(this.processFilter);
        let filteredProperties = defaultProperties.filter((filterProperty) => this.isValidProperty(this.filterProperties, filterProperty.key));
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
            this.filterProperties = EditProcessFilterCloudComponent.DEFAULT_PROCESS_FILTER_PROPERTIES;
        }
    }

    checkForProperty(property: string): boolean {
        return this.filterProperties ? this.filterProperties.indexOf(property) >= 0 : false;
    }

    private isValidProperty(filterProperties: string[], key: string): boolean {
        return filterProperties ? filterProperties.indexOf(key) >= 0 : true;
    }

    private hasSortProperty(): boolean {
        return this.filterProperties.includes('sort');
    }

    private hasLastModifiedProperty(): boolean {
        return this.filterProperties.includes('lastModified');
    }

    removeOrderProperty(filteredProperties: ProcessFilterProperties[]): ProcessFilterProperties[] {
        if (filteredProperties && filteredProperties.length > 0) {
            return filteredProperties.filter(property =>  property.key !== 'order');
        }
        return [];
    }

    get createSortProperties(): ProcessFilterOptions[] {
        this.checkMandatorySortProperties();
        const defaultSortProperties = this.createProcessSortProperties();
        return defaultSortProperties.filter((sortProperty) => this.isValidProperty(this.sortProperties, sortProperty.key));
    }

    async getAppVersionOptions() {
        await this.processCloudService.getApplicationVersions(this.appName)
            .toPromise().then((appVersions: ApplicationVersionModel[]) => {
                appVersions.forEach(appVersion => {
                    this.appVersionOptions.push({ label: appVersion.entry.version, value: appVersion.entry.version });
                });
            });
    }

    checkMandatorySortProperties() {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            this.sortProperties = EditProcessFilterCloudComponent.DEFAULT_SORT_PROPERTIES;
        }
    }

    createAndFilterActions() {
        this.checkMandatoryActions();
        const actions = this.createFilterActions();
        return actions.filter((action) => this.isValidAction(this.actions, action));
    }

    checkMandatoryActions() {
        if (this.actions === undefined || this.actions.length === 0) {
            this.actions = EditProcessFilterCloudComponent.DEFAULT_ACTIONS;
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

    onDateChanged(newDateValue: any, dateProperty: ProcessFilterProperties) {
        if (newDateValue) {
            const momentDate = moment(newDateValue, this.DATE_FORMAT, true);
            const controller = this.getPropertyController(dateProperty);

            if (momentDate.isValid()) {
                controller.setValue(momentDate.toDate());
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
    }

    onChangedUser(users: IdentityUserModel[], processProperty: ProcessFilterProperties) {
        this.getPropertyController(processProperty).setValue(users);
    }

    hasError(property: ProcessFilterProperties): boolean {
        const controller = this.getPropertyController(property);
        return controller.errors && controller.errors.invalid;
    }

    compareFilters(editedQuery: ProcessFilterCloudModel, currentQuery: ProcessFilterCloudModel): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    getRunningApplications() {
        this.appsProcessCloudService
            .getDeployedApplicationsByStatus('RUNNING', this.role)
            .subscribe((applications) => {
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        this.applicationNames.push({ label: application.name, value: application.name });
                    });
                }
            });
    }

    getProcessDefinitions() {
        this.processCloudService.getProcessDefinitions(this.appName).subscribe((processDefinitions) => {
            if (processDefinitions && processDefinitions.length > 0) {
                this.processDefinitionNames.push(this.allProcessDefinitionNamesOption);
                processDefinitions.map((processDefinition) => {
                    this.processDefinitionNames.push({ label: processDefinition.name, value: processDefinition.name });
                });
            }
        });
    }

    executeFilterActions(action: ProcessFilterAction): void {
        if (action.actionType === EditProcessFilterCloudComponent.ACTION_SAVE) {
            this.save(action);
        } else if (action.actionType === EditProcessFilterCloudComponent.ACTION_SAVE_AS) {
            this.saveAs(action);
        } else if (action.actionType === EditProcessFilterCloudComponent.ACTION_DELETE) {
            this.delete(action);
        }
    }

    save(saveAction: ProcessFilterAction) {
        this.processFilterCloudService
            .updateFilter(this.changedProcessFilter)
            .subscribe(() => {
                saveAction.filter = this.changedProcessFilter;
                this.action.emit(saveAction);
                this.formHasBeenChanged = this.compareFilters(this.changedProcessFilter, this.processFilter);
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
            .subscribe(() => {});
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
                const resultFilter: ProcessFilterCloudModel = Object.assign({}, this.changedProcessFilter, newFilter);
                this.processFilterCloudService
                    .addFilter(resultFilter)
                    .subscribe(() => {
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

    restoreDefaultProcessFilters(): Observable<ProcessFilterCloudModel[]> {
        return this.processFilterCloudService.getProcessFilters(this.appName);
    }

    showActions(): boolean {
        return this.showFilterActions;
    }

    onExpand() {
        this.toggleFilterActions = true;
    }

    onClose() {
        this.toggleFilterActions = false;
    }

    isDisabledAction(action: ProcessFilterAction): boolean {
        return this.isDisabledForDefaultFilters(action) ? true : this.hasFormChanged(action);
    }

    isDisabledForDefaultFilters(action: ProcessFilterAction): boolean {
        return (
            this.processFilterCloudService.isDefaultFilter(this.processFilter.name) &&
            this.actionDisabledForDefault.includes(action.actionType)
        );
    }

    hasFormChanged(action: ProcessFilterAction): boolean {
        if (action.actionType === EditProcessFilterCloudComponent.ACTION_SAVE) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditProcessFilterCloudComponent.ACTION_SAVE_AS) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditProcessFilterCloudComponent.ACTION_DELETE) {
            return false;
        }

        return false;
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

    createFilterActions(): ProcessFilterAction[] {
        return [
            {
                actionType: EditProcessFilterCloudComponent.ACTION_SAVE,
                icon: 'adf:save',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE'
            },
            {
                actionType: EditProcessFilterCloudComponent.ACTION_SAVE_AS,
                icon: 'adf:save-as',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE_AS'
            },
            {
                actionType: EditProcessFilterCloudComponent.ACTION_DELETE,
                icon: 'delete',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.DELETE'
            }
        ];
    }

    createLastModifiedProperty(): ProcessFilterProperties[] {
        return [
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED_DATE_FORM',
                type: 'date',
                key: 'lastModifiedFrom',
                value: ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED_TO',
                type: 'date',
                key: 'lastModifiedTo',
                value: ''
            }
        ];
    }

    createProcessSortProperties(): ProcessSortFilterProperty[] {
        return [
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.ID',
                key: 'id',
                value: 'id'
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

    createProcessFilterProperties(currentProcessFilter: ProcessFilterCloudModel): ProcessFilterProperties[] {
        return [
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: currentProcessFilter.appName || '',
                options: this.applicationNames
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_VERSION',
                type: 'number',
                key: 'appVersion',
                value: currentProcessFilter.appVersion
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_VERSION',
                type: 'multi-select',
                key: 'appVersionMultiple',
                value: currentProcessFilter.appVersionMultiple,
                options: this.appVersionOptions
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_INS_ID',
                type: 'text',
                key: 'processInstanceId',
                value: currentProcessFilter.processInstanceId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_NAME',
                type: 'text',
                key: 'processName',
                value: currentProcessFilter.processName || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_NAME',
                type: 'select',
                key: 'processDefinitionName',
                value: currentProcessFilter.processDefinitionName || '',
                options: this.processDefinitionNames
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: currentProcessFilter.status || this.status[0].value,
                options: this.status
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: currentProcessFilter.processDefinitionId || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_KEY',
                type: 'text',
                key: 'processDefinitionKey',
                value: currentProcessFilter.processDefinitionKey || ''
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: currentProcessFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: currentProcessFilter.order || this.directions[0].value,
                options: this.directions
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.COMPLETED_DATE',
                type: 'date',
                key: 'completedDate',
                value: currentProcessFilter.completedDate || false
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STARTED_BY',
                type: 'people',
                key: 'initiator',
                value: currentProcessFilter.initiator,
                selectionMode: 'multiple'
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.COMPLETED_DATE',
                type: 'date-range',
                key: 'completedDateRange',
                attributes: { dateType: 'completedDateType', from: '_completedFrom', to: '_completedTo'},
                value: {
                    completedDateType: currentProcessFilter.completedDateType || null,
                    _completedFrom: currentProcessFilter.completedFrom || null,
                    _completedTo: currentProcessFilter.completedTo || null
                }
            },
            {
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STARTED_DATE',
                type: 'date-range',
                key: 'startedDateRange',
                attributes: { dateType: 'startedDateType', from: '_startFrom', to: '_startTo'},
                value: {
                    startedDateType: currentProcessFilter.startedDateType || null,
                    _startFrom: currentProcessFilter.startFrom || null,
                    _startTo: currentProcessFilter.startTo || null
                }
            }
        ];
    }
}
