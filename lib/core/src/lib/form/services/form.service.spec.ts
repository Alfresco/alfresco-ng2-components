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
import { formModelTabs } from '../../mock';
import { FORM_SERVICE_FIELD_VALIDATORS_TOKEN, FormService } from './form.service';
import { FORM_FIELD_VALIDATORS, FormFieldValidator } from '../public-api';

const fakeValidator = {
    supportedTypes: ['test'],
    isSupported: () => true,
    validate: () => true
} as FormFieldValidator;

describe('Form service', () => {
    let service: FormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [{ provide: FORM_SERVICE_FIELD_VALIDATORS_TOKEN, useValue: [fakeValidator] }]
        });
        service = TestBed.inject(FormService);
    });

    describe('parseForm', () => {
        it('should parse a Form Definition with tabs', () => {
            expect(formModelTabs.formRepresentation.formDefinition).toBeDefined();
            const formParsed = service.parseForm(formModelTabs);
            expect(formParsed).toBeDefined();
        });

        it('should return form with injected field validators', () => {
            expect(formModelTabs.formRepresentation.formDefinition).toBeDefined();
            const formParsed = service.parseForm(formModelTabs);
            expect(formParsed.fieldValidators).toEqual([...FORM_FIELD_VALIDATORS, fakeValidator]);
        });
    });
});
