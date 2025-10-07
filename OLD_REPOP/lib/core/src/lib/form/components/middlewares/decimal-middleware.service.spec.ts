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

import { FormFieldModel, FormFieldTypes, FormModel } from '../widgets';
import { DecimalRenderMiddlewareService } from './decimal-middleware.service';

describe('DecimalRenderMiddlewareService', () => {
    let decimalMiddlewareService: DecimalRenderMiddlewareService;
    let formFieldModel: FormFieldModel;

    beforeEach(() => {
        decimalMiddlewareService = new DecimalRenderMiddlewareService();

        const form = new FormModel();
        formFieldModel = new FormFieldModel(form, {
            type: FormFieldTypes.DECIMAL,
            id: 'id',
            precision: 3,
            value: '10.1060'
        });
    });

    it('should return field with proper precisison', () => {
        formFieldModel.value = '10.1000000000000';
        formFieldModel.precision = 3;
        const parsedField = decimalMiddlewareService.getParsedField(formFieldModel);
        expect(parsedField.value).toBe('10.100');
    });

    it('should round up number with correct precisison', () => {
        formFieldModel.value = '10.1039999';
        formFieldModel.precision = 3;
        const parsedField = decimalMiddlewareService.getParsedField(formFieldModel);
        expect(parsedField.value).toBe('10.104');
    });

    it('should round up number, when removed fraction part starts with number larger or equal 5', () => {
        formFieldModel.value = '10.1035000';
        formFieldModel.precision = 3;
        const parsedField = decimalMiddlewareService.getParsedField(formFieldModel);
        expect(parsedField.value).toBe('10.104');
    });

    it('should NOT round up number, when removed fraction part starts with number smaller than 5', () => {
        formFieldModel.value = '10.1034999';
        formFieldModel.precision = 3;
        const parsedField = decimalMiddlewareService.getParsedField(formFieldModel);
        expect(parsedField.value).toBe('10.103');
    });

    it('should return the same value when precision is correct', () => {
        formFieldModel.value = '10.123';
        formFieldModel.precision = 3;
        const parsedField = decimalMiddlewareService.getParsedField(formFieldModel);
        expect(parsedField.value).toBe('10.123');
    });

    it('should work when value is not defined', () => {
        formFieldModel.value = null;
        const parsedField = decimalMiddlewareService.getParsedField(formFieldModel);
        expect(parsedField.value).toBe(null);
    });

    it('should work when value is number', () => {
        formFieldModel.value = 3.333;
        const parsedField = decimalMiddlewareService.getParsedField(formFieldModel);
        expect(parsedField.value).toBe(3.333);
    });
});
