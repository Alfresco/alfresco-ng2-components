/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

 /* tslint:disable:component-selector  */

import { Component, ViewEncapsulation } from '@angular/core';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'unknown-widget',
    template: `
            <md-list class="adf-unknown-widget">
                <md-list-item>
                     <md-icon class="md-24">error_outline</md-icon>
                     <span class="adf-unknown-text">Unknown type: {{field.type}}</span>
                </md-list-item>
            </md-list>

    `,
    styleUrls: ['./unknown.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class UnknownWidgetComponent extends WidgetComponent {

    constructor(public formService: FormService) {
         super(formService);
    }
}
