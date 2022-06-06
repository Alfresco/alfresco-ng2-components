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
import { Injectable } from '@angular/core';
import { AlfrescoApiService, AppConfigService, DataColumn, DataColumnType, LogService } from '@alfresco/adf-core';
import { ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { Observable, throwError } from 'rxjs';
import { ProcessListCloudSortingModel } from '../models/process-list-sorting.model';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { map } from 'rxjs/operators';
import { ProcessInstanceCloudListViewModel } from '../models/perocess-instance-cloud-view.model';
import { ProcessInstanceCloud } from '../../start-process/models/process-instance-cloud.model';
import { ProcessListDataColumnCustomData } from '../models/data-column-custom-data';

@Injectable({ providedIn: 'root' })
export class ProcessListCloudService extends BaseCloudService {

    constructor(apiService: AlfrescoApiService,
                appConfigService: AppConfigService,
                private logService: LogService) {
        super(apiService, appConfigService);
    }

    /**
     * Finds a process using an object with optional query properties.
     *
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns Process information
     */
    getProcessByRequest(requestNode: ProcessQueryCloudRequestModel, queryUrl?: string): Observable<any> {
        if (requestNode.appName || requestNode.appName === '') {
            queryUrl = queryUrl || `${this.getBasePath(requestNode.appName)}/query/v1/process-instances`;
            const queryParams = this.buildQueryParams(requestNode);
            const sortingParams = this.buildSortingParam(requestNode.sorting);
            if (sortingParams) {
                queryParams['sort'] = sortingParams;
            }

            return this.get(queryUrl, queryParams).pipe(
                map((response: any) => {
                    const entries = response.list && response.list.entries;
                    if (entries) {
                        response.list.entries = entries.map((entryData) => entryData.entry);
                    }
                    return response;
                })
            );
        } else {
            this.logService.error('Appname is mandatory for querying task');
            return throwError('Appname not configured');
        }
    }

    createRowsViewModel(
        processes: ProcessInstanceCloud[] = [],
        columnsSchema: DataColumn<ProcessListDataColumnCustomData>[]
    ): ProcessInstanceCloudListViewModel[] {
        const columnsByVariableId = columnsSchema
            .filter(column => !!column.customData)
            .reduce<{ [variableId: string]: string }>((columnsByVariable, column) => {
                const columnTitle = column.title;
                const variableIds = column.customData.assignedVariableDefinitionIds;

                variableIds.forEach((variableId) => {
                    columnsByVariable[variableId] = columnTitle;
                });
                return columnsByVariable;

            }, {});

        const rowsViewModel = processes.map((process) => {
            if (!process.variables?.length) {
                return process;
            }

            const variablesMap = (process.variables ?? []).reduce((variableAccumulator, variable) => {
                const processVariableDefinitionId = variable.variableDefinitionId;

                const column = columnsByVariableId[processVariableDefinitionId];
                if (column) {
                    variableAccumulator[column] = {
                        ...variable,
                        type: this.mapProcessVariableTypes(variable.type)
                    };
                }

                return variableAccumulator;
            }, {});

            return {
                ...process,
                variablesMap
            };
        });

        return rowsViewModel;
    }

    protected isPropertyValueValid(requestNode: any, property: string): boolean {
        return requestNode[property] !== '' && requestNode[property] !== null && requestNode[property] !== undefined;
    }

    protected buildQueryParams(requestNode: ProcessQueryCloudRequestModel): any {
        const queryParam = {};

        for (const property in requestNode) {
            if (requestNode.hasOwnProperty(property) &&
                !this.isExcludedField(property) &&
                this.isPropertyValueValid(requestNode, property)) {
                queryParam[property] = this.getQueryParamValueFromRequestNode(requestNode, property as keyof ProcessQueryCloudRequestModel);
            }
        }

        if (!queryParam['status']) {
            queryParam['status'] = this.buildFilterForAllStatus();
        }

        return queryParam;
    }

    private getQueryParamValueFromRequestNode(
        requestNode: ProcessQueryCloudRequestModel,
        property: keyof ProcessQueryCloudRequestModel
    ) {
        if (property === 'variableDefinitions' && requestNode[property]?.length > 0) {
            return `${requestNode[property].map(variableId => variableId).join(',')}`;
        }

        return requestNode[property];
    }

    protected buildFilterForAllStatus(): string[] {
        return ['RUNNING', 'SUSPENDED', 'CANCELLED', 'COMPLETED'];
    }

    protected isExcludedField(property: string): boolean {
        return property === 'appName' || property === 'sorting';
    }

    protected buildSortingParam(models: ProcessListCloudSortingModel[]): string {
        let finalSorting: string = '';
        if (models) {
            for (const sort of models) {
                if (!finalSorting) {
                    finalSorting = `${sort.orderBy},${sort.direction}`;
                } else {
                    finalSorting = `${finalSorting}&${sort.orderBy},${sort.direction}`;
                }
            }
        }
        return encodeURI(finalSorting);
    }

    private mapProcessVariableTypes(variableType: string): DataColumnType {
        switch (variableType) {
            case 'boolean':
            case 'integer':
            case 'string':
                return 'text';
            case 'date':
            case 'datetime':
                return 'date';
            default:
                return 'text';
        }
    }
}
