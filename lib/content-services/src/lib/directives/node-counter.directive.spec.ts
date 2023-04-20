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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeCounterDirective, NodeCounterComponent } from './node-counter.directive';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    template: `<div [adf-node-counter]="count"></div>`
})
class TestComponent {
    count: number = 0;
}

describe('NodeCounterDirective', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            declarations: [
                NodeCounterDirective,
                NodeCounterComponent,
                TestComponent
            ]
        });
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('should display the counter component', async () => {
        await fixture.whenStable();
        const counterElement = fixture.debugElement.query(By.css('adf-node-counter'));
        expect(counterElement).not.toBeNull();
        expect(counterElement.nativeElement.innerText).toBe('NODE_COUNTER.SELECTED_COUNT');
    });
});
