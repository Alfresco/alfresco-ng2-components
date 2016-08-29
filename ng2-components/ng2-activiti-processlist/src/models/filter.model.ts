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

/**
 *
 * This object represent the filter.
 *
 *
 * @returns {FilterModel} .
 */
export class FilterModel {
    id: number;
    name: string;
    recent: boolean = false;
    icon: string;
    filter: FilterParamsModel;
    appId: number;

    constructor(name: string, recent: boolean, icon: string, query: string, state: string, assignment: string, appDefinitionId?: string) {
        this.name = name;
        this.recent = recent;
        this.icon = icon;
        this.filter = new FilterParamsModel(query, state, assignment, appDefinitionId);
    }
}

/**
 *
 * This object represent the parameters of a filter.
 *
 *
 * @returns {FilterModel} .
 */
export class FilterParamsModel {
    name: string;
    sort: string;
    state: string;
    appDefinitionId: string;

    constructor(query: string, sort: string, state: string, appDefinitionId?: string) {
        this.name = query;
        this.sort = sort;
        this.state = state;
        this.appDefinitionId = appDefinitionId;
    }
}
