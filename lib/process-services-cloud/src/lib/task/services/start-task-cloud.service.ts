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
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StartTaskCloudRequestModel } from '../start-task/models/start-task-cloud-request.model';
import { TaskDetailsCloudModel, StartTaskCloudResponseModel } from '../start-task/models/task-details-cloud.model';
import { BaseCloudService } from '../../services/base-cloud.service';

@Injectable({ providedIn: 'root' })
export class StartTaskCloudService extends BaseCloudService {

    constructor(
        apiService: AlfrescoApiService,
        appConfigService: AppConfigService) {
        super(apiService, appConfigService);
    }

     /**
      * @deprecated in 3.5.0, use TaskCloudService instead.
      * Creates a new standalone task.
      * @param taskDetails Details of the task to create
      * @returns Details of the newly created task
      */
    createNewTask(taskDetails: TaskDetailsCloudModel): Observable<TaskDetailsCloudModel> {
        const url = `${this.getBasePath(taskDetails.appName)}/rb/v1/tasks`;
        const payload = JSON.stringify(new StartTaskCloudRequestModel(taskDetails));

        return this.post<any, StartTaskCloudResponseModel>(url, payload)
            .pipe(
                map(response => response.entry)
            );
    }
}
