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

export type GsGroupInclude = {
    /**
     * Returns additional information about the security group. The following optional fields can be requested:
     *  - inUse - A flag indicating whether the security group is in use or not.
     */
    include?: string;
};

export type GsPagingQuery = {
    /**
     * The number of entities that exist in the collection before those included in this list.
     */
    skipCount?: number;

    /**
     * The maximum number of items to return in the list.
     */
    maxItems?: number;
};

export type GsFieldsQuery = {
    /**
     * A list of field names.
     *
     * You can use this parameter to restrict the fields
     * returned within a response if, for example, you want to save on overall bandwidth.
     *
     * The list applies to a returned individual
     * entity or entries within a collection.
     *
     * If the API method also supports the **include**
     * parameter, then the fields specified in the **include**
     * parameter are returned in addition to those specified in the **fields** parameter.
     */
    fields?: string[];
};

export type GsIncludeQuery = {
    /**
     * Returns additional information about the record. Any optional field from the response model can be requested.
     */
    include?: string[];
};
