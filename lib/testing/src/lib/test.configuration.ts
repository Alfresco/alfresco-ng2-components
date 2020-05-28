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

import { AlfrescoApiConfig } from '@alfresco/js-api';

export interface TestConfiguration {

    appConfig: AlfrescoApiConfig;

    log: boolean;

    identityAdmin: {
        email: string,
        password: string
    };

    identityUser: {
        email: string,
        password: string
    };

    admin: {
        email: string,
        password: string
    };

    main: {
        rootPath: string;
    };

    adf: {
        url: string;
    };

    adf_external_acs: {
        host: string;
    };

}
