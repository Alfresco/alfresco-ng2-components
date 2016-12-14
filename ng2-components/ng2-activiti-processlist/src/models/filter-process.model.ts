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
    id: number;
    appId: string;
    name: string;
    recent: boolean;
    icon: string;
    filter: any;
    index: number;

    constructor(obj?: any) {
        this.appId = obj && obj.appId || null;
        this.name = obj && obj.name || null;
        this.recent = obj && obj.recent || false;
        this.icon = obj && obj.icon || null;
        this.filter = obj && obj.filter || null;
        this.index = obj && obj.index;
    }

    hasFilter() {
        return this.filter ? true : false;
    }
}
