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

import { AlfrescoApiConfig } from '@alfresco/js-api';
import { ApiService } from '../../../shared/api/api.service';
import { Logger } from '../utils/logger';
import { browser } from 'protractor';

export const createApiService = (
    /** @deprecated */
    appConfigOverride: Partial<AlfrescoApiConfig> = {}
) => {
    const patchedAppConfig = {
        ...browser.params.testConfig.appConfig,
        oauth2: {
            ...browser.params.testConfig.appConfig.oauth2,
            // For some reason protractor e2es must have this value hardcoded
            implicitFlow: false
        },
        // Legacy debt...
        hostEcm: browser.params.testConfig.appConfig.ecmHost,
        hostBpm: browser.params.testConfig.appConfig.bpmHost,
        ...appConfigOverride
    };

    return new ApiService(
        {
            appConfig: new AlfrescoApiConfig(patchedAppConfig),
            users: browser.params.testConfig.users
        },
        Logger
    );
};
