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

import { RequestTemplatesInner } from './requestTemplatesInner';

/**
 * Templates used for query expansion.
A template called \"WOOF\" defined as \"%(cm:name cm:title)\" allows
WOOF:example
to generate
cm:name:example cm:name:example

 */
export class RequestTemplates extends Array<RequestTemplatesInner> {

    constructor(input?: Partial<RequestTemplates>) {
        super();
        if (input) {
            Object.assign(this, input);
        }
    }

}
