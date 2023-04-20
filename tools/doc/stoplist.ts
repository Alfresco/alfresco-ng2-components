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

import * as fs from 'fs';

/* "Stoplist" of regular expressions to match against strings. */
export class Stoplist {
    regexes: RegExp[];

    constructor(slFilePath: string) {
        const listExpressions = JSON.parse(fs.readFileSync(slFilePath, 'utf8'));
        this.regexes = [];

        if (listExpressions) {
            for (let i = 0; i < listExpressions.length; i++) {
                this.regexes.push(new RegExp(listExpressions[i]));
            }
        } else {
            this.regexes = [];
        }
    }

    // Check if an item is covered by the stoplist and reject it if so.
    isRejected(itemName: string) {
        for (let i = 0; i < this.regexes.length; i++) {
            if (this.regexes[i].test(itemName)) {
                return true;
            }
        }

        return false;
    }

}
