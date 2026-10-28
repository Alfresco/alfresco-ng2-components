/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Subscription } from 'rxjs';
import { formModelTabs } from '../../mock';
import { FORM_SERVICE_FIELD_VALIDATORS_TOKEN, FormService } from './form.service';
import { FORM_FIELD_VALIDATORS, FormFieldValidator } from '../public-api';
import { FormModel } from '../components/widgets/core/form.model';
import { FormStateCommit, FormWriteContext } from '../models/form-state.model';

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

    describe('formState', () => {
        let form: FormModel;
        let context: FormWriteContext;
        let commits: FormStateCommit[];
        let subscription: Subscription;

        beforeEach(() => {
            form = new FormModel({ id: 'form', fields: [{ id: 'text', type: 'text', value: 'authored' }] }, undefined, false, service);
            context = { form, renderer: {}, generation: {}, invocation: {}, documentVersion: '1', outcomeId: 'clear', isCurrent: () => true };
            service.formState.bind(form, context.renderer, context.generation);
            commits = [];
            subscription = service.formState.commits.subscribe((commit) => commits.push(commit));
        });

        afterEach(() => subscription.unsubscribe());

        it('should commit silently and publish the commit when the mount is current', () => {
            const field = form.getFieldById('text');
            const mount = service.formState.captureMount(field);
            const edits = spyOn(service.formFieldValueChanged, 'next');
            const rules = spyOn(service.formRulesEvent, 'next');
            expect(mount).toEqual({ form, field, renderer: context.renderer, generation: context.generation });
            expect(service.formState.isMountCurrent(field, mount)).toBeTrue();
            expect(service.formState.isProjectionCurrent(field, context, mount)).toBeTrue();
            expect(service.formState.commit(field, 'reset', context)).toBeTrue();
            expect(form.values.text).toBe('reset');
            expect(commits).toEqual([{ field, context }]);
            expect(edits).not.toHaveBeenCalled();
            expect(rules).not.toHaveBeenCalled();
        });

        it('should reject the commit and the mount when the form is bound to another renderer', () => {
            const field = form.getFieldById('text');
            const mount = service.formState.captureMount(field);
            service.formState.bind(form, {}, {});
            expect(service.formState.isMountCurrent(field, mount)).toBeFalse();
            expect(service.formState.isProjectionCurrent(field, context, mount)).toBeFalse();
            expect(service.formState.commit(field, 'stale', context)).toBeFalse();
            expect(form.values.text).toBe('authored');
            expect(commits).toEqual([]);
        });

        it('should project a field value only when the invocation is current', () => {
            const field = form.getFieldById('text');
            service.formState.project(field, context);
            service.formState.project(field, { ...context, isCurrent: () => false });
            expect(commits).toEqual([{ field, context }]);
        });
    });
});
