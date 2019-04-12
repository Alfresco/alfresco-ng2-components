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
import { AppConfigService } from './../app-config/app-config.service';

@Pipe({ name: 'multiValue' })
export class MultiValuePipe implements PipeTransform {
    valueSeparator: string;

    constructor(private appConfig: AppConfigService) {
        this.valueSeparator = this.appConfig.get<string>('content-metadata.multi-value-pipe-separator');
    }

    transform(values: any): string {

        if (values && values instanceof Array) {
            values.map((value) => value.trim());
            return values.join( this.valueSeparator);
        }

        return values;
    }
}
