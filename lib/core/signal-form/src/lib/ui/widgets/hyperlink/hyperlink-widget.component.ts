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

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SignalFormWidget } from '../signal-form-widget';

const DEFAULT_URL = '#';
const DEFAULT_SCHEME = 'http://';
const WEB_SCHEME = /^https?:\/\//i;

/**
 * Shows a link to the field value or its configured URL, opening in a new tab. A URL without `http(s)://` gets
 * `http://`, so no other scheme can be linked.
 */
@Component({
    selector: 'adf-signal-hyperlink-widget',
    templateUrl: './hyperlink-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslatePipe]
})
export class SignalHyperlinkWidgetComponent extends SignalFormWidget<string | null> {
    protected readonly url = computed(() => {
        const target = this.field()().value() || this.definition().hyperlinkUrl;
        if (!target) {
            return DEFAULT_URL;
        }
        return WEB_SCHEME.test(target) ? target : `${DEFAULT_SCHEME}${target}`;
    });

    protected readonly text = computed(() => this.definition().displayText || this.definition().hyperlinkUrl || this.field()().value());
}
