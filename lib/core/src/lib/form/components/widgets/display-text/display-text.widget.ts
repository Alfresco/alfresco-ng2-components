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

/* eslint-disable @angular-eslint/component-selector */

import { Component, ViewEncapsulation } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseDisplayTextWidgetComponent } from '../base-display-text/base-display-text.widget';

@Component({
    selector: 'display-text-widget',
    templateUrl: './display-text.widget.html',
    styleUrls: ['./display-text.widget.scss'],
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
    imports: [TranslatePipe],
    encapsulation: ViewEncapsulation.None
})
export class DisplayTextWidgetComponent extends BaseDisplayTextWidgetComponent {
    protected storeOriginalValue(): void {
        if (this.field) {
            this.originalFieldValue = this.field.value;
        }
    }

    protected evaluateExpressions(): void {
        if (this.field) {
            this.field.value = this.resolveExpressions(this.field.value);
        }
    }

    protected reevaluateExpressions(): void {
        if (this.field && this.originalFieldValue) {
            this.field.value = this.resolveExpressions(this.originalFieldValue);
        }
    }
}
