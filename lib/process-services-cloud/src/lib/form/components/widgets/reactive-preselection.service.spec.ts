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
import { ADF_TYPED_VALUE_FORMATTING_ENABLED, FormService } from '@alfresco/adf-core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ReactivePreselectionHost, ReactivePreselectionService } from './reactive-preselection.service';

interface TestItem {
    id?: string;
    name?: string;
}

describe('ReactivePreselectionService', () => {
    let formRulesEvent: Subject<any>;
    let fieldValue: unknown;
    let preselection: TestItem[];
    let host: ReactivePreselectionHost<TestItem>;

    const emit = () => formRulesEvent.next({ type: 'fieldValueChanged' });

    const createService = (token: Observable<boolean> | boolean | null): ReactivePreselectionService<TestItem> => {
        TestBed.resetTestingModule();
        formRulesEvent = new Subject<any>();
        TestBed.configureTestingModule({
            providers: [
                ReactivePreselectionService,
                { provide: FormService, useValue: { formRulesEvent } },
                { provide: ADF_TYPED_VALUE_FORMATTING_ENABLED, useValue: token }
            ]
        });
        return TestBed.inject<ReactivePreselectionService<TestItem>>(ReactivePreselectionService);
    };

    beforeEach(() => {
        fieldValue = null;
        preselection = [];
        host = {
            getFieldValue: () => fieldValue,
            getPreselection: () => preselection,
            setPreselection: (value) => (preselection = value),
            identityOf: (item) => item?.id ?? item?.name
        };
    });

    describe('when the flag is enabled', () => {
        beforeEach(() => createService(true).connect(host));

        it('should sync the preselection with a new array reference when the value changes', () => {
            const next = [{ id: 'a' }];
            fieldValue = next;

            emit();

            expect(preselection).toEqual(next);
            expect(preselection).not.toBe(next);
        });

        it('should wrap a single object into an array', () => {
            fieldValue = { id: 'a' };

            emit();

            expect(preselection).toEqual([{ id: 'a' }]);
        });

        it('should not reassign the preselection when the value is unchanged', () => {
            preselection = [{ id: 'a' }];
            const initial = preselection;
            fieldValue = [{ id: 'a' }];

            emit();

            expect(preselection).toBe(initial);
        });

        it('should clear the preselection when the value is cleared', () => {
            preselection = [{ id: 'a' }];
            fieldValue = null;

            emit();

            expect(preselection).toEqual([]);
        });

        it('should ignore events other than fieldValueChanged', () => {
            const initial = preselection;
            fieldValue = [{ id: 'a' }];

            formRulesEvent.next({ type: 'formLoaded' });

            expect(preselection).toBe(initial);
        });
    });

    describe('when the flag is disabled', () => {
        it('should not react to form rules events', () => {
            createService(false).connect(host);
            const initial = preselection;
            fieldValue = [{ id: 'a' }];

            emit();

            expect(preselection).toBe(initial);
        });

        it('should treat a null token as disabled', () => {
            createService(null).connect(host);
            const initial = preselection;
            fieldValue = [{ id: 'a' }];

            emit();

            expect(preselection).toBe(initial);
        });
    });

    describe('when the flag is provided as an observable', () => {
        it('should stay inert until the observable emits true', () => {
            const token = new BehaviorSubject<boolean>(false);
            createService(token).connect(host);
            fieldValue = [{ id: 'a' }];

            emit();
            expect(preselection).toEqual([]);

            token.next(true);
            emit();
            expect(preselection).toEqual([{ id: 'a' }]);
        });
    });
});
