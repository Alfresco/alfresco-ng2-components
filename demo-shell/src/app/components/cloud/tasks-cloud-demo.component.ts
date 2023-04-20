/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TaskListCloudComponent, TaskListCloudSortingModel, TaskFilterCloudModel } from '@alfresco/adf-process-services-cloud';
import { UserPreferencesService, AppConfigService, DataCellEvent } from '@alfresco/adf-core';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudLayoutService } from './services/cloud-layout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const ACTION_SAVE_AS = 'saveAs';
const ACTION_DELETE = 'delete';
const TASK_FILTER_PROPERTY_KEYS = 'adf-edit-task-filter';

@Component({
    templateUrl: './tasks-cloud-demo.component.html'
})
export class TasksCloudDemoComponent implements OnInit, OnDestroy {
    @ViewChild('taskCloud')
    taskCloud: TaskListCloudComponent;

    appName: string = '';

    isFilterLoaded = false;

    selectedRow: any;

    sortArray: TaskListCloudSortingModel[];
    editedFilter: TaskFilterCloudModel;
    taskFilterProperties: any  = { filterProperties: [], sortProperties: [], actions: [] };

    filterId;
    multiselect: boolean;
    selectedRows: any[] = [];
    actionMenu: boolean;
    contextMenu: boolean;
    actions: any[] = [];
    selectedAction: { id: number; name: string; actionType: string};
    selectedContextAction: { id: number; name: string; actionType: string};
    testingMode: boolean;
    selectionMode: string;
    taskDetailsRedirection: boolean;

    private performAction$ = new Subject<any>();
    private onDestroy$ = new Subject<boolean>();

    constructor(
        private cloudLayoutService: CloudLayoutService,
        private route: ActivatedRoute,
        private router: Router,
        private userPreference: UserPreferencesService,
        private appConfig: AppConfigService) {

        const properties = this.appConfig.get<Array<any>>(TASK_FILTER_PROPERTY_KEYS);
        if (properties) {
            this.taskFilterProperties = properties;
        }
    }

    ngOnInit() {
        this.isFilterLoaded = false;
        this.route.parent.params.subscribe((params) => {
            this.appName = params.appName;
        });

        this.route.queryParams.subscribe((params) => {
            this.isFilterLoaded = true;
            this.onFilterChange(params);
            this.filterId = params.id;
        });

        this.cloudLayoutService.settings$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(settings => this.setCurrentSettings(settings));
        this.performContextActions();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    setCurrentSettings(settings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.testingMode = settings.testingMode;
            this.selectionMode = settings.selectionMode;
            this.taskDetailsRedirection = settings.taskDetailsRedirection;
            this.actionMenu = settings.actionMenu;
            this.contextMenu = settings.contextMenu;
            this.actions = settings.actions;
        }
    }

    onChangePageSize(event) {
        this.userPreference.paginationSize = event.maxItems;
    }

    resetSelectedRows() {
        this.selectedRows = [];
    }

    onRowClick(taskId) {
        if (!this.multiselect && this.selectionMode !== 'multiple' && this.taskDetailsRedirection) {
            this.router.navigate([`/cloud/${this.appName}/task-details/${taskId}`]);
        }
    }

    onRowsSelected(nodes) {
        this.resetSelectedRows();
        this.selectedRows = nodes.map((node) => node.obj);
    }

    onFilterChange(filter: any) {
        this.editedFilter = Object.assign({}, filter);
        this.sortArray = [new TaskListCloudSortingModel({ orderBy: this.editedFilter.sort, direction: this.editedFilter.order })];
    }

    onTaskFilterAction(filterAction: any) {

        if (filterAction.actionType === ACTION_DELETE) {
            this.cloudLayoutService.setCurrentTaskFilterParam({ index: 0 });
        } else {
            this.cloudLayoutService.setCurrentTaskFilterParam({ id: filterAction.filter.id });
        }

        if (filterAction.actionType === ACTION_SAVE_AS) {
            this.router.navigate([`/cloud/${this.appName}/tasks/`], { queryParams: filterAction.filter });
        }
    }

    onShowRowActionsMenu(event: DataCellEvent) {
        event.value.actions = this.actions;
    }

    onShowRowContextMenu(event: DataCellEvent) {
        event.value.actions = this.actions.map((action) => ({
                data: event.value.row['obj'],
                model: action,
                subject: this.performAction$

        }));
    }

    onExecuteRowAction(row: any) {
        const value = row.value.row['obj'].entry;
        const action = row.value.action;
        this.selectedAction = {id: value.id, name: value.name, actionType: action.title};
    }

    performContextActions() {
        this.performAction$
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((action: any) => {
            if (action) {
              this.onExecuteContextAction(action);
            }
          });
    }

    onExecuteContextAction(contextAction: any) {
        const value = contextAction.data.entry;
        const action = contextAction.model;
        this.selectedContextAction = {id: value.id, name: value.name, actionType: action.title};
    }
}
