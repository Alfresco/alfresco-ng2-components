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
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { InfiniteSelectScrollDirective } from './infinite-select-scroll.directive';
import { setupTestBed } from '../testing/setup-test-bed';
import {  MatSelect, MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    template: `
        <mat-select adf-infinite-select-scroll (scrollEnd)="load()" >
            <mat-option *ngFor="let option of options; let idx=index">
                {{ option.text }}
            </mat-option>
        </mat-select>`
})
class TestComponent {
    options = new Array(50).fill({text: 'dummy'});

    @ViewChild(MatSelect, { static: true })
    matSelect: MatSelect;

    open() {
        this.matSelect.open();
    }

    load() {
        this.options.push(...new Array(10).fill({text: 'dummy'}));
    }
}

describe('InfiniteSelectScrollDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    setupTestBed({
        imports: [
            MatSelectModule,
            NoopAnimationsModule
        ],
        declarations: [
            TestComponent,
            InfiniteSelectScrollDirective
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });

    beforeEach(fakeAsync(() => {
        fixture.detectChanges();
        component.open();
        fixture.detectChanges();
        flush();
    }));

    it('should call an action on scrollEnd event', fakeAsync(() => {
        const panel = document.querySelector('.mat-select-panel')  as HTMLElement;
        panel.scrollTop = panel.scrollHeight;
        panel.dispatchEvent(new Event('scroll'));
        fixture.detectChanges();
        expect(component.options.length).toBe(60);
    }));
});
