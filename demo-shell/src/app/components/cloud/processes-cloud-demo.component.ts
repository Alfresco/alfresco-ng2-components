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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { EditProcessFilterCloudComponent, ProcessFilterAction, ProcessFilterCloudModel, ProcessFilterCloudService } from '@alfresco/adf-process-services-cloud';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferencesService, DataCellEvent } from '@alfresco/adf-core';
import { CloudLayoutService, CloudServiceSettings } from './services/cloud-layout.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Pagination } from '@alfresco/js-api';
import { CloudProcessFiltersService } from './services/cloud-process-filters.service';

@Component({
    templateUrl: './processes-cloud-demo.component.html'
})
export class ProcessesCloudDemoComponent implements OnInit, OnDestroy {
    appName: string = '';
    isFilterLoaded = false;

    filterId: string = '';
    selectedRow: any;
    multiselect: boolean;
    selectionMode: string;
    selectedRows: any[] = [];
    testingMode: boolean;
    actionMenu: boolean;
    contextMenu: boolean;
    actions: any[] = [];
    selectedAction: { id: number, name: string, actionType: string};
    selectedContextAction: { id: number, name: string, actionType: string};

    filterProperties: string[];
    filterSortProperties: string[];
    filterActions: string[];

    processDetailsRedirection: boolean;

    editedFilter: ProcessFilterCloudModel;

    private performAction$ = new Subject<any>();
    private onDestroy$ = new Subject<boolean>();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cloudLayoutService: CloudLayoutService,
        private cloudProcessFiltersService: CloudProcessFiltersService,
        private processFilterCloudService: ProcessFilterCloudService,
        private userPreference: UserPreferencesService) {
    }

    ngOnInit() {
        this.filterProperties = this.cloudProcessFiltersService.filterProperties;
        this.filterSortProperties = this.cloudProcessFiltersService.sortProperties;
        this.filterActions = this.cloudProcessFiltersService.actions;

        this.route.queryParams.subscribe((params) => {
            this.isFilterLoaded = true;

            this.appName = params.appName;
            this.filterId = params.id;

            const model = this.cloudProcessFiltersService.readQueryParams(params);
            this.loadFilter(model);
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

    getInitiatorValue(): string {
        return this.editedFilter.initiator?.map(initiator => initiator.username).join(',');
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

    onFilterChange(filter: ProcessFilterCloudModel) {
        const queryParams = this.cloudProcessFiltersService.writeQueryParams(filter, this.appName, this.filterId);
        this.router.navigate([`/cloud/${this.appName}/processes/`], {queryParams});
    }

    onProcessFilterAction(filterAction: ProcessFilterAction) {
        if (filterAction.actionType === EditProcessFilterCloudComponent.ACTION_DELETE) {
            this.cloudLayoutService.setCurrentProcessFilterParam({ index: 0 });
        } else {
            this.cloudLayoutService.setCurrentProcessFilterParam({ id: filterAction.filter.id });
        }

        if ([EditProcessFilterCloudComponent.ACTION_SAVE, EditProcessFilterCloudComponent.ACTION_SAVE_AS].includes(filterAction.actionType)) {
            this.onFilterChange(filterAction.filter);
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

    private loadFilter(model: ProcessFilterCloudModel) {
        if (model && model.appName && model.id) {
            this.processFilterCloudService.getFilterById(model.appName, model.id).subscribe(filter => {
                this.editedFilter = Object.assign({}, filter, model);
            });
        }
    }
}
