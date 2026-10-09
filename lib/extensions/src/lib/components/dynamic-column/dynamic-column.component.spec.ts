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

import { Component, Input, OnChanges, OnDestroy, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ExtensionService } from '../../services/extension.service';
import { DynamicColumnComponent } from './dynamic-column.component';

@Component({
    selector: 'test-dynamic-column',
    template: ''
})
class TestDynamicColumnComponent implements OnChanges, OnDestroy {
    @Input() context: any;
    onChangesCalled = 0;
    destroyed = false;

    ngOnChanges() {
        this.onChangesCalled++;
    }

    ngOnDestroy() {
        this.destroyed = true;
    }
}

@Component({
    selector: 'test-legacy-dynamic-column',
    template: ''
})
class LegacyDynamicColumnComponent implements OnDestroy {
    context: any;
    destroyed = false;

    ngOnDestroy() {
        this.destroyed = true;
    }
}

describe('DynamicColumnComponent', () => {
    let fixture: ComponentFixture<DynamicColumnComponent>;
    let registeredComponent: Type<any> = TestDynamicColumnComponent;
    const extensionService = { getComponentById: () => registeredComponent };

    beforeEach(() => {
        registeredComponent = TestDynamicColumnComponent;
        TestBed.configureTestingModule({
            imports: [DynamicColumnComponent, TestDynamicColumnComponent],
            providers: [{ provide: ExtensionService, useValue: extensionService }]
        });

        fixture = TestBed.createComponent(DynamicColumnComponent);
        fixture.componentRef.setInput('id', 'test-column');
    });

    it('should pass context changes through Angular input binding', () => {
        const initialContext = { id: 'initial' };
        fixture.componentRef.setInput('context', initialContext);
        fixture.detectChanges();
        const child = fixture.debugElement.query(By.directive(TestDynamicColumnComponent)).componentInstance as TestDynamicColumnComponent;

        expect(child.context).toBe(initialContext);
        expect(child.onChangesCalled).toBe(1);

        const updatedContext = { id: 'updated' };
        fixture.componentRef.setInput('context', updatedContext);
        fixture.detectChanges();

        expect(child.context).toBe(updatedContext);
        expect(child.onChangesCalled).toBe(2);
    });

    it('should destroy the dynamic component with its host', () => {
        fixture.detectChanges();
        const child = fixture.debugElement.query(By.directive(TestDynamicColumnComponent)).componentInstance as TestDynamicColumnComponent;

        fixture.destroy();

        expect(child.destroyed).toBe(true);
    });

    it('should update legacy dynamic components with a plain context property', () => {
        registeredComponent = LegacyDynamicColumnComponent;
        fixture.componentRef.setInput('context', { id: 'legacy' });
        fixture.detectChanges();

        const child = fixture.debugElement.query(By.directive(LegacyDynamicColumnComponent)).componentInstance as LegacyDynamicColumnComponent;
        expect(child.context).toEqual({ id: 'legacy' });
    });
});
