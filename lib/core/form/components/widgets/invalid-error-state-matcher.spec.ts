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

import { InvalidErrorStateMatcher } from './invalid-error-state-matcher';
import { FormControl, Validators } from '@angular/forms';

describe('InvalidErrorStateMatcher', () => {

    const matcher = new InvalidErrorStateMatcher();

    it('Should return false if the form is valid', () => {
        const fakeFormControlValid = new FormControl('');
        expect(matcher.isErrorState(fakeFormControlValid)).toBeFalsy();
    });

    it('Should return false if the form is null', () => {
        expect(matcher.isErrorState(null)).toBeFalsy();
    });

    it('Should return true if form is invalid', () => {
        const fakeFormControlInvalid = new FormControl('', Validators.required);
        expect(matcher.isErrorState(fakeFormControlInvalid)).toBeTruthy();
    });
});
