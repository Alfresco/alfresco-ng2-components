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

export class FormControllersPage {

    enableToggle(toggle) {
        Util.waitUntilElementIsVisible(toggle);
        toggle.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') < 0) {
                Util.waitUntilElementIsClickable(toggle.all(by.css('div')).first());
                toggle.all(by.css('div')).first().click();
            }
        });
    }

    disableToggle(toggle) {
        Util.waitUntilElementIsVisible(toggle);
        toggle.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') >= 0) {
                Util.waitUntilElementIsClickable(toggle.element(by.css('div')));
                toggle.element(by.css('div')).click();
            }
        });
    }
}
