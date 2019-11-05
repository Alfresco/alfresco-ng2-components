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

import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { FormService } from './../services/form.service';

@Component({
    selector: 'adf-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FormListComponent implements OnChanges {

    /** The array that contains the information to show inside the list. */
    @Input()
    forms: any [] = [];

    constructor(protected formService: FormService) {
    }

    ngOnChanges() {
        this.getForms();
    }

    isEmpty(): boolean {
        return this.forms && this.forms.length === 0;
    }

    getForms() {
        this.formService.getForms().subscribe((forms) => {
            this.forms.push(...forms);
        });
    }

}
