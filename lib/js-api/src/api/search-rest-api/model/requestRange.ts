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

/**
 * Facet range
 */
export class RequestRange {
    /**
     * The name of the field to perform range
     */
    field?: string;
    /**
     * The start of the range
     */
    start?: string;
    /**
     * The end of the range
     */
    end?: string;
    /**
     * Bucket size
     */
    gap?: string;
    /**
     * If true means that the last bucket will end at “end” even if it is less than “gap” wide.
     */
    hardend?: boolean;
    /**
     * before, after, between, non, all
     */
    other?: string[];
    /**
     * lower, upper, edge, outer, all
     */
    include?: string[];
    /**
     * A label to include as a pivot reference
     */
    label?: string;
    /**
     * Filter queries to exclude when calculating statistics
     */
    excludeFilters?: string[];

    constructor(input?: Partial<RequestRange>) {
        if (input) {
            Object.assign(this, input);
        }
    }
}
