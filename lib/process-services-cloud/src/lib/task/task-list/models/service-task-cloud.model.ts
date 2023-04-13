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

import { TaskListCloudSortingModel } from '../../../models/task-list-sorting.model';

export interface ServiceTaskQueryCloudRequestModel {
    appName: string;
    appVersion?: string;
    environmentId?: string;
    id?: string;
    status?: string;
    maxItems: number;
    skipCount: number;
    sorting?: TaskListCloudSortingModel[];
    activityName?: string;
    activityType?: string;
    completedDate?: Date;
    elementId?: string;
    executionId?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionVersion?: number;
    processInstanceId?: string;
    serviceFullName?: string;
    serviceName?: string;
    serviceVersion?: string;
    startedDate?: Date;
}

export interface ServiceTaskIntegrationContextCloudModel extends ServiceTaskQueryCloudRequestModel {
    errorDate?: Date;
    errorClassName?: string;
    errorCode?: string;
    errorMessage?: string;
}
