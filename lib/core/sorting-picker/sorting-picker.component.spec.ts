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

import { SortingPickerComponent } from './sorting-picker.component';

describe('SortingPickerComponent', () => {

    let component: SortingPickerComponent;

    beforeEach(() => {
        component = new SortingPickerComponent();
    });

    it('should raise changed event on changing value', (done) => {
        component.selected = 'key1';
        component.ascending = false;

        component.change.subscribe((event: { key: string, ascending: boolean }) =>  {
            expect(event.key).toBe('key2');
            expect(event.ascending).toBeFalsy();
            done();
        });
        component.onChanged(<any> { value: 'key2' });
    });

    it('should raise changed event on changing direction', (done) => {
        component.selected = 'key1';
        component.ascending = false;

        component.change.subscribe((event: { key: string, ascending: boolean }) =>  {
            expect(event.key).toBe('key1');
            expect(event.ascending).toBeTruthy();
            done();
        });
        component.toggleSortDirection();
    });

});
