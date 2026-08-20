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

import { Component, ComponentRef, OnDestroy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BaseScreenCloudComponent } from './base-screen-cloud.component';
import { provideScreen } from '../../../services/provide-screen';
import { ScreenRenderingService } from '../../../services/screen-rendering.service';

@Component({
    selector: 'adf-cloud-test-dynamic-screen',
    template: `<div class="adf-cloud-test-dynamic-screen">dynamic screen</div>`
})
class TestDynamicScreenComponent implements OnDestroy {
    destroyed = false;

    ngOnDestroy(): void {
        this.destroyed = true;
    }
}

@Component({
    selector: 'adf-cloud-test-host-screen',
    template: `<ng-container #container />`
})
class TestHostScreenComponent extends BaseScreenCloudComponent<TestDynamicScreenComponent> {
    setInputsCalls: ComponentRef<TestDynamicScreenComponent>[] = [];
    subscribeToOutputsCalls: ComponentRef<TestDynamicScreenComponent>[] = [];

    get dynamicComponentRef(): ComponentRef<TestDynamicScreenComponent> | undefined {
        return this.componentRef;
    }

    get dynamicComponentRefSignalValue(): ComponentRef<TestDynamicScreenComponent> | undefined {
        return this.componentRefChanged();
    }

    protected override setInputsForDynamicComponent(componentRef: ComponentRef<TestDynamicScreenComponent>): void {
        this.setInputsCalls.push(componentRef);
    }

    protected subscribeToOutputs(componentRef: ComponentRef<TestDynamicScreenComponent>): void {
        this.subscribeToOutputsCalls.push(componentRef);
    }
}

/** Same host component, but without the `#container` anchor in its template. */
@Component({
    selector: 'adf-cloud-test-host-screen-without-container',
    template: `<div class="adf-cloud-no-container"></div>`
})
class TestHostScreenWithoutContainerComponent extends TestHostScreenComponent {}

describe('BaseScreenCloudComponent', () => {
    const screenId = 'test-screen';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestHostScreenComponent, TestHostScreenWithoutContainerComponent, TestDynamicScreenComponent],
            providers: [provideScreen(screenId, TestDynamicScreenComponent)]
        });
    });

    describe('when a screenId is provided', () => {
        let fixture: ComponentFixture<TestHostScreenComponent>;
        let component: TestHostScreenComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostScreenComponent);
            component = fixture.componentInstance;
            fixture.componentRef.setInput('screenId', screenId);
            fixture.detectChanges();
        });

        it('should create the dynamic component and expose it through the signal', () => {
            expect(component.dynamicComponentRef).toBeDefined();
            expect(component.dynamicComponentRefSignalValue).toBe(component.dynamicComponentRef);
            expect(fixture.debugElement.query(By.css('.adf-cloud-test-dynamic-screen'))).toBeTruthy();
        });

        it('should wire inputs and outputs once, passing the created component reference', () => {
            expect(component.setInputsCalls).toEqual([component.dynamicComponentRef!]);
            expect(component.subscribeToOutputsCalls).toEqual([component.dynamicComponentRef!]);
        });

        it('should destroy the dynamic component reference on destroy', () => {
            const destroySpy = spyOn(component.dynamicComponentRef!, 'destroy').and.callThrough();

            fixture.destroy();

            expect(destroySpy).toHaveBeenCalledTimes(1);
        });

        it('should run the ngOnDestroy hook of the dynamic component on destroy', () => {
            const dynamicComponentInstance = component.dynamicComponentRef?.instance;
            expect(dynamicComponentInstance?.destroyed).toBeFalse();

            fixture.destroy();

            expect(dynamicComponentInstance?.destroyed).toBeTrue();
        });

        it('should clear the dynamic component reference and the signal on destroy', () => {
            fixture.destroy();

            expect(component.dynamicComponentRef).toBeUndefined();
            expect(component.dynamicComponentRefSignalValue).toBeUndefined();
        });

        it('should destroy the dynamic component reference only once when ngOnDestroy runs again', () => {
            const destroySpy = spyOn(component.dynamicComponentRef!, 'destroy');

            component.ngOnDestroy();
            component.ngOnDestroy();

            expect(destroySpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('when no screenId is provided', () => {
        let fixture: ComponentFixture<TestHostScreenComponent>;
        let component: TestHostScreenComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostScreenComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should not create any dynamic component nor wire inputs and outputs', () => {
            expect(component.dynamicComponentRef).toBeUndefined();
            expect(component.dynamicComponentRefSignalValue).toBeUndefined();
            expect(component.setInputsCalls).toEqual([]);
            expect(component.subscribeToOutputsCalls).toEqual([]);
            expect(fixture.debugElement.query(By.css('.adf-cloud-test-dynamic-screen'))).toBeNull();
        });

        it('should not throw on destroy', () => {
            expect(() => fixture.destroy()).not.toThrow();
            expect(component.dynamicComponentRef).toBeUndefined();
        });
    });

    describe('when the container anchor is missing', () => {
        let fixture: ComponentFixture<TestHostScreenWithoutContainerComponent>;
        let component: TestHostScreenWithoutContainerComponent;

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostScreenWithoutContainerComponent);
            component = fixture.componentInstance;
            fixture.componentRef.setInput('screenId', screenId);
        });

        it('should not throw and should not create any dynamic component', () => {
            expect(() => fixture.detectChanges()).not.toThrow();

            expect(component.container).toBeUndefined();
            expect(component.dynamicComponentRef).toBeUndefined();
            expect(component.dynamicComponentRefSignalValue).toBeUndefined();
        });

        it('should not wire inputs and outputs when no dynamic component was created', () => {
            fixture.detectChanges();

            expect(component.setInputsCalls).toEqual([]);
            expect(component.subscribeToOutputsCalls).toEqual([]);
        });

        it('should not resolve any component type', () => {
            const resolveComponentTypeSpy = spyOn(TestBed.inject(ScreenRenderingService), 'resolveComponentType').and.callThrough();

            fixture.detectChanges();

            expect(resolveComponentTypeSpy).not.toHaveBeenCalled();
        });

        it('should not throw on destroy', () => {
            fixture.detectChanges();

            expect(() => fixture.destroy()).not.toThrow();
        });
    });
});
