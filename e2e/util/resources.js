/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
var exports = module.exports = {};

exports.Files = {

    APP_WITH_DATE_FIELD_FORM: {
        file_location: "/resources/apps/TestDate.zip",
        title: "TestDate",
        process_title: "TestDateField",
        id: -1,
        form_fields: {
            testdate_field: "activiti-testdate",
            completed_task_date_field: "span[ng-if*='field.dateDisplayFormat']"
        }
    },

    APP_WITH_PROCESSES:{
        file_location:"/resources/apps/App_with_processes.zip",
        title: "App_with_processes",
        description: "Description for app",
        process_se_name: "process_with_se",
        task_name: "Task Test 2"
    },

    APP_DYNAMIC_TABLE_DROPDOWN:{
        file_location:"/resources/apps/AppDynamicTableDropdown.zip",
        title: "App3576",
        description: "Description for app",
        processName: "Process3576"
    },

    APP_WITH_USER_WIDGET:{
        file_location:"/resources/apps/appWithUser.zip",
        title: "appWithUser",
        description: "Description for app",
        processName: "ProcessWithUser",
        startForm: "user",
        taskForm: "displayUser",
        peopleWidgetId: "label1"
    },

    SIMPLE_APP: {
        file_location: "/resources/Simple App.zip",
        title: "Simple App",
        id: -18,
        process_definitions: null,
        start_form: null
    },

    SIMPLE_APP_WITH_USER_FORM: {
        file_location: "/resources/apps/Simple App with User Form.zip",
        title: "Simple App with User Form",
        processName: "Simple Process",
        processDiagramFileLocation: '/resources/apps/SimpleAppWithUserForm.png',
        processThumbnail: '/resources/processes/Simple Process Thumbnail.png',
        formName: "Simple form",
        id: -19,
        taskName: "User Task",
        form_fields: {
            text_field: "activiti-textfield",
            form_fieldId: "textfield",
            text_field_value: "Hi tester, from Rest call"
        }
    },

    WIDGETS_SMOKE_TEST: {
        file_location: "/resources/apps/Widgets smoke test.zip",
        formName: "Widgets smoke test",
        title: "Widgets smoke test",
        form_fields: {
            text_id: "text",
            header_id: "header",
            number_id: "number",
            amount_id: "amount",
            people_id: "people",
            group_id: "groupofpeople",
            multiline_id: "multilinetext",
            typeAhead_id: "typeahead",
            displayText_id: "displaytext",
            displayValue_id: "displayvalue",
            hyperlink_id: "hyperlink",
            attachFolder_id: "attachfolder",
            attachFile_id: "attachfile",
            date_id: "date",
            dateTime_id: "dateandtime",
            checkbox_id: "checkbox",
            dropdown_id: "dropdown",
            dropdown_value: "mat-select[id='dropdown'] span span",
            radioButtons_id: "radiobuttons",
            dynamicTable_id: "dynamictable"
        }
    },

    DYNAMIC_TABLE_APP: {
        file_location: "/resources/apps/Dynamic Table App.zip",
        title: "Dynamic Table App",
        formName: "Dynamic Table App",
        process_se_name: "DynamicTableProcess"
    },

    ADF_DOCUMENTS: {
        PDF: {
            file_location: "/resources/adf/allFileTypes/a_file_supported.pdf",
            file_name: "a_file_supported.pdf",
            short_file_name: "a_file",
            first_page_text: "A Journey into Test Frameworks",
            second_page_text: "After looking into Spock’s GitHub",
            last_page_text: "and provide feedback. The main advantages being the readability of the te",
            last_page_number: "8"
        },
        PDF_B: {
            file_location: "/resources/adf/allFileTypes/b_file_supported.pdf",
            file_name: "b_file_supported.pdf"
        },
        PDF_C: {
            file_location: "/resources/adf/allFileTypes/c_file_supported.pdf",
            file_name: "c_file_supported.pdf"
        },
        PDF_D: {
            file_location: "/resources/adf/allFileTypes/d_file_supported.pdf",
            file_name: "d_file_supported.pdf"
        },
        PDF_ALL: {
            file_location: "/resources/adf/allFileTypes/pdf_all_properties.pdf",
            file_name: "pdf_all_properties.pdf"
        },
        PDF_PROTECTED: {
            file_location: "/resources/adf/allFileTypes/a_file_protected.pdf",
            file_name: "a_file_protected.pdf",
            first_page_text: "A Journey into Test Frameworks",
            second_page_text: "After looking into Spock’s GitHub",
            last_page_text: "and provide feedback. The main advantages being the readability of the te",
            last_page_number: "8",
            password: "1q2w3e4r"
        },
        LARGE_FILE:{
            file_location: "/resources/adf/BigFile.zip",
            file_name: "BigFile.zip"
        },
        EXCEL: {
            file_location: "/resources/adf/allFileTypes/a_excel_file.xlsx",
            file_name: "a_excel_file.xlsx"
        },
        DOCX_SUPPORTED: {
            file_location: "/resources/adf/allFileTypes/a_file_supported.docx",
            file_name: "a_file_supported.docx",
            first_page_text: "A Journey into Test Frameworks",
            second_page_text: "After looking into Spock’s GitHub",
            last_page_text: "and provide feedback. The main advantages being the readability of the te",
            last_page_number: "8"
        },
        DOCX: {
            file_location: "/resources/adf/allFileTypes/a_file_unsupported.docx",
            file_name: "a_file_unsupported.docx"
        },
        FOLDER_ONE: {
            folder_location: "/resources/adf/folderOne",
            folder_name: "folderOne"
        },
        FOLDER_TWO: {
            folder_location: "/resources/adf/folderTwo",
            folder_name: "folderTwo"
        },
        FOLDER_EXCLUDED: {
            folder_location: "/resources/adf/folderExcluded",
            folder_name: "folderExcluded"
        },
        FILE_INSIDE_FOLDER_ONE: {
            file_location: "/resources/adf/folderOne/share_profile_pic.png",
            file_name: "share_profile_pic.png"
        },
        FILE_INSIDE_FOLDER_TWO: {
            file_location: "/resources/adf/folderOne/a_file.txt",
            file_name: "a_file.txt"
        },
        JPG: {
            file_location: "/resources/adf/allFileTypes/a_jpg_file.jpg",
            file_name: "a_jpg_file.jpg"
        },
        MP4: {
            file_location: "/resources/adf/allFileTypes/a_mp4_file.mp4",
            file_name: "a_mp4_file.mp4"
        },
        PNG: {
            file_location: "/resources/adf/allFileTypes/a_png_file.png",
            file_name: "a_png_file.png"
        },
        PNG_B: {
            file_location: "/resources/adf/allFileTypes/b_png_file.png",
            file_name: "b_png_file.png"
        },
        PNG_C: {
            file_location: "/resources/adf/allFileTypes/c_png_file.png",
            file_name: "c_png_file.png"
        },
        PNG_D: {
            file_location: "/resources/adf/allFileTypes/d_png_file.png",
            file_name: "d_png_file.png"
        },
        PPT: {
            file_location: "/resources/adf/allFileTypes/a_ppt_file.pptx",
            file_name: "a_ppt_file.pptx",
            first_page_text: "PPTX test file"
        },
        PPT_B: {
            file_location: "/resources/adf/allFileTypes/b_ppt_file.pptx",
            file_name: "b_ppt_file.pptx"
        },
        TEST: {
            file_location: "/resources/adf/allFileTypes/testExtension.test",
            file_name: "testExtension.test"
        },
        TXT: {
            file_location: "/resources/adf/allFileTypes/a_txt_file.rtf",
            file_name: "a_txt_file.rtf"
        },
        TXT_400B: {
            file_location: "/resources/adf/allFileTypes/file400Bytes.txt",
            file_name: "file400Bytes.txt"
        },
        TXT_0B: {
            file_location: "/resources/adf/allFileTypes/zeroBytesFile.txt",
            file_name: "zeroBytesFile.txt"
        },
        ZIP: {
            file_location: "/resources/adf/allFileTypes/a_zip_file.mp4.zip",
            file_name: "a_zip_file.mp4.zip"
        },
        PAGES:{
            file_location: "/resources/adf/allFileTypes/file_unsupported.pages",
            file_name: "file_unsupported.pages"
        },
        UNSUPPORTED:{
            file_location: "/resources/adf/allFileTypes/file_unsupported.3DS",
            file_name: "file_unsupported.3DS"
        },
        INI:{
            file_location: "/resources/adf/allFileTypes/desktop.ini",
            file_name: "desktop.ini"
        },
        ARCHIVE_FOLDER: {
            folder_location: "/resources/adf/allFileTypes/documents/archive",
            folder_name: "archive"
        },
        EXCEL_FOLDER: {
            folder_location: "/resources/adf/allFileTypes/documents/excel",
            folder_name: "excel"
        },
        OTHER_FOLDER: {
            folder_location: "/resources/adf/allFileTypes/documents/other",
            folder_name: "other"
        },
        PPT_FOLDER: {
            folder_location: "/resources/adf/allFileTypes/documents/ppt",
            folder_name: "ppt"
        },
        TEXT_FOLDER: {
            folder_location: "/resources/adf/allFileTypes/documents/text",
            folder_name: "text"
        },
        WORD_FOLDER: {
            folder_location: "/resources/adf/allFileTypes/documents/word",
            folder_name: "word"
        },
        IMG_FOLDER: {
            folder_location: "/resources/adf/allFileTypes/images",
            folder_name: "images"
        }
    },

    PROFILE_IMAGES: {
        ECM: {
            file_location: "/resources/adf/share_profile_pic.jpg",
            file_name: "share_profile_pic.jpg"
        },
        BPM: {
            file_location: "/resources/adf/activiti_profile_pic.png",
            file_name: "activiti_profile_pic.png"
        }
    }

};
