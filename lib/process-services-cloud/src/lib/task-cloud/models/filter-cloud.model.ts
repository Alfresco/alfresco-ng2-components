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

export class TaskFilterCloudModel  {
    id: string;
    name: string;
    key: string;
    icon: string;
    index: number;
    appName: string;
    processDefinitionId: string;
    state: string;
    sort: string;
    assignment: string;
    order: string;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || Math.random().toString(36).substr(2, 9);
            this.name = obj.name;
            this.key = obj.key;
            this.icon = obj.icon;
            this.index = obj.index;
            this.appName = obj.appName;
            this.processDefinitionId = obj.processDefinitionId;
            this.state = obj.state;
            this.sort = obj.sort;
            this.assignment = obj.assignment;
            this.order = obj.order;
        }
    }
}

export interface FilterActionType {
    actionType: string;
    id: string;
}
