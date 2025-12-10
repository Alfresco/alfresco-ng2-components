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

import { Directive, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { CardViewBaseItemModel } from '../models/card-view-baseitem.model';
import { TranslateService } from '@ngx-translate/core';

@Directive({
    selector: '[adf-card-view-property-validator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CardViewPropertyValidatorDirective),
            multi: true
        }
    ]
})
export class CardViewPropertyValidatorDirective {
    @Input()
    property: CardViewBaseItemModel;

    @Output()
    validated = new EventEmitter<string[]>();

    constructor(private readonly translateService: TranslateService) {}

    validate(control: AbstractControl): ValidationErrors | null {
        const errors: ValidationErrors | null = this.property.isValid(control.value)
            ? null
            : Object.fromEntries(this.property.validators.map((validator) => [validator.message, this.translateService.instant(validator.message)]));
        this.validated.emit(errors ? Object.values(errors) : []);
        return errors;
    }
}
