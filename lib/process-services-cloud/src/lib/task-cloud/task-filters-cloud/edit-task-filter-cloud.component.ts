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

import { Component, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TaskFilterCloudModel, FilterActionType } from './../models/filter-cloud.model';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { MatDialog } from '@angular/material';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog-cloud.component';
import { TranslationService } from '@alfresco/adf-core';
@Component({
  selector: 'adf-cloud-edit-task-filter',
  templateUrl: './edit-task-filter-cloud.component.html',
  styleUrls: ['./edit-task-filter-cloud.component.scss']
})
export class EditTaskFilterCloudComponent implements OnChanges {

    public static ACTION_SAVE = 'SAVE';
    public static ACTION_SAVE_AS = 'SAVE_AS';
    public static ACTION_DELETE = 'DELETE';

    @Input()
    appName: string;

    @Input()
    id: string;

    taskFilter: TaskFilterCloudModel;
    changedTaskFilter: TaskFilterCloudModel;

    /** Emitted when an task filter property changes. */
    @Output()
    filterChange: EventEmitter<TaskFilterCloudModel> = new EventEmitter();

    /** Emitted when an filter action occurs i.e Save, SaveAs, Delete. */
    @Output()
    action: EventEmitter<FilterActionType> = new EventEmitter();

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'createdDate', label: 'Created Date'},
        {key: 'priority', label: 'PRIORITY'},
        {key: 'processDefinitionId', label: 'PROCESS DEFINITION ID'}
      ];

    status = [
        {label: 'ALL', value: ''},
        {label: 'CREATED', value: 'CREATED'},
        {label: 'CANCELLED', value: 'CANCELLED'},
        {label: 'ASSIGNED', value: 'ASSIGNED'},
        {label: 'SUSPENDED', value: 'SUSPENDED'},
        {label: 'COMPLETED', value: 'COMPLETED'},
        {label: 'DELETED', value: 'DELETED'}
    ];

    directions = ['ASC', 'DESC'];
    formHasBeenChanged = false;
    editTaskFilterForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private translateService: TranslationService,
        private taskFilterCloudService: TaskFilterCloudService) {}

    ngOnChanges(changes: SimpleChanges) {
        const id = changes['id'];
        if (id && id.currentValue !== id.previousValue) {
            this.retrieveTaskFilter();
            this.buildForm();
        }
    }

    buildForm() {
        this.formHasBeenChanged = false;
        this.editTaskFilterForm = this.formBuilder.group({
            state: this.taskFilter.state,
            appName: this.taskFilter.appName,
            processDefinitionId: this.taskFilter.processDefinitionId,
            assignment: this.taskFilter.assignment,
            sort: this.taskFilter.sort,
            order: this.taskFilter.order
        });
        this.onFilterChange();
    }

    retrieveTaskFilter() {
        this.taskFilter = this.taskFilterCloudService.getTaskFilterById(this.appName, this.id);
    }

    /**
     * Check for edit task filter form changes
     */
    onFilterChange() {
        this.editTaskFilterForm.valueChanges.subscribe((formValues: TaskFilterCloudModel) => {
            this.changedTaskFilter = Object.assign({}, this.taskFilter, formValues);
            this.formHasBeenChanged = !this.compareFilters(this.changedTaskFilter, this.taskFilter);
            this.filterChange.emit(this.changedTaskFilter);
        });
    }

    /**
     * Check if both filters are same
     */
    compareFilters(editedQuery, currentQuery): boolean  {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    onSave() {
        this.taskFilterCloudService.updateFilter(this.changedTaskFilter);
        this.action.emit({actionType: EditTaskFilterCloudComponent.ACTION_SAVE, id: this.changedTaskFilter.id});
    }

    onDelete() {
        this.taskFilterCloudService.deleteFilter(this.taskFilter);
        this.action.emit({actionType: EditTaskFilterCloudComponent.ACTION_DELETE, id: this.taskFilter.id});
    }

    onSaveAs() {
        const dialogRef = this.dialog.open(TaskFilterDialogCloudComponent, {
            data: {
                name: this.translateService.instant(this.taskFilter.name)
            },
            height: 'auto',
            minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe( (result) => {
            if (result && result.action === TaskFilterDialogCloudComponent.ACTION_SAVE) {
                const filterId = Math.random().toString(36).substr(2, 9);
                const filterKey = this.getSanitizeFilterName(result.name);
                const newFilter = {
                                    name: result.name,
                                    icon: result.icon,
                                    id: filterId,
                                    key: 'custom-' + filterKey
                                };
                const filter = Object.assign({}, this.changedTaskFilter, newFilter);
                this.taskFilterCloudService.addFilter(filter);
                this.action.emit({actionType: EditTaskFilterCloudComponent.ACTION_SAVE_AS, id: filter.id});
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
