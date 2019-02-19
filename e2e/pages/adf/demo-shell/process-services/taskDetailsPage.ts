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

import { by, element } from 'protractor';
import { Util } from '../../../../util/util';

export class TaskDetailsPage {

    taskDetailsHeader = element(by.css('ng-component h4'));
    taskPropertyList = element(by.css('adf-cloud-task-header adf-card-view div[class="adf-property-list"]'));

    checkTaskDetailsHeader(taskId) {
        Util.waitUntilElementIsOnPage(this.taskPropertyList);
        expect(this.taskDetailsHeader.getText()).toContain(taskId);
    }

    checkPropertyIsDisplayed(propertyName) {
        Util.waitUntilElementIsVisible(element(by.css(`div[data-automation-id="header-${propertyName}"]`)));
        return element(by.css(`div[data-automation-id="header-${propertyName}"]`));
    }

    getPropertyLabel(propertyLabel) {
        Util.waitUntilElementIsVisible(this.checkPropertyIsDisplayed(propertyLabel).element(by.css(`div[data-automation-id="card-textitem-label-${propertyLabel}"]`)));
        return this.checkPropertyIsDisplayed(propertyLabel).element(by.css(`div[data-automation-id="card-textitem-label-${propertyLabel}"]`)).getText();
    }

    getPropertyValue(propertyValue) {
        Util.waitUntilElementIsVisible(this.checkPropertyIsDisplayed(propertyValue).element(by.css(`span[data-automation-id="card-textitem-value-${propertyValue}"]`)));
        return this.checkPropertyIsDisplayed(propertyValue).element(by.css(`span[data-automation-id="card-textitem-value-${propertyValue}"]`)).getText();
    }

}
