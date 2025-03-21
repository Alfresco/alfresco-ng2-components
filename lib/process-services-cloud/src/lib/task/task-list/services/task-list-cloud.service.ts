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
import { TaskQueryCloudRequestModel, TaskListRequestModel } from '../../../models/filter-cloud-model';
import { Observable, throwError } from 'rxjs';
import { TaskListCloudSortingModel } from '../../../models/task-list-sorting.model';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { TaskCloudNodePaging } from '../../../models/task-cloud.model';
import { map } from 'rxjs/operators';
import { TaskListCloudServiceInterface } from '../../../services/task-list-cloud.service.interface';

@Injectable({ providedIn: 'root' })
export class TaskListCloudService extends BaseCloudService implements TaskListCloudServiceInterface {
    /**
     * Finds a task using an object with optional query properties.
     *
     * @deprecated From Activiti 8.7.0 forward, use TaskListCloudService.fetchTaskList instead.
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns Task information
     */
    getTaskByRequest(requestNode: TaskQueryCloudRequestModel, queryUrl?: string): Observable<any> {
        if (requestNode.appName || requestNode.appName === '') {
            queryUrl = queryUrl || `${this.getBasePath(requestNode.appName)}/query/v1/tasks`;
            const queryParams = this.buildQueryParams(requestNode);
            const sortingParams = this.buildSortingParam(requestNode.sorting);
            if (sortingParams) {
                queryParams['sort'] = sortingParams;
            }
            return this.get<TaskCloudNodePaging>(queryUrl, queryParams).pipe(
                map((response) => {
                    const entries = response.list?.entries;
                    if (entries) {
                        // TODO: this looks like a hack of the TaskCloudNodePaging collection
                        response.list.entries = entries.map((entryData) => entryData.entry) as any;
                    }
                    return response;
                })
            );
        } else {
            return throwError('Appname not configured');
        }
    }

    /**
     * Available from Activiti version 8.7.0 onwards.
     * Retrieves a list of tasks using an object with optional query properties.
     *
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns List of tasks
     */
    fetchTaskList(requestNode: TaskListRequestModel, queryUrl?: string): Observable<any> {
        if (!requestNode?.appName) {
            return throwError(() => new Error('Appname not configured'));
        }

        queryUrl = queryUrl || `${this.getBasePath(requestNode.appName)}/query/v1/tasks/search`;

        const queryParams = {
            maxItems: requestNode.pagination?.maxItems || 25,
            skipCount: requestNode.pagination?.skipCount || 0
        };

        const queryData = this.buildQueryData(requestNode);

        return this.post<any, TaskCloudNodePaging>(queryUrl, queryData, queryParams).pipe(
            map((response) => {
                const entries = response.list?.entries;
                if (entries) {
                    response.list.entries = entries.map((entryData) => entryData.entry) as any;
                }
                return response;
            })
        );
    }

    getTaskListCounter(requestNode: TaskListRequestModel): Observable<number> {
        if (!requestNode.appName) {
            return throwError(() => new Error('Appname not configured'));
        }
        return this.fetchTaskList(requestNode).pipe(map((tasks) => tasks.list.pagination.totalItems));
    }

    protected buildQueryData(requestNode: TaskListRequestModel) {
        const queryData: any = {
            id: requestNode.id,
            parentId: requestNode.parentId,
            processInstanceId: requestNode.processInstanceId,
            status: requestNode.status,
            processDefinitionName: requestNode.processDefinitionName,
            processName: requestNode.processName,
            assignee: requestNode.assignee,
            priority: requestNode.priority,
            name: requestNode.name,
            completedBy: requestNode.completedBy,
            completedFrom: requestNode.completedFrom,
            completedTo: requestNode.completedTo,
            createdFrom: requestNode.createdFrom,
            createdTo: requestNode.createdTo,
            dueDateFrom: requestNode.dueDateFrom,
            dueDateTo: requestNode.dueDateTo,
            processVariableKeys: requestNode.processVariableKeys,
            processVariableFilters: requestNode.processVariableFilters
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

    protected buildQueryParams(requestNode: TaskQueryCloudRequestModel): any {
        const queryParam: any = {};
        for (const propertyKey in requestNode) {
            if (
                Object.prototype.hasOwnProperty.call(requestNode, propertyKey) &&
                !this.isExcludedField(propertyKey) &&
                this.isPropertyValueValid(requestNode, propertyKey)
            ) {
                if (propertyKey === 'variableKeys' && requestNode[propertyKey]?.length > 0) {
                    queryParam[propertyKey] = requestNode[propertyKey].join(',');
                } else {
                    queryParam[propertyKey] = requestNode[propertyKey];
                }
            }
        }
        return queryParam;
    }

    protected isExcludedField(property: string): boolean {
        return property === 'appName' || property === 'sorting';
    }

    protected isPropertyValueValid(requestNode: any, property: string): boolean {
        return requestNode[property] !== '' && requestNode[property] !== null && requestNode[property] !== undefined;
    }

    protected buildSortingParam(models: TaskListCloudSortingModel[]): string {
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
