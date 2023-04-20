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

import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ModelService } from '../services/model.service';

@Component({
    selector: 'adf-form-list',
    templateUrl: './form-list.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FormListComponent implements OnChanges {

    /** The array that contains the information to show inside the list. */
    @Input()
    forms: any [] = [];

    constructor(protected modelService: ModelService) {
    }

    ngOnChanges() {
        this.getForms();
    }

    isEmpty(): boolean {
        return this.forms && this.forms.length === 0;
    }

    getForms() {
        this.modelService.getForms().subscribe((forms) => {
            this.forms.push(...forms);
        });
    }

}
