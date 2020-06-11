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

import { browser } from 'protractor';

export interface TestConfiguration {

    appConfig: {
        ecmHost: string,
        bpmHost: string
    };

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

export interface TestResourceFile {
    file_name: string;
    file_path: string;
}

export interface TestResourceFolder {
    folder_path: string;
    folder_location: string;
}

export interface TestResources {
    Files: {
        ADF_DOCUMENTS: {
            TXT: TestResourceFile;
            TXT_0B: TestResourceFile;
            PDF: TestResourceFile;
            PDF_B: TestResourceFile;
            PNG: TestResourceFile;
            PNG_B: TestResourceFile;
            TEXT_FOLDER: TestResourceFolder;
        }
    };
}

export interface BrowserParams {
    resources: TestResources;
    testConfig: TestConfiguration;
}

export function getTestParams(): BrowserParams {
    return browser.params;
}

export function getTestResources(): TestResources {
    return getTestParams().resources;
}
