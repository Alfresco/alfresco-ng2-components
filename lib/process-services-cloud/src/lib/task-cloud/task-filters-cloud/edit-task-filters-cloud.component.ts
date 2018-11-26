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
import { TaskFilterCloudRepresentationModel } from '../models/filter-cloud.model';
import { TaskFilterDialogEvent } from '../models/task-filter-dialog-event';
import { TranslationService } from '@alfresco/adf-core';

@Component({
  selector: 'adf-cloud-edit-task-filters',
  templateUrl: './edit-task-filters-cloud.component.html',
  styleUrls: ['./edit-task-filters-cloud.component.scss']
})
export class EditTaskFiltersCloudComponent implements OnChanges {

    @Input()
    taskFilter: TaskFilterCloudRepresentationModel;

    @Output()
    save: EventEmitter<any> = new EventEmitter();

    @Output()
    delete: EventEmitter<any> = new EventEmitter();

    @Output()
    filterChange: EventEmitter<TaskFilterCloudRepresentationModel> = new EventEmitter();

    @Output()
    success: EventEmitter<TaskFilterCloudRepresentationModel> = new EventEmitter();

    isDelete = true;
    isSave = false;
    filterName = '';
    editedTaskFilter: TaskFilterCloudRepresentationModel;

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

    constructor(
        private formBuilder: FormBuilder,
        private translateService: TranslationService,
        public dialog: MatDialog, private taskFilterCloudService: TaskFilterCloudService) { }

    ngOnChanges(changes: SimpleChanges) {
        const taskFilter = changes['taskFilter'];
        if (taskFilter && taskFilter.currentValue) {
            this.disableSaveButton();
            this.buildForm();
        }
    }

    buildForm() {
        this.editTaskFilterForm = this.formBuilder.group({
            state: this.taskFilter.query.state,
            assignment: this.taskFilter.query.assignment,
            sort: this.taskFilter.query.sort,
            order: this.taskFilter.query.order
        });
        this.onFilterChange();
    }

    onFilterChange() {
        this.editTaskFilterForm.valueChanges.subscribe(() => {
            const editedQuery = new QueryModel(this.editTaskFilterForm.value);
            editedQuery.appName = this.taskFilter.query.appName;
            editedQuery.assignment = this.taskFilter.query.assignment;
            if (JSON.stringify(editedQuery).toLowerCase() === JSON.stringify(this.taskFilter.query).toLowerCase()) {
                this.disableSaveButton();
                this.filterChange.emit(this.taskFilter);
            } else {
                this.enableSaveButton();
                this.editedTaskFilter = new TaskFilterCloudRepresentationModel(
                    {
                        id: this.taskFilter.id,
                        name: this.taskFilter.name,
                        key: this.taskFilter.key,
                        icon: this.taskFilter.icon,
                        query: editedQuery
                    });
                this.filterChange.emit(this.editedTaskFilter);
            }
        });
    }

    onSaveAs() {
        this.translateFilterName();
        const dialogRef = this.dialog.open(TaskFilterDialogCloudComponent, {
            data: {
                name: this.filterName
            },
            height: 'auto',
            minWidth: '30%'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.action === TaskFilterDialogEvent.ACTION_SAVE) {
                this.editedTaskFilter.name = result.name;
                this.editedTaskFilter.icon = result.icon;
                this.editedTaskFilter.id = Math.random().toString(36).substr(2, 9),
                this.saveFilter(this.editedTaskFilter);
            }
        });
    }

    saveFilter(filter: TaskFilterCloudRepresentationModel) {
        this.taskFilterCloudService.addFilter(filter);
        this.success.emit(filter);
        this.disableSaveButton();
    }

    translateFilterName() {
        this.translateService.get(this.taskFilter.name).subscribe((message) => {
            this.filterName = message;
        });
    }

    disableSaveButton() {
        this.isSave = false;
        this.isDelete = true;
    }

    enableSaveButton() {
        this.isSave = true;
        this.isDelete = false;
    }

    onDelete() {
        this.taskFilterCloudService.deleteFilter(this.taskFilter);
        this.delete.emit();
    }
}
