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
    DataColumn,
    DataRowEvent,
    DataSorting,
    DataTableAdapter,
    ObjectDataColumn,
    ObjectDataRow,
    ObjectDataTableAdapter
} from '@alfresco/adf-core';
import {
    AppConfigService,
    DataColumnListComponent,
    PaginatedComponent,
    PaginationComponent,
    PaginationQueryParams,
    UserPreferencesService
} from '@alfresco/adf-core';
import { DatePipe } from '@angular/common';
import {
    AfterContentInit,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges
} from '@angular/core';
import { ProcessFilterParamRepresentationModel } from '../models/filter-process.model';
import { processPresetsDefaultModel } from '../models/process-preset.model';
import { ProcessService } from '../services/process.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Pagination } from 'alfresco-js-api';
import { ProcessListModel } from '../models/process-list.model';

@Component({
    selector: 'adf-process-instance-list',
    styleUrls: ['./process-list.component.css'],
    templateUrl: './process-list.component.html'
})
export class ProcessInstanceListComponent implements OnChanges, AfterContentInit, PaginatedComponent {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    /** The id of the app. */
    @Input()
    appId: number;

    /** The processDefinitionKey of the process. */
    @Input()
    processDefinitionKey: string;

    /** Defines the state of the processes. Possible values are `running`, `completed` and `all` */
    @Input()
    state: string;

    /** Defines the sort ordering of the list. Possible values are `created-desc`, `created-asc`,
     * `ended-desc`, `ended-asc`.
     */
    @Input()
    sort: string;

    /** The name of the list. */
    @Input()
    name: string;

    /** The presetColumn of the custom schema to fetch. */
    @Input()
    page: number = 0;

    @Input()
    size: number = PaginationComponent.DEFAULT_PAGINATION.maxItems;

    @Input()
    presetColumn: string;

    requestNode: ProcessFilterParamRepresentationModel;

    /** Data source to define the datatable. */
    @Input()
    data: DataTableAdapter;

    /** Emitted when a row in the process list is clicked. */
    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when the list of process instances has been loaded successfully from the server. */
    @Output()
    success: EventEmitter<ProcessListModel> = new EventEmitter<ProcessListModel>();

    /** Emitted when an error occurs while loading the list of process instances from the server. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    currentInstanceId: string;
    isLoading: boolean = true;
    layoutPresets = {};

    pagination: BehaviorSubject<Pagination>;

    constructor(private processService: ProcessService,
                private userPreferences: UserPreferencesService,
                private appConfig: AppConfigService) {
        this.size = this.userPreferences.paginationSize;

        this.pagination = new BehaviorSubject<Pagination>(<Pagination> {
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });
    }

    ngAfterContentInit() {
        this.loadLayoutPresets();
        this.setupSchema();

        if (this.appId) {
            this.reload();
        }
    }

    /**
     * Setup html-based (html definitions) or code behind (data adapter) schema.
     * If component is assigned with an empty data adater the default schema settings applied.
     */
    setupSchema() {
        let schema: DataColumn[] = [];

        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }

