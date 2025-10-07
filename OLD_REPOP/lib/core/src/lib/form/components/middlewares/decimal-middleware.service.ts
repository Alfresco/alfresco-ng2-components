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

import { Injectable } from '@angular/core';
import { FormFieldModelRenderMiddleware } from './middleware';
import { FormFieldModel, FormFieldTypes } from '../widgets';

@Injectable()
export class DecimalRenderMiddlewareService implements FormFieldModelRenderMiddleware {
    type = FormFieldTypes.DECIMAL;

    getParsedField(field: FormFieldModel): FormFieldModel {
        const allowedMaxPrecision = field.precision;
        const value = field.value;

        field.value = this.forceMaxPrecisionIfNeeded(value, allowedMaxPrecision);

        return field;
    }

    private forceMaxPrecisionIfNeeded(value: string | number, allowedMaxPrecision: number): string | number {
        let numberOfDecimalDigits = 0;
        const stringValue = typeof value === 'string' ? value : `${value}`;
        const numberChunks = stringValue.split('.');

        if (numberChunks.length === 2) {
            numberOfDecimalDigits = numberChunks[1].length;
        }

        if (numberOfDecimalDigits > allowedMaxPrecision) {
            return parseFloat(value.toString()).toFixed(allowedMaxPrecision);
        }

        return value;
    }
}
