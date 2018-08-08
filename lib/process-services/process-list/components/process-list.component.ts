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
    DataTableSchema,
    DataRowEvent,
    DataTableAdapter,
    EmptyCustomContentDirective
} from '@alfresco/adf-core';
import {
    AppConfigService,
    PaginatedComponent,
    PaginationComponent,
    PaginationModel,
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
import { BehaviorSubject } from 'rxjs';
import { ProcessListModel } from '../models/process-list.model';

@Component({
    selector: 'adf-process-instance-list',
    styleUrls: ['./process-list.component.css'],
    templateUrl: './process-list.component.html'
})
export class ProcessInstanceListComponent extends DataTableSchema  implements OnChanges, AfterContentInit, PaginatedComponent {

    static PRESET_KEY = 'adf-process-list.presets';

    @ContentChild(EmptyCustomContentDirective) emptyCustomContent: EmptyCustomContentDirective;

    /** The id of the app. */
    @Input()
    appId: number;

    /** The Definition Key of the process.
     * @deprecated 2.4.0
     */
    @Input()
    processDefinitionKey: string;

    /** The Definition Id of the process. */
    @Input()
    processDefinitionId: string;

    /** The id of the process instance. */
    @Input()
    processInstanceId: number|string;

    /** Defines the state of the processes. Possible values are `running`, `completed` and `all` */
    @Input()
    state: string;

    /** Defines the sort ordering of the list. Possible values are `created-desc`, `created-asc`,
     * `ended-desc`, `ended-asc`.
     */
    @Input()
    sort: string;

    /** The page number of the processes to fetch. */
    @Input()
    page: number = 0;

    /** The number of processes to fetch in each page. */
    @Input()
    size: number = PaginationComponent.DEFAULT_PAGINATION.maxItems;

    /** Data source to define the datatable. */
    @Input()
    data: DataTableAdapter;

    /** Toggles multiple row selection, which renders checkboxes at the beginning of each row */
    @Input()
    multiselect: boolean = false;

    /** Row selection mode. Can be none, `single` or `multiple`. For `multiple` mode,
     * you can use Cmd (macOS) or Ctrl (Win) modifier key to toggle selection for
     * multiple rows.
     */
    @Input()
    selectionMode: string = 'single'; // none|single|multiple

    /** Toggles default selection of the first row */
    @Input()
    selectFirstRow: boolean = true;

    /** Emitted when a row in the process list is clicked. */
    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when the list of process instances has been loaded successfully from the server. */
    @Output()
    success: EventEmitter<ProcessListModel> = new EventEmitter<ProcessListModel>();

    /** Emitted when an error occurs while loading the list of process instances from the server. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    requestNode: ProcessFilterParamRepresentationModel;
    currentInstanceId: string;
    isLoading: boolean = true;
    rows: any[] = [];
    sorting: any[] = ['created', 'desc'];

    pagination: BehaviorSubject<PaginationModel>;

    constructor(private processService: ProcessService,
                private userPreferences: UserPreferencesService,
                appConfig: AppConfigService) {
        super(appConfig, ProcessInstanceListComponent.PRESET_KEY, processPresetsDefaultModel);
        this.size = this.userPreferences.paginationSize;

        this.pagination = new BehaviorSubject<PaginationModel>(<PaginationModel> {
            maxItems: this.size,
            skipCount: 0,
            totalItems: 0
        });
    }

    ngAfterContentInit() {
        this.createDatatableSchema();
        if (this.data && this.data.getColumns().length === 0) {
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
    }

    private isSortChanged(changes: SimpleChanges): boolean {
        const actualSort = changes['sort'];
        return actualSort && actualSort.currentValue && actualSort.currentValue !== actualSort.previousValue;
    }

    private isPropertyChanged(changes: SimpleChanges): boolean {
        let changed: boolean = false;

        let appId = changes['appId'];
        let processDefinitionKey = changes['processDefinitionKey'];
        let processDefinitionId = changes['processDefinitionId'];
        let processInstanceId = changes['processInstanceId'];
        let state = changes['state'];
        let sort = changes['sort'];
        let page = changes['page'];
        let size = changes['size'];

        if (appId && appId.currentValue) {
            changed = true;
        } else if (processDefinitionKey) {
            changed = true;
        } else if (processDefinitionId) {
            changed = true;
        } else if (processInstanceId) {
            changed = true;
        } else if (state && state.currentValue) {
            changed = true;
        } else if (sort && sort.currentValue) {
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
                    this.rows = this.optimizeNames(response.data);
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
     * Select the first instance of a list if present
     */
    selectFirst() {
        if (this.selectFirstRow) {
            if (!this.isListEmpty()) {
                let dataRow = this.rows[0];
                dataRow.isSelected = true;
                this.currentInstanceId = dataRow['id'];
            } else {
                this.currentInstanceId = null;
            }
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
        return !this.rows || this.rows.length === 0;
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
        instances = instances.map(instance => {
            instance.name = this.getProcessNameOrDescription(instance, 'medium');
            return instance;
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
            processDefinitionId: this.processDefinitionId,
            processInstanceId: this.processInstanceId,
            state: this.state,
            sort: this.sort,
            page: this.page,
            size: this.size,
            start: 0
        };
        return new ProcessFilterParamRepresentationModel(requestNode);
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
        return (skipCount && maxItems) ? Math.floor(skipCount / maxItems) : 0;
    }
}
