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
"use strict";
var forms_1 = require("@angular/forms");
var search_term_validator_1 = require("./search-term-validator");
describe('Search term validator', function () {
    it('should pass validation for a value with the specified required number of alphanumeric characters', function () {
        var control = new forms_1.FormControl('ab', search_term_validator_1.SearchTermValidator.minAlphanumericChars(2));
        expect(control.valid).toBe(true);
    });
    it('should pass validation for a value with more than the specified required number of alphanumeric characters', function () {
        var control = new forms_1.FormControl('abc', search_term_validator_1.SearchTermValidator.minAlphanumericChars(2));
        expect(control.valid).toBe(true);
    });
    it('should fail validation for a value with less than the specified required number of alphanumeric characters', function () {
        var control = new forms_1.FormControl('a', search_term_validator_1.SearchTermValidator.minAlphanumericChars(2));
        expect(control.valid).toBe(false);
    });
    it('should fail validation for a value with less than the specified required number of alphanumeric characters but with other non-alphanumeric characters', function () {
        var control = new forms_1.FormControl('a ._-?b', search_term_validator_1.SearchTermValidator.minAlphanumericChars(3));
        expect(control.valid).toBe(false);
    });
});
//# sourceMappingURL=search-term-validator.spec.js.map