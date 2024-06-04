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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ColorSetDirective } from './color-set.directive';
import { ColorSet } from './color-set.model';

@Component({
    template: ` <div class="adf-color-set" [adf-color-set]="testColorSet"></div> `
})
class TestComponent {
    testColorSet: ColorSet = {
        background: 'rgb(212, 233, 255)',
        border: 'rgb(30, 32, 110)',
        text: 'rgb(11, 13, 87)'
    };
}

describe('ColorSetDirective', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ColorSetDirective],
            declarations: [TestComponent]
        });

        fixture = TestBed.createComponent(TestComponent);
    });

    it('should apply color set to a component', () => {
        const testDiv = fixture.debugElement.query(By.css('.adf-color-set'));
        fixture.detectChanges();

        expect(testDiv.nativeElement.style.backgroundColor).toEqual('rgb(212, 233, 255)');
        expect(testDiv.nativeElement.style.borderColor).toEqual('rgb(30, 32, 110)');
        expect(testDiv.nativeElement.style.color).toEqual('rgb(11, 13, 87)');
    });
});
