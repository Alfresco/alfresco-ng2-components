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

import { Util } from '../../../util/util';
import { by } from 'protractor';

export class TaskFiltersCloudComponent {

    filter;
    taskIcon = by.xpath("ancestor::div[@class='mat-list-item-content']/mat-icon");

    constructor(filter) {
        this.filter = filter;
    }

    checkTaskFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter);
        return this;
    }

    getTaskFilterIcon() {
        Util.waitUntilElementIsVisible(this.filter);
        let icon = this.filter.element(this.taskIcon);
        Util.waitUntilElementIsVisible(icon);
        return icon.getText();
    }

    checkTaskFilterHasNoIcon() {
        Util.waitUntilElementIsVisible(this.filter);
        Util.waitUntilElementIsNotOnPage(this.filter.element(this.taskIcon));
    }

    clickTaskFilter() {
        Util.waitUntilElementIsVisible(this.filter);
        return this.filter.click();
    }

    clickCustomFilters() {
        Util.waitUntilElementIsVisible(this.filter);
        return this.filter.click();
    }

    clickFilterDropDown() {
        Util.waitUntilElementIsVisible(this.filter);
        return this.filter.click();
    }

    setOption() {
        Util.waitUntilElementIsVisible(this.filter);
        return this.filter.click();
    }

    checkTaskFilterNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.filter);
        return this.filter;
    }

}
