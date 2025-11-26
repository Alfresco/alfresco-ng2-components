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

import { formFieldVisibilityConditionHandler } from './form-field-visibility-condition.handler';
import { mockParentWithoutFields, mockParentWithFields, mockParentWithSectionFields } from '../mocks/repeatable-section-model.mock';
import {
    mockParentVisibilityCondition,
    mockParentVisibilityConditionWithLeftValue,
    mockParentVisibilityConditionWithRightValue,
    mockVisibilityCondition,
    mockVisibilityConditionLeftValue,
    mockVisibilityConditionRightValue
} from '../mocks/form-field-visibility-condition.handler.mock';
import { WidgetVisibilityModel } from '../../../../models/widget-visibility.model';

describe('formFieldVisibilityConditionHandler', () => {
    it('should return undefined if provided visibility condition json is null', () => {
        expect(formFieldVisibilityConditionHandler.getVisibilityCondition('mock-id', null)).toBe(undefined);
    });

    it('should return undefined if provided visibility condition json is undefined', () => {
        expect(formFieldVisibilityConditionHandler.getVisibilityCondition('mock-id', undefined)).toBe(undefined);
    });

    it('should return provided visibility condition if json is provided and no parent is provided', () => {
        const expectedVisibilityCondition = new WidgetVisibilityModel({
            leftType: 'field',
            leftValue: 'mock-left-value',
            rightType: 'field',
            rightValue: 'mock-right-value'
        });

        expect(formFieldVisibilityConditionHandler.getVisibilityCondition('mock-id', mockVisibilityCondition)).toEqual(expectedVisibilityCondition);
    });

    describe('rule and parent provided', () => {
        describe('leftValue provided', () => {
            it('should return provided visibility condition if parent has no fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'mock-left-value'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockVisibilityConditionLeftValue,
                        mockParentWithoutFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });

            it('should return provided visibility condition if leftValue does not belong to parent fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'mock-left-value'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockVisibilityConditionLeftValue,
                        mockParentWithFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });
            it('should return visibility condition with parent leftValue property if leftValue belongs to parent fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'Text0c0ydk-Row123456789'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockParentVisibilityConditionWithLeftValue,
                        mockParentWithFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });

            it('should return visibility condition with parent leftValue property if leftValue belongs to parent fields and sections are present', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'Text0c0ydk-Row123456789'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockParentVisibilityConditionWithLeftValue,
                        mockParentWithSectionFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });
        });

        describe('rightValue provided', () => {
            it('should return provided visibility condition if parent has no fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    rightType: 'field',
                    rightValue: 'mock-right-value'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockVisibilityConditionRightValue,
                        mockParentWithoutFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });

            it('should return provided visibility condition if rightValue does not belong to parent fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    rightType: 'field',
                    rightValue: 'mock-right-value'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockVisibilityConditionRightValue,
                        mockParentWithFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });
            it('should return visibility condition with parent rightValue property if rightValue belongs to parent fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    rightType: 'field',
                    rightValue: 'Text0c0ydk-Row123456789'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockParentVisibilityConditionWithRightValue,
                        mockParentWithFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });

            it('should return visibility condition with parent rightValue property if rightValue belongs to parent fields and sections are present', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    rightType: 'field',
                    rightValue: 'Text0c0ydk-Row123456789'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockParentVisibilityConditionWithRightValue,
                        mockParentWithSectionFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });
        });

        describe('leftValue and rightValue provided', () => {
            it('should return provided visibility condition if parent has no fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'mock-left-value',
                    rightType: 'field',
                    rightValue: 'mock-right-value'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockVisibilityCondition,
                        mockParentWithoutFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });

            it('should return provided visibility condition if leftValue and rightValue do not belong to parent fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'mock-left-value',
                    rightType: 'field',
                    rightValue: 'mock-right-value'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition('mock-id-Row123456789', mockVisibilityCondition, mockParentWithFields)
                ).toEqual(expectedVisibilityCondition);
            });
            it('should return visibility condition with parent leftValue and rightValue property if values belong to parent fields', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'Text0c0ydk-Row123456789',
                    rightType: 'field',
                    rightValue: 'Text0c26k4-Row123456789'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockParentVisibilityCondition,
                        mockParentWithFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });

            it('should return visibility condition with parent leftValue and rightValue property if values belong to parent fields and sections are present', () => {
                const expectedVisibilityCondition = new WidgetVisibilityModel({
                    leftType: 'field',
                    leftValue: 'Text0c0ydk-Row123456789',
                    rightType: 'field',
                    rightValue: 'Text0c26k4-Row123456789'
                });

                expect(
                    formFieldVisibilityConditionHandler.getVisibilityCondition(
                        'mock-id-Row123456789',
                        mockParentVisibilityCondition,
                        mockParentWithSectionFields
                    )
                ).toEqual(expectedVisibilityCondition);
            });
        });
    });
});
