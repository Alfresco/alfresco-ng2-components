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

import { CascadingDictionaryContentDefinition } from './cascadingDictionaryContentDefinition';
import { CascadingDictionaryItem } from './cascadingDictionaryItem';

export interface CascadingDictionaryContentBody {
    /**
     * The level definitions for the cascading dictionary content, specifying the properties used at each level.
     *
     * This is needed to correctly interpret the content data and validate it against the dictionary
     * registered in the system.
     */
    definition: CascadingDictionaryContentDefinition;
    /**
     * The actual content of the cascading dictionary, organized in a hierarchical structure according to
     * the levels defined in the definition object.
     */
    data: CascadingDictionaryItem[];
}
