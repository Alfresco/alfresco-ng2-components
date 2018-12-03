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
import { ProcessQueryModel, FilterActionType, ProcessFilterRepresentationModel } from '../models/process-filter-cloud.model';
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

    @Input()
    appName: string;

    @Input()
    id: string;

    /** Emitted when an process instance filter property changes. */
    @Output()
    filterChange: EventEmitter<ProcessQueryModel> = new EventEmitter();

    /** Emitted when an filter action occurs i.e Save, SaveAs, Delete. */
    @Output()
    action: EventEmitter<FilterActionType> = new EventEmitter();

    processFilter: ProcessFilterRepresentationModel;
    changedProcessFilter: ProcessFilterRepresentationModel;

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
            this.retrieveTaskFilter();
            this.buildForm();
        }
    }

    buildForm() {
        this.formHasBeenChanged = false;
        this.editProcessFilterForm = this.formBuilder.group({
            state: this.processFilter.query.state,
            sort: this.processFilter.query.sort,
            order: this.processFilter.query.order,
            processDefinitionId: this.processFilter.query.processDefinitionId,
            appName: this.processFilter.query.appName
        });
        this.onFilterChange();
    }

    retrieveTaskFilter() {
        this.processFilter = this.processFilterCloudService.getProcessFilterById(this.appName, this.id);
    }

    /**
     * Check for edit process instance filter form changes
     */
    onFilterChange() {
        this.editProcessFilterForm.valueChanges.subscribe((formValues: ProcessQueryModel) => {
            this.formHasBeenChanged = !this.compareFilters(formValues, this.processFilter.query);
            this.changedProcessFilter = Object.assign({}, this.processFilter);
            this.changedProcessFilter.query = formValues;
            this.filterChange.emit(formValues);
        });
    }

    /**
     * Check if both filters are same
     */
    compareFilters(editedQuery, currentQuery): boolean {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    onSave() {
        this.processFilterCloudService.updateFilter(this.changedProcessFilter);
        this.action.emit({actionType: EditProcessFilterCloudComponent.ACTION_SAVE, id: this.changedProcessFilter.id});
    }

    onDelete() {
        this.processFilterCloudService.deleteFilter(this.processFilter);
        this.action.emit({actionType: EditProcessFilterCloudComponent.ACTION_DELETE, id: this.processFilter.id});
    }

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
                const filter = new ProcessFilterRepresentationModel(
                    {
                        name: result.name,
                        icon: result.icon,
                        id: filterId,
                        key: 'custom-' + filterKey,
                        query: this.changedProcessFilter.query
                    }
                );
                this.processFilterCloudService.addFilter(filter);
                this.action.emit({actionType: EditProcessFilterCloudComponent.ACTION_SAVE_AS, id: filter.id});
            }
        });
    }

    getSanitizeFilterName(filterName) {
        const nameWithHyphen = this.replaceSpaceWithHyphen(filterName.trim());
        return nameWithHyphen.toLowerCase();
    }

    replaceSpaceWithHyphen(name) {
        const regExt = new RegExp(' ', 'g');
        return name.replace(regExt, '-');
    }
}
