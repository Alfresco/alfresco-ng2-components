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

import { Component, ViewEncapsulation, OnChanges, AfterContentInit, ContentChild, Output, EventEmitter, SimpleChanges, Input, ViewChild, Inject } from '@angular/core';
import { DataTableSchema, PaginatedComponent,
         CustomEmptyContentTemplateDirective, AppConfigService,
         UserPreferencesService, PaginationModel,
         UserPreferenceValues, DataRowEvent, CustomLoadingContentTemplateDirective, DataCellEvent, DataRowActionEvent, DataTableComponent, DataColumn } from '@alfresco/adf-core';
import { ProcessListCloudService } from '../services/process-list-cloud.service';
import { BehaviorSubject, of } from 'rxjs';
import { processCloudPresetsDefaultModel } from '../models/process-cloud-preset.model';
import { ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { ProcessListCloudSortingModel } from '../models/process-list-sorting.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { ProcessListCloudPreferences } from '../models/process-cloud-preferences';
import { ProcessListDatatableAdapter } from '../datatable/process-list-datatable-adapter';
import { ProcessListDataColumnCustomData, PROCESS_LIST_CUSTOM_VARIABLE_COLUMN } from '../../../models/data-column-custom-data';
import { VariableMapperService } from '../../../services/variable-mapper.sevice';

const PRESET_KEY = 'adf-cloud-process-list.presets';

@Component({
    selector: 'adf-cloud-process-list',
    templateUrl: './process-list-cloud.component.html',
    styleUrls: ['./process-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessListCloudComponent extends DataTableSchema<ProcessListDataColumnCustomData> implements OnChanges, AfterContentInit, PaginatedComponent {
    @ViewChild(DataTableComponent)
    dataTable: DataTableComponent;

    @ContentChild(CustomEmptyContentTemplateDirective)
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    @ContentChild(CustomLoadingContentTemplateDirective)
    customLoadingContent: CustomLoadingContentTemplateDirective;

    /** The name of the application. */
    @Input()
    appName: string = '';

    /** The version of the application. */
    @Input()
    appVersion: number | number[];

    /** Name of the initiator of the process. */
    @Input()
    initiator: string = '';

    /** Filter the processes to display only the ones with this ID. */
    @Input()
    id: string = '';

    /** Filter the processes to display only the ones with this environment ID. */
    @Input()
    environmentId: string;

    /** Filter the processes to display only the ones with this name. */
    @Input()
    name: string = '';

    /** Filter the processes to display only the ones with this process definition ID. */
    @Input()
    processDefinitionId: string = '';

    /** Filter the processes to display only the ones with this process definition name. */
    @Input()
    processDefinitionName: string = '';

    /** Filter the processes to display only the ones with this process definition key. */
    @Input()
    processDefinitionKey: string = '';

    /** Filter the processes to display only the ones with this status. */
    @Input()
    status: string = '';

    /** Filter the processes to display only the ones with this businessKey value. */
    @Input()
    businessKey: string = '';

    /** Filter the processes. Display only process with lastModifiedTo equal to the supplied date. */
    @Input()
    lastModifiedFrom: Date;

    /** Filter the processes. Display only process with lastModifiedTo equal to the supplied date. */
    @Input()
    lastModifiedTo: Date;

    /** Filter the processes. Display only process with startedDate greater then the supplied date. */
    @Input()
    startFrom: string = '';

    /** Filter the processes. Display only process with startedDate less than the supplied date. */
    @Input()
    startTo: string = '';

    /** Filter the processes. Display only process with completedFrom equal to the supplied date. */
    @Input()
    completedFrom: string = '';

    /** Filter the processes. Display only process with completedTo equal to the supplied date. */
    @Input()
    completedTo: string = '';

    /** Filter the processes. Display only process with completedDate equal to the supplied date. */
    @Input()
    completedDate: string = '';

    /** Filter the processes. Display only process with suspendedFrom equal to the supplied date. */
    @Input()
    suspendedFrom: string = '';

    /** Filter the processes. Display only process with suspendedTo equal to the supplied date. */
    @Input()
    suspendedTo: string = '';

    /**
     * Row selection mode. Can be "none", "single" or "multiple".
     * For multiple mode, you can use Cmd (macOS) or Ctrl (Win) modifier
     * key to toggle selection for multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles multiple row selection and renders checkboxes at the beginning of each row */
    @Input()
    multiselect: boolean = false;

    /**
     * Array of objects specifying the sort order and direction for the
     * list. The sort parameters are for BE sorting.
     */
    @Input()
    sorting: ProcessListCloudSortingModel[];

    /** Toggles the data actions column. */
    @Input()
    showActions: boolean = false;

    /** Position of the actions dropdown menu. Can be "left" or "right". */
    @Input()
    actionsPosition: string = 'right'; // left|right

    /** Toggles the sticky header mode. */
    @Input()
    stickyHeader: boolean = false;

    /** Toggles custom context menu for the component. */
    @Input()
    showContextMenu: boolean = false;

    /** Toggle main datatable actions. */
    @Input()
    showMainDatatableActions: boolean = false;

    /** Toggles main datatable column resizing feature. */
    @Input()
    isResizingEnabled: boolean = false;

    /** Emitted when a row in the process list is clicked. */
    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when rows are selected/unselected. */
    @Output()
    rowsSelected: EventEmitter<any[]> = new EventEmitter<any[]>();

    /** Emitted before the context menu is displayed for a row. */
    @Output()
    showRowContextMenu = new EventEmitter<DataCellEvent>();

    /** Emitted before the actions menu is displayed for a row. */
    @Output()
    showRowActionsMenu = new EventEmitter<DataCellEvent>();

    /** Emitted when the user executes a row action. */
    @Output()
    executeRowAction = new EventEmitter<DataRowActionEvent>();

    /** Emitted when an error occurs while loading the list of process instances from the server. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the list of process instances has been loaded successfully from the server. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    pagination: BehaviorSubject<PaginationModel>;
    size: number;
    skipCount: number = 0;
    currentInstanceId: string;
    selectedInstances: any[];
    isLoading = true;

    rows: any[] = [];
    formattedSorting: any[];
    requestNode: ProcessQueryCloudRequestModel;
    dataAdapter: ProcessListDatatableAdapter;

    private defaultSorting = { key: 'startDate', direction: 'desc' };

    constructor(private processListCloudService: ProcessListCloudService,
                appConfigService: AppConfigService,
                private userPreferences: UserPreferencesService,
                @Inject(PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN) private cloudPreferenceService: PreferenceCloudServiceInterface,
                private variableMapperService: VariableMapperService
            ) {
        super(appConfigService, PRESET_KEY, processCloudPresetsDefaultModel);
        this.size = userPreferences.paginationSize;
        this.userPreferences.select(UserPreferenceValues.PaginationSize).subscribe((pageSize) => {
            this.size = pageSize;
        });
        this.pagination = new BehaviorSubject<PaginationModel>({
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });
    }

    ngAfterContentInit() {
        this.cloudPreferenceService.getPreferences(this.appName)
            .pipe(
                take(1),
                map((preferences => {
                    const preferencesList = preferences?.list?.entries ?? [];
                    const columnsOrder = preferencesList.find(preference => preference.entry.key === ProcessListCloudPreferences.columnOrder);
                    const columnsVisibility = preferencesList.find(preference => preference.entry.key === ProcessListCloudPreferences.columnsVisibility);
                    const columnsWidths = preferencesList.find(preference => preference.entry.key === ProcessListCloudPreferences.columnsWidths);

                    return {
                        columnsOrder: columnsOrder ? JSON.parse(columnsOrder.entry.value) : undefined,
                        columnsVisibility: columnsVisibility ? JSON.parse(columnsVisibility.entry.value) : this.columnsVisibility,
                        columnsWidths: columnsWidths ? JSON.parse(columnsWidths.entry.value) : undefined
                    };
                }))
            )
            .subscribe(({ columnsOrder, columnsVisibility, columnsWidths }) => {
                if (columnsVisibility) {
                    this.columnsVisibility = columnsVisibility;
                }

                if (columnsOrder) {
                    this.columnsOrder = columnsOrder;
                }


                if (columnsWidths) {
                    this.columnsWidths = columnsWidths;
                }

                this.createDatatableSchema();
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes, 'sorting')) {
            this.formatSorting(changes['sorting'].currentValue);
        }
        if (this.isAnyPropertyChanged(changes)) {
            this.reload();
        }
    }

    getCurrentId(): string {
        return this.currentInstanceId;
    }

    reload() {
        if (this.appName || this.appName === '') {
            this.load();
        } else {
            this.rows = [];
        }
    }

    private load() {
        this.isLoading = true;

        this.isColumnSchemaCreated$.pipe(
            take(1),
            switchMap(() => of(this.createRequestNode())),
            tap((requestNode) => this.requestNode = requestNode),
            switchMap((requestNode) => this.processListCloudService.getProcessByRequest(requestNode))
        ).subscribe((processes) => {
            this.rows = this.variableMapperService.mapVariablesByColumnTitle(
                processes.list.entries,
                this.columns
            );

            this.dataAdapter = new ProcessListDatatableAdapter(this.rows, this.columns);

            this.success.emit(processes);
            this.isLoading = false;
            this.pagination.next(processes.list.pagination);
        }, (error) => {
            this.error.emit(error);
            this.isLoading = false;
        });
    }

    private isAnyPropertyChanged(changes: SimpleChanges): boolean {
        for (const property in changes) {
            if (this.isPropertyChanged(changes, property)) {
                return true;
            }
        }
        return false;
    }

    private isPropertyChanged(changes: SimpleChanges, property: string): boolean {
        return changes.hasOwnProperty(property);
    }

    isListEmpty(): boolean {
        return !this.rows || this.rows.length === 0;
    }

    /**
     * Resets the pagination values
     */
    resetPagination() {
        this.skipCount = 0;
        this.size = this.userPreferences.paginationSize;
        this.pagination.next({
            skipCount: 0,
            maxItems: this.size
        });
    }

    /**
     * Resets the pagination values and
     * Reloads the process list
     *
     * @param pagination Pagination values to be set
     */
    updatePagination(pagination: PaginationModel) {
        this.size = pagination.maxItems;
        this.skipCount = pagination.skipCount;
        this.pagination.next(pagination);
        this.reload();
    }

    onSortingChanged(event: CustomEvent) {
        this.setSorting(event.detail);
        this.formatSorting(this.sorting);
        this.reload();
    }

    onColumnOrderChanged(columnsWithNewOrder: DataColumn[]): void {
        this.columnsOrder = columnsWithNewOrder.map(column => column.id);
        this.createColumns();

        if (this.appName) {
            this.cloudPreferenceService.updatePreference(
                this.appName,
                ProcessListCloudPreferences.columnOrder,
                this.columnsOrder
            );
        }
    }

    onColumnsVisibilityChange(columns: DataColumn[]): void {
        this.columnsVisibility = columns.reduce((visibleColumnsMap, column) => {
            if (column.isHidden !== undefined) {
                visibleColumnsMap[column.id] = !column.isHidden;
            }

            return visibleColumnsMap;
        }, {});

        this.createColumns();
        this.reload();

        if (this.appName) {
            this.cloudPreferenceService.updatePreference(
                this.appName,
                ProcessListCloudPreferences.columnsVisibility,
                this.columnsVisibility
            );
        }
    }

    onColumnsWidthChanged(columns: DataColumn[]): void {
        const newColumnsWidths = columns.reduce((widthsColumnsMap, column) => {
            if (column.width) {
                widthsColumnsMap[column.id] = Math.ceil(column.width);
            }
            return widthsColumnsMap;
        }, {});

        this.columnsWidths = {...this.columnsWidths, ...newColumnsWidths};

        this.createColumns();

        if (this.appName) {
            this.cloudPreferenceService.updatePreference(
                this.appName,
                ProcessListCloudPreferences.columnsWidths,
                this.columnsWidths
            );
        }
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

    onShowRowActionsMenu(event: DataCellEvent) {
        this.showRowActionsMenu.emit(event);
    }

    onShowRowContextMenu(event: DataCellEvent) {
        this.showRowContextMenu.emit(event);
    }

    onExecuteRowAction(row: DataRowActionEvent) {
        this.executeRowAction.emit(row);
    }

    private createRequestNode(): ProcessQueryCloudRequestModel {
        const requestNode = {
            appName: this.appName,
            appVersion: this.getAppVersions(),
            maxItems: this.size,
            skipCount: this.skipCount,
            initiator: this.initiator,
            id: this.id,
            environmentId: this.environmentId,
            name: this.name,
            processDefinitionId: this.processDefinitionId,
            processDefinitionName: this.processDefinitionName,
            processDefinitionKey: this.processDefinitionKey,
            status: this.status,
            businessKey: this.businessKey,
            lastModifiedFrom: this.lastModifiedFrom,
            lastModifiedTo: this.lastModifiedTo,
            startFrom: this.startFrom,
            startTo: this.startTo,
            completedFrom: this.completedFrom,
            completedTo: this.completedTo,
            suspendedFrom: this.suspendedFrom,
            suspendedTo: this.suspendedTo,
            completedDate: this.completedDate,
            sorting: this.sorting,
            variableKeys: this.getVariableDefinitionsRequestModel()
        };

        return new ProcessQueryCloudRequestModel(requestNode);
    }

    getAppVersions(): string {
        return this.appVersion instanceof Array ? this.appVersion.join(',') : (this.appVersion ? String(this.appVersion) : '');
    }

    setSorting(sortDetail) {
        const sorting = sortDetail ? {
            orderBy: sortDetail.key,
            direction: sortDetail.direction.toUpperCase()
        } : { ... this.defaultSorting };
        this.sorting = [new ProcessListCloudSortingModel(sorting)];
    }

    formatSorting(sorting: ProcessListCloudSortingModel[]) {
        this.formattedSorting = this.isValidSorting(sorting) ? [
            sorting[0].orderBy,
            sorting[0].direction.toLocaleLowerCase()
        ] : null;
    }

    isValidSorting(sorting: ProcessListCloudSortingModel[]) {
        return sorting.length && sorting[0].orderBy && sorting[0].direction;
    }

    private getVariableDefinitionsRequestModel(): string[] | undefined {
        const displayedVariableColumns = this.columns
            .filter(column =>
                column.customData?.columnType === PROCESS_LIST_CUSTOM_VARIABLE_COLUMN &&
                column.isHidden !== true
            )
            .map(column => {
                const variableDefinitionsPayload = column.customData.variableDefinitionsPayload;
                return variableDefinitionsPayload;
            })
            .reduce((variablesPayload, payload) => [...variablesPayload, ...payload], []);

        return displayedVariableColumns.length ? displayedVariableColumns : undefined;
    }
}
