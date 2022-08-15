/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
    name: 'formatSpace'
})
export class FormatSpacePipe implements PipeTransform {

    transform(inputValue: string, replaceChar: string = '_', lowerCase: boolean = true): string {
        let transformedString = '';
        if (inputValue) {
            transformedString = lowerCase ? inputValue.trim().split(' ').join(replaceChar).toLocaleLowerCase() :
                inputValue.trim().split(' ').join(replaceChar);
        }
        return transformedString;
    }

}
