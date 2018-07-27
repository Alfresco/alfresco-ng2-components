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

var Util = require('../../../util/util');
var AppNavigationBarPage = require('./appNavigationBarPage');

var ProcessServicesPage = function(){

    var apsAppsContainer = element(by.css("div[class='adf-app-listgrid ng-star-inserted']"));
    var processServices = element(by.css("a[data-automation-id='Process Services']"));
    var taskApp = element(by.css("mat-card[title='Task App']"));
    var iconTypeLocator = by.css("mat-icon[class*='card-logo-icon']");
    var descriptionLocator = by.css("mat-card-subtitle[class*='subtitle']");
    var processInstanceList = element(by.css("adf-process-instance-list"));

    /**
     * Check Process Page Container is displayed
     * @method checkApsContainer
     */
    this.checkApsContainer = function(){
        Util.waitUntilElementIsVisible(apsAppsContainer);
    };

    /**
     * Go to Process Services Page
     * @method goToProcessServices
     * */
    this.goToProcessServices = function() {
        Util.waitUntilElementIsVisible(processServices);
        processServices.click();
        this.checkApsContainer();
        return this;
    };

    /**
     * Go to App
     * @method goToApp
     * */
    this.goToApp = function(applicationName) {
        var app = element(by.css("mat-card[title='" + applicationName +"']"));
        Util.waitUntilElementIsVisible(app);
        app.click();
        return new AppNavigationBarPage();
    };

    /**
     * Go to Task App
     * @method goToTaskApp
     * */
    this.goToTaskApp = function() {
        Util.waitUntilElementIsVisible(taskApp);
        taskApp.click();
        return new AppNavigationBarPage();
    };

    this.getAppIconType = function (applicationName) {
        var app = element(by.css("mat-card[title='" + applicationName +"']"));
        Util.waitUntilElementIsVisible(app);
        var iconType = app.element(iconTypeLocator);
        Util.waitUntilElementIsVisible(iconType);
        return iconType.getText();
    };

    this.getBackgroundColor = function(applicationName) {
        var app = element(by.css("mat-card[title='" + applicationName +"']"));
        Util.waitUntilElementIsVisible(app);
        return app.getCssValue("background-color");
    };

    this.getDescription = function(applicationName) {
        var app = element(by.css("mat-card[title='" + applicationName +"']"));
        Util.waitUntilElementIsVisible(app);
        var description = app.element(descriptionLocator);
        Util.waitUntilElementIsVisible(description);
        return description.getText();
    };

    this.checkAppIsNotDisplayed = function(applicationName) {
        var app = element(by.css("mat-card[title='" + applicationName +"']"));
        return Util.waitUntilElementIsNotOnPage(app);
    };

    this.checkAppIsDisplayed = function(applicationName) {
        var app = element(by.css("mat-card[title='" + applicationName +"']"));
        return Util.waitUntilElementIsVisible(app);
    };

    this.checkProcessListIsDisplayed = function() {
        Util.waitUntilElementIsVisible(processInstanceList);
    }

};

module.exports = ProcessServicesPage;
