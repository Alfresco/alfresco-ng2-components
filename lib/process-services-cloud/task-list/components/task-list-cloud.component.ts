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

import {
    Component, ContentChild, EventEmitter,
    OnChanges, Output, SimpleChanges, Input } from '@angular/core';
import { DataRowEvent, DataTableSchema, EmptyCustomContentDirective } from '@alfresco/adf-core';
import { AppConfigService, PaginatedComponent, UserPreferencesService, UserPreferenceValues, PaginationModel } from '@alfresco/adf-core';
import { BehaviorSubject } from 'rxjs';
import { TaskListCloudService } from '../services/task-list-cloud.service';
import { taskPresetsCloudDefaultModel } from '../models/task-preset-cloud.model';

@Component({
    selector: 'adf-tasklist',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent extends DataTableSchema implements OnChanges, PaginatedComponent {

    static PRESET_KEY = 'adf-task-list.presets';

    @Input()
    applicationName: string = '';

    @ContentChild(EmptyCustomContentDirective)
    emptyCustomContent: EmptyCustomContentDirective;

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

    size: number;
    currentInstanceId: string;
    selectedInstances: any[];
    isLoading: boolean = true;

    constructor(private taskListCloudService: TaskListCloudService,
                appConfigService: AppConfigService,
                private userPreferences: UserPreferencesService) {
        super(appConfigService, TaskListComponent.PRESET_KEY, taskPresetsCloudDefaultModel);
        this.userPreferences.select(UserPreferenceValues.PaginationSize).subscribe((pageSize) => {
            this.size = pageSize;
        });

        this.pagination = new BehaviorSubject<PaginationModel>(<PaginationModel>{
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes)) {
            // if (this.isSortChanged(changes)) {
            //     this.sorting = this.sort ? this.sort.split('-') : this.sorting;
            // }
            this.reload();
        }
    }

    // private isSortChanged(changes: SimpleChanges): boolean {
    //     const actualSort = changes['sort'];
    //     return actualSort && actualSort.currentValue && actualSort.currentValue !== actualSort.previousValue;
    // }

    private isPropertyChanged(changes: SimpleChanges): boolean {
        let changed: boolean = true;

        let landingTaskId = changes['landingTaskId'];
        let page = changes['page'];
        let size = changes['size'];
        if (landingTaskId && landingTaskId.currentValue && this.isEqualToCurrentId(landingTaskId.currentValue)) {
            changed = false;
        } else if (page && page.currentValue !== page.previousValue) {
            changed = true;
        } else if (size && size.currentValue !== size.previousValue) {
            changed = true;
        }

        return changed;
    }

    reload(): void {
        this.load();
    }

    private load(requestNode: TaskQueryRequestRepresentationModel) {
        this.isLoading = true;
        this.loadTasksByState().subscribe(
            (tasks) => {
                this.rows = this.optimizeNames(tasks.data);
                this.selectTask(this.landingTaskId);
                this.success.emit(tasks);
                this.isLoading = false;
                this.pagination.next({
                    count: tasks.data.length,
                    maxItems: this.size,
                    skipCount: this.page * this.size,
                    totalItems: tasks.total
                });
            }, (error) => {
                this.error.emit(error);
                this.isLoading = false;
            });
    }

    onRowClick(item: DataRowEvent) {
        this.currentInstanceId = item.value.getValue('id');
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
            this.currentInstanceId = event.detail.row.getValue('id');
            this.rowClick.emit(this.currentInstanceId);
        }
    }

    updatePagination(params: PaginationModel) {

    }

    private createRequestNode() {

        let requestNode = {
            appName: '',
            appVersion: '',
            assignee: '',
            claimedDate: null,
            createdDate: null,
            description: '',
            dueDate: null,
            id: '',
            name: '',
            owner: '',
            parentTaskId: '',
            priority: 0,
            processDefinitionId: '',
            processInstanceId: '',
            serviceFullName: '',
            serviceName: '',
            serviceType: '',
            serviceVersion: '',
            status: ''
        };
        return new TaskQueryRequestRepresentationModel(requestNode);
    }
}
