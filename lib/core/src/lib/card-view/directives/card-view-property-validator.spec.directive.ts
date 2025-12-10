/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input } from '@angular/core';
import { CardViewPropertyValidatorDirective } from './card-view-property-validator.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardViewBaseItemModel, CardViewTextItemModel, UnitTestingUtils } from '@alfresco/adf-core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
    imports: [CardViewPropertyValidatorDirective, ReactiveFormsModule],
    template: `<input [formControl]="control" adf-card-view-property-validator [property]="property" />`
})
class MockComponent {
    @Input()
    property: CardViewBaseItemModel;

    control = new FormControl('');
}

describe('CardViewPropertyValidatorDirective', () => {
    let fixture: ComponentFixture<MockComponent>;
    let component: MockComponent;
    let unitTestingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MockComponent]
        });
        fixture = TestBed.createComponent(MockComponent);
        component = fixture.componentInstance;
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    describe('Validation', () => {
        let validatorDirective: CardViewPropertyValidatorDirective;

        beforeEach(() => {
            component.property = new CardViewTextItemModel({
                label: 'Some label',
                key: 'Some key',
                value: 'Some value'
            });
            validatorDirective = unitTestingUtils.getByCSS('input').injector.get(CardViewPropertyValidatorDirective);
            spyOn(validatorDirective.validated, 'emit');
        });

        it('should control be valid if property has valid value', () => {
            spyOn(component.property, 'isValid').and.returnValue(true);

            fixture.detectChanges();
            expect(component.control.valid).toBeTrue();
            expect(component.control.errors).toBeNull();
            expect(validatorDirective.validated.emit).toHaveBeenCalledWith([]);
        });

        it('should control be invalid if property has invalid value', () => {
            spyOn(component.property, 'isValid').and.returnValue(false);
            const translationKey = 'ERROR_TRANSLATION_KEY';
            component.property.validators = [
                {
                    isValid: (): boolean => false,
                    message: translationKey
                }
            ];
            const error = 'Some error';
            const translateService = TestBed.inject(TranslateService);
            spyOn(translateService, 'instant').and.returnValue(error);

            fixture.detectChanges();
            expect(component.control.valid).toBeFalse();
            expect(component.control.errors).toEqual({
                [translationKey]: error
            });
            expect(validatorDirective.validated.emit).toHaveBeenCalledWith([error]);
        });
    });
});
