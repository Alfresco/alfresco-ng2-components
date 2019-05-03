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

import { element, by } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class TaskFormCloudComponent {

    cancelButton = element(by.css("button[id='adf-cloud-cancel-task']"));
    completeButton = element(by.css('button[adf-cloud-complete-task]'));

    checkCompleteButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.completeButton);
        return this;
    }

    checkCompleteButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.completeButton);
        return this;
    }

    clickCompleteButton() {
        BrowserActions.click(this.completeButton);
        return this;
    }

    clickCancelButton() {
        BrowserActions.click(this.cancelButton);
        return this;
    }

}
