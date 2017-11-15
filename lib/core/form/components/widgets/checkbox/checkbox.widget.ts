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
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'checkbox-widget',
    templateUrl: './checkbox.widget.html',
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class CheckboxWidgetComponent extends WidgetComponent {

    constructor(private visibilityService: WidgetVisibilityService, public formService: FormService) {
        super(formService);
    }

    onChange() {
        this.visibilityService.refreshVisibility(this.field.form);
    }

}
