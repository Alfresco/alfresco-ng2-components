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

import { ObjectUtils } from './object-utils';

describe('ObjectUtils', () => {

    it('should get top level property value', () => {
        let obj = {
            id: 1
        };
        expect(ObjectUtils.getValue(obj, 'id')).toBe(1);
    });

    it('should not get top level property value', () => {
        let obj = {};
        expect(ObjectUtils.getValue(obj, 'missing')).toBeUndefined();
    });

    it('should get nested property value', () => {
        let obj = {
            name: {
                firstName: 'John',
                lastName: 'Doe'
            }
        };

        expect(ObjectUtils.getValue(obj, 'name.lastName')).toBe('Doe');
    });

    it('should not get nested property value', () => {
        let obj = {};
        expect(ObjectUtils.getValue(obj, 'some.missing.property')).toBeUndefined();
    });

    it('should return undefined when getting value for missing target', () => {
        expect(ObjectUtils.getValue(null, 'id')).toBeUndefined();
    });

});
