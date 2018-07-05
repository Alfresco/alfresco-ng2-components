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

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {
    CardViewTextItemModel,
    CardViewDateItemModel,
    CardViewDatetimeItemModel,
    CardViewBoolItemModel,
    CardViewIntItemModel,
    CardViewFloatItemModel,
    CardViewKeyValuePairsItemModel,
    CardViewSelectItemModel,
    CardViewUpdateService,
    UpdateNotification
} from '@alfresco/adf-core';
import { of } from 'rxjs/observable/of';

@Component({
    templateUrl: './card-view.component.html',
    styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent implements OnInit {

    @ViewChild('console') console: ElementRef;

    properties: any;
    logs: string[];

    constructor(private cardViewUpdateService: CardViewUpdateService) {
        this.logs = [];
        this.properties = [
            new CardViewTextItemModel({
                label: 'CardView Text Item',
                value: 'Spock',
                key: 'name',
                default: 'default bar' ,
                multiline: false,
                icon: 'icon',
                editable: true
            }),
            new CardViewDateItemModel({
                label: 'CardView Date Item',
                value: new Date(),
                key: 'date-of-birth',
                default: new Date(),
                format: 'DD.MM.YYYY',
                editable: true
            }),
            new CardViewDatetimeItemModel({
                label: 'CardView Datetime Item',
                value: new Date(),
                key: 'datetime-of-birth',
                default: new Date(),
                format: 'DD.MM.YYYY',
                editable: true
            }),
            new CardViewBoolItemModel({
                label: 'CardView Boolean Item',
                value: true,
                key: 'vulcanian',
                default: false,
                editable: true
            }),
            new CardViewIntItemModel({
                label: 'CardView Int Item',
                value: 213,
                key: 'intelligence',
                default: 1,
                editable: true
            }),
            new CardViewFloatItemModel({
                label: 'CardView Float Item',
                value: 9.9,
                key: 'mental-stability',
                default: 0.0,
                editable: true
            }),
            new CardViewKeyValuePairsItemModel({
                label: 'CardView Key-Value Pairs Item',
                value: [],
                key: 'key-value-pairs',
                editable: true
            }),
            new CardViewSelectItemModel({
                label: 'CardView Select Item',
                value: 'one',
                options$: of([{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }]),
                key: 'select',
                editable: true
            })
        ];
    }

    ngOnInit() {
        this.cardViewUpdateService.itemUpdated$.subscribe(this.onItemChange.bind(this));
    }

    onItemChange(notification: UpdateNotification) {
        let value = notification.changed[notification.target.key];

        if (notification.target.type === 'keyvaluepairs') {
            value = JSON.stringify(value);
        }

        this.logs.push(`[${notification.target.label}] - ${value}`);
        this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
    }
}
