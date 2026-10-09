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
import { By } from '@angular/platform-browser';
import { Node } from '@alfresco/js-api';
import { ExtensionService } from '../../services/extension.service';
import { DynamicTabComponent } from './dynamic-tab.component';

@Component({
    selector: 'test-dynamic-tab',
    template: ''
})
class TestDynamicTabComponent implements OnChanges, OnDestroy {
    @Input() node!: Node;
    onChangesCalled = 0;
    destroyed = false;

    ngOnChanges() {
        this.onChangesCalled++;
    }

    ngOnDestroy() {
        this.destroyed = true;
    }
}

describe('DynamicTabComponent', () => {
    let fixture: ComponentFixture<DynamicTabComponent>;
    const extensionService = {
        getComponentById: () => TestDynamicTabComponent
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DynamicTabComponent, TestDynamicTabComponent],
            providers: [{ provide: ExtensionService, useValue: extensionService }]
        });

        fixture = TestBed.createComponent(DynamicTabComponent);
        fixture.componentRef.setInput('id', 'test-tab');
    });

    it('should pass node changes through Angular input binding', () => {
        const initialNode = { id: 'initial' } as Node;
        fixture.componentRef.setInput('node', initialNode);
        fixture.detectChanges();
        const child = fixture.debugElement.query(By.directive(TestDynamicTabComponent)).componentInstance as TestDynamicTabComponent;

        expect(child.node).toBe(initialNode);
        expect(child.onChangesCalled).toBe(1);

        const updatedNode = { id: 'updated' } as Node;
        fixture.componentRef.setInput('node', updatedNode);
        fixture.detectChanges();

        expect(child.node).toBe(updatedNode);
        expect(child.onChangesCalled).toBe(2);
    });

    it('should destroy the dynamic component with its host', () => {
        fixture.detectChanges();
        const child = fixture.debugElement.query(By.directive(TestDynamicTabComponent)).componentInstance as TestDynamicTabComponent;

        fixture.destroy();

        expect(child.destroyed).toBe(true);
    });
});
