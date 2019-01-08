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

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, filter, map } from 'rxjs/operators';
import moment from 'moment-es6';
import { of } from 'rxjs';

import { ApplicationInstanceModel } from '../../../app/models/application-instance.model';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { ProcessFilterCloudModel, ProcessFilterActionType, FilterOptions, ProcessFilterProperties } from '../models/process-filter-cloud.model';
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

    public static APP_RUNNING_STATUS: string = 'Running';
    public static DEFAULT_PROCESS_FILTER_PROPERTIES = ['state', 'sort', 'order'];
    public FORMAT_DATE: string = 'DD/MM/YYYY';

    /** The name of the application. */
    @Input()
    appName: string;

    /** Id of the process instance filter. */
    @Input()
    id: string;

    @Input()
    filterProperties: string[] = EditProcessFilterCloudComponent.DEFAULT_PROCESS_FILTER_PROPERTIES; // default ['state', 'sort', 'order']

    @Input()
    toggleFilterActions = true;

    @Input()
    showTitle = true;

    /** Emitted when an process instance filter property changes. */
    @Output()
    filterChange: EventEmitter<ProcessFilterCloudModel> = new EventEmitter();

    /** Emitted when an filter action occurs i.e Save, SaveAs, Delete. */
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
        { label: 'ALL', value: 'ALL' },
        { label: 'RUNNING', value: 'RUNNING' },
        { label: 'COMPLETED', value: 'COMPLETED' }
    ];

    directions = [{ label: 'ASC', value: 'ASC' }, { label: 'DESC', value: 'DESC' }];
    formHasBeenChanged = false;
    editProcessFilterForm: FormGroup;
    processFilterProperties: any[] = [];
    showFilterActions: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private processFilterCloudService: ProcessFilterCloudService,
        private appsProcessCloudService: AppsProcessCloudService) { }

    ngOnChanges(changes: SimpleChanges) {
        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.retrieveProcessFilter();
            this.initProcessFilterProperties(this.processFilter);
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
    retrieveProcessFilter() {
        this.processFilter = new ProcessFilterCloudModel(this.processFilterCloudService.getProcessFilterById(this.appName, this.id));
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

    initProcessFilterProperties(processFilter: ProcessFilterCloudModel) {
        if (this.filterProperties && this.filterProperties.length > 0) {
            const defaultProperties = this.defaultProcessFilterProperties(processFilter);
            this.processFilterProperties = defaultProperties.filter((filterProperty: ProcessFilterProperties) => this.isValidProperty(this.filterProperties, filterProperty));
        } else {
            this.processFilterProperties = EditProcessFilterCloudComponent.DEFAULT_PROCESS_FILTER_PROPERTIES;
        }
    }

    private isValidProperty(filterProperties: string[], filterProperty: ProcessFilterProperties): boolean {
        return filterProperties ? filterProperties.indexOf(filterProperty.key) >= 0 : true;
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

    getRunningApplications(): Observable<FilterOptions[]> {
        return this.appsProcessCloudService.getDeployedApplicationsByStatus(EditProcessFilterCloudComponent.APP_RUNNING_STATUS).pipe(
            map((applications: ApplicationInstanceModel[]) => {
                let options: FilterOptions[] = [];
                if (applications && applications.length > 0) {
                    applications.map((application) => {
                        options.push({ label: application.name, value: application.name });
                    });
                }
                return options;
            }));
    }

    /**
     * Save a process instance filter
     */
    onSave() {
        this.processFilterCloudService.updateFilter(this.changedProcessFilter);
        this.action.emit({ actionType: EditProcessFilterCloudComponent.ACTION_SAVE, id: this.changedProcessFilter.id });
    }

    /**
     * Delete a process instance filter
     */
    onDelete() {
        this.processFilterCloudService.deleteFilter(this.processFilter);
        this.action.emit({ actionType: EditProcessFilterCloudComponent.ACTION_DELETE, id: this.processFilter.id });
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
                const changedFilter: ProcessFilterCloudModel = Object.assign({}, this.changedProcessFilter, newFilter);
                this.processFilterCloudService.addFilter(changedFilter);
                this.action.emit({ actionType: EditProcessFilterCloudComponent.ACTION_SAVE_AS, id: changedFilter.id });
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

    toggleActions(): boolean {
        return this.toggleFilterActions;
    }

    onExpand(event: any) {
        this.showFilterActions = true;
    }

    onClose(event: any) {
        this.showFilterActions = false;
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

    defaultProcessFilterProperties(currentProcessFilter: ProcessFilterCloudModel): ProcessFilterProperties[] {
        return [
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.APP_NAME',
                type: 'select',
                key: 'appName',
                value: this.appName || '',
                options: this.getRunningApplications()
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.STATUS',
                type: 'select',
                key: 'state',
                value: currentProcessFilter.state || this.status[0].value,
                options: of(this.status)
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.COLUMN',
                type: 'select',
                key: 'sort',
                value: currentProcessFilter.sort || this.columns[0].value,
                options: of(this.columns)
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.DIRECTION',
                type: 'select',
                key: 'order',
                value: currentProcessFilter.order || this.directions[0].value,
                options: of(this.directions)
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_NAME',
                type: 'text',
                key: 'processName',
                value: currentProcessFilter.processName || ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_DEF_ID',
                type: 'text',
                key: 'processDefinitionId',
                value: currentProcessFilter.processDefinitionId || ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_INS_ID',
                type: 'text',
                key: 'processInstanceId',
                value: ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.START_DATE',
                type: 'date',
                key: 'startDate',
                value: ''
            }),
            new ProcessFilterProperties({
                label: 'ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.LAST_MODIFIED',
                type: 'date',
                key: 'lastModified',
                value: ''
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
            })
        ];
    }
}
