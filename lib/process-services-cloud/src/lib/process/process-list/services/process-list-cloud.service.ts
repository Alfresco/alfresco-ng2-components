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
import { ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { Observable, throwError } from 'rxjs';
import { ProcessListCloudSortingModel } from '../models/process-list-sorting.model';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProcessListCloudService extends BaseCloudService {

    constructor(apiService: AlfrescoApiService,
                appConfigService: AppConfigService,
                private logService: LogService) {
        super(apiService, appConfigService);
    }

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

    /**
     * Finds a process using an object with optional query properties.
     *
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

    private getVariableKeysFromQueryParams(queryParams: any): string[] {
        if (!queryParams['variableKeys'] || queryParams['variableKeys'].length <= 0) {
            return [];
        }

        return queryParams['variableKeys'].split(',');
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
        if (property === 'variableKeys' && requestNode[property]?.length > 0) {
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
}
