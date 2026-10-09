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

/* eslint-disable @angular-eslint/component-selector */

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicExtensionComponent } from './dynamic.component';
import { ComponentRegisterService } from '../../services/component-register.service';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'test-component',
    template: '<div data-automation-id="found-me">Hey I am the mighty test component!</div>'
})
export class TestComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    menuItem = 'matMenuTestData';
    public onChangesCalled = 0;
    public destroyed = false;

    ngOnChanges() {
        this.onChangesCalled++;
    }

    ngOnDestroy() {
        this.destroyed = true;
    }
}

@Component({
    selector: 'test-alternate-component',
    template: '<div data-automation-id="alternate-component">Alternate test component</div>'
})
export class AlternateTestComponent {
    @Input() data: any;
    menuItem = 'alternateMenuTestData';
}

describe('DynamicExtensionComponent', () => {
    let fixture: ComponentFixture<DynamicExtensionComponent>;
    let componentRegister: ComponentRegisterService;
    let component: DynamicExtensionComponent;

    beforeEach(() => {
        componentRegister = new ComponentRegisterService();
        componentRegister.setComponents({ 'test-component': TestComponent, 'alternate-component': AlternateTestComponent });

        TestBed.configureTestingModule({
            imports: [HttpClientModule, DynamicExtensionComponent, TestComponent, AlternateTestComponent],
            providers: [{ provide: ComponentRegisterService, useValue: componentRegister }]
        });
        TestBed.compileComponents();
    });

    describe('Sub-component creation', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(DynamicExtensionComponent);
            component = fixture.componentInstance;
            fixture.componentRef.setInput('id', 'test-component');
            fixture.componentRef.setInput('data', { foo: 'bar' });

            fixture.detectChanges();
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

            fixture.componentRef.setInput('data', data);
            fixture.detectChanges();

            const testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance;
            expect(testComponent.data).toBe(data);
        });

        it('should assign menuItem from dynamically generated component in ngAfterViewInit', () => {
            expect(component.menuItem).toEqual('matMenuTestData' as any);
        });

        it('should recreate the subcomponent when the id changes', () => {
            const testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance as TestComponent;

            fixture.componentRef.setInput('id', 'alternate-component');
            fixture.detectChanges();

            const alternateComponent = fixture.debugElement.query(By.css('test-alternate-component')).componentInstance as AlternateTestComponent;
            expect(testComponent.destroyed).toBe(true);
            expect(alternateComponent.data).toBe(component.data);
            expect(component.menuItem).toEqual('alternateMenuTestData' as any);
            expect(fixture.debugElement.query(By.css('test-component'))).toBeNull();
        });

        it('should remove the subcomponent when the id is not registered', () => {
            const testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance as TestComponent;

            fixture.componentRef.setInput('id', 'missing-component');
            fixture.detectChanges();

            expect(testComponent.destroyed).toBe(true);
            expect(component.menuItem).toBeUndefined();
            expect(fixture.debugElement.query(By.css('test-component'))).toBeNull();
        });
    });

    describe('Angular life-cycle methods in sub-component', () => {
        let testComponent: TestComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(DynamicExtensionComponent);
            fixture.componentRef.setInput('id', 'test-component');

            fixture.detectChanges();
            testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance;
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should call ngOnChanges once for each data update', () => {
            fixture.componentRef.setInput('data', { foo: 'bar' });
            fixture.detectChanges();

            expect(testComponent.onChangesCalled).toBe(2);
        });
    });
});
