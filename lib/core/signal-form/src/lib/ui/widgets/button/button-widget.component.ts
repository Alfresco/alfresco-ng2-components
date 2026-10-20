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

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { SignalFormEventType } from '../../../state/signal-form-event';
import { SignalFormWidget } from '../signal-form-widget';

const TOOLTIP_SHOW_DELAY = 500;

/** A button that holds no value: a click tells the form's listeners, such as form rules, that it was clicked. */
@Component({
    selector: 'adf-signal-button-widget',
    templateUrl: './button-widget.component.html',
    styleUrl: './button-widget.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatTooltipModule, TranslatePipe]
})
export class SignalButtonWidgetComponent extends SignalFormWidget<null> {
    protected readonly tooltipShowDelay = TOOLTIP_SHOW_DELAY;

    protected clicked(): void {
        this.form().notify({ type: SignalFormEventType.Click, fieldId: this.definition().id, row: this.row() });
    }
}
