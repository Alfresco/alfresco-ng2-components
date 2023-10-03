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

import { WidgetDataTableAdapter } from './data-table-adapter.widget';
import {
    mockEuropeCountriesData,
    mockCountriesIncorrectData,
    mockInvalidSchemaDefinition,
    mockSchemaDefinition
} from '../../../mocks/data-table-widget.mock';
import { ObjectDataRow } from '@alfresco/adf-core';

describe('WidgetDataTableAdapter', () => {
    let widgetDataTableAdapter: WidgetDataTableAdapter;

    beforeEach(() => {
        widgetDataTableAdapter = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
    });

    it('should return rows if all columns are linked to data', () => {
        const rows = widgetDataTableAdapter.getRows();

        expect(rows).toEqual([
            new ObjectDataRow({ id: 'IT', name: 'Italy' }),
            new ObjectDataRow({ id: 'PL', name: 'Poland' }),
            new ObjectDataRow({ id: 'UK', name: 'United Kingdom' })
        ]);
    });

    it('should return an empty array if not all columns are linked to data', () => {
        widgetDataTableAdapter = new WidgetDataTableAdapter(mockCountriesIncorrectData, mockSchemaDefinition);
        const rows = widgetDataTableAdapter.getRows();
        const isDataSourceValid = widgetDataTableAdapter.isDataSourceValid();

        expect(rows).toEqual([]);
        expect(isDataSourceValid).toBeFalse();
    });

    it('should return an empty array if columns have invalid structure', () => {
        widgetDataTableAdapter = new WidgetDataTableAdapter(mockEuropeCountriesData, mockInvalidSchemaDefinition);
        const rows = widgetDataTableAdapter.getRows();
        const isDataSourceValid = widgetDataTableAdapter.isDataSourceValid();

        expect(rows).toEqual([]);
        expect(isDataSourceValid).toBeFalse();
    });

    it('should return true for isDataSourceValid() if rows have data and valid columns schema', () => {
        const isValid = widgetDataTableAdapter.isDataSourceValid();

        expect(isValid).toBeTrue();
    });
});
