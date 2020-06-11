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
import { AlfrescoApiConfig } from '@alfresco/js-api';

export interface TestUserProfile {
    email: string;
    password: string;
}

export interface TestApiConfig extends AlfrescoApiConfig {
    // TODO: deprecate or move to the JS-API
    identityHost: string;
    // TODO: deprecate and use AlfrescoApiConfig.hostEcm instead
    ecmHost: string;
    // TODO: deprecate and use AlfrescoApiConfig.hostBpm instead
    bpmHost: string;
    // TODO: deprecate or move out
    log: number;
}

export interface TestConfiguration {
    appConfig: TestApiConfig;
    log: boolean;

    identityAdmin: TestUserProfile;
    identityUser: TestUserProfile;
    admin: TestUserProfile;
    hrUser: TestUserProfile;

    main: {
        rootPath: string;
    };

    adf: {
        url: string;
        host: string;
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
    last_page_text: string;
    last_page_number: string;
    password: string;
}

export interface TestResourceFolder {
    folder_name: string;
    folder_path: string;
    folder_location: string;
}

export interface TestResourceApp {
    title: string;
    description: string;
    file_path: string;
    file_location: string;
    attached_file: string;
    process_wse_name: string;
    process_se_name: string;
    formName: string;
    processName: string;
    process_title: string;
    taskName: string;
    form_fields: {
        form_fieldId: string;
        attachFile_id: string;
        text_id: string;
        multiline_id: string;
        number_id: string;
        amount_id: string;
        attachFolder_id: string;
        date_id: string;
        dateTime_id: string;
        people_id: string;
        group_id: string;
        displayText_id: string;
        displayValue_id: string;
        header_id: string;
        typeAhead_id: string;
        checkbox_id: string;
        radioButtons_id: string;
        hyperlink_id: string;
        dropdown_id: string;
        dynamicTable_id: string;
        container_id: string;
    };
}

export interface TestResources {
    Files: {
        ADF_DOCUMENTS: {
            FOLDER_ONE: TestResourceFolder;
            FOLDER_TWO: TestResourceFolder;
            ADF_FOLDER: TestResourceFolder;
            EXCEL_FOLDER: TestResourceFolder;
            IMG_FOLDER: TestResourceFolder;
            IMG_RENDITION_FOLDER: TestResourceFolder;
            OTHER_FOLDER: TestResourceFolder;
            ARCHIVE_FOLDER: TestResourceFolder;
            PPT_FOLDER: TestResourceFolder;
            WORD_FOLDER: TestResourceFolder;

            TXT: TestResourceFile;
            TXT_0B: TestResourceFile;
            PNG: TestResourceFile;
            PNG_B: TestResourceFile;
            PNG_C: TestResourceFile;
            PNG_D: TestResourceFile;
            JPG: TestResourceFile;
            TEST: TestResourceFile;
            MP4: TestResourceFile;
            UNSUPPORTED: TestResourceFile;
            LARGE_FILE: TestResourceFile;
            MEDIUM_FILE: TestResourceFile;
            TEXT_FOLDER: TestResourceFolder;
            FILE_ACCEPTED_INSIDE_TEXT_FOLDER: TestResourceFile;
            FILE_EXCLUDED_INSIDE_TEXT_FOLDER: TestResourceFile;
            INI: TestResourceFile;
            FILE_INSIDE_FOLDER_ONE: TestResourceFile;
            FILE_INSIDE_FOLDER_TWO: TestResourceFile;
            TXT_400B: TestResourceFile;
            JS: TestResourceFile;

            PDF: TestResourceDocumentFile;
            PDF_PROTECTED: TestResourceDocumentFile;
            PDF_B: TestResourceDocumentFile;
            DOCX: TestResourceDocumentFile;
            PPT: TestResourceDocumentFile;
        };
        PROFILE_IMAGES: {
            ECM: TestResourceFile;
            BPM: TestResourceFile;
        };
        APP_WITH_PROCESSES: TestResourceApp;
        WIDGETS_SMOKE_TEST: TestResourceApp;
        APP_WITH_DATE_FIELD_FORM: TestResourceApp;
        START_PROCESS_ATTACH_FILE: TestResourceApp;
        SIMPLE_APP_WITH_USER_FORM: TestResourceApp;
        APP_DYNAMIC_TABLE_DROPDOWN: TestResourceApp;
        DYNAMIC_TABLE_APP: TestResourceApp;
        APP_WITH_USER_WIDGET: TestResourceApp;
        TEST_ASSIGNEE: {
            title: string;
            file_path: string;
            processNames: string[];
            adminCapabilities: string[];
            candidate: {
                firstName: string;
                lastName: string;
            };
            candidateGroup: string;
            adminGroup: string;
            userTasks: {
                simple: {
                    one: string;
                    two: string;
                };
                candidateTask: string;
            };
        };
        DYNAMIC_TABLE: TestResourceApp;

        WIDGET_CHECK_APP: {
            file_path: string;
            VISIBILITY: {
                processName: string;
            };
            UPLOAD_FILE_FORM_CS: {
                formName: string;
                FIELD: {
                    widget_id: string;
                };
            };
            UPLOAD_FOLDER_FORM_CS: {
                formName: string;
                FIELD: {
                    widget_id: string;
                };
            };
            NUMBER: {
                processName: string;
                FIELD: {
                    number_general: string;
                    number_visible: string;
                    checkbox_id: string;
                };
            };
            DYNAMIC_TABLE: {
                processName: string;
                FIELD: {
                    dynamic_table_id: string;
                    dynamic_table_age_id: string;
                    dateTime_input_id: string;
                    checkbox_id: string;
                };
            };
            DYNAMIC_TABLE_USERS: {
                processName: string;
                FIELD: {
                    dynamic_table_age_id: string;
                    checkbox_id: string;
                    dateTime_input_id: string;
                    dynamic_table_id: string;
                };
            };
            CUSTOM_VALIDATOR: {
                processName: string;
                FIELD: {
                    NAME: string;
                    ID: string;
                    NUM: string;
                    ADDRESS: string;
                };
            };
            HYPERLINK: {
                processName: string;
                FIELD: {
                    hyperlink_id: string;
                    checkbox_id: string;
                };
            };
            HEADER: {
                processName: string;
                FIELD: {
                    header_id: string;
                    checkbox_id: string;
                };
            };
            MULTILINE_TEXT: {
                processName: string;
                FIELD: {
                    multiSimple: string;
                    multiMinMax: string;
                    multiRegexp: string;
                    multiVisible: string;
                    showMultiHidden: string;
                }
            };
            CHECKBOX: {
                processName: string;
                FIELD: {
                    checkbox_label: string;
                    checkbox_field_id: string;
                    checkbox_input_id: string;
                    number_input_id: string;
                }
            };
            ATTACH_FOLDER: {
                processName: string;
                FIELD: {
                    upload_button_id: string;
                    checkbox_id: string;
                };
            };
            DATETIME: {
                processName: string;
                FIELD: {
                    checkbox_label: string;
                    checkbox_input_id: string;
                    checkbox_field_id: string;
                    number_input_id: string;
                    date_time_input: string;
                    date_time_between_input: string;
                };
            };
            AMOUNT: {
                processName: string;
                FIELD: {
                    amount_input_id: string;
                    checkbox_id: string;
                };
            };
            DATE: {
                processName: string;
                FIELD: {
                    date_input: string;
                    date_between_input: string;
                }
            };
            DROPDOWN: {
                processName: string;
                FIELD: {
                    general_dropdown: string;
                    dropdown_visible: string;
                    checkbox_id: string;
                }
            };
            RADIO_BUTTONS: {
                processName: string;
                FIELD: {
                    checkbox_id: string;
                    radio_buttons_id: string;
                }
            };
            ADD_PEOPLE: {
                processName: string;
                FIELD: {
                    widget_id: string;
                    checkbox_id: string;
                }
            };
            TEXT: {
                processName: string;
                FIELD: {
                    simpleText: string;
                    textMinMax: string;
                    textMask: string;
                    textMaskReversed: string;
                    textRegexp: string;
                    textHidden: string;
                    showHiddenText: string;
                }
            };
        };
        MORE_WIDGETS: {
            file_path: string;
            groupUser: Array<{ firstName: string; lastName: string; }>;
            subGroupUser: { firstName: string; lastName: string; };
            group: {
                name: string;
                subgroup: Array<{ name: string; }>;
                groupUser: Array<{ firstName: string; lastName: string; }>;
            }
            ADD_GROUP_VISIBILITY: {
                formName: string;
                searchTerm: string;
                FIELD: {
                    widget_id: string;
                    checkbox_id: string;
                };
            };
            ADD_GROUP_AND_SUBGROUP_RESTRICTION: {
                formName: string;
                searchTerm: string;
                FIELD: {
                    widget_id: string;
                    checkbox_id: string;
                };
            };
            ADD_PEOPLE_AND_GROUP_RESTRICTION: {
                formName: string;
                searchTerm: string;
                FIELD: {
                    widget_id: string;
                    checkbox_id: string;
                };
            }
        };
        FILE_FORM_ADF: TestResourceApp;
        FORM_ADF: TestResourceApp;
        STENCIL_PROCESS: TestResourceApp;
        NO_FORM_APP: TestResourceApp;
    };
    ACTIVITI_CLOUD_APPS: {
        SIMPLE_APP: {
            name: string;
            forms: {
                requirednumbervisibility: {
                    name: string;
                };
                booleanvisibility: {
                    name: string;
                };
                uploadSingleMultiple: {
                    widgets: {
                        contentMultipleAttachFileId: string;
                    }
                };
                tabVisibilityFields: {
                    name: string;
                };
                tabVisibilityVars: {
                    name: string;
                }
            };
            processes: {
                numbervisibilityprocess: string;
                booleanvisibilityprocess: string;
                simpleProcess: string;
                candidateGroupProcess: string;
                anotherCandidateGroupProcess: string;
                dropdownrestprocess: string;
                uploadSingleMultipleFiles: string;
                processstring: string;
                calledprocess: string;
            };
            tasks: {
                uploadSingleMultipleFiles: string;
                processstring: string;
            };
        };
        CANDIDATE_BASE_APP: {
            name: string;
            tasks: {
                candidateUserTask: string;
                uploadFileTask: string;
            };
            processes: {
                uploadFileProcess: string;
                candidateUserProcess: string;
                processwithstarteventform: string;
                candidateGroupProcess: string;
                anotherCandidateGroupProcess: string;
            };
            forms: {
                starteventform: string;
                uploadfileform: string;
                formtotestvalidations: string;
            };
        };
        SUB_PROCESS_APP: {
            name: string;
            processes: {
                processparent: string;
            }
        };
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
