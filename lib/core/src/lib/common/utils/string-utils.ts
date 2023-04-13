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

import { ObjectUtils } from './object-utils';

export class StringUtils {

    static capitalize(target: string): string {
        return target.charAt(0).toUpperCase() + target.slice(1).toLowerCase();
    }

    static replaceAll(target: string, delimiters: any): string {
        if (!ObjectUtils.isObject(delimiters)) {
            return target;
        }

        Object.keys(delimiters).forEach((key) => {
            target = target.replace(key, delimiters[key]);
        });

        return target;
    }

    static removeAll(target: string, ...delimiters: string[]): string {
        const delimiterObj = {};
        delimiters.forEach(delimiter => {
            delimiterObj[delimiter] = '';
        });

        return StringUtils.replaceAll(target, delimiterObj);
    }

    static prettifyBooleanEnabled(target: string): string {
        const redactedTarget = StringUtils.removeAll(target.toLowerCase(), 'is', 'enabled');
        const bagOfWords = redactedTarget.split(' ');
        const capitalizedBagOfWords = bagOfWords.map((word) => StringUtils.capitalize(word));


        return capitalizedBagOfWords.join(' ');
    }

}
