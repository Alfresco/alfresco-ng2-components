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

import { Injectable } from '@angular/core';
import { TaskQueryCloudRequestModel } from '../../../models/filter-cloud-model';
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
                map((response: any) => {
                    const entries = response.list && response.list.entries;
                    if (entries) {
                        response.list.entries = entries.map((entryData: any) => entryData.entry);
                    }
                    return response;
                })
            );
        } else {
            this.logService.error('Appname is mandatory for querying task');
            return throwError('Appname not configured');
        }
    }

    protected buildQueryParams(requestNode: TaskQueryCloudRequestModel): any {
        const queryParam: any = {};
        for (const propertyKey in requestNode) {
            if (
                requestNode.hasOwnProperty(propertyKey) &&
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
