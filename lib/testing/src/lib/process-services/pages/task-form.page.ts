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
import { BrowserActions, BrowserVisibility } from '../../core/utils/public-api';

export class TaskFormPage {

    saveButton = element(by.cssContainingText('mat-card-actions[class*="adf-for"] span', 'SAVE'));
    claimButton = element(by.id('adf-task-form-claim-button'));
    releaseButton = element(by.id('adf-task-form-unclaim-button'));

    async clickOnClaimButton(): Promise<void> {
        await BrowserActions.click(this.claimButton);
    }

    async clickOnReleaseButton(): Promise<void> {
        await BrowserActions.click(this.releaseButton);
    }

    async isSaveButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isClaimButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.claimButton);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isReleaseButtonDisplayed(): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.releaseButton);
            return true;
        } catch (error) {
            return false;
        }
    }
    async isSaveButtonEnabled(): Promise<boolean> {
        return this.saveButton.isEnabled();
    }

    async isClaimButtonEnabled(): Promise<boolean> {
        return this.claimButton.isEnabled();
    }

    async isReleaseButtonEnabled(): Promise<boolean> {
        return this.releaseButton.isEnabled();
    }
}
