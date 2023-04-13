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

import { Component, ViewEncapsulation, Input, Inject } from '@angular/core';
import {
    AppConfigService, UserPreferencesService
} from '@alfresco/adf-core';
import { ServiceTaskQueryCloudRequestModel } from '../models/service-task-cloud.model';
import { BaseTaskListCloudComponent } from './base-task-list-cloud.component';
import { ServiceTaskListCloudService } from '../services/service-task-list-cloud.service';
import { TaskCloudService } from '../../services/task-cloud.service';
import { combineLatest } from 'rxjs';
import { PreferenceCloudServiceInterface, TASK_LIST_PREFERENCES_SERVICE_TOKEN } from '../../../services/public-api';
import { take } from 'rxjs/operators';

const PRESET_KEY = 'adf-cloud-service-task-list.presets';

@Component({
    selector: 'adf-cloud-service-task-list',
    templateUrl: './base-task-list-cloud.component.html',
    styleUrls: ['./base-task-list-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ServiceTaskListCloudComponent extends BaseTaskListCloudComponent {
    @Input()
    queryParams: { [key: string]: any } = {};

    constructor(private serviceTaskListCloudService: ServiceTaskListCloudService,
                appConfigService: AppConfigService,
                taskCloudService: TaskCloudService,
                userPreferences: UserPreferencesService,
                @Inject(TASK_LIST_PREFERENCES_SERVICE_TOKEN) cloudPreferenceService: PreferenceCloudServiceInterface
            ) {
        super(appConfigService, taskCloudService, userPreferences, PRESET_KEY, cloudPreferenceService);
    }

    reload() {
        this.requestNode = this.createRequestNode();

        if (this.requestNode.appName || this.requestNode.appName === '') {

            combineLatest([
                this.serviceTaskListCloudService.getServiceTaskByRequest(this.requestNode),
                this.isColumnSchemaCreated$
            ]).pipe(
                take(1)
            ).subscribe(
                ([tasks]) => {
                    this.rows = tasks.list.entries;
                    this.success.emit(tasks);
                    this.pagination.next(tasks.list.pagination);
                }, (error) => {
                    this.error.emit(error);
                    this.isLoading = false;
                });
        } else {
            this.rows = [];
        }
    }

    createRequestNode(): ServiceTaskQueryCloudRequestModel {
        const requestNode: ServiceTaskQueryCloudRequestModel = {
            appName: this.appName,
            maxItems: this.size,
            skipCount: this.skipCount,
            sorting: this.sorting,
            id: this.queryParams?.serviceTaskId,
            environmentId: this.queryParams?.environmentId,
            activityName: this.queryParams?.activityName,
            activityType: this.queryParams?.activityType,
            completedDate: this.queryParams?.completedDate,
            elementId: this.queryParams?.elementId,
            executionId: this.queryParams?.executionId,
            processDefinitionId: this.queryParams?.processDefinitionId,
            processDefinitionKey: this.queryParams?.processDefinitionKey,
            processDefinitionVersion: this.queryParams?.processDefinitionVersion,
            processInstanceId: this.queryParams?.processInstanceId,
            serviceFullName: this.queryParams?.serviceFullName,
            serviceName: this.queryParams?.serviceName,
            serviceVersion: this.queryParams?.serviceVersion,
            startedDate: this.queryParams?.startedDate,
            status: this.queryParams?.status
        } as ServiceTaskQueryCloudRequestModel;
        return requestNode;
    }
}
