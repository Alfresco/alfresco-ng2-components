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

import { $ } from 'protractor';
import { BrowserActions, BrowserVisibility } from '../../core/utils/public-api';

export class TaskFormPage {

    saveButton = $('#adf-form-save');
    claimButton = $('button[data-automation-id="adf-task-form-claim-button"]');
    releaseButton = $('button[data-automation-id="adf-task-form-unclaim-button"]');

    async clickOnClaimButton(): Promise<void> {
        await BrowserActions.click(this.claimButton);
    }

    async clickOnReleaseButton(): Promise<void> {
        await BrowserActions.click(this.releaseButton);
    }

    async isSaveButtonDisplayed(timeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.saveButton, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isSaveButtonNotDisplayed(timeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(this.saveButton, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isClaimButtonDisplayed(timeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.claimButton, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isClaimButtonNotDisplayed(timeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(this.claimButton, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isReleaseButtonDisplayed(timeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.releaseButton, timeout);
            return true;
        } catch (error) {
            return false;
        }
    }

    async isReleaseButtonNotDisplayed(timeout?: number): Promise<boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(this.releaseButton, timeout);
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
