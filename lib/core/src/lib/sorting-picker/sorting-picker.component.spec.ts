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

import { SortingPickerComponent } from './sorting-picker.component';

describe('SortingPickerComponent', () => {

    let component: SortingPickerComponent;

    beforeEach(() => {
        component = new SortingPickerComponent();
    });

    it('should raise changed event on changing value', (done) => {
        component.selected = 'key1';

        component.valueChange.subscribe((key: string) =>  {
            expect(key).toBe('key2');
            done();
        });
        component.onOptionChanged({ value: 'key2' } as any);
    });

    it('should raise changed event on changing direction', (done) => {
        component.ascending = false;

        component.sortingChange.subscribe((ascending: boolean) =>  {
            expect(ascending).toBeTruthy();
            done();
        });
        component.toggleSortDirection();
    });
});
