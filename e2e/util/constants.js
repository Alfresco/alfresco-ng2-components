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

var exports = module.exports = {};

/**
 *Rest API Response statusCodes
 */
exports.HTTP_RESPONSE_STATUS_CODE = {
    FORBIDDEN: 403,
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404
};

/**
 *Rest API Response Messages
 */
exports.HTTP_RESPONSE_STATUS = {
    OK: {
        'CODE': 200,
        'MESSAGE': 'OK'
    },
    CREATED: {
        'CODE': 201,
        'MESSAGE': 'Created'
    },
    NO_CONTENT: {
        'CODE': 204,
        'MESSAGE': 'No Content'
    },
    NOT_FOUND: {
        'CODE': 404,
        'MESSAGE': 'Not Found'
    }
};

/**
 *Rest API HTTP content types
 */
exports.HTTP_CONTENT_TYPE = {
    JSON: 'application/json',
    URLENCODED: 'application/x-www-form-urlencoded',
    IMAGE_PNG: 'image/png',
    TEXT: 'text/csv'
};

exports.APPLICATION = {
    ADF_APS: 'adf_aps',
    ADF_ACS: 'adf_acs',
    APS: 'main'
};

exports.TASK_FILTERS = {
    MY_TASKS: 'My Tasks',
    INV_TASKS: 'Involved Tasks',
    QUE_TASKS: 'Queued Tasks',
    COMPLETED_TASKS: 'Completed Tasks'
};

exports.TASK_DETAILS = {
    NO_FORM: 'No form',
    NO_PARENT: 'No parent',
    NO_DATE: 'No date',
    NO_CATEGORY: 'No category',
    NO_DESCRIPTION: 'No description'
};

exports.TASK_STATUS = {
    RUNNING: 'Running',
    COMPLETED: 'Completed'
};

exports.THEMING = {
    PINK_BLUE_DARK: "Pink Bluegrey Dark",
    DEFAULT_PASSWORD_ICON_COLOR: "rgba(0, 0, 0, 0.87)",
    DEFAULT_LOGIN_BUTTON_COLOR: "rgba(0, 0, 0, 0.38)",
    DEFAULT_BACKGROUND_COLOR: "rgba(0, 0, 0, 0.87)",
    PINK_BLUE_DARK_PASSWORD_ICON_COLOR: "rgba(255, 255, 255, 1)",
    PINK_BLUE_DARK_LOGIN_BUTTON_COLOR: "rgba(255, 255, 255, 0.87)",
    PINK_BLUE_DARK_BACKGROUND_COLOR: "rgba(255, 255, 255, 1)",
};

exports.APP_COLOR = {
    BLUE: "rgba(38, 154, 188, 1)",
    GREY: "rgba(105, 108, 103, 1)",
    ORANGE: "rgba(250, 185, 108, 1)",
    RED: "rgba(199, 78, 62, 1)"
};

exports.APP_ICON = {
    FAVORITE: "favorite_border",
    UNIT: "ac_unit",
    USER: "person"
};

exports.ROLES = {
    APS_USER: "APS_USER",
    ACTIVITI_USER: "ACTIVITI_USER",
    APS_ADMIN: "APS_ADMIN",
    ACTIVITI_ADMIN: "ACTIVITI_ADMIN"
};

exports.PROCESS_END_DATE = "No date";

exports.PROCESS_CATEGORY = "http://www.activiti.org/processdef";

exports.PROCESS_BUSINESS_KEY = "None";

exports.PROCESS_DESCRIPTION = "No description";

exports.PROCESS_DATE_FORMAT = "mmm dd yyyy";

exports.PROCESS_STATUS = {
    RUNNING: 'Running',
    COMPLETED: 'Completed'
};

exports.CS_USER_ROLES = {
    CONSUMER: 'SiteConsumer',
    COLLABORATOR: 'SiteCollaborator',
    CONTRIBUTOR: 'SiteContributor',
    MANAGER: 'SiteManager'
};
