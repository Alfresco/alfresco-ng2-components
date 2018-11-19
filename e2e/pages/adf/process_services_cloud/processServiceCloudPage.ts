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

import Util = require('../../../util/util');
import { AppNavigationBarPage } from '../../../pages/adf/process_services/appNavigationBarPage';

import { element, by } from 'protractor';

export class ProcessServicesCloudPage {

    apsAppsContainer = element(by.className('menu-container'));
    processServices = element(by.css('a[data-automation-id="Process Services"]'));
    taskApp = element(by.css('mat-card[title="Task App"]'));
    iconTypeLocator = by.css('mat-icon[class*="card-logo-icon"]');
    descriptionLocator = by.css('mat-card-subtitle[class*="subtitle"]');
    processInstanceList = element(by.css('adf-process-instance-list'));

    checkApsContainer() {
        Util.waitUntilElementIsVisible(this.apsAppsContainer);
    }

    goToProcessServices() {
        Util.waitUntilElementIsVisible(this.processServices);
        this.processServices.click();
        this.checkApsContainer();
        return this;
    }

    goToApp(applicationName) {
        let app = element(by.css('mat-card[title="' + applicationName + '"]'));
        Util.waitUntilElementIsVisible(app);
        app.click();
        return new AppNavigationBarPage();
    }

    checkAppIsNotDisplayed(applicationName) {
        let app = element(by.css('mat-card[title="' + applicationName + '"]'));
        return Util.waitUntilElementIsNotOnPage(app);
    }

    checkAppIsDisplayed(applicationName) {
        let app = element(by.css('mat-card[title="' + applicationName + '"]'));
        return Util.waitUntilElementIsVisible(app);
    }

    checkProcessListIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processInstanceList);
    }

}
