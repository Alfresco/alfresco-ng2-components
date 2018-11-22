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
import { MatDialog } from '@angular/material';
import { TaskFilterDialogCloudComponent } from './task-filter-dialog/task-filter-dialog-cloud.component';
import { QueryModel } from './../models/filter-cloud.model';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { FilterRepresentationModel } from '../models/filter-cloud.model';

@Component({
  selector: 'adf-cloud-edit-task-filters',
  templateUrl: './edit-task-filters-cloud.component.html',
  styleUrls: ['./edit-task-filters-cloud.component.scss']
})
export class EditTaskFiltersCloudComponent implements OnChanges {

    @Input()
    taskFilter: FilterRepresentationModel;

    @Output()
    save: EventEmitter<any> = new EventEmitter();

    @Output()
    delete: EventEmitter<any> = new EventEmitter();

    @Output()
    filterChange: EventEmitter<FilterRepresentationModel> = new EventEmitter();

    @Output()
    success: EventEmitter<FilterRepresentationModel> = new EventEmitter();

    isDelete = true;
    isSave = false;
    editedFilter: FilterRepresentationModel;

    columns = [
        {key: 'id', label: 'ID'},
        {key: 'name', label: 'NAME'},
        {key: 'createdDate', label: 'Created Date'},
        {key: 'priority', label: 'PRIORITY'},
        {key: 'processDefinitionId', label: 'PROCESS DEFINITION ID'}
      ];

    statuses = ['ALL', 'CREATED', 'CANCELLED', 'ASSIGNED', 'SUSPENDED', 'COMPLETED', 'DELETED'];

    directions = ['ASC', 'DESC'];

    editTaskFilter: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        public dialog: MatDialog, private taskFilterCloudService: TaskFilterCloudService) { }

    ngOnChanges(changes: SimpleChanges) {
        const taskFilter = changes['taskFilter'];
        if (taskFilter && taskFilter.currentValue) {
            this.buildForm();
        }
    }

    buildForm(): void {
        this.editTaskFilter = this.formBuilder.group({
            state: this.taskFilter.query.state,
            assignment: this.taskFilter.query.assignment,
            sort: this.taskFilter.query.sort,
            order: this.taskFilter.query.order
        });
        this.onFilterChange();
    }

    onFilterChange() {
        this.editTaskFilter.valueChanges.subscribe(() => {
            const editedFilter = <FilterRepresentationModel> { name: this.taskFilter.name, query: new QueryModel(this.editTaskFilter.value) };
            if (JSON.stringify(editedFilter).toLowerCase() === JSON.stringify(this.taskFilter).toLowerCase()) {
                // this.isSave = false;
                // this.isDelete = true;
                this.filterChange.emit(this.taskFilter);
            } else {
                this.isSave = true;
                this.isDelete = false;
                this.editedFilter = new FilterRepresentationModel(editedFilter);
                this.editedFilter.query.appName = this.taskFilter.query.appName;
                this.filterChange.emit(editedFilter);
            }
        });
    }

    onSaveAs() {
        const dialogRef = this.dialog.open(TaskFilterDialogCloudComponent, {
            data: {
                name: this.taskFilter.name
            },
            height: 'auto',
            minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.actions === 'SAVE') {
                this.editedFilter.name = result.name;
                this.editedFilter.icon = result.icon;
                this.saveFilter(this.editedFilter);
            } else {
                this.onDelete();
            }
        });
    }

    saveFilter(filter: FilterRepresentationModel) {
        this.taskFilterCloudService.addFilter(filter);
        this.success.emit(filter);
        this.isSave = false;
        this.isDelete = true;
    }

    onDelete() {
        // TODO
    }
}
