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

import { Injectable } from '@angular/core';
import { ProcessListRequestModel, ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { Observable, throwError } from 'rxjs';
import { ProcessListCloudSortingModel } from '../models/process-list-sorting.model';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProcessListCloudService extends BaseCloudService {
    private getProcess(
        callback: (queryUrl: string, queryParams: any) => Observable<any>,
        defaultQueryUrl: string,
        requestNode: ProcessQueryCloudRequestModel,
        queryUrl?: string
    ): Observable<any> {
        if (requestNode.appName || requestNode.appName === '') {
            queryUrl = queryUrl || `${this.getBasePath(requestNode.appName)}/${defaultQueryUrl}`;
            const queryParams = this.buildQueryParams(requestNode);
            const sortingParams = this.buildSortingParam(requestNode.sorting);
            if (sortingParams) {
                queryParams['sort'] = sortingParams;
            }

            return callback(queryUrl, queryParams).pipe(
                map((response: any) => {
                    const entries = response.list?.entries;
                    if (entries) {
                        // TODO: this is a hack of the model and needs to be revisited
                        response.list.entries = entries.map((entryData) => entryData.entry);
                    }
                    return response;
                })
            );
        } else {
            return throwError('Appname not configured');
        }
    }

    /**
     * Finds a process using an object with optional query properties.
     *
     * @deprecated From Activiti 8.7.0 forward, use ProcessListCloudService.fetchProcessList instead.
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns Process information
     */
    getProcessByRequest(requestNode: ProcessQueryCloudRequestModel, queryUrl?: string): Observable<any> {
        const callback = (url: string, queryParams: any) => this.get(url, queryParams);
        const defaultQueryUrl = 'query/v1/process-instances';

        return this.getProcess(callback, defaultQueryUrl, requestNode, queryUrl);
    }

    /**
     * Available from Activiti version 8.7.0 onwards.
     * Retrieves a list of processes using an object with optional query properties.
     *
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns List of processes
     */
    fetchProcessList(requestNode: ProcessListRequestModel, queryUrl?: string): Observable<any> {
        if (!requestNode?.appName) {
            return throwError(() => new Error('Appname not configured'));
        }

        queryUrl = queryUrl || `${this.getBasePath(requestNode.appName)}/query/v1/process-instances/search`;

        const queryParams = {
            maxItems: requestNode.pagination?.maxItems || 25,
            skipCount: requestNode.pagination?.skipCount || 0
        };

        const queryData = this.buildQueryData(requestNode);
        return this.post<any, any>(queryUrl, queryData, queryParams).pipe(
            map((response: any) => {
                const entries = response.list?.entries;
                if (entries) {
                    response.list.entries = entries.map((entryData) => entryData.entry);
                }
                return response;
            })
        );
    }

    protected buildQueryData(requestNode: ProcessListRequestModel): { [key: string]: any } {
        const queryData: { [key: string]: any } = {
            name: requestNode.name,
            id: requestNode.id,
            parentId: requestNode.parentId,
            processDefinitionName: requestNode.processDefinitionName,
            initiator: requestNode.initiator,
            appVersion: requestNode.appVersion,
            status: requestNode.status,
            lastModifiedFrom: requestNode.lastModifiedFrom,
            lasModifiedTo: requestNode.lasModifiedTo,
            startFrom: requestNode.startFrom,
            startTo: requestNode.startTo,
            completedFrom: requestNode.completedFrom,
            completedTo: requestNode.completedTo,
            suspendedFrom: requestNode.suspendedFrom,
            suspendedTo: requestNode.suspendedTo,
            processVariableKeys: requestNode.processVariableKeys,
            processVariableFilters: requestNode.processVariableFilters,
            excludeByProcessCategoryName: requestNode.excludeByProcessCategoryName
        };

        if (requestNode.sorting) {
            queryData['sort'] = {
                field: requestNode.sorting.orderBy,
                direction: requestNode.sorting.direction.toLowerCase(),
                isProcessVariable: requestNode.sorting.isFieldProcessVariable
            };
            if (queryData['sort'].isProcessVariable) {
                queryData['sort'].processDefinitionKey = requestNode.sorting.processVariableData?.processDefinitionKey;
                queryData['sort'].type = requestNode.sorting.processVariableData?.type;
            }
        }

        /*
         * Remove process variable filter keys with empty values from the query data.
         */
        if (queryData['processVariableFilters']) {
            queryData['processVariableFilters'] = queryData['processVariableFilters'].filter(
                (filter) => filter.value !== '' && filter.value !== null && filter.value !== undefined
            );
        }

        /*
         * Remove keys with empty values from the query data.
         */
        Object.keys(queryData).forEach((key) => {
            const value = queryData[key];
            const isValueEmpty = !value;
            const isValueArrayWithEmptyValue = Array.isArray(value) && (value.length === 0 || value[0] === null);
            if (isValueEmpty || isValueArrayWithEmptyValue) {
                delete queryData[key];
            }
        });

        return queryData;
    }

    getProcessListCounter(requestNode: ProcessListRequestModel): Observable<number> {
        if (!requestNode.appName) {
            return throwError(() => new Error('Appname not configured'));
        }
        return this.fetchProcessList(requestNode).pipe(map((processes) => processes.list.pagination.totalItems));
    }

    /**
     * Finds a process using an object with optional query properties.
     *
     * @param appName app name
     * @param status filter status
     * @returns Total items
     */
    getProcessCounter(appName: string, status: string): Observable<any> {
        const callback = (url: string, queryParams: any) => this.get(url, queryParams);
        let queryUrl: string;
        const defaultQueryUrl = 'query/v1/process-instances';
        const requestNode: ProcessQueryCloudRequestModel = {
            appName,
            appVersion: '',
            initiator: null,
            id: '',
            name: null,
            processDefinitionId: '',
            processDefinitionName: null,
            processDefinitionKey: '',
            status,
            businessKey: '',
            startFrom: null,
            startTo: null,
            completedFrom: null,
            completedTo: null,
            suspendedFrom: null,
            suspendedTo: null,
            completedDate: '',
            maxItems: 1,
            skipCount: 0,
            sorting: [
                {
                    orderBy: 'startDate',
                    direction: 'DESC'
                }
            ]
        };

        return this.getProcess(callback, defaultQueryUrl, requestNode, queryUrl).pipe(map((tasks) => tasks?.list?.pagination?.totalItems));
    }

    /**
     * Finds a process using an object with optional query properties in admin app.
     *
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns Process information
     */
    getAdminProcessByRequest(requestNode: ProcessQueryCloudRequestModel, queryUrl?: string): Observable<any> {
        const callback = (url: string, params: any) => {
            const postBody = {
                variableKeys: this.getVariableKeysFromQueryParams(params)
            };

            delete params['variableKeys'];

            return this.post(url, postBody, params);
        };

        const defaultQueryUrl = 'query/admin/v1/process-instances';

        return this.getProcess(callback, defaultQueryUrl, requestNode, queryUrl);
    }

    getProcessListCount(requestNode: ProcessListRequestModel): Observable<number> {
        if (!requestNode?.appName) {
            return throwError(() => new Error('Appname not configured'));
        }

        const queryUrl = `${this.getBasePath(requestNode.appName)}/query/v1/process-instances/count`;
        const queryData = this.buildQueryData(requestNode);

        return this.post<object, number>(queryUrl, queryData).pipe(map((response) => response || 0));
    }

    private getVariableKeysFromQueryParams(queryParams: any): string[] {
        if (!queryParams['variableKeys'] || queryParams['variableKeys'].length <= 0) {
            return [];
        }

        return queryParams['variableKeys'].split(',');
    }

    protected isPropertyValueValid(requestNode: ProcessQueryCloudRequestModel, property: string): boolean {
        return requestNode[property] !== '' && requestNode[property] !== null && requestNode[property] !== undefined;
    }

    protected buildQueryParams(requestNode: ProcessQueryCloudRequestModel): any {
        const queryParam = {};

        for (const property in requestNode) {
            if (
                Object.prototype.hasOwnProperty.call(requestNode, property) &&
                !this.isExcludedField(property) &&
                this.isPropertyValueValid(requestNode, property)
            ) {
                queryParam[property] = this.getQueryParamValueFromRequestNode(requestNode, property as keyof ProcessQueryCloudRequestModel);
            }
        }

        if (!queryParam['status']) {
            queryParam['status'] = this.buildFilterForAllStatus();
        }

        return queryParam;
    }

    private getQueryParamValueFromRequestNode(requestNode: ProcessQueryCloudRequestModel, property: keyof ProcessQueryCloudRequestModel) {
        if (property === 'variableKeys' && requestNode[property]?.length > 0) {
            return `${requestNode[property].map((variableId) => variableId).join(',')}`;
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
}
