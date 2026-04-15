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

import { FormLayoutColumn, getFormLayoutColumnWidth } from './column-width';

describe('getFormLayoutColumnWidth', () => {
    it('should return the default width when numberOfColumns is invalid', () => {
        const columns: FormLayoutColumn[] = [{ fields: [{ colspan: 1 }] }];

        const width = getFormLayoutColumnWidth(undefined, columns, 0);

        expect(width).toBe('100');
    });

    it('should return the default width for an authored empty spacer column', () => {
        const NUMBER_OF_COLUMNS = 3;
        const columns: FormLayoutColumn[] = [{ fields: [] }, { fields: [{ colspan: 1 }] }];

        const width = getFormLayoutColumnWidth(NUMBER_OF_COLUMNS, columns, 0);

        expect(width).toBe('33.333333333333336');
    });

    it('should return zero width for an empty column covered by a previous colspan', () => {
        const NUMBER_OF_COLUMNS = 4;
        const columns: FormLayoutColumn[] = [{ fields: [{ colspan: 3 }] }, { fields: [] }, { fields: [] }, { fields: [] }];

        const width = getFormLayoutColumnWidth(NUMBER_OF_COLUMNS, columns, 1);

        expect(width).toBe('0');
    });

    it('should use the maximum colspan when a column contains multiple fields', () => {
        const NUMBER_OF_COLUMNS = 4;
        const columns: FormLayoutColumn[] = [{ fields: [{ colspan: 1 }, { colspan: 3 }] }];

        const width = getFormLayoutColumnWidth(NUMBER_OF_COLUMNS, columns, 0);

        expect(width).toBe('75');
    });

    it('should cap the width at 100 percent when colspan exceeds the available columns', () => {
        const NUMBER_OF_COLUMNS = 2;
        const columns: FormLayoutColumn[] = [{ fields: [{ colspan: 5 }] }];

        const width = getFormLayoutColumnWidth(NUMBER_OF_COLUMNS, columns, 0);

        expect(width).toBe('100');
    });

    it('should treat a missing colspan as one column', () => {
        const NUMBER_OF_COLUMNS = 5;
        const columns: FormLayoutColumn[] = [{ fields: [{}] }];

        const width = getFormLayoutColumnWidth(NUMBER_OF_COLUMNS, columns, 0);

        expect(width).toBe('20');
    });

    it('should not mark a later empty spacer as covered when an earlier column is also empty', () => {
        const NUMBER_OF_COLUMNS = 4;
        const columns: FormLayoutColumn[] = [{ fields: [] }, { fields: [] }, { fields: [{ colspan: 1 }] }, { fields: [] }];

        const width = getFormLayoutColumnWidth(NUMBER_OF_COLUMNS, columns, 1);

        expect(width).toBe('25');
    });
});
