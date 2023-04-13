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

import { Injectable } from '@angular/core';
import { ProcessFilterCloudModel, ProcessFilterCloudService } from '@alfresco/adf-process-services-cloud';
import { AppConfigService } from '@alfresco/adf-core';

@Injectable({ providedIn: 'root' })
export class CloudProcessFiltersService {
    constructor(private appConfigService: AppConfigService, private processFilterCloudService: ProcessFilterCloudService) {
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

    readQueryParams(obj: any): ProcessFilterCloudModel {
        return this.processFilterCloudService.readQueryParams(obj);
    }

    writeQueryParams(value: any, appName?: string, id?: string): any {
        return this.processFilterCloudService.writeQueryParams(value, this.filterProperties, appName, id);
    }
}
