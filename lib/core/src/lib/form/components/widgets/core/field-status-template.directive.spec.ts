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

import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
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
class TestHostComponent {
    @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<unknown>;
}

describe('FieldStatusTemplateDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostComponent]
        });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    const getDirectiveDebugElement = (): DebugElement => fixture.debugElement.query(By.directive(FieldStatusTemplateDirective));

    it('should expose the template provided through the input', () => {
        const directive = getDirectiveDebugElement().injector.get(FieldStatusTemplateDirective);

        expect(directive.template).toBe(fixture.componentInstance.statusTemplate);
    });

    it('should provide the input template through the FIELD_STATUS_TEMPLATE token', () => {
        const providedTemplate = getDirectiveDebugElement().injector.get(FIELD_STATUS_TEMPLATE);

        expect(providedTemplate).toBe(fixture.componentInstance.statusTemplate);
    });
});
