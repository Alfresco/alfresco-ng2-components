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
import { QueryModel, FilterActionType } from './../models/filter-cloud.model';
import { TaskFilterCloudRepresentationModel } from '../models/filter-cloud.model';

@Component({
  selector: 'adf-cloud-edit-task-filter',
  templateUrl: './edit-task-filter-cloud.component.html',
  styleUrls: ['./edit-task-filter-cloud.component.scss']
})
export class EditTaskFilterCloudComponent implements OnChanges {

    public static ACTION_SAVE = 'SAVE';
    public static ACTION_SAVE_AS = 'SAVE_AS';
    public static ACTION_DELETE = 'DELETE';

    /** (**required**) Full details of the task filter to display information about. */
    @Input()
    taskFilter: TaskFilterCloudRepresentationModel;

    /** Emitted when an task filter property changes. */
    @Output()
    filterChange: EventEmitter<QueryModel> = new EventEmitter();

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

    states = ['ALL', 'CREATED', 'CANCELLED', 'ASSIGNED', 'SUSPENDED', 'COMPLETED', 'DELETED'];

    directions = ['ASC', 'DESC'];
    formHasBeenChanged = false;
    editTaskFilterForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges) {
        const taskFilter = changes['taskFilter'];
        if (taskFilter && !taskFilter.currentValue) {
            this.reset();
            return;
        }
        if (taskFilter && taskFilter.currentValue) {
            this.buildForm();
        }
    }

    buildForm() {
        this.formHasBeenChanged = false;
        this.editTaskFilterForm = this.formBuilder.group({
            state: this.taskFilter.query.state,
            appName: this.taskFilter.query.appName,
            processDefinitionId: this.taskFilter.query.processDefinitionId,
            assignment: this.taskFilter.query.assignment,
            sort: this.taskFilter.query.sort,
            order: this.taskFilter.query.order
        });
        this.onFilterChange();
    }

    /**
     * Check for edit task filter form changes
     */
    onFilterChange() {
        this.editTaskFilterForm.valueChanges.subscribe((formValues: QueryModel) => {
            this.formHasBeenChanged = !this.compareFilters(new QueryModel(formValues), this.taskFilter.query);
            this.filterChange.emit(formValues);
        });
    }

    /**
     * Check if both filters are same
     */
    compareFilters(editedQuery, currentQuery): boolean  {
        return JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(currentQuery).toLowerCase();
    }

    onSave() {
        this.action.emit(new FilterActionType(EditTaskFilterCloudComponent.ACTION_SAVE));
    }

    onSaveAs() {
        this.action.emit(new FilterActionType(EditTaskFilterCloudComponent.ACTION_SAVE_AS));
    }

    onDelete() {
        this.action.emit(new FilterActionType(EditTaskFilterCloudComponent.ACTION_DELETE));
    }

    /**
     * Reset the task filter
     */
    reset() {
        this.taskFilter = null;
    }
}
