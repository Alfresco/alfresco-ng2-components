/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

export class TaskListCloudSortingModel {
    orderBy: string;
    direction: string;

    constructor(obj: any) {
        if (obj) {
            this.orderBy = obj.orderBy;
            this.direction = obj.direction;
        }
    }
}

export class TaskListRequestSortingModel extends TaskListCloudSortingModel {
    orderBy: string;
    direction: string;

    isFieldProcessVariable: boolean;
    processVariableData?: {
        processDefinitionKey: string;
        type: string;
    }

    constructor(obj: TaskListRequestSortingModel) {
        super(obj);
        if (obj.isFieldProcessVariable) {
            this.isFieldProcessVariable = true;
            this.processVariableData = obj.processVariableData;
            if (!this.processVariableData.processDefinitionKey || !this.processVariableData.type) {
                throw new Error('missing required property when sorting by process variable');
            }
        } else {
            this.isFieldProcessVariable = false;
        }
    }
}
