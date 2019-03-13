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

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { debounceTime, filter } from 'rxjs/operators';
import moment from 'moment-es6';

import { ApplicationInstanceModel } from '../../../app/models/application-instance.model';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { ProcessFilterCloudModel, ProcessFilterActionType, ProcessFilterProperties, ProcessFilterAction, ProcessFilterOptions } from '../models/process-filter-cloud.model';
import { TranslationService } from '@alfresco/adf-core';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';

@Component({
    selector: 'adf-cloud-edit-process-filter',
    templateUrl: './edit-process-filter-cloud.component.html',
    styleUrls: ['./edit-process-filter-cloud.component.scss']
})
export class EditProcessFilterCloudComponent implements OnChanges {

    public static ACTION_SAVE = 'SAVE';
    public static ACTION_SAVE_AS = 'SAVE_AS';
    public static ACTION_DELETE = 'DELETE';
    public static APPLICATION_NAME: string = 'appName';
    public static APP_RUNNING_STATUS: string = 'Running';
    public static DEFAULT_PROCESS_FILTER_PROPERTIES = ['state', 'sort', 'order'];
    public static DEFAULT_SORT_PROPERTIES = ['id', 'name', 'status', 'startDate'];
    public static DEFAULT_ACTIONS = ['save', 'saveAs', 'delete'];
    public FORMAT_DATE: string = 'DD/MM/YYYY';

    /** The name of the application. */
    @Input()
    appName: string;

    /** Id of the process instance filter. */
    @Input()
    id: string;

    /** List of process filter properties to display */
    @Input()
    filterProperties: string[] = EditProcessFilterCloudComponent.DEFAULT_PROCESS_FILTER_PROPERTIES; // default ['state', 'sort', 'order']

    /** Toggles editing of process filter actions. */
    @Input()
    showFilterActions = true;

    /** Toggles editing of the process filter title. */
    @Input()
    showTitle = true;

    /** List of sort properties to display. */
    @Input()
    sortProperties: string[] = [];

    /** List of sort actions. */
    @Input()
    actions: string[] = EditProcessFilterCloudComponent.DEFAULT_ACTIONS;

    /** Emitted when a process instance filter property changes. */
    @Output()
    filterChange: EventEmitter<ProcessFilterCloudModel> = new EventEmitter();

    /** Emitted when a filter action occurs i.e Save, SaveAs, Delete. */
    @Output()
    action: EventEmitter<ProcessFilterActionType> = new EventEmitter();

    processFilter: ProcessFilterCloudModel;
    changedProcessFilter: ProcessFilterCloudModel;

    columns = [
        { value: 'id', label: 'ID' },
        { value: 'name', label: 'NAME' },
        { value: 'status', label: 'STATUS' },
        { value: 'startDate', label: 'START DATE' }
    ];

    status = [
        { label: 'ALL', value: '' },
        { label: 'RUNNING', value: 'RUNNING' },
        { label: 'COMPLETED', value: 'COMPLETED' }
    ];

