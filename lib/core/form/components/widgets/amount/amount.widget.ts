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

 /* tslint:disable:component-selector  */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService } from './../../../services/form.service';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'amount-widget',
    templateUrl: './amount.widget.html',
    styleUrls: ['./amount.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class AmountWidgetComponent extends WidgetComponent implements OnInit {

    static DEFAULT_CURRENCY: string = '$';

    currency: string = AmountWidgetComponent.DEFAULT_CURRENCY;

    get placeholder(): string {
        return !this.field.readOnly ? this.field.placeholder : '';
    }

    constructor(public formService: FormService) {
        super(formService);
    }

    ngOnInit() {
        if (this.field && this.field.currency) {
            this.currency = this.field.currency;
        }
    }

}
