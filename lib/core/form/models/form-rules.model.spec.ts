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

import { setupTestBed } from '../../testing/setup-test-bed';
import { FormBaseModule } from '../form-base.module';
import { CoreTestingModule } from '../../testing';
import { TranslateModule } from '@ngx-translate/core';
import { ByPassFormRuleManager, FormRulesManager, formRulesManagerFactory, FORM_RULES_MANAGER } from '../models/form-rules.model';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

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
    });

    describe('Injection token not provided', () => {
        setupTestBed({
            imports: [
                TranslateModule.forRoot(),
                CoreTestingModule,
                FormBaseModule
            ]
        });

        beforeEach(() => {
            injector = TestBed.inject(Injector);
        });

        it('factory function should return bypass service', () => {
            const rulesManager = formRulesManagerFactory<any>(injector);

            expect(rulesManager instanceof ByPassFormRuleManager).toBeTruthy();
        });
    });
});
