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

import { OptionsFilterPipe } from './options-filter.pipe';
import { CardViewSelectItemOption } from '../../../interfaces/card-view-selectitem-properties.interface';

describe('OptionsFilterPipe', () => {
    let pipe: OptionsFilterPipe;
    const items = [
        { label: 'label_1', key: 'key_1' },
        { label: 'label_2', key: 'key_2' },
        { label: 'label_3', key: 'key_3' }
    ] as CardViewSelectItemOption<any>[];

    beforeEach(() => {
        pipe = new OptionsFilterPipe();
    });

    it('should return empty array when no items are passed', () => {
        const result = pipe.transform(null, 'search-term');
        expect(result).toEqual([]);
    });

    it('should return all items when search term is empty', () => {
        const result = pipe.transform(items, '');
        expect(result).toEqual(items);
    });

    it('should filter items by search term', () => {
        const result = pipe.transform(items, 'label_2');
        expect(result).toEqual([{ label: 'label_2', key: 'key_2' }]);
    });
});
