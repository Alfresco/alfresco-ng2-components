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
 * @returns {FilterRepresentationModel} .
 */
export class FilterRepresentationModel {
    id: number;
    appId: string;
    name: string;
    recent: boolean;
    icon: string;
    filter: FilterParamRepresentationModel;
    index: number;

    constructor(obj?: any) {
        this.appId = obj && obj.appId || null;
        this.name = obj && obj.name || null;
        this.recent = obj && obj.recent || false;
        this.icon = obj && obj.icon || null;
        this.filter = new FilterParamRepresentationModel(obj.filter);
        this.index = obj && obj.index;
    }
}

/**
 *
 * This object represent the parameters of a filter.
 *
 *
 * @returns {FilterParamRepresentationModel} .
 */
export class FilterParamRepresentationModel {
    processDefinitionId: string;
    processDefinitionKey: string;
    name: string;
    state: string;
    sort: string;

    constructor(obj?: any) {
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.processDefinitionKey = obj && obj.processDefinitionKey || null;
        this.name = obj && obj.name || null;
        this.state = obj && obj.state || null;
        this.sort = obj && obj.sort || null;
    }
}

export class UserProcessInstanceFilterRepresentationModel extends FilterRepresentationModel {
    public filter: ProcessInstanceFilterRepresentation;
    constructor(obj?: any) {
        super(obj);
        this.filter = new ProcessInstanceFilterRepresentation(obj.filter);
    }
}

export class ProcessInstanceFilterRepresentation extends FilterParamRepresentationModel {
    constructor(obj?: any) {
        super(obj);
    }
}
