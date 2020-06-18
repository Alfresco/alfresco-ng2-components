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

import { QueryBody } from '@alfresco/js-api';
import { SearchConfigurationInterface, VersionCompatibilityService } from '@alfresco/adf-core';
import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';

export const ALFRESCO_ACS_COMPATIBILITY_TOKEN = new InjectionToken<boolean>('Alfresco ACS compatibility token');

@Injectable()
export class SearchPermissionConfigurationService implements SearchConfigurationInterface {

    public static ACS_VERSION_REQUIRED = '7.0.0';

    constructor(
        private versionCompatibilityService: VersionCompatibilityService,
        @Optional()
        @Inject(ALFRESCO_ACS_COMPATIBILITY_TOKEN)
        private versionCompatibilityProvider: boolean) {
    }

    public generateQueryBody(searchTerm: string, maxResults: number, skipCount: number): QueryBody {
        const defaultQueryBody: QueryBody = {
            query: {
                query: this.buildQuery(searchTerm)
            },
            include: ['properties', 'aspectNames'],
            paging: {
                maxItems: maxResults,
                skipCount: skipCount
            },
            filterQueries: [
                /*tslint:disable-next-line */
                { query: "TYPE:'cm:authority'" }]
        };

        return defaultQueryBody;
    }

    private buildQuery(searchTerm: string): string {
        let query: string;
        if (!this.versionCompatibilityProvider ||
            this.versionCompatibilityService.isAcsVersionSupported(
                SearchPermissionConfigurationService.ACS_VERSION_REQUIRED)) {
            query = `authorityName:*${searchTerm}* OR userName:*${searchTerm}*`;
        } else {
            query = `userName:*${searchTerm}*`;
        }

        return query;
    }
}
