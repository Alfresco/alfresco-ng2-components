/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/**
 * Common query defaults
 */
export interface RequestDefaults {
    /**
     * A list of query fields/properties used to expand TEXT: queries.
     * The default is cm:content.
     * You could include all content properties using d:content or list all individual content properties or types.
     * As more terms are included the query size, complexity, memory impact and query time will increase.
     */
    textAttributes?: string[];
    /**
     * The default way to combine query parts when AND or OR is not explicitly stated - includes ! - +
     * one two three
     * (one two three)
     */
    defaultFTSOperator?: 'AND' | 'OR' | string;
    /**
     * The default way to combine query parts in field query groups when AND or OR is not explicitly stated - includes ! - +
     * FIELD:(one two three)
     */
    defaultFTSFieldOperator?: 'AND' | 'OR' | string;
    /**
     * The default name space to use if one is not provided
     */
    namespace?: string;
    defaultFieldName?: string;
}
