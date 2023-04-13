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

import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../../shared/api/api.service';
import { UserFiltersApi, UserFilterOrderRepresentation, UserTaskFilterRepresentation, ResultListDataRepresentationUserProcessInstanceFilterRepresentation } from '@alfresco/js-api';

export class UserFiltersUtil {

    apiService: ApiService;
    userFiltersApi: UserFiltersApi;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
        this.userFiltersApi = new UserFiltersApi(apiService.getInstance());
    }

    async createATaskFilter(newTaskFilterName: string, sortType?: string,  stateType?: string, assignmentType?: string, iconName?: string, appId?: number): Promise<any> {
        try {
            return this.userFiltersApi.createUserTaskFilter(new UserTaskFilterRepresentation(
                {appId, name: newTaskFilterName, icon: iconName, filter: {sort: sortType, state: stateType, assignment: assignmentType}}));
        } catch (error) {
            Logger.error('Create Task Filter - Service error, Response: ', error);
        }
    }

    async createUserTaskFilter(userTaskFilterRepresentation: UserTaskFilterRepresentation): Promise<any> {
        try {
            return this.userFiltersApi.createUserTaskFilter(userTaskFilterRepresentation);
        } catch (error) {
            Logger.error('Create Task Filter - Service error, Response: ', error);
        }
    }

    async orderUserTaskFilters(filtersIdOrder: number[], appId?: number): Promise<any> {
        try {
            return this.userFiltersApi.orderUserTaskFilters(new UserFilterOrderRepresentation({appId, order: filtersIdOrder}));
        } catch (error) {
            Logger.error('Re-order the list of user task filters - Service error, Response: ', error);
        }
    }

    async getUserTaskFilters(appId?: number): Promise<any> {
        try {
            return this.userFiltersApi.getUserTaskFilters({appId});
        } catch (error) {
            Logger.error('List task filters - Service error, Response: ', error);
        }
    }

    async getUserProcessFilters(appId?: number): Promise<ResultListDataRepresentationUserProcessInstanceFilterRepresentation> {
        try {
            return this.userFiltersApi.getUserProcessInstanceFilters({ appId });
        } catch (error) {
            Logger.error('List process filters - Service error, Response: ', error);
            return new ResultListDataRepresentationUserProcessInstanceFilterRepresentation();
        }
    }

    async getUserTaskFilterByName(taskFilterName: string, appId?: number): Promise<any> {
        try {
            const taskFiltersList = this.userFiltersApi.getUserTaskFilters({appId});
            const chosenTaskFilter = (await taskFiltersList).data.find( (taskFilter) => taskFilter.name === taskFilterName);
            return chosenTaskFilter;
        } catch (error) {
            Logger.error('Get user task filters by name - Service error, Response: ', error);
        }
    }

    async deleteUserTaskFilter(filterId: number): Promise<any> {
        try {
            return this.userFiltersApi.deleteUserTaskFilter(filterId);
        } catch (error) {
            Logger.error('Delete a task filter - Service error, Response: ', error);
        }
    }

    async updateUserTaskFilter(filterId: number, updatedTaskFilterName?: string, updatedSortType?: string, updatedStateType?: string, updatedAssignmentType?: string, updatedIconName?: string, appId?: number): Promise<any> {
        try {
            return this.userFiltersApi.updateUserTaskFilter(filterId, new UserTaskFilterRepresentation(
                {appId, name: updatedTaskFilterName, icon: updatedIconName, filter: {sort: updatedSortType, state: updatedStateType, assignment: updatedAssignmentType}}));
        } catch (error) {
            Logger.error('Update a task filter - Service error, Response: ', error);
        }
    }
}
