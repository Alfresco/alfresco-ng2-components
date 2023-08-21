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
import { AlfrescoApi } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';

@Injectable({ providedIn: 'root' })
export class ExternalAlfrescoApiService extends AlfrescoApiService {
    init(ecmHost: string, contextRoot: string) {
        const domainPrefix = this.createPrefixFromHost(ecmHost);

        const config = {
            provider: 'ECM',
            hostEcm: ecmHost,
            authType: 'BASIC',
            contextRoot,
            domainPrefix
        };
        this.setup(config);
        this.alfrescoApiInitialized.next(true);
    }

    private setup(config) {
        if (this.alfrescoApi) {
            this.alfrescoApi.setConfig(config);
        } else {
            this.alfrescoApi = new AlfrescoApi(config);
        }
    }

    private createPrefixFromHost(url: string): string {
        const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        let result = null;
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            result = match[2];
        }
        return result;
    }
}
