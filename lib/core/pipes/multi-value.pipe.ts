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

@Pipe({ name: 'multiValue' })
export class MultiValuePipe implements PipeTransform {

    static DEFAULT_SEPARATOR = ', ';

    transform(values: string | string [], valueSeparator: string = MultiValuePipe.DEFAULT_SEPARATOR): string {

        if (values && values instanceof Array) {
            const valueList = values.map((value) => value.trim());
            return valueList.join(valueSeparator);
        }

        return <string> values;
    }
}
