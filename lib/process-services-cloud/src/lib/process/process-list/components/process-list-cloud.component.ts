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

import { Component, ViewEncapsulation, OnChanges, AfterContentInit, ContentChild, Output, EventEmitter, SimpleChanges, Input } from '@angular/core';
import { DataTableSchema, PaginatedComponent,
         CustomEmptyContentTemplateDirective, AppConfigService,
         UserPreferencesService, PaginationModel,
         UserPreferenceValues, DataRowEvent, CustomLoadingContentTemplateDirective } from '@alfresco/adf-core';
import { ProcessListCloudService } from '../services/process-list-cloud.service';
import { BehaviorSubject } from 'rxjs';
import { processCloudPresetsDefaultModel } from '../models/process-cloud-preset.model';
import { ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { ProcessListCloudSortingModel } from '../models/process-list-sorting.model';
@Component({
    selector: 'adf-cloud-process-list',
    templateUrl: './process-list-cloud.component.html',
    styleUrls: ['./process-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessListCloudComponent extends DataTableSchema implements OnChanges, AfterContentInit, PaginatedComponent {

    static PRESET_KEY = 'adf-cloud-process-list.presets';

    @ContentChild(CustomEmptyContentTemplateDirective)
    emptyCustomContent: CustomEmptyContentTemplateDirective;

    @ContentChild(CustomLoadingContentTemplateDirective)
    customLoadingContent: CustomLoadingContentTemplateDirective;

    /** The name of the application. */
    @Input()
    appName: string = '';

    /** Name of the initiator of the process. */
    @Input()
    initiator: string = '';

    /** Filter the processes to display only the ones with this ID. */
    @Input()
    id: string = '';

    /** Filter the processes to display only the ones with this name. */
    @Input()
    name: string = '';

    /** Filter the processes to display only the ones with this process definition ID. */
    @Input()
    processDefinitionId: string = '';

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
    lastModifiedFrom: string = '';

    /** Filter the processes. Display only process with lastModifiedTo equal to the supplied date. */
    @Input()
    lastModifiedTo: string = '';

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

    /** Emitted when a row in the process list is clicked. */
    @Output()
    rowClick: EventEmitter<string> = new EventEmitter<string>();

    /** Emitted when rows are selected/unselected. */
    @Output()
    rowsSelected: EventEmitter<any[]> = new EventEmitter<any[]>();

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
    isLoading = false;
    rows: any[] = [];
    requestNode: ProcessQueryCloudRequestModel;

    constructor(private processListCloudService: ProcessListCloudService,
                appConfigService: AppConfigService,
                private userPreferences: UserPreferencesService) {
        super(appConfigService, ProcessListCloudComponent.PRESET_KEY, processCloudPresetsDefaultModel);
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

    ngAfterContentInit() {
        this.createDatatableSchema();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.isPropertyChanged(changes)) {
            this.reload();
        }
    }

    getCurrentId(): string {
        return this.currentInstanceId;
    }

    reload() {
        this.requestNode = this.createRequestNode();
        if (this.requestNode.appName) {
            this.load(this.requestNode);
        } else {
            this.rows = [];
        }
    }

    private load(requestNode: ProcessQueryCloudRequestModel) {
        this.isLoading = true;
        this.processListCloudService.getProcessByRequest(requestNode).subscribe(
            (processes) => {
                this.rows = processes.list.entries;
                this.success.emit(processes);
                this.isLoading = false;
                this.pagination.next(processes.list.pagination);
            }, (error) => {
                this.error.emit(error);
                this.isLoading = false;
            });
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

    private createRequestNode(): ProcessQueryCloudRequestModel {
        let requestNode = {
            appName: this.appName,
            maxItems: this.size,
            skipCount: this.skipCount,
            initiator: this.initiator,
            id: this.id,
            name: this.name,
            processDefinitionId: this.processDefinitionId,
            processDefinitionKey: this.processDefinitionKey,
            status: this.status,
            businessKey: this.businessKey,
            lastModifiedFrom: this.lastModifiedFrom,
            lastModifiedTo: this.lastModifiedTo,
            sorting: this.sorting
        };
        return new ProcessQueryCloudRequestModel(requestNode);
    }

}
