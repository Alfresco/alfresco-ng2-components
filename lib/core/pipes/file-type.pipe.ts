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

import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'fileType',
    pure: true
})
export class FileTypePipe implements PipeTransform {

    transform(value: string) {

        if ( value == null || value === undefined ) {
            return '';
        } else {
            const fileInfo = value.substring(value.lastIndexOf('/') + 1).replace(/\.[a-z]+/, '');
            return fileInfo.split('_').pop();
        }
    }

}
