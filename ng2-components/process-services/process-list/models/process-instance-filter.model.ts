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

export class ProcessFilterRequestRepresentation {
    processDefinitionId: string;
    appDefinitionId: string;
    state: string;
    sort: string;
    page: number;
    size: number;

    constructor(obj?: any) {
        this.processDefinitionId = obj && obj.processDefinitionId || null;
        this.appDefinitionId = obj && obj.appDefinitionId || null;
        this.state = obj && obj.state || null;
        this.sort = obj && obj.sort || null;
        this.page = obj && obj.page || 0;
        this.size = obj && obj.size || 25;
    }
}
