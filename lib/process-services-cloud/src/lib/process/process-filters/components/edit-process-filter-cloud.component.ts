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
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProcessFilterCloudModel, ProcessFilterActionType } from '../models/process-filter-cloud.model';
import { TranslationService } from '@alfresco/adf-core';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'adf-cloud-edit-process-filter',
  templateUrl: './edit-process-filter-cloud.component.html',
  styleUrls: ['./edit-process-filter-cloud.component.scss']
})
export class EditProcessFilterCloudComponent implements OnChanges {

    public static ACTION_SAVE = 'SAVE';
    public static ACTION_SAVE_AS = 'SAVE_AS';
    public static ACTION_DELETE = 'DELETE';

     /** The name of the application. */
    @Input()
    appName: string;

    /** Id of the process instance filter. */
    @Input()
    id: string;

    /** Emitted when an process instance filter property changes. */
    @Output()
    filterChange: EventEmitter<ProcessFilterCloudModel> = new EventEmitter();

    /** Emitted when an filter action occurs i.e Save, SaveAs, Delete. */
    @Output()
    action: EventEmitter<ProcessFilterActionType> = new EventEmitter();

    processFilter: ProcessFilterCloudModel;
    changedProcessFilter: ProcessFilterCloudModel;

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'status', label: 'STATUS'},
        {key: 'startDate', label: 'START DATE'}
      ];

    status = [
        {label: 'ALL', value: ''},
        {label: 'RUNNING', value: 'RUNNING'},
        {label: 'COMPLETED', value: 'COMPLETED'}
    ];

    directions = ['ASC', 'DESC'];
    formHasBeenChanged = false;
    editProcessFilterForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private processFilterCloudService: ProcessFilterCloudService) {}

    ngOnChanges(changes: SimpleChanges) {
        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.retrieveProcessFilter();
            this.buildForm();
        }
    }

    /**
     * Build process filter edit form
     */
    buildForm() {
        this.formHasBeenChanged = false;
        this.editProcessFilterForm = this.formBuilder.group({
            state: this.processFilter.state ? this.processFilter.state : '',
            sort: this.processFilter.sort,
            order: this.processFilter.order,
            processDefinitionId: this.processFilter.processDefinitionId,
            appName: this.processFilter.appName
        });
        this.onFilterChange();
    }

    /**
     * Return process instance filter by application name and filter id
     */
    retrieveProcessFilter() {
        this.processFilter = this.processFilterCloudService.getProcessFilterById(this.appName, this.id);
    }

    /**
     * Check process instance filter changes
     */
    onFilterChange() {
        this.editProcessFilterForm.valueChanges.subscribe((formValues: ProcessFilterCloudModel) => {
            this.changedProcessFilter = new ProcessFilterCloudModel(Object.assign({}, this.processFilter, formValues));
            this.formHasBeenChanged = !this.compareFilters(this.changedProcessFilter, this.processFilter);
            this.filterChange.emit(this.changedProcessFilter);
        });
    }

    /**
     * Return true if both filters are same
     * @param editedQuery, @param currentQuery
     */
    compareFilters(editedQuery: ProcessFilterCloudModel, currentQuery: ProcessFilterCloudModel): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    /**
     * Save a process instance filter
     */
    onSave() {
        this.processFilterCloudService.updateFilter(this.changedProcessFilter);
        this.action.emit({actionType: EditProcessFilterCloudComponent.ACTION_SAVE, id: this.changedProcessFilter.id});
    }

    /**
     * Delete a process instance filter
     */
    onDelete() {
        this.processFilterCloudService.deleteFilter(this.processFilter);
        this.action.emit({actionType: EditProcessFilterCloudComponent.ACTION_DELETE, id: this.processFilter.id});
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
        dialogRef.afterClosed().subscribe( (result) => {
            if (result && result.action === ProcessFilterDialogCloudComponent.ACTION_SAVE) {
                const filterId = Math.random().toString(36).substr(2, 9);
                const filterKey = this.getSanitizeFilterName(result.name);
                const newFilter = {
                        name: result.name,
                        icon: result.icon,
                        id: filterId,
                        key: 'custom-' + filterKey
                    };
                const filter = Object.assign({}, this.changedProcessFilter, newFilter);
                this.processFilterCloudService.addFilter(filter);
                this.action.emit({actionType: EditProcessFilterCloudComponent.ACTION_SAVE_AS, id: filter.id});
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
}
