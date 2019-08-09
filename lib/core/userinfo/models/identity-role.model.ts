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
export class IdentityRoleModel {
    id: string;
    name: string;
    description?: string;
    clientRole?: boolean;
    composite?: boolean;
    containerId?: string;
    scopeParamRequired?: boolean;

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || null;
            this.name = obj.name || null;
            this.description = obj.description || null;
            this.clientRole = obj.clientRole || null;
            this.composite = obj.composite || null;
            this.containerId = obj.containerId || null;
            this.scopeParamRequired = obj.scopeParamRequired || null;
        }
    }
}
