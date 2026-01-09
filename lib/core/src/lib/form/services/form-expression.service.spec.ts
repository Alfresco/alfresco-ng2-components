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

import { TestBed } from '@angular/core/testing';
import { FormExpressionService } from './form-expression.service';
import { FormModel } from '../components/widgets/core';

describe('FormExpressionService', () => {
    let service: FormExpressionService;
    let formModel: FormModel;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FormExpressionService]
        });
        service = TestBed.inject(FormExpressionService);
        formModel = new FormModel();
    });

    describe('resolveExpressions', () => {
        it('should return the original string if there are no expressions', () => {
            const input = 'plain text without expressions';
            const result = service.resolveExpressions(formModel, input);
            expect(result).toBe(input);
        });

        it('should return empty string for null input', () => {
            const result = service.resolveExpressions(formModel, null);
            expect(result).toBe('');
        });

        it('should return empty string for undefined input', () => {
            const result = service.resolveExpressions(formModel, undefined);
            expect(result).toBe('');
        });

        it('should resolve field expression with value', () => {
            const mockField = {
                id: 'testField',
                value: 'test value'
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.testField}';
            const result = service.resolveExpressions(formModel, input);

            expect(formModel.getFieldById).toHaveBeenCalledWith('testField');
            expect(result).toBe('test value');
        });

        it('should resolve variable expression with value', () => {
            spyOn(formModel, 'getProcessVariableValue').and.returnValue('variable value');

            const input = '${variable.myVar}';
            const result = service.resolveExpressions(formModel, input);

            expect(formModel.getProcessVariableValue).toHaveBeenCalledWith('myVar');
            expect(result).toBe('variable value');
        });

        it('should replace expression with empty string when field value is null', () => {
            const mockField = {
                id: 'testField',
                value: null
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.testField}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('');
        });

        it('should replace expression with empty string when field value is undefined', () => {
            const mockField = {
                id: 'testField',
                value: undefined
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.testField}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('');
        });

        it('should replace expression with empty string when field is not found', () => {
            spyOn(formModel, 'getFieldById').and.returnValue(undefined);

            const input = '${field.nonExistentField}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('');
        });

        it('should stringify non-string field values', () => {
            const mockField = {
                id: 'numericField',
                value: 42
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.numericField}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('42');
        });

        it('should stringify object field values', () => {
            const mockField = {
                id: 'objectField',
                value: { key: 'value', num: 123 }
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.objectField}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('{"key":"value","num":123}');
        });

        it('should stringify array field values', () => {
            const mockField = {
                id: 'arrayField',
                value: [1, 2, 3]
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.arrayField}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('[1,2,3]');
        });

        it('should resolve multiple expressions in the same string', () => {
            const mockField1 = {
                id: 'field1',
                value: 'value1'
            };
            const mockField2 = {
                id: 'field2',
                value: 'value2'
            };
            spyOn(formModel, 'getFieldById').and.callFake((id) => {
                if (id === 'field1') {
                    return mockField1 as any;
                }
                if (id === 'field2') {
                    return mockField2 as any;
                }
                return undefined;
            });

            const input = 'Hello ${field.field1} and ${field.field2}!';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('Hello value1 and value2!');
        });

        it('should resolve mixed field and variable expressions', () => {
            const mockField = {
                id: 'myField',
                value: 'field value'
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);
            spyOn(formModel, 'getProcessVariableValue').and.returnValue('var value');

            const input = 'Field: ${field.myField}, Variable: ${variable.myVar}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('Field: field value, Variable: var value');
        });

        it('should not resolve expressions with whitespace', () => {
            const mockField = {
                id: 'testField',
                value: 'test value'
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${ field.testField }';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('${ field.testField }');
        });

        it('should handle field names with underscores', () => {
            const mockField = {
                id: 'test_field_name',
                value: 'underscore value'
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.test_field_name}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('underscore value');
        });

        it('should handle field names with dollar sign', () => {
            const mockField = {
                id: '$field',
                value: 'dollar value'
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.$field}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('dollar value');
        });

        it('should handle field names with numbers', () => {
            const mockField = {
                id: 'field123',
                value: 'numeric value'
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.field123}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('numeric value');
        });

        it('should not resolve expressions with multiple variables', () => {
            const mockField1 = {
                id: 'field1',
                value: 'value1'
            };
            const mockField2 = {
                id: 'field2',
                value: 'value2'
            };
            spyOn(formModel, 'getFieldById').and.callFake((id) => {
                if (id === 'field1') {
                    return mockField1 as any;
                }
                if (id === 'field2') {
                    return mockField2 as any;
                }
                return undefined;
            });

            const input = '${field.field1 field.field2}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe(input);
        });

        it('should not resolve expressions without valid variable names', () => {
            const input = '${sometext}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe(input);
        });

        it('should handle boolean field values', () => {
            const mockField = {
                id: 'boolField',
                value: true
            };
            spyOn(formModel, 'getFieldById').and.returnValue(mockField as any);

            const input = '${field.boolField}';
            const result = service.resolveExpressions(formModel, input);

            expect(result).toBe('true');
        });
    });

    describe('getFieldDependencies', () => {
        it('should return empty array for string without expressions', () => {
            const input = 'plain text without expressions';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual([]);
        });

        it('should extract single field dependency', () => {
            const input = '${field.testField}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['testField']);
        });

        it('should extract multiple field dependencies', () => {
            const input = '${field.field1} and ${field.field2}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['field1', 'field2']);
        });

        it('should not include duplicate field dependencies', () => {
            const input = '${field.testField} and ${field.testField}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['testField']);
        });

        it('should not include variable dependencies', () => {
            const input = '${variable.myVar}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual([]);
        });

        it('should extract only field dependencies when mixed with variables', () => {
            const input = '${field.myField} and ${variable.myVar}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['myField']);
        });

        it('should handle field names with underscores', () => {
            const input = '${field.test_field_name}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['test_field_name']);
        });

        it('should handle field names with dollar sign', () => {
            const input = '${field.$field}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['$field']);
        });

        it('should handle field names with numbers', () => {
            const input = '${field.field123}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['field123']);
        });

        it('should handle multiple different fields', () => {
            const input = '${field.firstName} ${field.lastName} ${field.email}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['firstName', 'lastName', 'email']);
        });

        it('should handle complex expressions with text', () => {
            const input = 'Hello ${field.firstName}, your email is ${field.email}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual(['firstName', 'email']);
        });

        it('should return empty array for expressions without field prefix', () => {
            const input = '${sometext}';
            const result = service.getFieldDependencies(input);

            expect(result).toEqual([]);
        });
    });
});
