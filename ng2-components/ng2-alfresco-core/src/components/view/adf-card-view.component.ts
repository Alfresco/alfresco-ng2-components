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

import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import { CardViewModel } from '../../models/card-view.model';
import * as moment from 'moment';

@Component({
    selector: 'adf-card-view',
    templateUrl: './adf-card-view.component.html',
    styleUrls: ['./adf-card-view.component.css']
})
export class CardView implements OnInit {

    @Input()
    properties: CardViewModel [];

    constructor() {

    }

    ngOnInit() {

    }

    getPropertyValue(property: CardViewModel): string {
        if (!property.value) {
            return property.default;
        } else if (property.format) {
            return moment(property.value).format(property.format);
        }
        return property.value;
    }

}
