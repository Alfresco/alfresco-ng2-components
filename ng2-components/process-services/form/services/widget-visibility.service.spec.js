"use strict";
/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var index_1 = require("./../components/widgets/core/index");
var widget_visibility_model_1 = require("./../models/widget-visibility.model");
var widget_visibility_service_mock_1 = require("./assets/widget-visibility.service.mock");
var widget_visibility_service_1 = require("./widget-visibility.service");
describe('WidgetVisibilityService', function () {
    var service;
    var booleanResult;
    var stubFormWithFields = new index_1.FormModel(widget_visibility_service_mock_1.fakeFormJson);
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [],
            providers: [
                widget_visibility_service_1.WidgetVisibilityService
            ]
        });
        service = testing_1.TestBed.get(widget_visibility_service_1.WidgetVisibilityService);
        jasmine.Ajax.install();
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    describe('should be able to evaluate logic operations', function () {
        it('using AND and return true', function () {
            booleanResult = service.evaluateLogicalOperation('and', true, true);
            expect(booleanResult).toBeTruthy();
        });
        it('using AND and return false', function () {
            booleanResult = service.evaluateLogicalOperation('and', true, false);
            expect(booleanResult).toBeFalsy();
        });
        it('using OR and return true', function () {
            booleanResult = service.evaluateLogicalOperation('or', true, false);
            expect(booleanResult).toBeTruthy();
        });
        it('using OR and return false', function () {
            booleanResult = service.evaluateLogicalOperation('or', false, false);
            expect(booleanResult).toBeFalsy();
        });
        it('using AND NOT and return true', function () {
            booleanResult = service.evaluateLogicalOperation('and-not', true, false);
            expect(booleanResult).toBeTruthy();
        });
        it('using AND NOT and return false', function () {
            booleanResult = service.evaluateLogicalOperation('and-not', false, false);
            expect(booleanResult).toBeFalsy();
        });
        it('using OR NOT and return true', function () {
            booleanResult = service.evaluateLogicalOperation('or-not', true, true);
            expect(booleanResult).toBeTruthy();
        });
        it('using OR NOT and return false', function () {
            booleanResult = service.evaluateLogicalOperation('or-not', false, true);
            expect(booleanResult).toBeFalsy();
        });
        it('should fail with invalid operation', function () {
            booleanResult = service.evaluateLogicalOperation(undefined, false, true);
            expect(booleanResult).toBeUndefined();
        });
    });
    describe('should be able to evaluate next condition operations', function () {
        it('using == and return true', function () {
            booleanResult = service.evaluateCondition('test', 'test', '==');
            expect(booleanResult).toBeTruthy();
        });
        it('using < and return true', function () {
            booleanResult = service.evaluateCondition(1, 2, '<');
            expect(booleanResult).toBeTruthy();
        });
        it('using != and return true', function () {
            booleanResult = service.evaluateCondition(true, false, '!=');
            expect(booleanResult).toBeTruthy();
        });
        it('using != and return false', function () {
            booleanResult = service.evaluateCondition(true, true, '!=');
            expect(booleanResult).toBeFalsy();
        });
        it('using >= and return true', function () {
            booleanResult = service.evaluateCondition(2, 2, '>=');
            expect(booleanResult).toBeTruthy();
        });
        it('using empty with null values and return true', function () {
            booleanResult = service.evaluateCondition(null, null, 'empty');
            expect(booleanResult).toBeTruthy();
        });
        it('using empty with empty strings values and return true', function () {
            booleanResult = service.evaluateCondition('', '', 'empty');
            expect(booleanResult).toBeTruthy();
        });
        it('using empty with empty string value and return false', function () {
            booleanResult = service.evaluateCondition('fake_value', undefined, 'empty');
            expect(booleanResult).toBeFalsy();
        });
        it('using > and return false', function () {
            booleanResult = service.evaluateCondition(2, 3, '>');
            expect(booleanResult).toBeFalsy();
        });
        it('using not empty with null values and return false', function () {
            booleanResult = service.evaluateCondition(null, null, '!empty');
            expect(booleanResult).toBeFalsy();
        });
        it('using OR NOT with empty strings and return false', function () {
            booleanResult = service.evaluateCondition('', '', '!empty');
            expect(booleanResult).toBeFalsy();
        });
        it('using <= and return false', function () {
            booleanResult = service.evaluateCondition(2, 1, '<=');
            expect(booleanResult).toBeFalsy();
        });
        it('using <= and return true for different values', function () {
            booleanResult = service.evaluateCondition(1, 2, '<=');
            expect(booleanResult).toBeTruthy();
        });
        it('using <= and return true for same values', function () {
            booleanResult = service.evaluateCondition(2, 2, '<=');
            expect(booleanResult).toBeTruthy();
        });
        it('should return undefined for invalid operation', function () {
            booleanResult = service.evaluateCondition(null, null, undefined);
            expect(booleanResult).toBeUndefined();
        });
    });
    describe('should retrive the process variables', function () {
        var fakeFormWithField = new index_1.FormModel(widget_visibility_service_mock_1.fakeFormJson);
        var visibilityObjTest;
        var chainedVisibilityObj = new widget_visibility_model_1.WidgetVisibilityModel();
        beforeEach(function () {
            visibilityObjTest = new widget_visibility_model_1.WidgetVisibilityModel();
        });
        it('should return the process variables for task', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function (res) {
                expect(res).toBeDefined();
                expect(res.length).toEqual(3);
                expect(res[0].id).toEqual('TEST_VAR_1');
                expect(res[0].type).toEqual('string');
                expect(res[0].value).toEqual('test_value_1');
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: widget_visibility_service_mock_1.fakeTaskProcessVariableModels
            });
        });
        it('should be able to retrieve the value of a process variable', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function (res) {
                expect(res).toBeDefined();
                var varValue = service.getVariableValue(widget_visibility_service_mock_1.formTest, 'TEST_VAR_1', res);
                expect(varValue).not.toBeUndefined();
                expect(varValue).toBe('test_value_1');
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: widget_visibility_service_mock_1.fakeTaskProcessVariableModels
            });
        });
        it('should return undefined if the variable does not exist', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function (res) {
                var varValue = service.getVariableValue(widget_visibility_service_mock_1.formTest, 'TEST_MYSTERY_VAR', res);
                expect(varValue).toBeUndefined();
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: widget_visibility_service_mock_1.fakeTaskProcessVariableModels
            });
        });
        it('should retrieve the value for the right field when it is a process variable', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function (res) {
                visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                var rightValue = service.getRightValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
                expect(rightValue).not.toBeNull();
                expect(rightValue).toBe('test_value_2');
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: widget_visibility_service_mock_1.fakeTaskProcessVariableModels
            });
        });
        it('should retrieve the value for the left field when it is a process variable', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function (res) {
                visibilityObjTest.leftRestResponseId = 'TEST_VAR_2';
                var rightValue = service.getLeftValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
                expect(rightValue).not.toBeNull();
                expect(rightValue).toBe('test_value_2');
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: widget_visibility_service_mock_1.fakeTaskProcessVariableModels
            });
        });
        it('should evaluate the visibility for the field between form value and process var', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function (res) {
                visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
                visibilityObjTest.operator = '!=';
                visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                var isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);
                expect(isVisible).toBeTruthy();
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: widget_visibility_service_mock_1.fakeTaskProcessVariableModels
            });
        });
        it('should evaluate visibility with multiple conditions', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function (res) {
                visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
                visibilityObjTest.operator = '!=';
                visibilityObjTest.rightRestResponseId = 'TEST_VAR_2';
                visibilityObjTest.nextConditionOperator = 'and';
                chainedVisibilityObj.leftRestResponseId = 'TEST_VAR_2';
                chainedVisibilityObj.operator = '!empty';
                visibilityObjTest.nextCondition = chainedVisibilityObj;
                var isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);
                expect(isVisible).toBeTruthy();
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: widget_visibility_service_mock_1.fakeTaskProcessVariableModels
            });
        });
        it('should catch error on 403 response', function (done) {
            service.getTaskProcessVariable('9999').subscribe(function () {
            }, function () {
                done();
            });
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });
    });
    describe('should return the value of the field', function () {
        var visibilityObjTest;
        var fakeFormWithField = new index_1.FormModel(widget_visibility_service_mock_1.fakeFormJson);
        var jsonFieldFake = {
            id: 'FAKE_FORM_FIELD_ID',
            value: 'FAKE_FORM_FIELD_VALUE',
            visibilityCondition: undefined
        };
        var fakeForm = new index_1.FormModel({
            variables: [
                {
                    name: 'FORM_VARIABLE_TEST',
                    type: 'string',
                    value: 'form_value_test'
                }
            ]
        });
        beforeEach(function () {
            visibilityObjTest = new widget_visibility_model_1.WidgetVisibilityModel();
            widget_visibility_service_mock_1.formTest.values = widget_visibility_service_mock_1.formValues;
            jsonFieldFake.visibilityCondition = visibilityObjTest;
        });
        it('should be able to retrieve a field value searching in the form', function () {
            var formValue = service.searchValueInForm(stubFormWithFields, 'FIELD_WITH_CONDITION');
            expect(formValue).not.toBeNull();
            expect(formValue).toBe('field_with_condition_value');
        });
        it('should return empty string if the field value is not in the form', function () {
            var formValue = service.searchValueInForm(stubFormWithFields, 'FIELD_MYSTERY');
            expect(formValue).not.toBeUndefined();
            expect(formValue).toBe('');
        });
        it('should search in the form if element value is not in form values', function () {
            var value = service.getFormValue(fakeFormWithField, 'FIELD_WITH_CONDITION');
            expect(value).not.toBeNull();
            expect(value).toBe('field_with_condition_value');
        });
        it('should return empty string if the element is not present anywhere', function () {
            var formValue = service.getFormValue(fakeFormWithField, 'FIELD_MYSTERY');
            expect(formValue).not.toBeUndefined();
            expect(formValue).toBe('');
        });
        it('should retrieve the value for the right field when it is a value', function () {
            visibilityObjTest.rightValue = '100';
            var rightValue = service.getRightValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(rightValue).toBe('100');
        });
        it('should return formatted date when right value is a date', function () {
            visibilityObjTest.rightValue = '9999-12-31';
            var rightValue = service.getRightValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(rightValue).toBe('9999-12-31T00:00:00.000Z');
        });
        it('should return the value when right value is not a date', function () {
            visibilityObjTest.rightValue = '9999-99-99';
            var rightValue = service.getRightValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(rightValue).toBe('9999-99-99');
        });
        it('should retrieve the value for the right field when it is a form variable', function () {
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            var rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);
            expect(rightValue).not.toBeNull();
            expect(rightValue).toBe('RIGHT_FORM_FIELD_VALUE');
        });
        it('should take the value from form values if it is present', function () {
            var formValue = service.getFormValue(widget_visibility_service_mock_1.formTest, 'test_1');
            expect(formValue).not.toBeNull();
            expect(formValue).toBe('value_1');
        });
        it('should retrieve right value from form values if it is present', function () {
            visibilityObjTest.rightFormFieldId = 'test_2';
            var rightValue = service.getRightValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(rightValue).not.toBeNull();
            expect(widget_visibility_service_mock_1.formTest.values).toEqual(widget_visibility_service_mock_1.formValues);
            expect(rightValue).toBe('value_2');
        });
        it('should retrieve the value for the left field when it is a form value', function () {
            visibilityObjTest.leftFormFieldId = 'FIELD_WITH_CONDITION';
            var leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);
            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('field_with_condition_value');
        });
        it('should retrieve left value from form values if it is present', function () {
            visibilityObjTest.leftFormFieldId = 'test_2';
            var leftValue = service.getLeftValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('value_2');
        });
        it('should return undefined for a value that is not on variable or form', function () {
            var leftValue = service.getLeftValue(fakeFormWithField, visibilityObjTest);
            expect(leftValue).toBeUndefined();
        });
        it('should evaluate the visibility for the field with single visibility condition between two field values', function () {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'test_3';
            var isVisible = service.isFieldVisible(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(isVisible).toBeTruthy();
        });
        it('should evaluate true visibility for the field with single visibility condition between a field and a value', function () {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightValue = 'value_1';
            var isVisible = service.isFieldVisible(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(isVisible).toBeTruthy();
        });
        it('should return empty string for a value that is not on variable or form', function () {
            visibilityObjTest.rightFormFieldId = 'NO_FIELD_FORM';
            var rightValue = service.getRightValue(fakeFormWithField, visibilityObjTest);
            expect(rightValue).not.toBeUndefined();
            expect(rightValue).toBe('');
        });
        it('should evaluate the visibility for the field with single visibility condition between form values', function () {
            visibilityObjTest.leftFormFieldId = 'LEFT_FORM_FIELD_ID';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            var isVisible = service.isFieldVisible(fakeFormWithField, visibilityObjTest);
            expect(isVisible).toBeTruthy();
        });
        it('should refresh the visibility for a form field object', function () {
            visibilityObjTest.leftFormFieldId = 'test_1';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'test_3';
            var fakeFormField = new index_1.FormFieldModel(widget_visibility_service_mock_1.formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);
            expect(fakeFormField.isVisible).toBeFalsy();
        });
        it('should return true when the visibility condition is not valid', function () {
            visibilityObjTest.leftFormFieldId = '';
            visibilityObjTest.leftRestResponseId = '';
            visibilityObjTest.operator = '!=';
            var isVisible = service.evaluateVisibility(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(isVisible).toBeTruthy();
        });
        it('should return always true when field does not have a visibility condition', function () {
            jsonFieldFake.visibilityCondition = null;
            var fakeFormField = new index_1.FormFieldModel(fakeFormWithField, jsonFieldFake);
            fakeFormField.isVisible = false;
            service.refreshEntityVisibility(fakeFormField);
            expect(fakeFormField.isVisible).toBeTruthy();
        });
        it('should be able to retrieve the value of a form variable', function () {
            var varValue = service.getVariableValue(fakeForm, 'FORM_VARIABLE_TEST', null);
            expect(varValue).not.toBeUndefined();
            expect(varValue).toBe('form_value_test');
        });
        it('should return undefined for not existing form variable', function () {
            var varValue = service.getVariableValue(fakeForm, 'MISTERY_FORM_VARIABLE', null);
            expect(varValue).toBeUndefined();
        });
        it('should retrieve the value for the left field when it is a form variable', function () {
            visibilityObjTest.leftRestResponseId = 'FORM_VARIABLE_TEST';
            var leftValue = service.getLeftValue(fakeForm, visibilityObjTest);
            expect(leftValue).not.toBeNull();
            expect(leftValue).toBe('form_value_test');
        });
        it('should determine visibility for dropdown on label condition', function () {
            var dropdownValue = service.getFieldValue(widget_visibility_service_mock_1.formTest.values, 'dropdown_LABEL');
            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });
        it('should be able to get the value for a dropdown filtered with Label', function () {
            var dropdownValue = service.getFieldValue(widget_visibility_service_mock_1.formTest.values, 'dropdown_LABEL');
            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });
        it('should be able to get the value for a standard field', function () {
            var dropdownValue = service.getFieldValue(widget_visibility_service_mock_1.formTest.values, 'test_2');
            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('value_2');
        });
        it('should get the dropdown label value from a form', function () {
            var dropdownValue = service.getFormValue(widget_visibility_service_mock_1.formTest, 'dropdown_LABEL');
            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_label');
        });
        it('should get the dropdown id value from a form', function () {
            var dropdownValue = service.getFormValue(widget_visibility_service_mock_1.formTest, 'dropdown');
            expect(dropdownValue).not.toBeNull();
            expect(dropdownValue).toBeDefined();
            expect(dropdownValue).toBe('dropdown_id');
        });
        it('should retrieve the value for the right field when it is a dropdown id', function () {
            visibilityObjTest.rightFormFieldId = 'dropdown';
            var rightValue = service.getRightValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(rightValue).toBeDefined();
            expect(rightValue).toBe('dropdown_id');
        });
        it('should retrieve the value for the right field when it is a dropdown label', function () {
            visibilityObjTest.rightFormFieldId = 'dropdown_LABEL';
            var rightValue = service.getRightValue(widget_visibility_service_mock_1.formTest, visibilityObjTest);
            expect(rightValue).toBeDefined();
            expect(rightValue).toBe('dropdown_label');
        });
        it('should be able to evaluate condition with a dropdown <label>', function () {
            visibilityObjTest.leftFormFieldId = 'test_5';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'dropdown_LABEL';
            var fakeFormField = new index_1.FormFieldModel(widget_visibility_service_mock_1.formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);
            expect(fakeFormField.isVisible).toBeTruthy();
        });
        it('should be able to evaluate condition with a dropdown <id>', function () {
            visibilityObjTest.leftFormFieldId = 'test_4';
            visibilityObjTest.operator = '==';
            visibilityObjTest.rightFormFieldId = 'dropdown';
            var fakeFormField = new index_1.FormFieldModel(widget_visibility_service_mock_1.formTest, jsonFieldFake);
            service.refreshEntityVisibility(fakeFormField);
            expect(fakeFormField.isVisible).toBeTruthy();
        });
        it('should be able to get value from form values', function () {
            var res = service.getFormValue(widget_visibility_service_mock_1.formTest, 'test_1');
            expect(res).not.toBeNull();
            expect(res).toBeDefined();
            expect(res).toBe('value_1');
        });
        /*
         it('should refresh the visibility for field', () => {
         visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
         visibilityObjTest.operator = '!=';
         visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';

         let container = <ContainerModel> fakeFormWithField.fields[0];
         let column0 = container.columns[0];
         let column1 = container.columns[1];

         column0.fields[0].visibilityCondition = visibilityObjTest;
         service.refreshVisibility(fakeFormWithField);

         expect(column0.fields[0].isVisible).toBeFalsy();
         expect(column0.fields[1].isVisible).toBeTruthy();
         expect(column0.fields[2].isVisible).toBeTruthy();
         expect(column1.fields[0].isVisible).toBeTruthy();
         });
         */
        it('should refresh the visibility for tab in forms', function () {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            var tab = new index_1.TabModel(fakeFormWithField, { id: 'fake-tab-id', title: 'fake-tab-title', isVisible: true });
            tab.visibilityCondition = visibilityObjTest;
            fakeFormWithField.tabs.push(tab);
            service.refreshVisibility(fakeFormWithField);
            expect(fakeFormWithField.tabs[0].isVisible).toBeFalsy();
        });
        it('should refresh the visibility for single tab', function () {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            var tab = new index_1.TabModel(fakeFormWithField, { id: 'fake-tab-id', title: 'fake-tab-title', isVisible: true });
            tab.visibilityCondition = visibilityObjTest;
            service.refreshEntityVisibility(tab);
            expect(tab.isVisible).toBeFalsy();
        });
        xit('should refresh the visibility for container in forms', function () {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'LEFT_FORM_FIELD_ID';
            var contModel = new index_1.ContainerModel(new index_1.FormFieldModel(fakeFormWithField, {
                id: 'fake-container-id',
                type: index_1.FormFieldTypes.GROUP,
                name: 'fake-container-name',
                isVisible: true,
                visibilityCondition: visibilityObjTest
            }));
            fakeFormWithField.fields.push(contModel);
            service.refreshVisibility(fakeFormWithField);
            expect(contModel.isVisible).toBeFalsy();
        });
        it('should refresh the visibility for single container', function () {
            visibilityObjTest.leftFormFieldId = 'FIELD_TEST';
            visibilityObjTest.operator = '!=';
            visibilityObjTest.rightFormFieldId = 'RIGHT_FORM_FIELD_ID';
            var contModel = new index_1.ContainerModel(new index_1.FormFieldModel(fakeFormWithField, {
                id: 'fake-container-id',
                type: index_1.FormFieldTypes.GROUP,
                name: 'fake-container-name',
                isVisible: true,
                visibilityCondition: visibilityObjTest
            }));
            service.refreshEntityVisibility(contModel.field);
            expect(contModel.isVisible).toBeFalsy();
        });
    });
});
