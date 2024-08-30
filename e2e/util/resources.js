/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/**
 * Provides resources used throughout the application
 *
 * @class util.Resources
 */
const path = require('path');
const ACTIVITI_CLOUD_APPS = require('../../dist/libs/testing');

const RESOURCES = {
    ...ACTIVITI_CLOUD_APPS,
    Files: {
        APP_WITH_PROCESSES: {
            file_location: '/resources/apps/App_with_processes.zip',
            file_path: path.join(__dirname, '../resources/apps/App_with_processes.zip'),
            title: 'App_with_processes',
            description: 'Description for app',
            process_se_name: 'process_with_se',
            process_wse_name: 'process_without_se',
            task_name: 'Task Test 2'
        },

        SIMPLE_APP_WITH_USER_FORM: {
            file_location: '/resources/apps/Simple App with User Form.zip',
            file_path: path.join(__dirname, '../resources/apps/Simple App with User Form.zip'),
            title: 'Simple App with User Form',
            description: 'Simple app with a process having a User task with a form attached.',
            processName: 'Simple Process',
            processDiagramFileLocation: '/resources/apps/SimpleAppWithUserForm.png',
            processThumbnail: '/resources/processes/Simple Process Thumbnail.png',
            formName: 'Simple form',
            id: -19,
            taskName: 'User Task',
            form_fields: {
                text_field: 'activiti-textfield',
                form_fieldId: 'textfield',
                text_field_value: 'Hi tester, from Rest call'
            },
            visibilityProcess: {
                name: 'VisibilityProcess',
                formName: 'visibilityTabWithFields',
                taskName: 'No name'
            }
        },

        WIDGETS_SMOKE_TEST: {
            file_location: '/resources/apps/Widgets smoke test.zip',
            file_path: path.join(__dirname, '../resources/apps/Widgets smoke test.zip'),
            title: 'Widgets smoke test',
            formName: 'Widgets smoke test',
            form_fields: {
                text_id: 'text',
                header_id: 'header',
                number_id: 'number',
                amount_id: 'amount',
                people_id: 'people',
                group_id: 'groupofpeople',
                multiline_id: 'multilinetext',
                typeAhead_id: 'typeahead',
                displayText_id: 'displaytext',
                displayValue_id: 'displayvalue',
                hyperlink_id: 'hyperlink',
                attachFolder_id: 'attachfolder',
                attachFile_id: 'attachfile',
                date_id: 'date',
                dateTime_id: 'dateandtime',
                checkbox_id: 'checkbox',
                dropdown_id: 'dropdown',
                drofpdown_value: "mat-select[id='dropdown'] span span",
                radioButtons_id: 'radiobuttons',
                dynamicTable_id: 'dynamictable'
            }
        },

        ADF_DOCUMENTS: {
            JS: {
                file_location: '/resources/adf/a_js_file.js',
                file_path: path.join(__dirname, '../resources/adf/a_js_file.js'),
                file_name: 'a_js_file.js'
            },
            PDF: {
                file_location: '/resources/adf/allFileTypes/a_file_supported.pdf',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/a_file_supported.pdf'),
                file_name: 'a_file_supported.pdf',
                short_file_name: 'a_file',
                first_page_text: 'one',
                second_page_text: 'two',
                last_page_text: 'eight',
                last_page_number: '8'
            },
            DOCX: {
                file_location: '/resources/adf/allFileTypes/a_file_supported.docx',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/a_file_supported.docx'),
                file_name: 'a_file_supported.docx',
                first_page_text: 'A Journey into Test Frameworks',
                second_page_text: 'After looking into Spock’s GitHub',
                last_page_text: 'and provide feedback. The main advantages being the readability of the te',
                last_page_number: '8'
            },
            JPG: {
                file_location: '/resources/adf/allFileTypes/a_jpg_file.jpg',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/a_jpg_file.jpg'),
                file_name: 'a_jpg_file.jpg'
            },
            MP4: {
                file_location: '/resources/adf/allFileTypes/a_mp4_file.mp4',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/a_mp4_file.mp4'),
                file_name: 'a_mp4_file.mp4'
            },
            PNG: {
                file_location: '/resources/adf/allFileTypes/a_png_file.png',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/a_png_file.png'),
                file_name: 'a_png_file.png'
            },
            PPT: {
                file_location: '/resources/adf/allFileTypes/a_ppt_file.pptx',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/a_ppt_file.pptx'),
                file_name: 'a_ppt_file.pptx',
                first_page_text: 'PPTX test file'
            },
            TEST: {
                file_location: '/resources/adf/allFileTypes/testExtension.test',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/testExtension.test'),
                file_name: 'testExtension.test'
            },
            TXT: {
                file_location: '/resources/adf/allFileTypes/a_txt_file.rtf',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/a_txt_file.rtf'),
                file_name: 'a_txt_file.rtf'
            },
            PAGES: {
                file_location: '/resources/adf/allFileTypes/file_unsupported.pages',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/file_unsupported.pages'),
                file_name: 'file_unsupported.pages'
            },
            INI: {
                file_location: '/resources/adf/allFileTypes/desktop.ini',
                file_path: path.join(__dirname, '../resources/adf/allFileTypes/desktop.ini'),
                file_name: 'desktop.ini'
            }
        }
    }
};

module.exports = RESOURCES;