    directions = [{ label: 'ASC', value: 'ASC' }, { label: 'DESC', value: 'DESC' }];
    applicationNames: any[] = [];
    formHasBeenChanged = false;
    editProcessFilterForm: FormGroup;
    processFilterProperties: ProcessFilterProperties[] = [];
    processFilterActions: ProcessFilterAction[] = [];
    toggleFilterActions: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private processFilterCloudService: ProcessFilterCloudService,
        private appsProcessCloudService: AppsProcessCloudService) { }

    ngOnChanges(changes: SimpleChanges) {
        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.processFilterProperties = this.createAndFilterProperties();
            this.processFilterActions = this.createAndFilterActions();
            this.buildForm(this.processFilterProperties);
        }
    }

    /**
     * Build process filter edit form
     */
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
     * Return process instance filter by application name and filter id
     */
    retrieveProcessFilter(): ProcessFilterCloudModel {
        return new ProcessFilterCloudModel(this.processFilterCloudService.getProcessFilterById(this.appName, this.id));
    }

    /**
     * Check process instance filter changes
     */
    onFilterChange() {
        this.editProcessFilterForm.valueChanges
            .pipe(debounceTime(500), filter(() => this.isFormValid()))
            .subscribe((formValues: ProcessFilterCloudModel) => {
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
        this.processFilter = this.retrieveProcessFilter();
        const defaultProperties = this.createProcessFilterProperties(this.processFilter);
        return defaultProperties.filter((filterProperty: ProcessFilterProperties) => this.isValidProperty(this.filterProperties, filterProperty));
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

    createSortProperties(): any {
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
            let momentDate;

            if (typeof newDateValue === 'string') {
                momentDate = moment(newDateValue, this.FORMAT_DATE, true);
            } else {
                momentDate = newDateValue;
            }

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

    /**
     * Return true if both filters are same
     * @param editedQuery, @param currentQuery
     */
    compareFilters(editedQuery: ProcessFilterCloudModel, currentQuery: ProcessFilterCloudModel): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    getRunningApplications() {
        this.appsProcessCloudService.getDeployedApplicationsByStatus(EditProcessFilterCloudComponent.APP_RUNNING_STATUS)
            .subscribe((applications: ApplicationInstanceModel[]) => {
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        this.applicationNames.push({ label: application.name, value: application.name });
                    });
                }
            });
    }

    executeFilterActions(action: ProcessFilterAction): void {
        if (action.actionType === EditProcessFilterCloudComponent.DEFAULT_ACTIONS[0]) {
            this.onSave();
        } else if (action.actionType === EditProcessFilterCloudComponent.DEFAULT_ACTIONS[1]) {
            this.onSaveAs();
        } else if (action.actionType === EditProcessFilterCloudComponent.DEFAULT_ACTIONS[2]) {
            this.onDelete();
        }
    }

    /**
     * Save a process instance filter
     */
    onSave() {
        this.processFilterCloudService.updateFilter(this.changedProcessFilter);
        this.action.emit({ actionType: EditProcessFilterCloudComponent.ACTION_SAVE, filter: this.changedProcessFilter });
        this.formHasBeenChanged = this.compareFilters(this.changedProcessFilter, this.processFilter);
    }

    /**
     * Delete a process instance filter
     */
    onDelete() {
        this.processFilterCloudService.deleteFilter(this.processFilter);
        this.action.emit({ actionType: EditProcessFilterCloudComponent.ACTION_DELETE, filter: this.processFilter });
    }

    /**
     * Save As a process instance filter
     */
    onSaveAs() {
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
                this.processFilterCloudService.addFilter(resultFilter);
                this.action.emit({ actionType: EditProcessFilterCloudComponent.ACTION_SAVE_AS, filter: resultFilter });
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

    showActions(): boolean {
        return this.showFilterActions;
    }

    onExpand(event: any) {
        this.toggleFilterActions = true;
    }

    onClose(event: any) {
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

    hasFormChanged(action: any): boolean {
        if (action.actionType === EditProcessFilterCloudComponent.DEFAULT_ACTIONS[0]) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditProcessFilterCloudComponent.DEFAULT_ACTIONS[1]) {
            return !this.formHasBeenChanged;
        }
        if (action.actionType === EditProcessFilterCloudComponent.DEFAULT_ACTIONS[2]) {
            return false;
        }
    }

     createFilterActions(): ProcessFilterAction[] {
        return [
            new ProcessFilterAction({
                actionType: EditProcessFilterCloudComponent.DEFAULT_ACTIONS[0],
                icon: 'save',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE'
            }),
            new ProcessFilterAction({
                actionType: EditProcessFilterCloudComponent.DEFAULT_ACTIONS[1],
                icon: 'unarchive',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE_AS'
            }),
            new ProcessFilterAction({
                actionType: EditProcessFilterCloudComponent.DEFAULT_ACTIONS[2],
                icon: 'delete',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.DELETE'
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
                key: 'state',
                value: currentProcessFilter.state || this.status[0].value,
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
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.SORT',
                type: 'select',
                key: 'sort',
                value: currentProcessFilter.sort || this.createSortProperties[0].value,
                options: this.createSortProperties()
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
