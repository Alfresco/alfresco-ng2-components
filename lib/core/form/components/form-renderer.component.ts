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

import { Component, ViewEncapsulation, Input, OnDestroy, Injector, OnChanges } from '@angular/core';
import { FormRulesManager, formRulesManagerFactory } from '../models/form-rules.model';
import { FormModel } from './widgets/core/form.model';

@Component({
    selector: 'adf-form-renderer',
    templateUrl: './form-renderer.component.html',
    styleUrls: ['./form-renderer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: FormRulesManager,
            useFactory: formRulesManagerFactory,
            deps: [Injector]
        }
    ]
})
export class FormRendererComponent<T> implements OnChanges, OnDestroy {

    /** Toggle debug options. */
    @Input()
    showDebugButton: boolean = false;

    @Input()
    formDefinition: FormModel;

    debugMode: boolean;

    constructor(private formRulesManager: FormRulesManager<T>) { }

    ngOnChanges(): void {
        this.formRulesManager.initialize(this.formDefinition);
    }

    ngOnDestroy() {
        this.formRulesManager.destroy();
    }

}
