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

 /* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, ViewEncapsulation, InjectionToken, Inject, Optional } from '@angular/core';
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from '../widget.component';

export interface AmountWidgetSettings {
    showReadonlyPlaceholder: boolean;
}

export const ADF_AMOUNT_SETTINGS = new InjectionToken<AmountWidgetSettings>('adf-amount-settings');

@Component({
    selector: 'amount-widget',
    templateUrl: './amount.widget.html',
    styleUrls: ['./amount.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class AmountWidgetComponent extends WidgetComponent implements OnInit {

    static DEFAULT_CURRENCY: string = '$';
    private showPlaceholder = true;

    currency: string = AmountWidgetComponent.DEFAULT_CURRENCY;

    get placeholder(): string {
        return this.showPlaceholder ? this.field.placeholder : '';
    }

    constructor(
        public formService: FormService,
        @Inject(ADF_AMOUNT_SETTINGS)
        @Optional()
        private settings: AmountWidgetSettings
    ) {
        super(formService);
    }

    ngOnInit() {
        if (this.field) {
            if (this.field.currency) {
                this.currency = this.field.currency;
            }

            if (this.field.readOnly) {
                this.showPlaceholder = this.settings && this.settings.showReadonlyPlaceholder;
            }
        }
    }

}
