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

import { RequestHighlightFields } from './requestHighlightFields';

/**
 * Request that highlight fragments to be added to result set rows
The properties reflect SOLR highlighting parameters.

 */
export class RequestHighlight {
    /**
     * The string used to mark the start of a highlight in a fragment.
     */
    prefix?: string;
    /**
     * The string used to mark the end of a highlight in a fragment.
     */
    postfix?: string;
    /**
     * The maximum number of distinct highlight snippets to return for each highlight field.
     */
    snippetCount?: number;
    /**
     * The character length of each snippet.
     */
    fragmentSize?: number;
    /**
     * The number of characters to be considered for highlighting. Matches after this count will not be shown.
     */
    maxAnalyzedChars?: number;
    /**
     * If fragments over lap they can be  merged into one larger fragment
     */
    mergeContiguous?: boolean;
    /**
     * Should phrases be identified.
     */
    usePhraseHighlighter?: boolean;
    /**
     * The fields to highlight and field specific configuration properties for each field
     */
    fields?: RequestHighlightFields[];

    constructor(input?: Partial<RequestHighlight>) {
        if (input) {
            Object.assign(this, input);
            if (input.fields) {
                this.fields = input.fields.map((item) => {
                    return new RequestHighlightFields(item);
                });
            }
        }
    }

}
