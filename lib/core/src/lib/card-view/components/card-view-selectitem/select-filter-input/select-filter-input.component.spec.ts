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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '../../../../testing/setup-test-bed';
import { CoreTestingModule } from '../../../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SelectFilterInputComponent } from './select-filter-input.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ESCAPE } from '@angular/cdk/keycodes';
import { MatSelect } from '@angular/material/select';

@Component({
    selector: 'adf-test-filter',
    template: `
        <mat-select [(ngModel)]="field.value" [compareWith]="compare" [multiple]="multiple">
            <adf-select-filter-input *ngIf="showInputFilter" (change)="onChange($event)"></adf-select-filter-input>
            <mat-option *ngFor="let opt of options"
                        [value]="opt"
                        [id]="opt.id">{{opt.name}}
            </mat-option>
        </mat-select>
    `
})
export class TestComponent {
    @ViewChild(SelectFilterInputComponent) filterInputComponent: SelectFilterInputComponent;
    field: any = { value : '' };
    showInputFilter = true;
    multiple = false;
    standardOptions = [
        { id: '1', name: 'one' },
        { id: '2', name: 'two' },
        { id: '3', name: 'three' }
    ];
    options = this.standardOptions;

    compare(obj1, obj2) {
        if (!obj1 || !obj2) {
            return false;
        }
        return obj1.id === obj2.id;
    }

    onChange(search: string) {
        if (!search) {
            this.options = this.standardOptions;
        } else {
            this.options = this.standardOptions.filter(({ name }) => name.includes(search));
        }
    }
}

describe('SelectFilterInputComponent', () => {
    let testFixture: ComponentFixture<TestComponent>;
    let testComponent: TestComponent;
    let fixture: ComponentFixture<SelectFilterInputComponent>;
    let component: SelectFilterInputComponent;
    let matSelect: MatSelect;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            NoopAnimationsModule
        ],
        declarations: [
            TestComponent
        ],
        providers: [
            MatSelect
        ]
    });

    describe('component', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(SelectFilterInputComponent);
            component = fixture.componentInstance;
            matSelect = TestBed.inject(MatSelect);
            fixture.detectChanges();
        });

        it('should focus input on initialization', async () => {
            spyOn(component.selectFilterInput.nativeElement, 'focus');
            matSelect.openedChange.next(true);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.selectFilterInput.nativeElement.focus).toHaveBeenCalled();
        });

        it('should clear search term on close', async () => {
            component.onModelChange('some-search-term');
            expect(component.term).toBe('some-search-term');

            matSelect.openedChange.next(false);

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.term).toBe('');
        });

        it('should emit event when value changes', async () => {
            spyOn(component.change, 'next');
            component.onModelChange('some-search-term');
            expect(component.change.next).toHaveBeenCalledWith('some-search-term');
        });

        it('should reset value on reset() event', () => {
            component.onModelChange('some-search-term');
            expect(component.term).toBe('some-search-term');

            component.reset();
            expect(component.term).toBe('');
        });

        it('should reset value on Escape event', () => {
            component.onModelChange('some-search-term');
            expect(component.term).toBe('some-search-term');

            component.selectFilterInput.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {keyCode: ESCAPE} as any));
            fixture.detectChanges();
            expect(component.term).toBe('');
        });

    });

    describe('testComponent', () => {
        beforeEach(() => {
            testFixture = TestBed.createComponent(TestComponent);
            testComponent = testFixture.componentInstance;
        });

        afterEach(() => testFixture.destroy());

        it('should preserve the values for multiple search', async () => {
            const userSelection = [{ id: '3', name: 'three' }];
            const preSelected = [
                { id: '1', name: 'one' },
                { id: '2', name: 'two' }
            ];
            testComponent.field.value = preSelected;
            testComponent.multiple = true;
            testFixture.detectChanges();

            const dropdown: HTMLElement = testFixture.nativeElement.querySelector('.mat-select-trigger');
            dropdown.click();
            await testFixture.whenStable();
            testFixture.detectChanges();

            const filter = testFixture.debugElement.query(By.css('input'));
            filter.triggerEventHandler('input', { target: { value: 'three' } });
            testFixture.detectChanges();

            const option = testFixture.debugElement.query(By.css('mat-option'));
            option.triggerEventHandler('click', null);
            testFixture.detectChanges();

            expect(testComponent.field.value).toEqual([...preSelected, ...userSelection]);
        });
    });
});
