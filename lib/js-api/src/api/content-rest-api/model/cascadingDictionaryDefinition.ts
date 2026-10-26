/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DateAlfresco } from '../../content-custom-api';
import { CascadingDictionaryLevel } from './cascadingDictionaryLevel';

export class CascadingDictionaryDefinition {
    /** The name of the cascading dictionary, e.g. "Accounts". */
    name: string;
    /** The prefixed name of the aspect describing the cascading dictionary, e.g. 'cdict:account'. */
    aspect: string;
    /** The prefixed name of the key property, e.g. 'cdict:accountNumber'. */
    keyProperty: string;
    /** The prefixed name of the version property, e.g. 'cdict:accountDictVersion'. */
    versionProperty: string;
    /** The version of the cascading dictionary definition, e.g. '1.5'. */
    version: string;
    levels: CascadingDictionaryLevel[];
    createdAt: Date;
    modifiedAt: Date;

    constructor(input?: Partial<CascadingDictionaryDefinition>) {
        if (input) {
            Object.assign(this, input);
            if (input.levels) {
                this.levels = input.levels.map((item) => new CascadingDictionaryLevel(item));
            }
            this.createdAt = input.createdAt ? DateAlfresco.parseDate(input.createdAt) : undefined;
            this.modifiedAt = input.modifiedAt ? DateAlfresco.parseDate(input.modifiedAt) : undefined;
        }
    }
}
