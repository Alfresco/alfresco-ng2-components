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

import {
    ElementFinder,
    by,
    browser,
    ExpectedConditions as EC
} from 'protractor';
import { Component } from './component';

export class ConfirmDialog extends Component {
    static selectors = {
        root: 'adf-confirm-dialog',

        title: '.mat-dialog-title',
        content: '.mat-dialog-content',
        accept: 'adf-confirm-accept',
        cancel: 'adf-confirm-cancel',
        actionButton: 'adf-confirm'
    };

    title: ElementFinder = this.component.element(
        by.css(ConfirmDialog.selectors.title)
    );
    content: ElementFinder = this.component.element(
        by.css(ConfirmDialog.selectors.content)
    );
    acceptButton: ElementFinder = this.component.element(
        by.id(ConfirmDialog.selectors.accept)
    );
    cancelButton: ElementFinder = this.component.element(
        by.id(ConfirmDialog.selectors.cancel)
    );
    actionButton: ElementFinder = this.component.element(
        by.id(ConfirmDialog.selectors.actionButton)
    );

    constructor(ancestor?: ElementFinder) {
        super(ConfirmDialog.selectors.root, ancestor);
    }

    async waitForDialogToClose() {
        await browser.wait(EC.stalenessOf(this.title), this.waitTimeout);
    }

    async waitForDialogToOpen() {
        await browser.wait(EC.presenceOf(this.title), this.waitTimeout);
    }

    async isDialogOpen() {
        return await browser.isElementPresent(
            by.css(ConfirmDialog.selectors.root)
        );
    }

    async getTitle() {
        return await this.title.getText();
    }

    async getText() {
        return await this.content.getText();
    }

    getButtonByName(name: string) {
        return this.component.element(by.buttonText(name));
    }

    async clickButton(name: string) {
        const button = this.getButtonByName(name);
        await button.click();
    }

    async isButtonEnabled(name: string) {
        const button = this.getButtonByName(name);
        return await button.isEnabled();
    }

    async isOkEnabled() {
        return await this.isButtonEnabled('OK');
    }

    async isCancelEnabled() {
        return await this.isButtonEnabled('Cancel');
    }

    async isKeepEnabled() {
        return await this.isButtonEnabled('Keep');
    }

    async isDeleteEnabled() {
        return await this.isButtonEnabled('Delete');
    }

    async isRemoveEnabled() {
        return await this.isButtonEnabled('Remove');
    }

    async clickOk() {
        return await this.clickButton('OK');
    }

    async clickCancel() {
        return await this.clickButton('Cancel');
    }

    async clickKeep() {
        return await this.clickButton('Keep');
    }

    async clickDelete() {
        return await this.clickButton('Delete');
    }

    async clickRemove() {
        return await this.clickButton('Remove');
    }
}
