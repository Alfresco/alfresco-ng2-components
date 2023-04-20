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

import { InjectionToken, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormEvent } from '../events';
import { FormRulesEvent } from '../events/form-rules.event';
import { FormModel, FormService } from '../public-api';

export const FORM_RULES_MANAGER = new InjectionToken<FormRulesManager<any>>('form.rule.manager');

export function formRulesManagerFactory<T>(injector: Injector): FormRulesManager<T> {
    try {
        return injector.get(FORM_RULES_MANAGER);
    } catch {
        return new ByPassFormRuleManager<T>(null);
    }
}

export abstract class FormRulesManager<T> {
    constructor(private formService: FormService) { }

    protected formModel: FormModel;
    private onDestroy$ = new Subject<boolean>();
    private initialized = false;

    initialize(formModel: FormModel) {
        if (this.initialized) {
            this.destroy();
            this.onDestroy$ = new Subject<boolean>();
        }

        this.formModel = formModel;

        if (!this.formModel.readOnly) {
            const rules = this.getRules();

            if (!!rules) {
                this.formService.formRulesEvent
                    .pipe(
                        filter(event => !!event?.form?.id && event.form.id === formModel?.id),
                        takeUntil(this.onDestroy$)
                    ).subscribe(event => {
                        this.handleRuleEvent(event, rules);
                    });

                this.formService.formRulesEvent.next(new FormRulesEvent('formLoaded', new FormEvent(formModel)));
            }
        }

        this.initialized = true;
    }

    protected abstract getRules(): T;
    protected abstract handleRuleEvent(event: FormRulesEvent, rules: T): void;

    destroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}

export class ByPassFormRuleManager<T> extends FormRulesManager<T> {

    protected getRules(): T {
        return null;
    }

    protected handleRuleEvent(): void {
        return;
    }
}
