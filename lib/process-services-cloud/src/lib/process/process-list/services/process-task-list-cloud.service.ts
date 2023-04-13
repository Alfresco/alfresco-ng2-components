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
import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { Observable, throwError } from 'rxjs';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { map } from 'rxjs/operators';
import { TaskListCloudServiceInterface } from '../../../services/task-list-cloud.service.interface';
import { TaskQueryCloudRequestModel } from '../../../models/filter-cloud-model';
import { TaskCloudNodePaging } from '../../../models/task-cloud.model';
import { TaskListCloudSortingModel } from '../../../models/task-list-sorting.model';

@Injectable({ providedIn: 'root' })
export class ProcessTaskListCloudService extends BaseCloudService implements TaskListCloudServiceInterface {

    constructor(apiService: AlfrescoApiService,
                appConfigService: AppConfigService,
                protected logService: LogService) {
        super(apiService, appConfigService);
    }

    /**
     * Finds a task using an object with optional query properties.
     *
     * @param requestNode Query object
     * @param queryUrl Query url
     * @returns Task information
     */
    getTaskByRequest(requestNode: TaskQueryCloudRequestModel, queryUrl?: string): Observable<any> {
        if (requestNode.appName || requestNode.appName === '') {
            queryUrl = queryUrl || `${this.getBasePath(requestNode.appName)}/query/v1/process-instances/${requestNode.processInstanceId}/tasks`;
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
        for (const property in requestNode) {
            if (requestNode.hasOwnProperty(property) &&
                !this.isExcludedField(property) &&
                this.isPropertyValueValid(requestNode, property)) {
                queryParam[property] = requestNode[property];
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
