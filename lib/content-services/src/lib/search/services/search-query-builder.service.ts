/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Inject, Injectable, Optional } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { SearchConfiguration } from '../models/search-configuration.interface';
import { BaseQueryBuilderService } from './base-query-builder.service';
import { ADF_SEARCH_CONFIGURATION } from '../search-configuration.token';
import { AlfrescoApiService } from '../../services/alfresco-api.service';

@Injectable({ providedIn: 'root' })
export class SearchQueryBuilderService extends BaseQueryBuilderService {
    public isFilterServiceActive(): boolean {
        return false;
    }

    constructor(
        appConfig: AppConfigService,
        alfrescoApiService: AlfrescoApiService,
        @Optional() @Inject(ADF_SEARCH_CONFIGURATION) private configuration?: SearchConfiguration
    ) {
        super(appConfig, alfrescoApiService);
    }

    public loadConfiguration(): SearchConfiguration {
        return this.configuration || this.appConfig.get<SearchConfiguration>('search');
    }
}
