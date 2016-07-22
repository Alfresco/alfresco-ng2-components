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

import { ProcessInstance } from '../models/process-instance';

export class ProcessList {

    data: ProcessInstance[];
    size: number;
    start: number;
    total: number;

    constructor(data?: ProcessInstance[]) {
        this.data = data || [];
    }
}

export class SingleProcessList extends ProcessList {
    constructor(name?: string) {
        let instance = new ProcessInstance();
        instance.id = '123';
        instance.name = name;
        super([instance]);
    }
}
