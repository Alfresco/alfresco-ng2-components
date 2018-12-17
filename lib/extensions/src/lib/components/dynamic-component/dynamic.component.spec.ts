/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

/* tslint:disable:component-selector  */

import {
    Component,
    Input,
    SimpleChanges,
    OnChanges,
    SimpleChange,
    ComponentFactoryResolver,
    OnInit,
    OnDestroy,
    AfterContentInit,
    DoCheck,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DynamicExtensionComponent } from './dynamic.component';
import { ComponentRegisterService } from '../../services/component-register.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'test-component',
    template: '<div data-automation-id="found-me">Hey I am the mighty test component!</div>'
})
export class TestComponent {
    @Input() data: any;
}

@Component({
    selector: 'test-component-with-methods',
    template: '<div data-automation-id="found-me-2">Hey I am the mighty test component!</div>'
})
export class TestWithMethodsComponent implements
        OnChanges,
        OnInit,
        AfterContentInit,
        DoCheck,
        AfterContentChecked,
        AfterViewInit,
        AfterViewChecked,
        OnDestroy {
    @Input() data: any;

    public onChangesCalled = 0;
    public onInitCalled = 0;
    public doCheckCalled = 0;
    public afterContentInitCalled = 0;
    public afterContentCheckedCalled = 0;
    public afterViewInitCalled = 0;
    public afterViewCheckedCalled = 0;
    public onDestroyCalled = 0;

    ngOnChanges(changes: SimpleChanges) { this.onChangesCalled ++; }
    ngOnInit() { this.onInitCalled++; }
    ngDoCheck() { this.doCheckCalled++; }
    ngAfterContentInit() { this.afterContentInitCalled++; }
    ngAfterContentChecked() { this.afterContentCheckedCalled++; }
    ngAfterViewInit() { this.afterViewInitCalled++; }
    ngAfterViewChecked() { this.afterViewCheckedCalled++; }
    ngOnDestroy() { this.onDestroyCalled++; }
}

describe('DynamicExtensionComponent', () => {

    let fixture: ComponentFixture<DynamicExtensionComponent>;
    let componentRegister: ComponentRegisterService;
    let component: DynamicExtensionComponent;
    let componentFactoryResolver: ComponentFactoryResolver;

    const lifeCycleMethods = [
        { name: 'ngOnInit', checker: 'onInitCalled' },
        { name: 'ngDoCheck', checker: 'doCheckCalled' },
        { name: 'ngAfterContentInit', checker: 'afterContentInitCalled' },
        { name: 'ngAfterContentChecked', checker: 'afterContentCheckedCalled' },
        { name: 'ngAfterViewInit', checker: 'afterViewInitCalled' },
        { name: 'ngAfterViewChecked', checker: 'afterViewCheckedCalled' },
        { name: 'ngOnDestroy', checker: 'onDestroyCalled' }
    ];

    beforeEach(async(() => {
        componentRegister = new ComponentRegisterService();
        componentRegister.setComponents({'test-component': TestComponent});
        componentRegister.setComponents({'test-component-with-methods': TestWithMethodsComponent});

        TestBed.configureTestingModule({
            imports: [ HttpClientModule ],
            declarations: [ DynamicExtensionComponent, TestComponent, TestWithMethodsComponent ],
            providers: [ { provide: ComponentRegisterService, useValue: componentRegister } ]
        });

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: { entryComponents: [ TestComponent, TestWithMethodsComponent ] }
        });

        TestBed.compileComponents();
    }));

    describe('Sub-component creation', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(DynamicExtensionComponent);
            componentFactoryResolver = TestBed.get(ComponentFactoryResolver);
            spyOn(componentFactoryResolver, 'resolveComponentFactory').and.callThrough();
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

        it('should load the TestComponent', () => {
            const innerElement = fixture.debugElement.query(By.css('[data-automation-id="found-me"]'));
            expect(innerElement).not.toBeNull();
        });

        it('should load the TestComponent only ONCE', () => {
            component.ngOnChanges({});
            fixture.detectChanges();
            component.ngOnChanges({});
            fixture.detectChanges();

            expect((<any> componentFactoryResolver.resolveComponentFactory).calls.count()).toBe(1);
        });

        it('should pass through the data', () => {
            const testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance;

            expect(testComponent.data).toBe(component.data);
        });

        it('should update the subcomponent\'s input parameters', () => {
            const data = { foo: 'baz' };

            component.ngOnChanges({ data: new SimpleChange(component.data, data, false) });

            const testComponent = fixture.debugElement.query(By.css('test-component')).componentInstance;
            expect(testComponent.data).toBe(data);
        });
    });

    describe('Angular life-cycle methods in sub-component', () => {

        let testComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(DynamicExtensionComponent);
            component = fixture.componentInstance;
            component.id = 'test-component-with-methods';

            fixture.detectChanges();
            component.ngOnChanges({});
            testComponent = fixture.debugElement.query(By.css('test-component-with-methods')).componentInstance;
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

        it('should call through the remaining life-cycle methods', () => {
            lifeCycleMethods.forEach((lifeCycleMethod) => {
                try {
                    component[lifeCycleMethod.name].call(component);
                    expect(testComponent[lifeCycleMethod.checker]).toBe(1, `${lifeCycleMethod.name} should have been called once and only once.`);
                } catch (e) {
                    console.error(`${lifeCycleMethod.name} can't be called.`);
                    throw e;
                }
            });
        });

        it('should NOT call through the ngOnChanges if the method does not exist (no error should be thrown)', () => {
            const params = {};
            const execution = () => {
                component.ngOnChanges(params);
            };

            expect(execution).not.toThrowError();
        });

        it('should NOT call through the remaining life-cycle methods if the method does not exist (no error should be thrown)', () => {
            lifeCycleMethods.forEach((lifeCycleMethod) => {
                const execution = () => {
                    component[lifeCycleMethod.name].call(component);
                };

                expect(execution).not.toThrowError();
            });
        });
    });

    describe('The lack of Angular life-cycle methods in sub-component', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(DynamicExtensionComponent);
            component = fixture.componentInstance;
            component.id = 'test-component';

            fixture.detectChanges();
            component.ngOnChanges({});
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should NOT call through the ngOnChanges if the method does not exist (no error should be thrown)', () => {
            const params = {};
            const execution = () => {
                component.ngOnChanges(params);
            };

            expect(execution).not.toThrowError();
        });

        it('should NOT call through the remaining life-cycle methods if the method does not exist (no error should be thrown)', () => {
            lifeCycleMethods.forEach((lifeCycleMethod) => {
                const execution = () => {
                    component[lifeCycleMethod.name].call(component);
                };

                expect(execution).not.toThrowError();
            });
        });
    });
});
