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

import { RestVariable } from '@alfresco/js-api';

export class ProcessInstanceVariable implements RestVariable {

    name?: string;
    scope?: string;
    type?: string;
    value?: string;
    valueUrl?: string;

    constructor(obj?: any) {
        this.name = obj && obj.name !== undefined ? obj.name : null;
        this.scope = obj && obj.scope !== undefined ? obj.scope : null;
        this.value = obj && obj.value !== undefined ? obj.value : null;
        this.valueUrl = obj && obj.valueUrl !== undefined ? obj.valueUrl : null;
    }
}
