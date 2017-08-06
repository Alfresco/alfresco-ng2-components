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
 * @returns {FilterProcessRepresentationModel} .
 */
export class FilterProcessRepresentationModel {
    id: string;
    appId: string;
    name: string;
    recent: boolean;
    icon: string;
    filter: ProcessFilterParamRepresentationModel;
    index: number;

    constructor(obj?: any) {
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
        return this.filter ? true : false;
    }
}

/**
 *
 * This object represent the parameters to filter a filter.
 *
 *
 * @returns {FilterParamsModel} .
 */
export class FilterParamsModel {
    id: string;
    name: string;
    index: number;

    constructor(obj?: any) {
        this.id = obj.id || null;
        this.name = obj.name || null;
        this.index = obj.index;
    }
}

/**
 *
 * This object represent the parameters of a process filter.
 *
 *
 * @returns {ProcessFilterParamRepresentationModel} .
 */
export class ProcessFilterParamRepresentationModel {
    state: string;
    sort: string;

    constructor(obj?: any) {
        this.state = obj.state || null;
        this.sort = obj.sort || null;
    }
}
