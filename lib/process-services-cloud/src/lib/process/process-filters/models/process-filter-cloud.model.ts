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
import { DateCloudFilterType } from '../../../models/date-cloud-filter.model';
import { DateRangeFilterService } from '../../../common/date-range-filter/date-range-filter.service';
import { ComponentSelectionMode } from '../../../types';
import { IdentityUserModel } from '@alfresco/adf-core';

export class ProcessFilterCloudModel {

    private dateRangeFilterService = new DateRangeFilterService();

    id: string;
    name: string;
    key: string;
    icon: string;
    index: number;
    appName: string;
    appVersion?: number;
    appVersionMultiple?: number[];
    processName: string;
    processInstanceId: string;
    initiator: IdentityUserModel[];
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
    completedDateType: DateCloudFilterType;
    startedDateType: DateCloudFilterType;
    completedDate: Date;

    private _completedFrom: string;
    private _completedTo: string;
    private _startFrom: string;
    private _startTo: string;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substring(2, 9);
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.icon = obj.icon || null;
            this.index = obj.index || null;
            this.appName = obj.appName || obj.appName === '' ? obj.appName : null;
            this.appVersion = obj.appVersion || null;
            this.appVersionMultiple = obj.appVersionMultiple || null;
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
            this.startFrom = obj._startFrom || null;
            this.startTo = obj._startTo || null;
            this.completedDateType = obj.completedDateType || null;
            this.startedDateType = obj.startedDateType || null;
            this.completedFrom = obj._completedFrom || null;
            this.completedTo = obj._completedTo || null;
            this.completedDate = obj.completedDate || null;
        }
    }

    set completedFrom(completedFrom: string) {
        this._completedFrom = completedFrom;
    }

    set completedTo(completedTo: string) {
        this._completedTo = completedTo;
    }

    get completedFrom() {
        if (this.isDateRangeType(this.completedDateType)) {
            return this._completedFrom;
        }
        return this.getStartDate(this.completedDateType);
    }

    get completedTo() {
        if (this.isDateRangeType(this.completedDateType)) {
            return this._completedTo;
        }
        return this.getEndDate(this.completedDateType);
    }

    set startFrom(startFrom: string) {
        this._startFrom = startFrom;
    }

    set startTo(startTo: string) {
        this._startTo = startTo;
    }

    get startFrom() {
        if (this.isDateRangeType(this.startedDateType)) {
            return this._startFrom;
        }
        return this.getStartDate(this.startedDateType);
    }

    get startTo() {
        if (this.isDateRangeType(this.startedDateType)) {
            return this._startTo;
        }
        return this.getEndDate(this.startedDateType);
    }

    private getStartDate(key: DateCloudFilterType) {
        return this.dateRangeFilterService.getDateRange(key).startDate;
    }

    private getEndDate(key: DateCloudFilterType) {
        return this.dateRangeFilterService.getDateRange(key).endDate;
    }

    private isDateRangeType(type: DateCloudFilterType) {
        return !!this.dateRangeFilterService.isDateRangeType(type);
    }
}

export interface ProcessFilterAction {
    actionType?: string;
    icon?: string;
    tooltip?: string;
    filter?: ProcessFilterCloudModel;
}

export interface ProcessFilterOptions {
    label?: string;
    value?: string | object;
}

export interface ProcessFilterProperties {
    label?: string;
    type?: string;
    value?: any;
    key?: string;
    attributes?: { [key: string]: string; };
    options?: ProcessFilterOptions[];
    dateFilterOptions?: DateCloudFilterType[];
    selectionMode?: ComponentSelectionMode;
}

export interface ProcessSortFilterProperty {
    label: string;
    value: string | object;
    key: string;
}
