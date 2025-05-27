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

/* eslint-disable @angular-eslint/component-selector */

import { Component, Input, OnChanges, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicExtensionComponent } from './dynamic.component';
import { ComponentRegisterService } from '../../services/component-register.service';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'test-component',
    standalone: true,
    template: '<div data-automation-id="found-me">Hey I am the mighty test component!</div>'
})
export class TestComponent implements OnChanges {
    @Input() data: any;
    public onChangesCalled = 0;

    ngOnChanges() {
        this.onChangesCalled++;
    }
}

describe('DynamicExtensionComponent', () => {
    let fixture: ComponentFixture<DynamicExtensionComponent>;
    let componentRegister: ComponentRegisterService;
    let component: DynamicExtensionComponent;

    beforeEach(() => {
        componentRegister = new ComponentRegisterService();
        componentRegister.setComponents({ 'test-component': TestComponent });

        TestBed.configureTestingModule({
            imports: [HttpClientModule, DynamicExtensionComponent, TestComponent],
            providers: [{ provide: ComponentRegisterService, useValue: componentRegister }]
        });

        TestBed.compileComponents();
    });

    describe('Sub-component creation', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(DynamicExtensionComponent);
            component = fixture.componentInstance;
            component.id = 'test-component';
            component.data = { foo: 'bar' };

            fixture.detectChanges();
            component.ngOnChanges({});
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        const getInnerElement = () => fixture.debugElement.query(By.css('[data-automation-id="found-me"]'));

        it('should load the TestComponent', () => {
            expect(getInnerElement()).not.toBeNull();
        });

        it('should pass through the data', () => {
            const testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance;

            expect(testComponent.data).toBe(component.data);
        });

        it('should update the subcomponent input parameters', () => {
            const data = { foo: 'baz' };

            component.ngOnChanges({ data: new SimpleChange(component.data, data, false) });

            const testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance;
            expect(testComponent.data).toBe(data);
        });

        it('should assign menuItem from dynamically generated component in ngAfterViewInit', () => {
            component.menuItem = null;
            const mockMenuItem = {
                _uniqueId: 'menu-123',
                disabled: false,
                getLabel: () => 'Test Item',
                trigger: null,
                isSubmenu: false
            };
            getInnerElement().componentInstance.menuItem = mockMenuItem;
            component.ngAfterViewInit();
            expect(component.menuItem).toBe(mockMenuItem);
        });
    });

    describe('Angular life-cycle methods in sub-component', () => {
        let testComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(DynamicExtensionComponent);
            component = fixture.componentInstance;
            component.id = 'test-component';

            fixture.detectChanges();
            component.ngOnChanges({});
            testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance;
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should call through the ngOnChanges', () => {
            const params = {};

            component.ngOnChanges(params);

            expect(testComponent.onChangesCalled).toBe(2);
        });

        it('should NOT call through the ngOnChanges if the method does not exist (no error should be thrown)', () => {
            testComponent.ngOnChanges = undefined;
            const params = {};
            const execution = () => {
                component.ngOnChanges(params);
            };

            expect(execution).not.toThrowError();
        });
    });
});
