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

import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
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
    CardViewMapItemModel,
    UpdateNotification,
    DecimalNumberPipe,
    CardViewArrayItemModel
} from '@alfresco/adf-core';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './card-view.component.html',
    styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent implements OnInit, OnDestroy {

    @ViewChild('console') console: ElementRef;

    isEditable = true;
    properties: any;
    logs: string[];
    showClearDateAction = false;
    showNoneOption = false;

    private onDestroy$ = new Subject<boolean>();

    constructor(private cardViewUpdateService: CardViewUpdateService,
                private decimalNumberPipe: DecimalNumberPipe) {
        this.logs = [];
        this.createCard();
    }

    respondToCardClick() {
        this.logs.push(`clickable field`);
    }

    ngOnInit() {
        this.cardViewUpdateService.itemUpdated$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(this.onItemChange.bind(this));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    createCard() {
        this.properties = [
            new CardViewTextItemModel({
                label: 'CardView Text Item',
                value: 'Spock',
                key: 'name',
                default: 'default bar',
                multiline: false,
                icon: 'icon',
                editable: this.isEditable
            }),
            new CardViewDateItemModel({
                label: 'CardView Date Item',
                value: new Date(1983, 11, 24, 10, 0, 30),
                key: 'date',
                default: new Date(1983, 11, 24, 10, 0, 30),
                format: 'shortDate',
                editable: this.isEditable
            }),
            new CardViewDatetimeItemModel({
                label: 'CardView Datetime Item',
                value: new Date(1983, 11, 24, 10, 0, 0),
                key: 'datetime',
                default: new Date(1983, 11, 24, 10, 0, 0),
                format: 'short',
                editable: this.isEditable
            }),
            new CardViewBoolItemModel({
                label: 'CardView Boolean Item',
                value: true,
                key: 'boolean',
                default: false,
                editable: this.isEditable
            }),
            new CardViewIntItemModel({
                label: 'CardView Int Item',
                value: 213,
                key: 'int',
                default: 1,
                editable: this.isEditable
            }),
            new CardViewFloatItemModel({
                label: 'CardView Float Item',
                value: 9.9,
                key: 'float',
                default: 0.0,
                editable: this.isEditable,
                pipes: [{ pipe: this.decimalNumberPipe}]
            }),
            new CardViewKeyValuePairsItemModel({
                label: 'CardView Key-Value Pairs Item',
                value: [],
                key: 'key-value-pairs',
                editable: this.isEditable
            }),
            new CardViewSelectItemModel({
                label: 'CardView Select Item',
                value: 'one',
                options$: of([{ key: 'one', label: 'One' }, { key: 'two', label: 'Two' }]),
                key: 'select',
                editable: this.isEditable
            }),
            new CardViewMapItemModel({
                label: 'My map',
                value: new Map([['999', 'My Value']]),
                key: 'map',
                default: 'default map value'
            }),
            new CardViewTextItemModel({
                label: 'This is clickable ',
                value: 'click here',
                key: 'click',
                default: 'click here',
                editable: this.isEditable,
                clickable: true,
                clickCallBack: () => {
                    this.respondToCardClick();
                }
            }),
            new CardViewArrayItemModel({
                label: 'CardView Array of items',
                value: of([
                    { icon: 'directions_bike', value: 'Zlatan' },
                    { icon: 'directions_bike', value: 'Lionel Messi'},
                    { value: 'Mohamed', directions_bike: 'save'},
                    { value: 'Ronaldo'}
                ]),
                key: 'array',
                icon: 'edit',
                default: 'Empty',
                noOfItemsToDisplay: 2
            })
        ];
    }

    onItemChange(notification: UpdateNotification) {
        let value = notification.changed[notification.target.key];

        if (notification.target.type === 'keyvaluepairs') {
            value = JSON.stringify(value);
        }

        this.logs.push(`[${notification.target.label}] - ${value}`);
        this.console.nativeElement.scrollTop = this.console.nativeElement.scrollHeight;
    }

    toggleEditable() {
        this.isEditable = !this.isEditable;
        this.createCard();
    }

    toggleClearDate() {
        this.showClearDateAction = !this.showClearDateAction;
    }

    toggleNoneOption() {
        this.showNoneOption = !this.showNoneOption;
    }

    reset() {
        this.isEditable = true;
        this.createCard();
        this.logs = [];
    }
}
