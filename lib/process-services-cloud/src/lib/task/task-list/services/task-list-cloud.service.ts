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
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { TaskQueryCloudRequestModel } from '../models/filter-cloud-model';
import { Observable, from } from 'rxjs';
import { TaskListCloudSortingModel } from '../models/task-list-sorting.model';
import { BaseCloudService } from '../../../services/base-cloud.service';

@Injectable()
export class TaskListCloudService extends BaseCloudService {

    constructor(private apiService: AlfrescoApiService,
                private appConfigService: AppConfigService) {
                    super();
    }

    contentTypes = ['application/json'];
    accepts = ['application/json'];

    /**
     * Finds a task using an object with optional query properties.
     * @param requestNode Query object
     * @returns Task information
     */
    getTaskByRequest(requestNode: TaskQueryCloudRequestModel): Observable<any> {

        const queryUrl = this.buildQueryUrl(requestNode);
        const queryParams = this.buildQueryParams(requestNode);
        const sortingParams = this.buildSortingParam(requestNode.sorting);
        if (sortingParams) {
            queryParams['sort'] = sortingParams;
        }
        return from(this.apiService.getInstance()
            .oauth2Auth.callCustomApi(queryUrl, 'GET',
                null, queryParams, null,
                null, null,  ['application/json'],
                ['application/json'], null, null)
        );
    }

    private buildQueryUrl(requestNode: TaskQueryCloudRequestModel) {
        this.contextRoot = this.appConfigService.get('bpmHost', '');
        this.buildBasePath(requestNode.appName);
        return `${this.basePath}/query/v1/tasks`;
    }

    private buildQueryParams(requestNode: TaskQueryCloudRequestModel) {
        const queryParam = {};
        for (const property in requestNode) {
            if (requestNode.hasOwnProperty(property) &&
                !this.isExcludedField(property) &&
                this.isPropertyValueValid(requestNode, property)) {
                queryParam[property] = requestNode[property];
            }
        }
        return queryParam;
    }

    private isExcludedField(property) {
        return property === 'appName' || property === 'sorting';
    }

    private isPropertyValueValid(requestNode, property) {
        return requestNode[property] !== '' && requestNode[property] !== null && requestNode[property] !== undefined;
    }

    private buildSortingParam(sortings: TaskListCloudSortingModel[]): string {
        let finalSorting: string = '';
        if (sortings) {
            for (const sort of sortings) {
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
