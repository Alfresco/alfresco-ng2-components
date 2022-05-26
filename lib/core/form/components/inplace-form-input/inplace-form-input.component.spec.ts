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
import { FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from 'content-services/src/lib/testing/content.testing.module';
import { InplaceFormInputComponent } from './inplace-form-input.component';
import { MockProvider } from 'ng-mocks';
import { ApiClientsService } from '@alfresco/adf-core/api';

describe('InplaceFormInputComponent', () => {
    let component: InplaceFormInputComponent;
    let fixture: ComponentFixture<InplaceFormInputComponent>;
    let formControl: FormControl;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ],
            providers: [
                MockProvider(ApiClientsService)
            ],
            declarations: [InplaceFormInputComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        formControl = new FormControl('');
        fixture = TestBed.createComponent(InplaceFormInputComponent);

        component = fixture.componentInstance;
        component.control = formControl;
    });

    it('should update form value', () => {
        formControl.setValue('New Value');
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector(
            '[data-automation-id="adf-inplace-input"]'
        );

        expect(input.value).toBe('New Value');
    });

    it('should show error', () => {
        formControl.setValidators(() => ({ error: 'error' }));
        formControl.setValue('value');
        formControl.markAsTouched();
        formControl.updateValueAndValidity();

        fixture.detectChanges();

        const error = fixture.nativeElement.querySelector(
            '[data-automation-id="adf-inplace-input-error"]'
        );

        expect(error).toBeTruthy();
    });

    it('should show label', () => {
        formControl.setValue('');

        fixture.detectChanges();

        const error = fixture.nativeElement.querySelector(
            '[data-automation-id="adf-inplace-input-label"]'
        );

        expect(error).toBeTruthy();
    });
});
