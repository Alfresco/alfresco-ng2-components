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
import { TranslationService } from '../services/translation.service';

@Pipe({
    name: 'adfFileSize',
    pure: false
})
export class FileSizePipe implements PipeTransform {

    constructor(private translation: TranslationService) {
    }

    transform(bytes: number, decimals: number = 2): string {
        if (bytes == null || bytes === undefined) {
            return '';
        }

        if (bytes === 0) {
            return '0 ' + this.translation.instant('CORE.FILE_SIZE.BYTES');
        }

        const k = 1024,
            dm = decimals || 2,
            sizes = ['BYTES', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));

        const i18nSize = this.translation.instant(`CORE.FILE_SIZE.${sizes[i]}`);

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + i18nSize;
    }

}
