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

import { by } from 'protractor';
import { TestElement } from '../../test-element';

export class DataTableColumnSelector {
    columnsSelectorComponent = TestElement.byCss('[data-automation-id="adf-columns-selector"]');

    closeButton = TestElement.byCss('[data-automation-id="adf-columns-selector-close-button"]');
    searchInput = TestElement.byCss('[data-automation-id="adf-columns-selector-search-input"]');
    applyButton = TestElement.byCss('[data-automation-id="adf-columns-selector-apply-button"]');
    columnsListContainer = TestElement.byCss('.adf-columns-selector-list-container');
    allColumnsSelectors = this.columnsListContainer.elementFinder.all(
        by.css('.adf-columns-selector-column-checkbox')
    );

    async getAllColumnSelectors(): Promise<{ name: string; isSelected: boolean }[]> {
        const columnCheckboxes = this.allColumnsSelectors.map<[string, boolean]>(column => {
            const checkBoxElement = column.element(by.tagName('input'));
            return Promise.all([
                column.getText(),
                checkBoxElement.isSelected()
            ]);
        });

        const checkboxesValues = await columnCheckboxes;

        return checkboxesValues.map(([name, isSelected]) => ({
            name,
            isSelected
        }));
    }

    async selectColumn(columnName: string): Promise<void> {
        const columnSelector = this.allColumnsSelectors.filter(
            async column => {
                const columnText = await column.getText();
                return columnText === columnName;
            }
        ).first();

        return columnSelector.click();
    }
}
