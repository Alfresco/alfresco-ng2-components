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

import { Directive, InjectionToken, Input, TemplateRef } from '@angular/core';
import type { WidgetComponent } from '../widget.component';

export type FieldStatusTemplate = TemplateRef<{ $implicit: WidgetComponent }>;
export const FIELD_STATUS_TEMPLATE = new InjectionToken<FieldStatusTemplate>('FIELD_STATUS_TEMPLATE');

@Directive({
    selector: '[adf-field-status-template]',
    providers: [
        {
            provide: FIELD_STATUS_TEMPLATE,
            useFactory: (directive: FieldStatusTemplateDirective) => directive.template,
            deps: [FieldStatusTemplateDirective]
        }
    ]
})
export class FieldStatusTemplateDirective {
    @Input('adf-field-status-template')
    template?: FieldStatusTemplate;
}
