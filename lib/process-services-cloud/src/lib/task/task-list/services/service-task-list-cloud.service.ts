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
import { ServiceTaskQueryCloudRequestModel, ServiceTaskIntegrationContextCloudModel } from '../models/service-task-cloud.model';
import { Observable, throwError } from 'rxjs';
import { TaskListCloudSortingModel } from '../../../models/task-list-sorting.model';
import { BaseCloudService } from '../../../services/base-cloud.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ServiceTaskListCloudService extends BaseCloudService {
    /**
     * Finds a task using an object with optional query properties.
     *
     * @param requestNode Query object
     * @returns Task information
     */
    getServiceTaskByRequest(requestNode: ServiceTaskQueryCloudRequestModel): Observable<any> {
        if (requestNode.appName || requestNode.appName === '') {
            const queryUrl = `${this.getBasePath(requestNode.appName)}/query/admin/v1/service-tasks`;
            const queryParams = this.buildQueryParams(requestNode);
            const sortingParams = this.buildSortingParam(requestNode.sorting);
            if (sortingParams) {
                queryParams['sort'] = sortingParams;
            }
            return this.get(queryUrl, queryParams);
        } else {
            this.logService.error('Appname is mandatory for querying task');
            return throwError('Appname not configured');
        }
    }

    /**
     * Finds a service task integration context using an object with optional query properties.
     *
     * @param appName string
     * @param serviceTaskId string
     * @returns Service Task Integration Context information
     */
    getServiceTaskStatus(appName: string, serviceTaskId: string): Observable<ServiceTaskIntegrationContextCloudModel> {
        if (appName) {
            const queryUrl = `${this.getBasePath(appName)}/query/admin/v1/service-tasks/${serviceTaskId}/integration-context`;
            return this.get(queryUrl).pipe(
                map((response: any) => response.entry)
            );
        } else {
            this.logService.error('Appname is mandatory for querying task');
            return throwError('Appname not configured');
        }
    }

    /**
     * Replay a service task based on the related execution id and flow-node id
     *
     * @param appName string
     * @param executionId string
     * @param flowNodeId string
     * @returns Replay task informations
     */
    replayServiceTaskRequest(appName: string, executionId: string, flowNodeId: string): Observable<any> {
        if (appName && executionId && flowNodeId) {
            const payload = { flowNodeId };
            const queryUrl = `${this.getBasePath(appName)}/rb/admin/v1/executions/${executionId}/replay/service-task`;
            return this.post(queryUrl, payload);
        } else {
            this.logService.error('Appname, executionId and flowNodeId are mandatory to replaying a service task');
            return throwError('Appname/executionId/flowNodeId not configured');
        }
    }

    protected buildQueryParams(requestNode: ServiceTaskQueryCloudRequestModel): any {
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
