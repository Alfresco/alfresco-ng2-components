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

import { Component, Input, ViewChild } from '@angular/core';
import { MdDatepicker } from '@angular/material';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/adf-card-view-update.service';

@Component({
    selector: 'adf-card-view-dateitem',
    templateUrl: './adf-card-view-dateitem.component.html',
    styleUrls: ['./adf-card-view-dateitem.component.scss']
})
export class CardViewDateItemComponent {
    @Input()
    property: CardViewDateItemModel;

    @Input()
    editable: boolean;  @ViewChild(MdDatepicker)
    public datepicker: MdDatepicker<any>;

    constructor(private cardViewUpdateService: CardViewUpdateService) {}

    showDatePicker() {
        this.datepicker.open();
    }

    dateChanged(changed) {
        this.cardViewUpdateService.update(this.property, { [this.property.key]: changed });
    }
}
