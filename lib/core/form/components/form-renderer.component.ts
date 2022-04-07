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

import { Component, ViewEncapsulation, Input, OnInit, Inject, Optional, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FormService } from '../public-api';
import { FORM_RULES_MANAGER, FormRulesManager } from '../models/form-rules.model';
import { FormModel } from './widgets/core/form.model';

@Component({
    selector: 'adf-form-renderer',
    templateUrl: './form-renderer.component.html',
    styleUrls: ['./form-renderer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormRendererComponent implements OnInit, OnDestroy {

    /** Toggle debug options. */
    @Input()
    showDebugButton: boolean = false;

    @Input()
    formDefinition: FormModel;

    debugMode: boolean;
    private onDestroy$ = new Subject<boolean>();

    constructor(private formService: FormService, @Optional() @Inject(FORM_RULES_MANAGER) private formRulesManager: FormRulesManager) { }

    ngOnInit(): void {
        if (!!this.formRulesManager) {
            const rules = this.formDefinition?.rules;

            if (!!rules) {
                this.formService.formRulesEvent
                    .pipe(
                        filter(event => !!event.form.id && event.form.id === this.formDefinition?.id),
                        takeUntil(this.onDestroy$)
                    ).subscribe(event => {
                        this.formRulesManager.handleRuleEvent(event, rules);
                    });

            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

}
