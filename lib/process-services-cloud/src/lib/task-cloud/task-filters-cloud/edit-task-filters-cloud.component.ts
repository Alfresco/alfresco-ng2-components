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
  selector: 'adf-cloud-edit-task-filters',
  templateUrl: './edit-task-filters-cloud.component.html',
  styleUrls: ['./edit-task-filters-cloud.component.scss']
})
export class EditTaskFiltersCloudComponent implements OnChanges {

    public static ACTION_SAVE = 'SAVE';
    public static ACTION_SAVE_AS = 'SAVE_AS';
    public static ACTION_DELETE = 'DELETE';

    @Input()
    taskFilter: TaskFilterCloudRepresentationModel;

    @Output()
    filterChange: EventEmitter<QueryModel> = new EventEmitter();

    @Output()
    action: EventEmitter<FilterActionType> = new EventEmitter();

    toggleAction = false;

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'createdDate', label: 'Created Date'},
        {key: 'priority', label: 'PRIORITY'},
        {key: 'processDefinitionId', label: 'PROCESS DEFINITION ID'}
      ];

    states = ['ALL', 'CREATED', 'CANCELLED', 'ASSIGNED', 'SUSPENDED', 'COMPLETED', 'DELETED'];

    directions = ['ASC', 'DESC'];

    editTaskFilterForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges) {
        const taskFilter = changes['taskFilter'];
        if (taskFilter && taskFilter.currentValue) {
            this.buildForm();
        }
    }

    buildForm() {
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

    onFilterChange() {
        this.editTaskFilterForm.valueChanges.subscribe((formValues: QueryModel) => {
            const editedQuery = new QueryModel(formValues);
            if (JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(this.taskFilter.query).toLowerCase()) {
                this.toggleFilterAction();
                this.filterChange.emit(this.taskFilter.query);
            } else {
                this.toggleFilterAction();
                this.filterChange.emit(editedQuery);
            }
        });
    }

    toggleFilterAction() {
        this.toggleAction = !this.toggleAction;
    }

    onSave() {
        this.action.emit(new FilterActionType(EditTaskFiltersCloudComponent.ACTION_SAVE));
    }

    onSaveAs() {
        this.action.emit(new FilterActionType(EditTaskFiltersCloudComponent.ACTION_SAVE_AS));
    }

    onDelete() {
        this.action.emit(new FilterActionType(EditTaskFiltersCloudComponent.ACTION_DELETE));
    }
}
