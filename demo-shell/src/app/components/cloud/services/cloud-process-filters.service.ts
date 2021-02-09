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

import { Injectable } from '@angular/core';
import { ProcessFilterCloudModel } from '@alfresco/adf-process-services-cloud';
import { AppConfigService } from '@alfresco/adf-core';

@Injectable({ providedIn: 'root' })
export class CloudProcessFiltersService {
    constructor(private appConfigService: AppConfigService) {
    }

    get filterProperties(): string[] {
        return this.appConfigService.get(
            'adf-edit-process-filter.filterProperties',
            ['status', 'sort', 'order', 'processName']
        );
    }

    get sortProperties(): string[] {
        return this.appConfigService.get(
            'adf-edit-process-filter.sortProperties',
            ['id', 'name', 'status', 'startDate']
        );
    }

    get actions(): string[] {
        return this.appConfigService.get(
            'adf-edit-process-filter.actions',
            ['save', 'saveAs', 'delete']
        );
    }

    readQueryParams(obj: Object): ProcessFilterCloudModel {
        const model = Object.assign({}, obj) as ProcessFilterCloudModel;

        if (obj.hasOwnProperty('appVersion') && obj['appVersion']) {
            if (typeof obj['appVersion'] === 'string') {
                model.appVersion = obj['appVersion'].split(',').map(str => parseInt(str, 10));
            }
        }

        return model;
    }

    writeQueryParams(value: Object): Object {
        const result = {};

        for (const prop of this.filterProperties) {
            if (prop === 'appVersionMultiple') {
                const versions = value['appVersion'];

                if (Array.isArray(versions) && versions.length > 0) {
                    result['appVersion'] = versions.join(',');
                }
            } else if (value.hasOwnProperty(prop)) {
                result[prop] = value[prop];
            }
        }

        return result;
    }
}
