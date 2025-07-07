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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

describe('ToolbarComponent', () => {
    let fixture: ComponentFixture<ToolbarComponent>;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ToolbarComponent]
        });

        fixture = TestBed.createComponent(ToolbarComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    it('should render title span', async () => {
        fixture.componentInstance.title = 'test-title';

        fixture.detectChanges();
        await fixture.whenStable();

        const title: HTMLSpanElement = testingUtils.getByCSS('.adf-toolbar-title').nativeElement;
        expect(title.innerHTML).toBe('test-title');
    });
});
