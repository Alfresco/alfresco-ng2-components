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

import { Component, ViewEncapsulation, OnChanges, Input, SimpleChanges, Output, EventEmitter, ContentChild, AfterContentInit } from '@angular/core';
import { AppConfigService, UserPreferencesService,
         DataTableSchema, UserPreferenceValues,
         PaginatedComponent, PaginationModel,
         DataRowEvent, CustomEmptyContentTemplateDirective } from '@alfresco/adf-core';
import { taskPresetsCloudDefaultModel } from '../models/task-preset-cloud.model';
import { TaskQueryCloudRequestModel } from '../models/filter-cloud-model';
import { BehaviorSubject } from 'rxjs';
import { TaskListCloudService } from '../services/task-list-cloud.service';
import { TaskListCloudSortingModel } from '../models/task-list-sorting.model';

@Component({
  selector: 'adf-cloud-task-list',
  templateUrl: './task-list-cloud.component.html',
  styleUrls: ['./task-list-cloud.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TaskListCloudComponent extends DataTableSchema implements OnChanges, AfterContentInit, PaginatedComponent {

    static PRESET_KEY = 'adf-cloud-task-list.presets';

    @ContentChild(CustomEmptyContentTemplateDirective)
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    /** The name of the application. */
    @Input()
    appName: string = '';

    /**
     * The assignee of the process. Possible values are: "assignee" (the current user is the assignee),
     * "candidate" (the current user is a task candidate", "group_x" (the task is assigned to a group
     * where the current user is a member, no value (the current user is involved).
     */
    @Input()
    assignee: string = '';

    /** Filter the tasks. Display only tasks created on the supplied date. */
    @Input()
    createdDate: string = '';

    /** Filter the tasks. Display only tasks with dueDate equal to the supplied date. */
    @Input()
    dueDate: string = '';

    /** Filter the tasks. Display only tasks with lastModifiedFrom equal to the supplied date. */
    @Input()
    lastModifiedFrom: string = '';

    /** Filter the tasks. Display only tasks with lastModifiedTo equal to the supplied date. */
    @Input()
    lastModifiedTo: string = '';

    /** Filter the tasks. Display only tasks with id equal to the supplied value. */
    @Input()
    id: string = '';

    /** Filter the tasks. Display only tasks with the supplied name. */
    @Input()
    name: string = '';

    /** Filter the tasks. Display only tasks with parentTaskId equal to the supplied value. */
    @Input()
    parentTaskId: string = '';

    /** Filter the tasks. Display only tasks with processDefinitionId equal to the supplied value. */
    @Input()
    processDefinitionId: string = '';

    /** Filter the tasks. Display only tasks with processInstanceId equal to the supplied value. */
    @Input()
    processInstanceId: string = '';

    /** Filter the tasks. Display only tasks with status equal to the supplied value. */
    @Input()
    status: string = '';

    /** Filter the tasks. Display only tasks with owner equal to the supplied value. */
    @Input()
    owner: string = '';

    /** Filter the tasks. Display only tasks with priority equal to the supplied value. */
    @Input()
    priority: number;

    /** Filter the tasks. Display only the tasks that belong to a process in case is false or tasks that doesn't belong to a process in case of true. */
    @Input()
    standAlone: boolean = false;

    /**
     * Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use the Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for
     * multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles multiple row selection, rendering a checkbox at the beginning of each row. */
    @Input()
    multiselect: boolean = false;

    /**
     * Specifies how the table should be sorted. The parameters are for BE sorting.
     */
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
        if (this.isPropertyChanged(changes)) {
            this.reload();
        }
    }

    ngAfterContentInit() {
        this.createDatatableSchema();
    }

    getCurrentId(): string {
        return this.currentInstanceId;
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
                this.success.emit(tasks);
                this.isLoading = false;
                this.pagination.next(tasks.list.pagination);
            }, (error) => {
                this.error.emit(error);
                this.isLoading = false;
            });
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
            appName: this.appName,
            assignee: this.assignee,
            id: this.id,
            name: this.name,
            parentTaskId: this.parentTaskId,
            processDefinitionId: this.processDefinitionId,
            processInstanceId: this.processInstanceId,
            owner: this.owner,
            priority: this.priority,
            lastModifiedFrom: this.lastModifiedFrom,
            lastModifiedTo: this.lastModifiedTo,
            status: this.status,
            dueDate: this.dueDate,
            createdDate: this.createdDate,
            maxItems: this.size,
            skipCount: this.skipCount,
            sorting: this.sorting
        };
        return new TaskQueryCloudRequestModel(requestNode);
    }

}
