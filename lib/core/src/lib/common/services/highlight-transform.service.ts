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

import { Injectable } from '@angular/core';

export interface HighlightTransformResult {
    text: string;
    changed: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class HighlightTransformService {
    /**
     * Searches for `search` string(s) within `text` and highlights all occurrences.
     *
     * @param text Text to search within
     * @param search Text pattern to search for
     * @param wrapperClass CSS class used to provide highlighting style
     * @returns New text along with boolean value to indicate whether anything was highlighted
     */
    public highlight(text: string, search: string, wrapperClass: string = 'adf-highlight'): HighlightTransformResult {
        let isMatching = false;
        let result = text;

        if (search && text) {
            // eslint-disable-next-line no-useless-escape
            let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            pattern = pattern
                .split(' ')
                .filter((t) => t.length > 0)
                .join('|');

            const regex = new RegExp(pattern, 'gi');
            result = this.removeHtmlTags(text).replace(regex, (match) => {
                isMatching = true;
                return `<span class="${wrapperClass}">${match}</span>`;
            });
            return { text: result, changed: isMatching };
        } else {
            return { text: result, changed: isMatching };
        }
    }

    private removeHtmlTags(text: string): string {
        return text.split('>').pop().split('<')[0];
    }
}
