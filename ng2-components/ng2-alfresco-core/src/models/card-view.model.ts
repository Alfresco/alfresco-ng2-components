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
 * This object represent the basic structure of a card view.
 *
 *
 * @returns {CardViewModel} .
 */

export class CardViewModel {
    label: string;
    value: any;
    key: any;
    format: string;
    default: string;

    constructor(obj?: any) {
        this.label = obj.label || '';
        this.value = obj.value;
        this.key = obj.key;
        this.format = obj.format;
        this.default = obj.default;
    }
}
