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

import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AutoFocusDirective } from './auto-focus.directive';
import { By } from '@angular/platform-browser';

@Component({
    imports: [AutoFocusDirective],
    template: ` <div tabindex="0" adf-auto-focus>Test</div>`
})
class AutoFocusTestComponent {}

describe('AutoFocusDirective', () => {
    let fixture: ComponentFixture<AutoFocusTestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AutoFocusDirective, AutoFocusTestComponent]
        });
        fixture = TestBed.createComponent(AutoFocusTestComponent);
    });

    it('should focus the element after content is initialized', fakeAsync(() => {
        const autoFocusElement = fixture.debugElement.query(By.directive(AutoFocusDirective)).nativeElement;
        spyOn(autoFocusElement, 'focus');
        fixture.detectChanges();
        tick(200);
        expect(autoFocusElement.focus).toHaveBeenCalled();
    }));
});
