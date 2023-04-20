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

import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../translation/translation.service';

@Pipe({
    name: 'adfLocalizedRole'
})
export class LocalizedRolePipe implements PipeTransform {
    constructor(private translationService: TranslationService) {
    }

    transform(value: string): any {
        if (value) {
            const key = `ADF.ROLES.${value.toUpperCase()}`;
            const translation = this.translationService.instant(key);

            if (translation) {
                return translation;
            }
        }
        return value;
    }
}
