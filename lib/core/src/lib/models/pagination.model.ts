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

export class PaginationModel {
    merge?: boolean;
    count?: number;
    hasMoreItems?: boolean;
    totalItems?: number;
    skipCount?: number;
    maxItems?: number;

    constructor(input?: any) {
        if (input) {
            this.count = input.count;
            this.hasMoreItems = input.hasMoreItems ? input.hasMoreItems : false;
            this.merge = input.merge ? input.merge : false;
            this.totalItems = input.totalItems;
            this.skipCount = input.skipCount;
            this.maxItems = input.maxItems;
        }
    }
}
