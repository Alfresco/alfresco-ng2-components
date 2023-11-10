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

import { SearchEntryHighlight } from './searchEntryHighlight';

export class SearchEntry {
    /**
     * The score for this row
     */
    score?: number;
    /**
     * Highlight fragments if requested and available. A match can happen in any of the requested field.

     */
    highlight?: SearchEntryHighlight[];

    constructor(input?: Partial<SearchEntry>) {
        if (input) {
            Object.assign(this, input);
            if (input.highlight) {
                this.highlight = input.highlight.map((item) => {
                    return new SearchEntryHighlight(item);
                });
            }
        }
    }

}
