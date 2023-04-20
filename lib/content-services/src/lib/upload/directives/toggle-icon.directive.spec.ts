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

import { Component, ViewChild } from '@angular/core';
import { ToggleIconDirective } from './toggle-icon.directive';
import { setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
    selector: 'adf-test-component',
    template: `
       <button id="testButton" adf-toggle-icon>test</button>
    `
})
class TestComponent {
    @ViewChild(ToggleIconDirective)
    directive: ToggleIconDirective;
}

describe('ToggleIconDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    setupTestBed({
        declarations: [
            TestComponent,
            ToggleIconDirective
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should set toggle to true on mouseenter', () => {
        const button: HTMLElement = fixture.nativeElement.querySelector('#testButton');
        button.dispatchEvent(new MouseEvent('mouseenter'));

        expect(component.directive.isToggled).toBe(true);
    });

    it('should set toggle to false on mouseleave if element is not focused', () => {
        const button: HTMLElement = fixture.nativeElement.querySelector('#testButton');
        button.dispatchEvent(new MouseEvent('mouseleave'));

        expect(component.directive.isToggled).toBe(false);
    });

    it('should set toggle and focus to false on mouseleave when element is focused', () => {
        const button: HTMLElement = fixture.nativeElement.querySelector('#testButton');
        button.dispatchEvent(new Event('focus'));
        expect(component.directive.isToggled).toBe(true);

        button.dispatchEvent(new MouseEvent('mouseleave'));

        expect(component.directive.isToggled).toBe(false);
        expect(component.directive.isFocused).toBe(false);
    });

    it('should set toggle and focus to true when element is focused', () => {
        const button: HTMLElement = fixture.nativeElement.querySelector('#testButton');
        button.dispatchEvent(new Event('focus'));

        expect(component.directive.isToggled).toBe(true);
        expect(component.directive.isFocused).toBe(true);
    });

    it('should set toggle and focus to true when element blur event', () => {
        const button: HTMLElement = fixture.nativeElement.querySelector('#testButton');
        button.dispatchEvent(new Event('focus'));
        button.dispatchEvent(new Event('blur'));

        expect(component.directive.isToggled).toBe(false);
        expect(component.directive.isFocused).toBe(false);
    });
});
