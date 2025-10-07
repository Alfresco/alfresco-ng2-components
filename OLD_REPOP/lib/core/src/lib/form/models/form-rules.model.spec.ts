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

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { FormModel } from '../components/widgets';
import { FormEvent, FormRulesEvent } from '../events';
import { FormService } from '../services/form.service';
import { ByPassFormRuleManager, FORM_RULES_MANAGER, FormRulesManager, formRulesManagerFactory } from './form-rules.model';

class CustomRuleManager extends FormRulesManager<any> {
    getRules(): any {
        return null;
    }

    handleRuleEvent(): void {
        return;
    }
}

describe('Form Rules', () => {
    let injector: Injector;
    const customRuleManager = new CustomRuleManager(null);
    let formService: FormService;

    describe('Injection token provided', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: FORM_RULES_MANAGER,
                        useValue: customRuleManager
                    }
                ]
            });
            injector = TestBed.inject(Injector);
            formService = TestBed.inject(FormService);
        });

        it('factory function should not return bypass service', () => {
            spyOn(customRuleManager, 'destroy');
            spyOn(customRuleManager, 'initialize');
            const rulesManager = formRulesManagerFactory<any>(injector);

            expect(rulesManager instanceof CustomRuleManager).toBeTruthy();

            rulesManager.destroy();
            expect(customRuleManager.destroy).toHaveBeenCalled();
            rulesManager.initialize(null);
            expect(customRuleManager.initialize).toHaveBeenCalled();
        });

        it('should send the form loaded event when initialized', () => {
            const rulesManager = new CustomRuleManager(formService);
            const getRulesSpy = spyOn(rulesManager, 'getRules').and.returnValue({});
            const handleRuleEventSpy = spyOn(rulesManager, 'handleRuleEvent');
            const formModel = new FormModel({ id: 'mock' }, {}, false);
            const formEvent = new FormEvent(formModel);
            const event = new FormRulesEvent('formLoaded', formEvent);

            rulesManager.initialize(formModel);
            getTestScheduler().flush();

            expect(getRulesSpy).toHaveBeenCalled();
            expect(handleRuleEventSpy).toHaveBeenCalledWith(event, {});
        });

        it('should not receive the form event when event has no form', () => {
            const rulesManager = new CustomRuleManager(formService);
            spyOn(rulesManager, 'getRules').and.returnValue({});
            const handleRuleEventSpy = spyOn(rulesManager, 'handleRuleEvent');
            const formModel = new FormModel({ id: 'mock' }, {}, false);
            const formEvent = new FormEvent(new FormModel(null));
            const event = new FormRulesEvent('formLoaded', formEvent);

            rulesManager.initialize(formModel);

            formService.formRulesEvent.next(event);

            getTestScheduler().flush();

            expect(handleRuleEventSpy).not.toHaveBeenCalledWith(event, jasmine.anything());
        });
    });

    describe('Injection token not provided', () => {
        let formModel: FormModel;
        let rulesManager: FormRulesManager<any>;
        let getRulesSpy: jasmine.Spy;

        beforeEach(() => {
            injector = TestBed.inject(Injector);
            rulesManager = formRulesManagerFactory(injector);
            getRulesSpy = spyOn(rulesManager as any, 'getRules');
        });

        it('factory function should return bypass service', () => {
            expect(rulesManager instanceof ByPassFormRuleManager).toBeTruthy();
        });

        it('should get rules when form is not readonly', () => {
            formModel = new FormModel({}, {}, false);

            rulesManager.initialize(formModel);

            expect(getRulesSpy).toHaveBeenCalled();
        });

        it('should not get rules when form is readonly', () => {
            formModel = new FormModel({}, {}, true);

            rulesManager.initialize(formModel);

            expect(getRulesSpy).not.toHaveBeenCalled();
        });
    });
});
