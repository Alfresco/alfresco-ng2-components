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

import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {
    ProcessListCloudComponent,
    ProcessFilterCloudModel,
    ProcessListCloudSortingModel,
    ProcessFiltersCloudComponent
} from '@alfresco/adf-process-services-cloud';

import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferencesService, AppConfigService, DataCellEvent } from '@alfresco/adf-core';
import { CloudLayoutService, CloudServiceSettings } from './services/cloud-layout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pagination } from '@alfresco/js-api';

@Component({
    templateUrl: './processes-cloud-demo.component.html',
    styleUrls: ['./processes-cloud-demo.component.scss']
})
export class ProcessesCloudDemoComponent implements OnInit, OnDestroy {

    public static ACTION_SAVE_AS = 'saveAs';
    static PROCESS_FILTER_PROPERTY_KEYS = 'adf-edit-process-filter';

    @ViewChild('processCloud', { static: false })
    processCloud: ProcessListCloudComponent;

    @ViewChild('processFiltersCloud', { static: false })
    processFiltersCloud: ProcessFiltersCloudComponent;

    appName: string = '';
    isFilterLoaded: boolean;

    filterId: string = '';
    sortArray: any = [];
    selectedRow: any;
    multiselect: boolean;
    selectionMode: string;
    selectedRows: string[] = [];
    testingMode: boolean;
    actionMenu: boolean;
    contextMenu: boolean;
    actions: any[] = [];
    selectedAction: { id: number, name: string, actionType: string};
    selectedContextAction: { id: number, name: string, actionType: string};
    processFilterProperties: any  = { filterProperties: [], sortProperties: [], actions: [] };
    processDetailsRedirection: boolean;

    editedFilter: ProcessFilterCloudModel;

    private performAction$ = new Subject<any>();
    private onDestroy$ = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cloudLayoutService: CloudLayoutService,
        private userPreference: UserPreferencesService,
        private appConfig: AppConfigService) {
        const properties = this.appConfig.get<Array<any>>(ProcessesCloudDemoComponent.PROCESS_FILTER_PROPERTY_KEYS);
        if (properties) {
            this.processFilterProperties = properties;
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

    setCurrentSettings(settings: CloudServiceSettings) {
        if (settings) {
            this.multiselect = settings.multiselect;
            this.testingMode = settings.testingMode;
            this.selectionMode = settings.selectionMode;
            this.processDetailsRedirection = settings.processDetailsRedirection;
            this.actionMenu = settings.actionMenu;
            this.contextMenu = settings.contextMenu;
            this.actions = settings.actions;
        }
    }

    onChangePageSize(event: Pagination) {
        this.userPreference.paginationSize = event.maxItems;
    }

    resetSelectedRows() {
        this.selectedRows = [];
    }

    onRowClick(processInstanceId: string) {
        if (!this.multiselect && this.selectionMode !== 'multiple' && this.processDetailsRedirection) {
            this.router.navigate([`/cloud/${this.appName}/process-details/${processInstanceId}`]);
        }
    }

    onFilterChange(query: any) {
        this.editedFilter = Object.assign({}, query);
        this.sortArray = [
            new ProcessListCloudSortingModel({
                orderBy: this.editedFilter.sort,
                direction: this.editedFilter.order
            })
        ];
    }

    onProcessFilterAction(filterAction: any) {
        this.cloudLayoutService.setCurrentProcessFilterParam({ id: filterAction.filter.id });
        if (filterAction.actionType === ProcessesCloudDemoComponent.ACTION_SAVE_AS) {
            this.router.navigate([`/cloud/${this.appName}/processes/`], { queryParams: filterAction.filter });
        }
    }

    onRowsSelected(nodes) {
        this.resetSelectedRows();
        this.selectedRows = nodes.map((node) => node.obj.entry);
    }

    onShowRowActionsMenu(event: DataCellEvent) {
        event.value.actions = this.actions;
    }

    onShowRowContextMenu(event: DataCellEvent) {
        event.value.actions = this.actions.map((action) => {
            return {
                data: event.value.row['obj'],
                model: action,
                subject: this.performAction$

            };
        });
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
