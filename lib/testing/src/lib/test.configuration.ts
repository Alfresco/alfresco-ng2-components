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
    file_location: string;
}

export interface TestResourceDocumentFile extends TestResourceFile {
    first_page_text: string;
    second_page_text: string;
    last_page_number: string;
    password: string;
}

export interface TestResourceFolder {
    folder_name: string;
    folder_path: string;
    folder_location: string;
}

export interface TestResources {
    Files: {
        ADF_DOCUMENTS: {
            TXT: TestResourceFile;
            TXT_0B: TestResourceFile;
            PDF: TestResourceDocumentFile;
            PDF_PROTECTED: TestResourceDocumentFile;
            PDF_B: TestResourceDocumentFile;
            PNG: TestResourceFile;
            PNG_B: TestResourceFile;
            PNG_C: TestResourceFile;
            PNG_D: TestResourceFile;
            JPG: TestResourceFile;
            TEST: TestResourceFile;
            MP4: TestResourceFile;
            UNSUPPORTED: TestResourceFile;
            DOCX: TestResourceDocumentFile;
            PPT: TestResourceDocumentFile;
            LARGE_FILE: TestResourceFile;
            TEXT_FOLDER: TestResourceFolder;
            FILE_ACCEPTED_INSIDE_TEXT_FOLDER: TestResourceFile;
            FILE_EXCLUDED_INSIDE_TEXT_FOLDER: TestResourceFile;
            INI: TestResourceFile;
            FOLDER_ONE: TestResourceFolder;
            FOLDER_TWO: TestResourceFolder;
            FILE_INSIDE_FOLDER_ONE: TestResourceFile;
            FILE_INSIDE_FOLDER_TWO: TestResourceFile;
            ADF_FOLDER: TestResourceFolder;
        }
    };
}

export interface BrowserParams {
    resources: TestResources;
    testConfig: TestConfiguration;
}

/**
 * Retrieves the global browser test params
 */
export function getTestParams(): BrowserParams {
    return browser.params;
}

/**
 * Retrieves the test resources
 */
export function getTestResources(): TestResources {
    return getTestParams().resources;
}

/**
 * Retrieves the test configuration
 */
export function getTestConfig(): TestConfiguration {
    return getTestParams().testConfig;
}
