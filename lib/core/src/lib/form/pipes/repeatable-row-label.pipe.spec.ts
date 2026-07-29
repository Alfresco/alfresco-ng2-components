/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { RepeatableRowLabelPipe } from './repeatable-row-label.pipe';

describe('RepeatableRowLabelPipe', () => {
    let pipe: RepeatableRowLabelPipe;

    beforeEach(() => {
        pipe = new RepeatableRowLabelPipe();
    });

    it('should return null when the label text is empty', () => {
        expect(pipe.transform({ rowLabelText: '', appendRowNumber: true }, 0)).toBeNull();
    });

    it('should return null when the label text is undefined', () => {
        expect(pipe.transform({ appendRowNumber: true }, 0)).toBeNull();
    });

    it('should return null when the label text is only whitespace', () => {
        expect(pipe.transform({ rowLabelText: '   ', appendRowNumber: true }, 0)).toBeNull();
    });

    it('should return null when the params are undefined', () => {
        expect(pipe.transform(undefined, 0)).toBeNull();
    });

    it('should return null when the label text is not a string', () => {
        expect(pipe.transform({ rowLabelText: 5 as unknown as string, appendRowNumber: true }, 0)).toBeNull();
    });

    it('should append the 1-based row number when appendRowNumber is true', () => {
        expect(pipe.transform({ rowLabelText: 'Approver', appendRowNumber: true }, 0)).toBe('Approver 1');
        expect(pipe.transform({ rowLabelText: 'Approver', appendRowNumber: true }, 4)).toBe('Approver 5');
    });

    it('should append the row number by default when appendRowNumber is undefined', () => {
        expect(pipe.transform({ rowLabelText: 'Approver' }, 1)).toBe('Approver 2');
    });

    it('should NOT append the row number when appendRowNumber is false', () => {
        expect(pipe.transform({ rowLabelText: 'Approver', appendRowNumber: false }, 3)).toBe('Approver');
    });

    it('should trim the label text', () => {
        expect(pipe.transform({ rowLabelText: '  Approver  ', appendRowNumber: true }, 0)).toBe('Approver 1');
    });
});
