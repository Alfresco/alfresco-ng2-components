/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { setupTestBed } from '../../testing/setup-test-bed';
import { FormBaseModule } from '../form-base.module';
import { CoreTestingModule } from '../../testing';
import { TranslateModule } from '@ngx-translate/core';
import { ByPassFormRuleManager, FormRulesManager, formRulesManagerFactory, FORM_RULES_MANAGER } from './form-rules.model';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormModel } from '../components/widgets/core/form.model';
import { FormRulesEvent } from '../events/form-rules.event';
import { FormEvent } from '../events/form.event';
import { FormService } from '../services/form.service';
import { getTestScheduler } from 'jasmine-marbles';

class CustomRuleManager extends FormRulesManager<any> {
    protected getRules() {
        return null;
    }
    protected handleRuleEvent(): void {
        return;
    }

}

describe('Form Rules', () => {

    let injector: Injector;
    const customRuleManager = new CustomRuleManager(null);
    let formService: FormService;

    describe('Injection token provided', () => {
        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule,
                FormBaseModule
            ],
            providers: [
                {
                    provide: FORM_RULES_MANAGER,
                    useValue: customRuleManager
                }
            ]
        });

        beforeEach(() => {
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
            const getRulesSpy = spyOn<any>(rulesManager, 'getRules').and.returnValue({});
            const handleRuleEventSpy = spyOn<any>(rulesManager, 'handleRuleEvent');
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
            spyOn<any>(rulesManager, 'getRules').and.returnValue({});
            const handleRuleEventSpy = spyOn<any>(rulesManager, 'handleRuleEvent');
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

        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule,
                FormBaseModule
            ]
        });

        beforeEach(() => {
            injector = TestBed.inject(Injector);
            rulesManager = formRulesManagerFactory<any>(injector);
            getRulesSpy = spyOn<any>(rulesManager, 'getRules');
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
