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

export class ArrayUtil {

    /**
     * Returns TRUE if the first array contains all elements from the second one.
     *
     * @param  superset
     * @param  subset
     *
     */
    static arrayContainsArray(superset: any[], subset: any[]): boolean {
        if (0 === subset.length) {
            return false;
        }
        return subset.every((value) => (superset.indexOf(value) >= 0));
    }
}
