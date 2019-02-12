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

import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {

    let pipe: FileSizePipe;

    beforeEach(() => {
        const translation: any = {
            instant(key) {
                const enUs = {
                    'CORE.FILE_SIZE.BYTES': 'Bytes',
                    'CORE.FILE_SIZE.KB': 'KB',
                    'CORE.FILE_SIZE.MB': 'MB',
                    'CORE.FILE_SIZE.GB': 'GB',
                    'CORE.FILE_SIZE.TB': 'TB',
                    'CORE.FILE_SIZE.PB': 'PB',
                    'CORE.FILE_SIZE.EB': 'EB',
                    'CORE.FILE_SIZE.ZB': 'ZB',
                    'CORE.FILE_SIZE.YB': 'YB'
                };
                return enUs[key];
            }
        };
        pipe = new FileSizePipe(translation);
    });

    it('returns empty string with invalid input', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });

    it('should convert value to Bytes', () => {
        expect(pipe.transform(0)).toBe('0 Bytes');
        expect(pipe.transform(1023)).toBe('1023 Bytes');
    });

    it('should convert value to KB', () => {
        expect(pipe.transform(1024)).toBe('1 KB');
        expect(pipe.transform(1048575)).toBe('1024 KB');
    });

    it('should convert value to MB', () => {
        expect(pipe.transform(1048576)).toBe('1 MB');
        expect(pipe.transform(1073741823)).toBe('1024 MB');
    });

    it('should convert value to GB', () => {
        expect(pipe.transform(1073741824)).toBe('1 GB');
        expect(pipe.transform(1099511627775)).toBe('1024 GB');
    });

    it('should convert value to TB and PB', () => {
        expect(pipe.transform(1099511627776)).toBe('1 TB');
        expect(pipe.transform(1125899906842623)).toBe('1 PB');
    });

    it('should convert value with custom precision', () => {
        const tests = [
            { size: 10, precision: 2, expectancy: '10 Bytes'},
            { size: 1023, precision: 1, expectancy: '1023 Bytes'},
            { size: 1025, precision: 2, expectancy: '1 KB'},
            { size: 1499, precision: 0, expectancy: '1.46 KB'},
            { size: 1999, precision: 0, expectancy: '1.95 KB'},
            { size: 2000, precision: 2, expectancy: '1.95 KB'},
            { size: 5000000, precision: 4, expectancy: '4.7684 MB'},
            { size: 12345678901234, precision: 3, expectancy: '11.228 TB'}
        ];

        tests.forEach(({ size, precision, expectancy }) => {
            expect(pipe.transform(size, precision)).toBe(expectancy);
        });
    });

});
