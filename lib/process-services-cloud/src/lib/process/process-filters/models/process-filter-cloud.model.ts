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

import { Observable } from 'rxjs';

export class ProcessFilterCloudModel {
    id: string;
    name: string;
    key: string;
    icon: string;
    index: number;
    appName: string;
    processName: string;
    initiator: string;
    state: string;
    sort: string;
    order: string;
    processDefinitionId: string;
    processDefinitionKey: string;
    processInstanceId: string;
    startDate: Date;
    lastModified: Date;
    lastModifiedTo: Date;
    lastModifiedFrom: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substring(2, 9);
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.icon = obj.icon || null;
            this.index = obj.index || null;
            this.appName = obj.appName || null;
            this.processName = obj.processName || null;
            this.initiator = obj.initiator || null;
            this.state = obj.state || null;
            this.sort = obj.sort || null;
            this.order = obj.order || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.processDefinitionKey = obj.processDefinitionKey || null;
            this.processInstanceId = obj.processInstanceId || null;
            this.startDate = obj.startDate || null;
            this.lastModified = obj.lastModified || null;
            this.lastModifiedTo = obj.lastModifiedTo || null;
            this.lastModifiedFrom = obj.lastModifiedFrom || null;
        }
    }
}

export interface ProcessFilterActionType {
    actionType: string;
    id: string;
}

export interface FilterOptions {
    label?: string;
    value?: string;
}

export class ProcessFilterProperties {
    label: string;
    type: string; // text|date|select
    value: string;
    key: string;
    options$: Observable<FilterOptions[]>;

    constructor(obj?: any) {
        if (obj) {
            this.label = obj.label || null;
            this.type = obj.type || null;
            this.value = obj.value || null;
            this.key = obj.key || null;
            this.options$ = obj.options || null;
        }
    }
}
