/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export class ProcessInstanceCloud {
    appName: string;
    id: string;
    name: string;
    startDate: Date;
    initiator: string;
    status: string;
    processDefinitionId: string;
    processDefinitionKey: string;

    constructor(obj?: any) {
        this.appName = obj && obj.appName || null;
        this.id = obj && obj.id || null;
        this.name = obj && obj.name || null;
        this.startDate = obj && obj.startDate || null;
        this.initiator = obj && obj.initiator || null;
        this.status = obj && obj.status || null;
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.processDefinitionKey = obj && obj.processDefinitionKey || null;
    }
}
