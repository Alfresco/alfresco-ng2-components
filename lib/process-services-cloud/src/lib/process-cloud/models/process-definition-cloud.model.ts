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

export class ProcessDefinitionCloud {
    id: string;
    appName: string;
    key: string;
    appVersion: number;
    version: number;
    name: string;
    serviceFullName: string;
    serviceName: string;
    serviceType: string;
    serviceVersion: string;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.name = obj && obj.name || null;
        this.appName = obj && obj.appName || null;
        this.key = obj && obj.key || null;
        this.version = obj && obj.version || 0;
        this.appVersion = obj && obj.appVersion || 0;
        this.serviceFullName = obj && obj.serviceFullName || null;
        this.serviceType = obj && obj.serviceType || null;
        this.serviceName = obj && obj.serviceName || null;
        this.serviceVersion = obj && obj.serviceVersion || null;
    }
}
