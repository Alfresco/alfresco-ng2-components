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
export class ProcessQueryModel {
    processDefinitionId: string;
    appName: string;
    state: string;
    sort: string;
    assignment: string;
    order: string;

    constructor(obj?: any) {
        if (obj) {
            this.appName = obj.appName || null;
            this.processDefinitionId = obj.processDefinitionId || null;
            this.state = obj.state || null;
            this.sort = obj.sort || null;
            this.assignment = obj.assignment || null;
            this.order = obj.order || null;
        }
    }
}
export class ProcessFilterRepresentationModel {
    id: string;
    name: string;
    key: string;
    icon: string;
    query: ProcessQueryModel;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substring(2, 9);
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.icon = obj.icon || null;
            this.query = new ProcessQueryModel(obj.query);
        }
    }

    hasFilter() {
        return !!this.query;
    }
}

export class ProcessFilterParamModel {
    id: string;
    name: string;
    key: string;
    index: number;
    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.name = obj.name || null;
            this.key = obj.key || null;
            this.index = obj.index || null;
        }
    }
}

export class FilterActionType {
    actionType: string;
    constructor(action: string) {
        this.actionType = action;
    }
}
