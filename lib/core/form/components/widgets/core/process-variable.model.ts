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

export interface ProcessVariableModel {
    serviceName?: string;
    serviceFullName?: string;
    serviceVersion?: string;
    appName?: string;
    appVersion?: string;
    serviceType?: string;
    id?: number;
    type?: string;
    name?: string;
    createTime?: number;
    lastUpdatedTime?: number;
    executionId?: string;
    value?: any;
    markedAsDeleted?: boolean;
    processInstanceId?: string;
    taskId?: string;
    taskVariable?: boolean;
}
