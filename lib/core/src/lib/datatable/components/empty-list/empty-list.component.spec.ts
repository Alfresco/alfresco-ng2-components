/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyListComponent } from './empty-list.component';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('EmptyListComponentComponent', () => {
    let fixture: ComponentFixture<EmptyListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [EmptyListComponent]
        });
        fixture = TestBed.createComponent(EmptyListComponent);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the input values', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(UnitTestingUtils.getByCSS(fixture.debugElement, '.adf-empty-list_template')).toBeDefined();
    });
});
