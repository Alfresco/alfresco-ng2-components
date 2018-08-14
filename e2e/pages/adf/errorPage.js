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

var Util = require('../../util/util');

var ErrorPage = function(){

    var errorPage = element(by.css("adf-error-content"));
    var errorPageCode = element(by.css("adf-error-content .adf-error-content-code"));
    var errorPageTitle = element(by.css("adf-error-content .adf-error-content-title"));
    var errorPageDescription = element(by.css("adf-error-content .adf-error-content-description"));
    var backButton = element(by.id("adf-return-button"));
    var secondButton = element(by.id("adf-secondary-button"));

    this.checkErrorPage = function(){
        Util.waitUntilElementIsVisible(errorPage);
    };

    this.clickBackButton = function(){
        Util.waitUntilElementIsVisible(backButton);
        backButton.click();
    };

    this.clickSecondButton = function(){
        Util.waitUntilElementIsVisible(secondButton);
        secondButton.click();
    };

    this.checkErrorTitle = function(){
        Util.waitUntilElementIsVisible(errorPageTitle);
    };

    this.checkErrorCode = function(){
        Util.waitUntilElementIsVisible(errorPageCode);
    };

    this.checkErrorDescription = function(){
        Util.waitUntilElementIsVisible(errorPageDescription);
    };

    this.getErrorCode = function() {
        Util.waitUntilElementIsVisible(errorPageCode);
        return errorPageCode.getText();
    };

    this.getErrorTitle = function() {
        Util.waitUntilElementIsVisible(errorPageTitle);
        return errorPageTitle.getText();
    };

    this.getErrorDescription = function() {
        Util.waitUntilElementIsVisible(errorPageDescription);
        return errorPageDescription.getText();
    };

};

module.exports = ErrorPage;
