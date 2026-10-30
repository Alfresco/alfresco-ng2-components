/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FIELD_STATUS_TEMPLATE, FieldStatusTemplateDirective } from './field-status-template.directive';

@Component({
    standalone: true,
    imports: [FieldStatusTemplateDirective],
    template: `
        <div [adf-field-status-template]="statusTemplate"></div>
        <ng-template #statusTemplate />
    `
})
class TestHostComponent {}

describe('FieldStatusTemplateDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let debugElement: DebugElement;
    let directive: FieldStatusTemplateDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent]
        });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        debugElement = fixture.debugElement.query(By.directive(FieldStatusTemplateDirective));
        directive = debugElement.injector.get(FieldStatusTemplateDirective);
    });

    it('provides the input template through the FIELD_STATUS_TEMPLATE token', () => {
        expect(directive.template).toBeTruthy();
        expect(debugElement.injector.get(FIELD_STATUS_TEMPLATE)).toBe(directive.template);
    });
});
