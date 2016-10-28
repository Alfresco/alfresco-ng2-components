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

import { Subject } from 'rxjs/Rx';

export interface PaginationProvider {

    /**
     *  The number of objects in the collection.
     */
    count: number;

    /**
     * A boolean value which is true if there are more entities in the collection beyond those in this response.
     * A true value means a request with a larger value for the skipCount or the maxItems parameter will return more entities.
     */
    hasMoreItems: boolean;

    /**
     * An integer describing the total number of entities in the collection.
     * The API might not be able to determine this value, in which case this property will not be present.
     */
    totalItems?: number;

    /**
     * An integer describing how many entities exist in the collection before those included in this list.
     */
    skipCount: number;

    /**
     * The value of the maxItems parameter used to generate this list,
     * or if there was no maxItems parameter the default value is 100.
     */
    maxItems: number;

    /**
     * An event that is emitted every time data is loaded.
     */
    dataLoaded: Subject<any>;
}
