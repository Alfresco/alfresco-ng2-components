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

import { ProcessScopeIdentifierRepresentation } from './processScopeIdentifierRepresentation';

export class ProcessScopesRequestRepresentation {
    identifiers?: ProcessScopeIdentifierRepresentation[];
    overriddenModel?: string;

    constructor(input?: Partial<ProcessScopesRequestRepresentation>) {
        if (input) {
            Object.assign(this, input);
            if (input.identifiers) {
                this.identifiers = input.identifiers.map((item) => {
                    return new ProcessScopeIdentifierRepresentation(item);
                });
            }
        }
    }

}
