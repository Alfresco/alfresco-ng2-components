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

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

    constructor() { }

    transform(text: string, search: string): any {
        if (search && text) {
            let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
            pattern = pattern.split(' ').filter((t) => {
                return t.length > 0;
            }).join('|');
            const regex = new RegExp(pattern, 'gi');
            let result = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
            return result;
        } else {
            return text;
        }
    }
}
