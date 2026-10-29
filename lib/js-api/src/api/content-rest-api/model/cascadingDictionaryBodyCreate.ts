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

export interface CascadingDictionaryBodyCreate {
    /** The unique name of the cascading dictionary. */
    name: string;
    /**
     * The prefixed name of the aspect describing the cascading dictionary, e.g. 'cdict:account'.
     *
     * The aspect must already be defined in the repository and registered as a cascading dictionary.
     * It must also contain at least the key and version properties defined below.
     */
    aspect: string;
    /** The prefixed name of the key property, e.g. 'cdict:accountNumber'. */
    keyProperty: string;
    /** The prefixed name of the version property, e.g. 'cdict:accountDictVersion'. */
    versionProperty: string;
}
