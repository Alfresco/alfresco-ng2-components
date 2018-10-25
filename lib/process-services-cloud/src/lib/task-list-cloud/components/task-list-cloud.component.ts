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

import { Component, ViewEncapsulation, OnChanges, Input, SimpleChanges, Output, EventEmitter, ContentChild, AfterContentInit, SimpleChange } from '@angular/core';
import { AppConfigService, UserPreferencesService,
         DataTableSchema, UserPreferenceValues,
         PaginatedComponent, PaginationModel,
         DataRowEvent, EmptyCustomContentDirective } from '@alfresco/adf-core';
import { taskPresetsCloudDefaultModel } from '../models/task-preset-cloud.model';
import { TaskQueryCloudRequestModel } from '../models/filter-cloud-model';
import { BehaviorSubject } from 'rxjs';
import { TaskListCloudService } from '../services/task-list-cloud.service';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { TaskListCloudSortingModel } from '../models/task-list-sorting.model';

@Component({
  selector: 'adf-cloud-task-list',
  templateUrl: './task-list-cloud.component.html',
  styleUrls: ['./task-list-cloud.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TaskListCloudComponent extends DataTableSchema implements OnChanges, AfterContentInit, PaginatedComponent {

    static PRESET_KEY = 'adf-cloud-task-list.presets';

    @ContentChild(EmptyCustomContentDirective)
    emptyCustomContent: EmptyCustomContentDirective;

    @Input()
    applicationName: string = '';

    @Input()
    assignee: string = '';

    @Input()
    createdDate: string = '';

    @Input()
    dueDate: string = '';

    @Input()
    id: string = '';

    @Input()
    name: string = '';

    @Input()
    parentTaskId: string = '';

    @Input()
    processDefinitionId: string = '';

    @Input()
    processInstanceId: string = '';

    @Input()
    status: string = '';

    @Input()
    selectFirstRow: boolean = true;

    @Input()
    landingTaskId: string;

    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles multiple row selection, renders checkboxes at the beginning of each row */
    @Input()
    multiselect: boolean = false;

    @Input()
    sorting: TaskListCloudSortingModel[];

    /** Emitted when a task in the list is clicked */
    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when rows are selected/unselected */
    @Output()
    rowsSelected: EventEmitter<any[]> = new EventEmitter<any[]>();

    /** Emitted when the task list is loaded */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    pagination: BehaviorSubject<PaginationModel>;

    requestNode: TaskQueryCloudRequestModel;
    rows: any[] = [];
    size: number;
    skipCount: number = 0;
    currentInstanceId: any;
    isLoading = false;
    selectedInstances: any[];

    constructor(private taskListCloudService: TaskListCloudService,
                appConfigService: AppConfigService,
                private userPreferences: UserPreferencesService) {
        super(appConfigService, TaskListCloudComponent.PRESET_KEY, taskPresetsCloudDefaultModel);
        this.size = userPreferences.paginationSize;
        this.userPreferences.select(UserPreferenceValues.PaginationSize).subscribe((pageSize) => {
            this.size = pageSize;
        });

        this.pagination = new BehaviorSubject<PaginationModel>(<PaginationModel> {
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes) &&
            !this.isEqualToCurrentId(changes['landingTaskId'])) {
            this.reload();
        }
    }

    ngAfterContentInit() {
        this.createDatatableSchema();
    }

    getCurrentId(): string {
        return this.currentInstanceId;
    }

    isEqualToCurrentId(landingTaskChanged: SimpleChange): boolean {
        return landingTaskChanged && this.currentInstanceId === landingTaskChanged.currentValue;
    }

    private isPropertyChanged(changes: SimpleChanges): boolean {
        for (let property in changes) {
            if (changes.hasOwnProperty(property)) {
                if (changes[property] &&
                    (changes[property].currentValue !== changes[property].previousValue)) {
                    return true;
                }
            }
        }
        return false;
    }

    reload() {
        this.requestNode = this.createRequestNode();
        if (this.requestNode.appName) {
            this.load(this.requestNode);
        } else {
            this.rows = [];
        }
    }

    private load(requestNode: TaskQueryCloudRequestModel) {
        this.isLoading = true;
        this.taskListCloudService.getTaskByRequest(requestNode).subscribe(
            (tasks) => {
                this.rows = tasks.list.entries;
                this.selectTask(this.landingTaskId);
                this.success.emit(tasks);
                this.isLoading = false;
                this.pagination.next(tasks.list.pagination);
            }, (error) => {
                this.error.emit(error);
                this.isLoading = false;
            });
    }

    selectTask(taskIdSelected: string) {
        if (!this.isListEmpty()) {
            let dataRow: any = null;
            if (taskIdSelected) {
                dataRow = this.rows.find((currentRow: MinimalNodeEntity) => {
                    return currentRow.entry.id === taskIdSelected;
                });
            }
            if (!dataRow && this.selectFirstRow) {
                dataRow = this.rows[0];
            }
            if (dataRow) {
                dataRow.isSelected = true;
                this.currentInstanceId = dataRow.entry.id;
            }
        } else {
            this.currentInstanceId = null;
        }
    }

    isListEmpty(): boolean {
        return !this.rows || this.rows.length === 0;
    }

    updatePagination(pagination: PaginationModel) {
        this.size = pagination.maxItems;
        this.skipCount = pagination.skipCount;
        this.pagination.next(pagination);
        this.reload();
    }

    onRowClick(item: DataRowEvent) {
        this.currentInstanceId = item.value.getValue('entry.id');
        this.rowClick.emit(this.currentInstanceId);
    }

    onRowSelect(event: CustomEvent) {
        this.selectedInstances = [...event.detail.selection];
        this.rowsSelected.emit(this.selectedInstances);
    }

    onRowUnselect(event: CustomEvent) {
        this.selectedInstances = [...event.detail.selection];
        this.rowsSelected.emit(this.selectedInstances);
    }

    onRowKeyUp(event: CustomEvent) {
        if (event.detail.keyboardEvent.key === 'Enter') {
            event.preventDefault();
            this.currentInstanceId = event.detail.row.getValue('entry.id');
            this.rowClick.emit(this.currentInstanceId);
        }
    }

    private createRequestNode() {

        let requestNode = {
            appName: this.applicationName,
            assignee: this.assignee,
            id: this.id,
            name: this.name,
            parentTaskId: this.parentTaskId,
            processDefinitionId: this.processDefinitionId,
            processInstanceId: this.processInstanceId,
            status: this.status,
            maxItems: this.size,
            skipCount: this.skipCount,
            sorting: this.sorting
        };
        return new TaskQueryCloudRequestModel(requestNode);
    }

}
