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
import { DateCloudFilterType, RangeKeys } from '../../../models/date-cloud-filter.model';

export class ProcessFilterCloudModel {
    id: string;
    name: string;
    key: string;
    icon: string;
    index: number;
    appName: string;
    appVersion?: number;
    processName: string;
    processInstanceId: string;
    initiator: string;
    status: string;
    sort: string;
    order: string;
    processDefinitionId: string;
    processDefinitionName?: string;
    processDefinitionKey: string;
    lastModified: Date;
    lastModifiedTo: Date;
    lastModifiedFrom: Date;
    startedDate: Date;
    startFrom: Date;
    startTo: Date;
    completedFrom: Date;
    completedTo: Date;
    completedDate: Date;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substring(2, 9);
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.icon = obj.icon || null;
            this.index = obj.index || null;
            this.appName = obj.appName || obj.appName === '' ? obj.appName : null;
            this.appVersion = obj.appVersion || null;
            this.processInstanceId = obj.processInstanceId || null;
            this.processName = obj.processName || null;
            this.initiator = obj.initiator || null;
            this.status = obj.status || null;
            this.sort = obj.sort || null;
            this.order = obj.order || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.processDefinitionName = obj.processDefinitionName || null;
            this.processDefinitionKey = obj.processDefinitionKey || null;
            this.lastModified = obj.lastModified || null;
            this.lastModifiedTo = obj.lastModifiedTo || null;
            this.lastModifiedFrom = obj.lastModifiedFrom || null;
            this.startedDate = obj.startedDate || null;
            this.startFrom = obj.startFrom || null;
            this.startTo = obj.startTo || null;
            this.completedFrom = obj.completedFrom || null;
            this.completedTo = obj.completedTo || null;
            this.completedDate = obj.completedDate || null;
        }

    }
}

export class ProcessFilterAction {
    actionType: string;
    icon: string;
    tooltip: string;
    filter: ProcessFilterCloudModel;

     constructor(obj?: any) {
        if (obj) {
            this.actionType = obj.actionType || null;
            this.icon = obj.icon || null;
            this.tooltip = obj.tooltip || null;
            this.filter = obj.filter || null;
        }
    }
}

export interface ProcessFilterOptions {
    label?: string;
    value?: string;
}

export class ProcessFilterProperties {
    label: string;
    type: string;
    value: string;
    key: string;
    options: ProcessFilterOptions[];
    rangeKeys?: RangeKeys;
    dateFilterOptions?: DateCloudFilterType[];

    constructor(obj?: any) {
        if (obj) {
            this.label = obj.label || null;
            this.type = obj.type || null;
            this.value = obj.value || '';
            this.key = obj.key || null;
            this.rangeKeys = obj.rangeKeys || null;
            this.options = obj.options || null;
            this.rangeKeys = obj.rangeKeys || null;
            this.dateFilterOptions = obj.dateFilterOptions || [];
        }
    }
}

export interface ProcessSortFilterProperties {
    label: string;
    value: string;
    key: string;
}
