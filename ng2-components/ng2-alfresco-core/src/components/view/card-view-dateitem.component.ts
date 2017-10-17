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

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import * as moment from 'moment';
import { Moment } from 'moment';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { UserPreferencesService } from '../../services/user-preferences.service';
import { MOMENT_DATE_FORMATS, MomentDateAdapter } from '../../utils/momentDateAdapter';

@Component({
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter},
        {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS}],
    selector: 'adf-card-view-dateitem',
    templateUrl: './card-view-dateitem.component.html',
    styleUrls: ['./card-view-dateitem.component.scss']
})
export class CardViewDateItemComponent implements OnInit {

    public SHOW_FORMAT: string = 'MMM DD YY';

    @Input()
    property: CardViewDateItemModel;

    @Input()
    editable: boolean;

    @ViewChild(MatDatepicker)
    public datepicker: MatDatepicker<any>;

    valueDate: Moment;

    constructor(
        private cardViewUpdateService: CardViewUpdateService,
        private dateAdapter: DateAdapter<Moment>,
        private preferences: UserPreferencesService) {
    }

    ngOnInit() {
        this.preferences.locale$.subscribe( (locale) => {
            this.dateAdapter.setLocale(locale);
        });
        let momentDateAdapter = <MomentDateAdapter> this.dateAdapter;
        momentDateAdapter.overrideDisplyaFormat = this.SHOW_FORMAT;

        if (this.property.value) {
            this.valueDate = moment(this.property.value, this.SHOW_FORMAT);
        }

    }

    isEditable() {
        return this.editable && this.property.editable;
    }

    showDatePicker() {
        this.datepicker.open();
    }

    onDateChanged(newDateValue) {
        if (newDateValue) {
            let momentDate = moment(newDateValue.value, this.SHOW_FORMAT, true);
            if (momentDate.isValid()) {
                this.valueDate = momentDate;
                this.cardViewUpdateService.update(this.property, {[this.property.key]: momentDate.toDate()});
            }
        }
    }

}
