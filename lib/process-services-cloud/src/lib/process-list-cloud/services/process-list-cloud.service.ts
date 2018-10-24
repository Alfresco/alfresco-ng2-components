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
import { Injectable } from '@angular/core';
import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { ProcessQueryCloudRequestModel } from '../models/process-cloud-query-request.model';
import { Observable, from, throwError } from 'rxjs';
import { ProcessListCloudSortingModel } from '../models/process-list-sorting.model';
@Injectable()
export class ProcessListCloudService {

    contentTypes = ['application/json'];
    accepts = ['application/json'];

    constructor(private apiService: AlfrescoApiService,
                private appConfigService: AppConfigService,
                private logService: LogService) {
    }

    getProcessByRequest(requestNode: ProcessQueryCloudRequestModel): Observable<any> {
        if (requestNode.appName) {
            let queryUrl = this.buildQueryUrl(requestNode);
            let queryParams = this.buildQueryParams(requestNode);
            let sortingParams = this.buildSortingParam(requestNode.sorting);
            if (sortingParams) {
                queryParams['sort'] = sortingParams;
            }
            return from(this.apiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                    null, queryParams, null,
                    null, null, null, this.contentTypes,
                    this.accepts, Object, null, null)
            );
        } else {
            this.logService.error('Appname is mandatory for querying task');
            return throwError('Appname not configured');
        }
    }
    private buildQueryUrl(requestNode: ProcessQueryCloudRequestModel) {
        return `${this.appConfigService.get('bpmHost', '')}/${requestNode.appName}-query/v1/process-instances`;
    }

    private isPropertyValueValid(requestNode, property) {
        return requestNode[property] !== '' && requestNode[property] !== null && requestNode[property] !== undefined;
    }

    private buildQueryParams(requestNode: ProcessQueryCloudRequestModel) {
        let queryParam = {};
        for (let property in requestNode) {
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

    private buildSortingParam(sortings: ProcessListCloudSortingModel[]): string {
        let finalSorting: string = '';
        if (sortings) {
            for (let sort of sortings) {
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
