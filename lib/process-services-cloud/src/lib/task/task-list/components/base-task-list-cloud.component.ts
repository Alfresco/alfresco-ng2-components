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

import { OnChanges, Input, SimpleChanges, Output, EventEmitter, ContentChild, AfterContentInit, OnDestroy, OnInit, Directive } from '@angular/core';
import {
    AppConfigService, UserPreferencesService,
    DataTableSchema, UserPreferenceValues,
    PaginatedComponent, PaginationModel,
    DataRowEvent, CustomEmptyContentTemplateDirective, DataCellEvent, DataRowActionEvent, DataRow, DataColumn, ObjectDataTableAdapter
} from '@alfresco/adf-core';
import { taskPresetsCloudDefaultModel } from '../models/task-preset-cloud.model';
import { TaskQueryCloudRequestModel } from '../../../models/filter-cloud-model';
import { BehaviorSubject, Subject } from 'rxjs';
import { TaskListCloudSortingModel } from '../../../models/task-list-sorting.model';
import { map, take, takeUntil } from 'rxjs/operators';
import { TaskCloudService } from '../../services/task-cloud.service';
import { PreferenceCloudServiceInterface } from '../../../services/preference-cloud.interface';
import { TasksListCloudPreferences } from '../models/tasks-cloud-preferences';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class BaseTaskListCloudComponent<T = unknown> extends DataTableSchema<T> implements OnChanges, AfterContentInit, PaginatedComponent, OnDestroy, OnInit {

    @ContentChild(CustomEmptyContentTemplateDirective)
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    /** The name of the application. */
    @Input()
    appName: string = '';

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

    /** Toggles the sticky header mode. */
    @Input()
    stickyHeader: boolean = false;

    /**
     * Specifies how the table should be sorted. The parameters are for BE sorting.
     */
    @Input()
    sorting: TaskListCloudSortingModel[];

    /** Toggles the data actions column. */
    @Input()
    showActions: boolean = false;

    /** Position of the actions dropdown menu. Can be "left" or "right". */
    @Input()
    actionsPosition: string = 'right'; // left|right

    /** Toggles custom context menu for the component. */
    @Input()
    showContextMenu: boolean = false;

    /** Toggles main datatable actions. */
    @Input()
    showMainDatatableActions: boolean = false;

    /** Toggles main datatable column resizing feature. */
    @Input()
    isResizingEnabled: boolean = false;

    /** Emitted before the context menu is displayed for a row. */
    @Output()
    showRowContextMenu = new EventEmitter<DataCellEvent>();

    /** Emitted before the actions menu is displayed for a row. */
    @Output()
    showRowActionsMenu = new EventEmitter<DataCellEvent>();

    /** Emitted when the user executes a row action. */
    @Output()
    executeRowAction = new EventEmitter<DataRowActionEvent>();

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
    isLoading = true;
    selectedInstances: any[];
    formattedSorting: any[];
    dataAdapter: ObjectDataTableAdapter | undefined;

    private defaultSorting = { key: 'startDate', direction: 'desc' };
    boundReplacePriorityValues: (row: DataRow, col: DataColumn) => any;

    private onDestroy$ = new Subject<boolean>();

    constructor(appConfigService: AppConfigService,
        private taskCloudService: TaskCloudService,
        private userPreferences: UserPreferencesService,
        presetKey: string,
        private cloudPreferenceService: PreferenceCloudServiceInterface) {
        super(appConfigService, presetKey, taskPresetsCloudDefaultModel);
        this.size = userPreferences.paginationSize;

        this.pagination = new BehaviorSubject<PaginationModel>({
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });

        this.boundReplacePriorityValues = this.replacePriorityValues.bind(this);
    }

    ngOnInit() {
        this.userPreferences
            .select(UserPreferenceValues.PaginationSize)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(pageSize => this.size = pageSize);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['sorting']) {
            this.formatSorting(changes['sorting'].currentValue);
        }
        if (changes['appName']) {
            this.retrieveTasksPreferences();
        }
        this.reload();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    private retrieveTasksPreferences(): void {
        this.isLoading = true;
        this.cloudPreferenceService.getPreferences(this.appName).pipe(
            take(1),
            map((preferences => {
                const preferencesList = preferences?.list?.entries ?? [];
                const columnsOrder = preferencesList.find(preference => preference.entry.key === TasksListCloudPreferences.columnOrder);
                const columnsVisibility = preferencesList.find(preference => preference.entry.key === TasksListCloudPreferences.columnsVisibility);
                const columnsWidths = preferencesList.find(preference => preference.entry.key === TasksListCloudPreferences.columnsWidths);

                return {
                    columnsOrder: columnsOrder ? JSON.parse(columnsOrder.entry.value) : undefined,
                    columnsVisibility: columnsVisibility ? JSON.parse(columnsVisibility.entry.value) : undefined,
                    columnsWidths: columnsWidths ? JSON.parse(columnsWidths.entry.value) : undefined
                };
            }))
        ).subscribe(({ columnsOrder, columnsVisibility, columnsWidths }) => {
            if (columnsOrder) {
                this.columnsOrder = columnsOrder;
            }

            if (columnsVisibility) {
                this.columnsVisibility = columnsVisibility;
            }

            if (columnsWidths) {
                this.columnsWidths = columnsWidths;
            }

            this.createDatatableSchema();
            this.createColumns();
            this.isLoading = false;
        }, (error) => {
            this.error.emit(error);
            this.isLoading = false;
        });
    }

    ngAfterContentInit(): void {
        this.retrieveTasksPreferences();
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
     * Reloads the task list
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

    onColumnOrderChanged(columnsWithNewOrder: DataColumn[]): void {
        this.columnsOrder = columnsWithNewOrder.map(column => column.id);
        this.createColumns();

        if (this.appName) {
            this.cloudPreferenceService.updatePreference(
                this.appName,
                TasksListCloudPreferences.columnOrder,
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

        if (this.appName) {
            this.cloudPreferenceService.updatePreference(
                this.appName,
                TasksListCloudPreferences.columnsVisibility,
                this.columnsVisibility
            );
        }

        this.reload();
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
                TasksListCloudPreferences.columnsWidths,
                this.columnsWidths
            );
        }
    }

    setSorting(sortDetail) {
        const sorting = sortDetail ? {
            orderBy: sortDetail.key,
            direction: sortDetail.direction.toUpperCase()
        } : { ... this.defaultSorting };
        this.sorting = [new TaskListCloudSortingModel(sorting)];
    }

    formatSorting(sorting: TaskListCloudSortingModel[]) {
        this.formattedSorting = this.isValidSorting(sorting) ? [
            sorting[0].orderBy,
            sorting[0].direction.toLocaleLowerCase()
        ] : null;
    }

    isValidSorting(sorting: TaskListCloudSortingModel[]) {
        return sorting && sorting.length && sorting[0].orderBy && sorting[0].direction;
    }

    replacePriorityValues(row: DataRow, column: DataColumn) {
        return column.key.split('.').reduce((source, key) => {
            if (key === 'priority' && source && typeof (source[key]) === 'number') {
                return source[key] = this.taskCloudService.getPriorityLabel(source[key]);
            }
            return source && typeof (source) === 'object' ? source[key] : undefined;
        }, row.obj);
    }

    abstract reload();
}
