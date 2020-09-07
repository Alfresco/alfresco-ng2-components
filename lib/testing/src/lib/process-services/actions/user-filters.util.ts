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

import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../core/actions/api.service';
import { UserProcessInstanceFilterRepresentation, UserFilterOrderRepresentation } from '@alfresco/js-api';

export class UserFiltersUtil {

    apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    }

    async createATaskFilter(newTaskFilterName: string, sortType?: string,  stateType?: string, assignmentType?: string, appId?: number, iconName?: string): Promise<any> {
        try {
            return this.apiService.getInstance().activiti.userFiltersApi.createUserTaskFilter(new UserProcessInstanceFilterRepresentation(
                {appId: appId, name: newTaskFilterName, icon: iconName, filter: {sort: sortType, state: stateType, assignment: assignmentType}}));
        } catch (error) {
            Logger.error('Create Task Filter - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async orderUserTaskFilters(filtersIdOrder: number[], appId?: number): Promise<any> {
        try {
            return this.apiService.getInstance().activiti.userFiltersApi.orderUserTaskFilters(new UserFilterOrderRepresentation({appId: appId, order: filtersIdOrder}));
        } catch (error) {
            Logger.error('Re-order the list of user task filters - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async getUserTaskFilters(appId?: number): Promise<any> {
        try {
            return this.apiService.getInstance().activiti.userFiltersApi.getUserTaskFilters({appId: appId});
        } catch (error) {
            Logger.error('List task filters - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }

    async deleteUserTaskFilter(filterId: number): Promise<any> {
        try {
            return this.apiService.getInstance().activiti.userFiltersApi.deleteUserTaskFilter(filterId);
        } catch (error) {
            Logger.error('Delete a task filter - Service error, Response: ', JSON.parse(JSON.stringify(error)));
        }
    }
}
