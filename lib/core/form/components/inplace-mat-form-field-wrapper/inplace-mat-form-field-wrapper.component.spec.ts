/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { InplaceMatFormFieldWrapperComponent } from './inplace-mat-form-field-wrapper.component';

describe('InplaceMatFormFieldWrapperComponent', () => {
    let component: InplaceMatFormFieldWrapperComponent;
    let fixture: ComponentFixture<InplaceMatFormFieldWrapperComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InplaceMatFormFieldWrapperComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InplaceMatFormFieldWrapperComponent);
        component = fixture.componentInstance;
    });

    it('should add class', () => {
        fixture.detectChanges();

        const wrapperClass = fixture.nativeElement.querySelector(
            '.adf-inplace-mat-form-field-wrapper'
        );

        const errorClass = fixture.nativeElement.querySelector(
            '.adf-inplace-mat-form-field-wrapper-error'
        );

        expect(wrapperClass).toBeTruthy();
        expect(errorClass).toBeFalsy();
    });

    it('should add error class', () => {
        component.isInvalid = true;
        fixture.detectChanges();

        const wrapperClass = fixture.nativeElement.querySelector(
            '.adf-inplace-mat-form-field-wrapper'
        );

        const errorClass = fixture.nativeElement.querySelector(
            '.adf-inplace-mat-form-field-wrapper-error'
        );

        expect(wrapperClass).toBeTruthy();
        expect(errorClass).toBeTruthy();
    });
});
