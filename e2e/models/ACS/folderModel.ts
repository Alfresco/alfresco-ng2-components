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

import { Util } from '../../util/util';

export class FolderModel {

    id = Util.generateRandomString();
    name = Util.generateRandomString();
    shortName = this.name;
    tooltip = this.name;
    location = '';
    description = '';

    constructor(details?: any) {
        Object.assign(this, details);
    }

    getName() {
        return this.name;
    }

    getShortName() {
        return this.shortName;
    }

    getTooltip() {
        return this.tooltip;
    }

    getId() {
        return this.id;
    }

    getLocation() {
        return this.location;
    }

}
