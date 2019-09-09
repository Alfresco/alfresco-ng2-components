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

export interface TestConfiguration {

    appConfig: any;

    log: boolean;

    identityAdmin: {
        email: string,
        password: string
    };

    identityUser: {
        email: string,
        password: string
    };

    main: {
        timeout: number;
        rootPath: string;
    };

    adf: {
        url: string;
        port: string;
        login: string;
        adminUser: string;
        adminEmail: string;
        adminPassword: string;
        hostBPM: string;
        clientIdSso: string;

        hostSso: () => string;
        hostIdentity: () => string;
    };

    adf_acs: {
        protocol: string;
        host: string;
        port: string;
        apiContextRoot: string;
        clientIdSso: string;
    };

    adf_aps: {
        protocol: string;
        host: string;
        port: string;
        apiContextRoot: string;
        clientIdSso: string;
    };
}
