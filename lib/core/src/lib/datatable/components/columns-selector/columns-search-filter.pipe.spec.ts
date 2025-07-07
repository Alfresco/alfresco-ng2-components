/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ColumnsSearchFilterPipe } from './columns-search-filter.pipe';
import { DataColumn } from '../../data/data-column.model';
import { TestBed } from '@angular/core/testing';

describe('ColumnsSeearchFilterPipe', () => {
    let pipe: ColumnsSearchFilterPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ColumnsSearchFilterPipe],
            providers: [ColumnsSearchFilterPipe]
        });

        pipe = TestBed.inject(ColumnsSearchFilterPipe);
    });

    it('should filter columns', () => {
        const columns: DataColumn[] = [
            {
                title: 'Column 1',
                key: '',
                type: 'text'
            },
            {
                title: 'Column 2',
                key: '',
                type: 'number'
            },
            {
                title: 'Column 3',
                key: '',
                type: 'number'
            }
        ];

        const filteredColumns = pipe.transform(columns, '1');

        expect(filteredColumns.length).toBe(1);
        expect(filteredColumns).toEqual([
            {
                title: 'Column 1',
                key: '',
                type: 'text'
            }
        ]);
    });
});
