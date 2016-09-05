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

    constructor(name: string, recent: boolean, icon: string, query: string, state: string, assignment: string, appDefinitionId?: string) {
        this.name = name;
        this.recent = recent;
        this.icon = icon;
        this.filter = new FilterParamsModel(assignment, state, query, appDefinitionId);
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
    appDefinitionId: string;
    processInstanceId: string;
    processDefinitionId: string;
    text: string;
    assignment: string;
    state: string;
    sort: string;
    page: number = 0;
    size: number = 25;

    constructor(assignment: string, state: string, text: string, appDefinitionId?: string, processInstanceId?: string,
                processDefinitionId?: string, page?: number, size?: number) {
        this.appDefinitionId = appDefinitionId;
        this.processInstanceId = processInstanceId;
        this.processDefinitionId = processDefinitionId;
        this.text = text;
        this.assignment = assignment;
        this.state = state;
        this.page = page;
        this.size = size;
    }
}