        if (!this.data) {
            this.data = new ObjectDataTableAdapter([], schema.length > 0 ? schema : this.getLayoutPreset(this.presetColumn));
        } else {
            if (schema && schema.length > 0) {
                this.data.setColumns(schema);
            } else if (this.data.getColumns().length === 0) {
                this.presetColumn ? this.setupDefaultColumns(this.presetColumn) : this.setupDefaultColumns();
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes)) {
            this.reload();
        }
    }

    private isPropertyChanged(changes: SimpleChanges): boolean {
        let changed: boolean = false;

        let appId = changes['appId'];
        let processDefinitionKey = changes['processDefinitionKey'];
        let state = changes['state'];
        let sort = changes['sort'];
        let name = changes['name'];
        let page = changes['page'];
        let size = changes['size'];

        if (appId && appId.currentValue) {
            changed = true;
        } else if (processDefinitionKey && processDefinitionKey.currentValue) {
            changed = true;
        } else if (state && state.currentValue) {
            changed = true;
        } else if (sort && sort.currentValue) {
            changed = true;
        } else if (name && name.currentValue) {
            changed = true;
        } else if (page && page.currentValue !== page.previousValue) {
            changed = true;
        } else if (size && size.currentValue !== size.previousValue) {
            changed = true;
        }
        return changed;
    }

    public reload() {
        this.requestNode = this.createRequestNode();
        this.load(this.requestNode);
    }

    private load(requestNode: ProcessFilterParamRepresentationModel) {
        this.isLoading = true;
        this.processService.getProcessInstances(requestNode, this.processDefinitionKey)
            .subscribe(
                (response) => {
                    let instancesRow = this.createDataRow(response.data);
                    this.renderInstances(instancesRow);
                    this.selectFirst();
                    this.success.emit(response);
                    this.isLoading = false;
                    this.pagination.next({
                        count: response.data.length,
                        maxItems: this.size,
                        skipCount: this.page * this.size,
                        totalItems: response.total
                    });
                },
                error => {
                    this.error.emit(error);
                    this.isLoading = false;
                });
    }

    /**
     * Create an array of ObjectDataRow
     * @param instances
     */
    private createDataRow(instances: any[]): ObjectDataRow[] {
        let instancesRows: ObjectDataRow[] = [];
        instances.forEach((row) => {
            instancesRows.push(new ObjectDataRow(row));
        });
        return instancesRows;
    }

    /**
     * Render the instances list
     *
     * @param instances
     */
    private renderInstances(instances: any[]) {
        instances = this.optimizeNames(instances);
        this.setDatatableSorting();
        this.data.setRows(instances);
    }

    /**
     * Sort the datatable rows based on current value of 'sort' property
     */
    private setDatatableSorting() {
        if (!this.sort) {
            return;
        }
        let sortingParams: string[] = this.sort.split('-');
        if (sortingParams.length === 2) {
            let sortColumn = sortingParams[0] === 'created' ? 'started' : sortingParams[0];
            let sortOrder = sortingParams[1];
            this.data.setSorting(new DataSorting(sortColumn, sortOrder));
        }
    }

    /**
     * Select the first instance of a list if present
     */
    selectFirst() {
        if (!this.isListEmpty()) {
            let row = this.data.getRows()[0];
            row.isSelected = true;
            this.data.selectedRow = row;
            this.currentInstanceId = row.getValue('id');
        } else {
            if (this.data) {
                this.data.selectedRow = null;
            }
            this.currentInstanceId = null;
        }
    }

    /**
     * Return the current id
     */
    getCurrentId(): string {
        return this.currentInstanceId;
    }

    /**
     * Check if the list is empty
     */
    isListEmpty(): boolean {
        return this.data === undefined ||
            (this.data && this.data.getRows() && this.data.getRows().length === 0);
    }

    /**
     * Emit the event rowClick passing the current task id when the row is clicked
     * @param event
     */
    onRowClick(event: DataRowEvent) {
        let item = event;
        this.currentInstanceId = item.value.getValue('id');
        this.rowClick.emit(this.currentInstanceId);
    }

    /**
     * Emit the event rowClick passing the current task id when pressed the Enter key on the selected row
     * @param event
     */
    onRowKeyUp(event: CustomEvent) {
        if (event.detail.keyboardEvent.key === 'Enter') {
            event.preventDefault();
            this.currentInstanceId = event.detail.row.getValue('id');
            this.rowClick.emit(this.currentInstanceId);
        }
    }

    /**
     * Optimize name field
     * @param instances
     */
    private optimizeNames(instances: any[]): any[] {
        instances = instances.map(t => {
            t.obj.name = this.getProcessNameOrDescription(t.obj, 'medium');
            return t;
        });
        return instances;
    }

    getProcessNameOrDescription(processInstance, dateFormat): string {
        let name = '';
        if (processInstance) {
            name = processInstance.name ||
                processInstance.processDefinitionName + ' - ' + this.getFormatDate(processInstance.started, dateFormat);
        }
        return name;
    }

    getFormatDate(value, format: string) {
        let datePipe = new DatePipe('en-US');
        try {
            return datePipe.transform(value, format);
        } catch (err) {
            return '';
        }
    }

    private createRequestNode() {
        let requestNode = {
            appDefinitionId: this.appId,
            state: this.state,
            sort: this.sort,
            page: this.page,
            size: this.size,
            start: 0
        };
        return new ProcessFilterParamRepresentationModel(requestNode);
    }

    setupDefaultColumns(preset: string = 'default'): void {
        if (this.data) {
            const columns = this.getLayoutPreset(preset);
            this.data.setColumns(columns);
        }
    }

    private loadLayoutPresets(): void {
        const externalSettings = this.appConfig.get('adf-process-list.presets', null);

        if (externalSettings) {
            this.layoutPresets = Object.assign({}, processPresetsDefaultModel, externalSettings);
        } else {
            this.layoutPresets = processPresetsDefaultModel;
        }

    }

    private getLayoutPreset(name: string = 'default'): DataColumn[] {
        return (this.layoutPresets[name] || this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }

    updatePagination(params: PaginationQueryParams) {

    }

    get supportedPageSizes(): number[] {
        return this.userPreferences.getDifferentPageSizes();
    }
}
