/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    DataTableSchema,
    DataRowEvent,
    DataTableAdapter,
    CustomEmptyContentTemplateDirective,
    CustomLoadingContentTemplateDirective,
    DataRow,
    DataColumn,
    AppConfigService,
    PaginatedComponent,
    PaginationModel,
    UserPreferencesService,
    DataCellEvent,
    DEFAULT_PAGINATION,
    EmptyContentComponent,
    DataTableComponent,
    LoadingContentTemplateDirective,
    NoContentTemplateDirective,
    ObjectDataRow
} from '@alfresco/adf-core';
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ProcessService } from '../../services/process.service';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
    ProcessInstanceQueryRepresentation,
    ProcessInstanceQueryRepresentationSort,
    ProcessInstanceQueryRepresentationState,
    ResultListDataRepresentationProcessInstanceRepresentation
} from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

const PRESET_KEY = 'adf-process-list.presets';

export const processPresetsDefaultModel = {
    default: [
        {
            key: 'name',
            type: 'text',
            title: 'ADF_PROCESS_LIST.PROPERTIES.NAME',
            sortable: true
        },
        {
            key: 'created',
            type: 'text',
            title: 'ADF_PROCESS_LIST.PROPERTIES.CREATED',
            cssClass: 'hidden',
            sortable: true
        }
    ]
};

@Component({
    selector: 'adf-process-instance-list',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        EmptyContentComponent,
        TranslatePipe,
        DataTableComponent,
        LoadingContentTemplateDirective,
        NoContentTemplateDirective
    ],
    styleUrls: ['./process-list.component.css'],
    templateUrl: './process-list.component.html'
})
export class ProcessInstanceListComponent extends DataTableSchema implements OnChanges, AfterContentInit, PaginatedComponent {
    @ContentChild(CustomEmptyContentTemplateDirective)
    customEmptyContent: CustomEmptyContentTemplateDirective;

    @ContentChild(CustomLoadingContentTemplateDirective)
    customLoadingContent: CustomLoadingContentTemplateDirective;

    /** The id of the app. */
    @Input()
    appId: number;

    /** The Definition Id of the process. */
    @Input()
    processDefinitionId: string;

    /** The id of the process instance. */
    @Input()
    processInstanceId: string;

    /** Defines the state of the processes. */
    @Input()
    state: ProcessInstanceQueryRepresentationState;

    /**
     * Defines the sort ordering of the list.
     */
    @Input()
    sort: ProcessInstanceQueryRepresentationSort;

    /** The page number of the processes to fetch. */
    @Input()
    page: number = 0;

    /** The number of processes to fetch in each page. */
    @Input()
    size: number = DEFAULT_PAGINATION.maxItems;

    /** Data source to define the datatable. */
    @Input()
    data: DataTableAdapter;

    /** Toggles multiple row selection, which renders checkboxes at the beginning of each row */
    @Input()
    multiselect: boolean = false;

    /**
     * Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for
     * multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles default selection of the first row */
    @Input()
    selectFirstRow: boolean = true;

    /** Toggles the sticky header mode. */
    @Input()
    stickyHeader: boolean = false;

    /** Toggles custom context menu for the component. */
    @Input()
    showContextMenu: boolean = false;

    /** Enables column resizing for datatable */
    @Input()
    isResizingEnabled = false;

    /** Enables blur when resizing datatable columns */
    @Input()
    blurOnResize = true;

    /** Emitted before the context menu is displayed for a row. */
    @Output()
    showRowContextMenu = new EventEmitter<DataCellEvent>();

    /**
     * Resolver function is used to show dynamic complex column objects
     * see the docs to learn how to configure a resolverFn.
     */
    @Input()
    resolverFn: (row: DataRow, col: DataColumn) => any = null;

    /** Emitted when a row in the process list is clicked. */
    @Output()
    rowClick = new EventEmitter<string>();

    /** Emitted when the list of process instances has been loaded successfully from the server. */
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output()
    success = new EventEmitter<ResultListDataRepresentationProcessInstanceRepresentation>();

    /** Emitted when an error occurs while loading the list of process instances from the server. */
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output()
    error = new EventEmitter<any>();

    /** Emitted when rows are selected/unselected */
    @Output()
    rowsSelected = new EventEmitter<ObjectDataRow[]>();

    requestNode: ProcessInstanceQueryRepresentation;
    currentInstanceId: string;
    isLoading: boolean = true;
    rows: any[] = [];
    sorting: any[] = ['created', 'desc'];
    pagination: BehaviorSubject<PaginationModel>;

    constructor(private processService: ProcessService, private userPreferences: UserPreferencesService, appConfig: AppConfigService) {
        super(appConfig, PRESET_KEY, processPresetsDefaultModel);
        this.size = this.userPreferences.paginationSize;

        this.pagination = new BehaviorSubject<PaginationModel>({
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });
    }

