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
import { MatDialog, DateAdapter } from '@angular/material';
import { debounceTime, filter, takeUntil, finalize, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import moment from 'moment-es6';
import { Moment } from 'moment';

import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { ProcessFilterCloudModel, ProcessFilterProperties, ProcessFilterAction, ProcessFilterOptions } from '../models/process-filter-cloud.model';
import { TranslationService, UserPreferencesService, UserPreferenceValues } from '@alfresco/adf-core';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { ApplicationInstanceModel } from '../../../app/models/application-instance.model';

@Component({
    selector: 'adf-cloud-edit-process-filter',
    templateUrl: './edit-process-filter-cloud.component.html',
    styleUrls: ['./edit-process-filter-cloud.component.scss']
})
export class EditProcessFilterCloudComponent implements OnInit, OnChanges, OnDestroy {

    public static ACTION_SAVE = 'save';
    public static ACTION_SAVE_AS = 'saveAs';
    public static ACTION_DELETE = 'delete';
    public static APPLICATION_NAME: string = 'appName';
    public static APP_RUNNING_STATUS: string = 'RUNNING';
    public static LAST_MODIFIED: string = 'lastModified';
    public static SORT: string = 'sort';
    public static ORDER: string = 'order';
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

    /** Emitted when a process instance filter property changes. */
    @Output()
    filterChange: EventEmitter<ProcessFilterCloudModel> = new EventEmitter();

    /** Emitted when a filter action occurs i.e Save, SaveAs, Delete. */
    @Output()
    action: EventEmitter<ProcessFilterAction> = new EventEmitter();

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
    applicationNames: any[] = [];
    formHasBeenChanged = false;
    editProcessFilterForm: FormGroup;
    processFilterProperties: ProcessFilterProperties[] = [];
    processFilterActions: ProcessFilterAction[] = [];
    toggleFilterActions: boolean = false;

    private onDestroy$ = new Subject<boolean>();
    isLoading: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private dateAdapter: DateAdapter<Moment>,
        private userPreferencesService: UserPreferencesService,
        private translateService: TranslationService,
        private processFilterCloudService: ProcessFilterCloudService,
        private appsProcessCloudService: AppsProcessCloudService) {
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
        this.formHasBeenChanged = false;
        this.editProcessFilterForm = this.formBuilder.group(this.getFormControlsConfig(processFilterProperties));
        this.onFilterChange();
    }

    getFormControlsConfig(processFilterProperties: ProcessFilterProperties[]): any {
        const properties = processFilterProperties.map((property: ProcessFilterProperties) => {
            return { [property.key]: property.value };
        });
        return properties.reduce(((result, current) => Object.assign(result, current)), {});
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
                debounceTime(500),
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
        if (this.checkForApplicationNameProperty()) {
            this.applicationNames = [];
            this.getRunningApplications();
        }
        const defaultProperties = this.createProcessFilterProperties(this.processFilter);
        let filteredProperties = defaultProperties.filter((filterProperty: ProcessFilterProperties) => this.isValidProperty(this.filterProperties, filterProperty));
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

    checkForApplicationNameProperty(): boolean {
        return this.filterProperties ? this.filterProperties.indexOf(EditProcessFilterCloudComponent.APPLICATION_NAME) >= 0 : false;
    }

    private isValidProperty(filterProperties: string[], filterProperty: ProcessFilterProperties): boolean {
        return filterProperties ? filterProperties.indexOf(filterProperty.key) >= 0 : true;
    }

    hasSortProperty(): boolean {
        return this.filterProperties.indexOf(EditProcessFilterCloudComponent.SORT) >= 0;
    }

    hasLastModifiedProperty(): boolean {
        return this.filterProperties.indexOf(EditProcessFilterCloudComponent.LAST_MODIFIED) >= 0;
    }

    removeOrderProperty(filteredProperties: ProcessFilterProperties[]): ProcessFilterProperties[] {
        if (filteredProperties && filteredProperties.length > 0) {
            return filteredProperties.filter(
                property =>  property.key !== EditProcessFilterCloudComponent.ORDER
            );
        }
        return [];
    }

    get createSortProperties(): ProcessFilterOptions[] {
        this.checkMandatorySortProperties();
        const sortProperties = this.sortProperties.map((property: string) => {
            return <ProcessFilterOptions> { label: property.charAt(0).toUpperCase() + property.slice(1), value: property };
        });
        return sortProperties;
    }

    checkMandatorySortProperties() {
        if (this.sortProperties === undefined || this.sortProperties.length === 0) {
            this.sortProperties = EditProcessFilterCloudComponent.DEFAULT_SORT_PROPERTIES;
        }
    }

    createAndFilterActions() {
        this.checkMandatoryActions();
        const actions = this.createFilterActions();
        return actions.filter((action: ProcessFilterAction) => this.isValidAction(this.actions, action));
    }

    checkMandatoryActions() {
        if (this.actions === undefined || this.actions.length === 0) {
            this.actions = EditProcessFilterCloudComponent.DEFAULT_ACTIONS;
        }
    }

    private isValidAction(actions: string[], action: any): boolean {
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

            if (momentDate.isValid()) {
                this.getPropertyController(dateProperty).setValue(momentDate.toDate());
                this.getPropertyController(dateProperty).setErrors(null);
            } else {
                this.getPropertyController(dateProperty).setErrors({ invalid: true });
            }
        }
    }

    hasError(property: ProcessFilterProperties): boolean {
        return this.getPropertyController(property).errors && this.getPropertyController(property).errors.invalid;
    }

    compareFilters(editedQuery: ProcessFilterCloudModel, currentQuery: ProcessFilterCloudModel): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    getRunningApplications() {
        this.appsProcessCloudService
            .getDeployedApplicationsByStatus(EditProcessFilterCloudComponent.APP_RUNNING_STATUS, this.role)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((applications: ApplicationInstanceModel[]) => {
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        this.applicationNames.push({ label: application.name, value: application.name });
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
            .pipe(takeUntil(this.onDestroy$))
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
                switchMap(() => this.restoreDefaultProcessFilters()),
                takeUntil(this.onDestroy$))
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
                    .pipe(takeUntil(this.onDestroy$))
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

    isDateType(property: ProcessFilterProperties): boolean {
        return property.type === 'date';
    }

    isSelectType(property: ProcessFilterProperties): boolean {
        return property.type === 'select';
    }

    isTextType(property: ProcessFilterProperties): boolean {
        return property.type === 'text';
    }

    isNumberType(property: ProcessFilterProperties): boolean {
        return property.type === 'number';
    }

    hasFormChanged(action: any): boolean {
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
            new ProcessFilterAction({
                actionType: EditProcessFilterCloudComponent.ACTION_SAVE,
                icon: 'save',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE'
            }),
            new ProcessFilterAction({
                actionType: EditProcessFilterCloudComponent.ACTION_SAVE_AS,
                icon: 'unarchive',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE_AS'
            }),
            new ProcessFilterAction({
                actionType: EditProcessFilterCloudComponent.ACTION_DELETE,
                icon: 'delete',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.DELETE'
            })
        ];
    }

    createLastModifiedProperty(): ProcessFilterProperties[] {
        return [
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED_DATE_FORM',
                type: 'date',
                key: 'lastModifiedFrom',
                value: ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED_TO',
                type: 'date',
                key: 'lastModifiedTo',
                value: ''
            })
        ];
    }

    createProcessFilterProperties(currentProcessFilter: ProcessFilterCloudModel): ProcessFilterProperties[] {
        return [
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: currentProcessFilter.appName || '',
                options: this.applicationNames
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_VERSION',
                type: 'number',
                key: 'appVersion',
                value: currentProcessFilter.appVersion
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_INS_ID',
                type: 'text',
                key: 'processInstanceId',
                value: currentProcessFilter.processInstanceId || ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_NAME',
                type: 'text',
                key: 'processName',
                value: currentProcessFilter.processName || ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.INITIATOR',
                type: 'text',
                key: 'initiator',
                value: currentProcessFilter.initiator || ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'status',
                value: currentProcessFilter.status || this.status[0].value,
                options: this.status
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: currentProcessFilter.processDefinitionId || ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_KEY',
                type: 'text',
                key: 'processDefinitionKey',
                value: currentProcessFilter.processDefinitionKey || ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: currentProcessFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: currentProcessFilter.order || this.directions[0].value,
                options: this.directions
            })
        ];
    }

}
