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
import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { TaskQueryCloudRequestModel } from '../models/filter-cloud.model';
import { Observable, from } from 'rxjs';

@Injectable()
export class TaskListCloudService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    contentTypes = ['application/json'];
    accepts = ['application/json'];

    // mockResponse = {
    //     list: {
    //         entries: [
    //             {
    //                 entry: {
    //                     serviceName: 'test-francesco-rb',
    //                     serviceFullName: 'test-francesco-rb',
    //                     serviceVersion: '',
    //                     appName: 'test-francesco',
    //                     appVersion: '',
    //                     serviceType: null,
    //                     id: '5153d835-bce2-11e8-855e-0a58646001d6',
    //                     assignee: null,
    //                     name: 'My Parent Task',
    //                     description: 'My Parent Task',
    //                     createdDate: 1537454084786,
    //                     dueDate: null,
    //                     claimedDate: null,
    //                     priority: 15,
    //                     category: null,
    //                     processDefinitionId: null,
    //                     processInstanceId: null,
    //                     status: 'CREATED',
    //                     owner: 'superadminuser',
    //                     parentTaskId: null,
    //                     lastModified: 1537454084786,
    //                     lastModifiedTo: null,
    //                     lastModifiedFrom: null,
    //                     standAlone: true
    //                 }
    //             }
    //         ],
    //         pagination: {
    //             skipCount: 0,
    //             maxItems: 100,
    //             count: 1,
    //             hasMoreItems: false,
    //             totalItems: 1
    //         }
    //     }
    // };

    getTaskByRequest(requestNode: TaskQueryCloudRequestModel): Observable<any> {
        let queryUrl = this.buildQueryUrl(requestNode);
        let queryParams = this.buildQueryParams(requestNode);
        this.logService.log('Performin Call');
        return from(this.apiService.getInstance()
                .oauth2Auth.callCustomApi(queryUrl, 'GET',
                                    null, queryParams, null ,
                                    null, null, null, ['application/json'],
                                    ['application/json'], Object, null, null)
        );
    }

    private buildQueryUrl(requestNode: TaskQueryCloudRequestModel) {
        return `${this.apiService.getInstance().config.hostBpm}/${requestNode.appName}-query/v1/tasks`;
    }

    private buildQueryParams(requestNode: TaskQueryCloudRequestModel) {
        let queryParam = {};
        for (let property in requestNode) {
            /*tslint:disable-next-line*/
            console.log(property);
            if (requestNode.hasOwnProperty(property) &&
                property.toString().toLocaleLowerCase() !== 'appName' &&
                requestNode[property]) {
                queryParam[property] = requestNode[property];
            }
        }
        return queryParam;
    }
}