    ngAfterContentInit() {
        this.createDatatableSchema();

        if (this.data?.getColumns().length === 0) {
            this.data.setColumns(this.columns);
        }

        if (this.appId != null) {
            this.reload();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes)) {
            if (this.isSortChanged(changes)) {
                this.sorting = this.sort ? this.sort.split('-') : this.sorting;
            }
            this.reload();
        }

        const presetColumnChanges = changes['presetColumn'];
        if (presetColumnChanges && !presetColumnChanges.firstChange) {
            this.columns = this.mergeJsonAndHtmlSchema();
        }
    }

    reload() {
        this.requestNode = this.createRequestNode();
        this.load(this.requestNode);
    }

    /**
     * Select the first instance of a list if present
     */
    selectFirst() {
        if (this.selectFirstRow) {
            if (!this.isListEmpty()) {
                const dataRow = this.rows[0];
                dataRow.isSelected = true;
                this.currentInstanceId = dataRow['id'];
            } else {
                this.currentInstanceId = null;
            }
        }
    }

    /**
     * Get the id of the current instance
     *
     * @returns instance id
     */
    getCurrentId(): string {
        return this.currentInstanceId;
    }

    /**
     * Check if the list is empty
     *
     * @returns `true` if list is empty, otherwise `false`
     */
    isListEmpty(): boolean {
        return !this.rows || this.rows.length === 0;
    }

    /**
     * Emit the event rowClick passing the current task id when the row is clicked
     *
     * @param event input event
     */
    onRowClick(event: DataRowEvent) {
        const item = event;

        this.currentInstanceId = item.value.getValue('id');
        this.rowClick.emit(this.currentInstanceId);
    }

    onRowCheckboxToggle(event: CustomEvent) {
        this.rowsSelected.emit([...event.detail.selection]);
    }

    /**
     * Emit the event rowClick passing the current task id when pressed the Enter key on the selected row
     *
     * @param event keyboard event
     */
    onRowKeyUp(event: CustomEvent<any>) {
        if (event.detail.keyboardEvent.key === 'Enter') {
            event.preventDefault();

            this.currentInstanceId = event.detail.row.getValue('id');
            this.rowClick.emit(this.currentInstanceId);
        }
    }

    onShowRowContextMenu(event: DataCellEvent) {
        this.showRowContextMenu.emit(event);
    }

    updatePagination(params: PaginationModel) {
        const needsReload = params.maxItems || params.skipCount;

        this.size = params.maxItems;
        this.page = this.currentPage(params.skipCount, params.maxItems);

        if (needsReload) {
            this.reload();
        }
    }

    currentPage(skipCount: number, maxItems: number): number {
        return skipCount && maxItems ? Math.floor(skipCount / maxItems) : 0;
    }

    private createRequestNode(): ProcessInstanceQueryRepresentation {
        return {
            appDefinitionId: this.appId,
            processDefinitionId: this.processDefinitionId,
            processInstanceId: this.processInstanceId,
            state: this.state,
            sort: this.sort,
            page: this.page,
            size: this.size,
            start: 0
        };
    }

    private isSortChanged(changes: SimpleChanges): boolean {
        const actualSort = changes['sort'];
        return actualSort?.currentValue && actualSort.currentValue !== actualSort.previousValue;
    }

    private isPropertyChanged(changes: SimpleChanges): boolean {
        let changed: boolean = false;

        const appId = changes['appId'];
        const processDefinitionId = changes['processDefinitionId'];
        const processInstanceId = changes['processInstanceId'];
        const state = changes['state'];
        const sort = changes['sort'];
        const page = changes['page'];
        const size = changes['size'];

        if (appId?.currentValue) {
            changed = true;
        } else if (processDefinitionId) {
            changed = true;
        } else if (processInstanceId) {
            changed = true;
        } else if (state?.currentValue) {
            changed = true;
        } else if (sort?.currentValue) {
            changed = true;
        } else if (page && page?.currentValue !== page.previousValue) {
            changed = true;
        } else if (size && size.currentValue !== size.previousValue) {
            changed = true;
        }
        return changed;
    }

    private load(requestNode: ProcessInstanceQueryRepresentation) {
        this.isLoading = true;
        this.processService
            .getProcesses(requestNode)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(
                (response) => {
                    this.rows = response.data;
                    this.selectFirst();
                    this.success.emit(response);
                    this.pagination.next({
                        count: (response.data || []).length,
                        maxItems: this.size,
                        skipCount: this.page * this.size,
                        totalItems: response.total
                    });
                },
                (error) => {
                    this.error.emit(error);
                }
            );
    }
}
