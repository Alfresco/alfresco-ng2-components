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


var landingPage = require('../pages/activiti/landingPage.js');
var EditorNavBar = require('../pages/activiti/editor/components/editorNavBar.js');
var allAppsPage = require('../pages/activiti/editor/allAppsPage.js');
var appPage = require('../pages/activiti/editor/appPage.js');
var DeleteAppDialog = require('../pages/activiti/editor/components/deleteAppDialog');

var AppUtils = function () {

    var editorNavBar = new EditorNavBar();
    var deleteAppDialog = new DeleteAppDialog();

    this.deleteApp =  function (appName) {
        // navigate to app details page
        landingPage.go();
        landingPage.clickKickstartApp();
        editorNavBar.clickAppsMenu();

        allAppsPage.getAppByName(appName);

        // delete the app
        appPage.deleteApp();

        // confirm the deletion
        deleteAppDialog.selectAllVersions();
        deleteAppDialog.clickDeleteAppDefinition();

        allAppsPage.verifyAppNotDisplayed(appName);
    };

};

module.exports = AppUtils;