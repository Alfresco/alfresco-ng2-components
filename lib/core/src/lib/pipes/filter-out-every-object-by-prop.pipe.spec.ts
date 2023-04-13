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

import { FilterOutArrayObjectsByPropPipe } from './filter-out-every-object-by-prop.pipe';

describe('FilterOutArrayObjectsByPropPipe', () => {
    let pipe: FilterOutArrayObjectsByPropPipe<any>;

    beforeEach(() => {
        pipe = new FilterOutArrayObjectsByPropPipe();
    });

    it('should filter out object', () => {
        const testArray = [{
            id: 1
        }, {
            id: 2
        }, {
            id: 3
        }];

        const result = pipe.transform(testArray, 'id', 3);

        expect(result.length).toBe(testArray.length  - 1);
        expect(result[0]).toEqual(testArray[0]);
        expect(result[1]).toEqual(testArray[1]);
    });

    it('should filter out multiple objects', () => {
        const testArray = [{
            isHidden: true
        }, {
            isHidden: true
        }, {
            isHidden: true
        }, {
            isHidden: false
        }];

        const result = pipe.transform(testArray, 'isHidden', true);

        expect(result.length).toBe(1);
        expect(result[0]).toEqual(testArray[3]);
    });

    it('should work with empty array', () => {
        const testArray = [];

        const result = pipe.transform(testArray, 'prop', true);

        expect(result.length).toBe(0);
    });

    it('should work with non existing prop', () => {
        const testArray = [{ prop: 1 }];

        const result = pipe.transform(testArray, 'nonExistionProp', 1);

        expect(result.length).toBe(1);
    });
});
