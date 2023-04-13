/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    ProcessFilterRequestRepresentation,
    ProcessInstanceFilterRepresentation,
    UserProcessInstanceFilterRepresentation
} from '@alfresco/js-api';

export class FilterProcessRepresentationModel implements UserProcessInstanceFilterRepresentation {
    appId: number;
    filter: ProcessInstanceFilterRepresentation;
    icon: string;
    id: number;
    index: number;
    name: string;
    recent: boolean;

    constructor(obj: any) {
        if (obj) {
            this.id = obj.id || null;
            this.appId = obj.appId || null;
            this.name = obj.name || null;
            this.recent = !!obj.recent;
            this.icon = obj.icon || null;
            this.filter = obj.filter || null;
            this.index = obj.index;
        }
    }

    hasFilter() {
        return !!this.filter;
    }
}

/**
 * This object represent the parameters of a process filter.
 */
export class ProcessFilterParamRepresentationModel implements ProcessFilterRequestRepresentation {

    processDefinitionId?: string;
    processInstanceId?: string;
    appDefinitionId?: number;
    state?: any;
    sort?: any;
    page?: number;
    size?: number;

    constructor(obj?: any) {
        this.processDefinitionId = obj.processDefinitionId || null;
        this.appDefinitionId = obj.appDefinitionId || null;
        this.processInstanceId = obj.processInstanceId || null;
        this.state = obj.state || null;
        this.sort = obj.sort || null;
        this.page = obj.page || null;
        this.size = obj.size || null;
    }
}
