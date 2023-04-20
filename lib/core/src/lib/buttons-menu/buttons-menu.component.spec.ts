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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '../material.module';
import { CoreTestingModule } from '../testing/core.testing.module';
import { setupTestBed } from '../testing/setup-test-bed';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'adf-custom-container',
    template: `
        <adf-buttons-action-menu>
            <button mat-menu-item (click)="assignValue()">
                <mat-icon>settings</mat-icon><span> Button </span>
            </button>
        </adf-buttons-action-menu>
    `
})
export class CustomContainerComponent {

    value: number;

    assignValue() {
        this.value = 1;
    }
}

@Component({
    selector: 'adf-custom-empty-container',
    template: `
        <adf-buttons-action-menu>
        </adf-buttons-action-menu>
    `
})
export class CustomEmptyContainerComponent {
}

describe('ButtonsMenuComponent', () => {

    describe('When Buttons are injected', () => {

        let fixture: ComponentFixture<CustomContainerComponent>;
        let component: CustomContainerComponent;
        let element: HTMLElement;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule,
                MaterialModule
            ],
            declarations: [
                CustomContainerComponent
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(CustomContainerComponent);
            element = fixture.debugElement.nativeElement;
            component = fixture.componentInstance;
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should render buttons menu when at least one button is declared', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const buttonsMenuElement = element.querySelector('#adf-buttons-menu');
            expect(buttonsMenuElement).toBeDefined();
        });

        it('should trigger event when a specific button is clicked', async () => {
            expect(component.value).toBeUndefined();

            fixture.detectChanges();
            await fixture.whenStable();

            const button = element.querySelector('button');
            button.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.value).toBe(1);
        });
    });

    describe('When no buttons are injected', () => {
        let fixture: ComponentFixture<CustomEmptyContainerComponent>;
        let element: HTMLElement;

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule,
                MaterialModule
            ],
            declarations: [
                CustomEmptyContainerComponent
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(CustomEmptyContainerComponent);
            element = fixture.nativeElement;
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should hide buttons menu if buttons input is empty', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const buttonsMenuElement = element.querySelector('#adf-buttons-menu');
            expect(buttonsMenuElement).toBeNull();
        });
    });
});
