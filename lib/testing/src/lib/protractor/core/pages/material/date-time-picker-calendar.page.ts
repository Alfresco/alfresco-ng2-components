/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { element, by, $ } from 'protractor';
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';

export class DateTimePickerCalendarPage {

    datePicker = $(`.mat-calendar`);
    today = $(`.mat-calendar-body-today`);

    async waitTillDateDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.datePicker);
    }

    async setToday(): Promise<void> {
        await BrowserActions.click(this.today);
    }

    async setDate(date?: string): Promise<boolean> {
        try {
            if (date) {
                await BrowserActions.clickScript(element.all(by.cssContainingText(`.mat-calendar-body-cell-content`, date)).first());
            } else {
                await this.setToday();
            }
            return true;
        } catch {
            return false;
        }
    }

    async checkCalendarTodayDayIsDisabled(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(element(by.cssContainingText('.mat-calendar-body-disabled', await BrowserActions.getText(this.today))));
    }
}
