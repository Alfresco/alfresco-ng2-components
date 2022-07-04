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

import { $$ } from 'protractor';
import { TestElement } from '../../test-element';
import { BrowserActions } from '../../utils/browser-actions';

export class DataTableColumnSelector {
    columnsSelectorComponent = TestElement.byCss('[data-automation-id="adf-columns-selector"]');
    closeButton = TestElement.byCss('[data-automation-id="adf-columns-selector-close-button"]');
    searchInput = TestElement.byCss('[data-automation-id="adf-columns-selector-search-input"]');
    columnsList = TestElement.byCss('.adf-columns-selector-list-container');

    async getAllColmns(): Promise<{name: string; isChecked: boolean}[]> {

        const columnNames = await BrowserActions.getArrayText($$('.adf-columns-selector-column-checkbox')) as any as string[];

        const req = columnNames.map(column => )



        const c = await Promise.all(b);
        console.log(c);
        // const value = $$('.adf-columns-selector-column-checkbox').reduce(function(acc, elem) {
        //     return elem.getText().then(function(text) {
        //       return acc + text + ' ';
        //     });
        //   }, '');

        // const a = await Promise.all([value] as any);


        // const allColumns = await columnCheckBoxes.getText();
        // debugger;
        // columnCheckBoxes.forEach((element => {
        //     debugger;
        //     console.log('element', element);

        // }));

        // const TestElement.byTag('mat-checkbox');



        return Promise.resolve([]);
    }
}
