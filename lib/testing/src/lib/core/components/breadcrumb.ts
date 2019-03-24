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

import { ElementFinder, ElementArrayFinder, by } from 'protractor';
import { Component } from './component';

export class Breadcrumb extends Component {
    static selectors = {
        root: 'adf-breadcrumb',
        item: '.adf-breadcrumb-item',
        currentItem: '.adf-breadcrumb-item-current'
    };

    items: ElementArrayFinder = this.component.all(
        by.css(Breadcrumb.selectors.item)
    );
    currentItem: ElementFinder = this.component.element(
        by.css(Breadcrumb.selectors.currentItem)
    );

    constructor(ancestor?: ElementFinder) {
        super(Breadcrumb.selectors.root, ancestor);
    }

    getNthItem(nth: number): ElementFinder {
        return this.items.get(nth - 1);
    }

    async getNthItemName(nth: number) {
        return await this.getNthItem(nth).getText();
    }

    async getItemsCount() {
        return await this.items.count();
    }

    async getAllItems() {
        return this.items.map(async elem => {
            const str = await elem.getText();
            return str.split('\nchevron_right')[0];
        });
    }

    async getFirstItemName() {
        return await this.items.get(0).getText();
    }

    getCurrentItem() {
        return this.currentItem;
    }

    async getCurrentItemName() {
        return await this.currentItem.getText();
    }

    async clickItem(name: string) {
        const elem = this.component.element(
            by.css(`${Breadcrumb.selectors.item}[title=${name}]`)
        );
        await elem.click();
    }

    async clickNthItem(nth: number) {
        await this.getNthItem(nth).click();
    }

    async getNthItemTooltip(nth: number) {
        return await this.getNthItem(nth).getAttribute('title');
    }
}
