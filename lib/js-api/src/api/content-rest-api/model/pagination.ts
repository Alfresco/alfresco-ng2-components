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

export class Pagination {
    /**
     * The number of objects in the entries array.

     */
    count?: number;
    /**
     * A boolean value which is **true** if there are more entities in the collection
beyond those in this response. A true value means a request with a larger value
for the **skipCount** or the **maxItems** parameter will return more entities.

     */
    hasMoreItems?: boolean;
    /**
     * An integer describing the total number of entities in the collection.
The API might not be able to determine this value,
in which case this property will not be present.

     */
    totalItems?: number;
    /**
     * An integer describing how many entities exist in the collection before
those included in this list. If there was no **skipCount** parameter then the
default value is 0.

     */
    skipCount?: number;
    /**
     * The value of the **maxItems** parameter used to generate this list.
If there was no **maxItems** parameter then the default value is 100.

     */
    maxItems?: number;

    constructor(input?: Partial<Pagination>) {
        if (input) {
            Object.assign(this, input);
        }
    }

}
