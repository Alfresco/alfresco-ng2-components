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

import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { CardViewSelectItemOption } from '../../interfaces/card-view.interfaces';
import { MatSelectChange } from '@angular/material/select';
import { BaseCardView } from '../base-card-view';
import { AppConfigService } from '../../../app-config/app-config.service';
import { takeUntil, map } from 'rxjs/operators';

@Component({
    selector: 'adf-card-view-selectitem',
    templateUrl: './card-view-selectitem.component.html',
    styleUrls: ['./card-view-selectitem.component.scss']
})
export class CardViewSelectItemComponent extends BaseCardView<CardViewSelectItemModel<string | number>> implements OnInit, OnChanges, OnDestroy {
    static HIDE_FILTER_LIMIT = 5;

    @Input() editable: boolean = false;

    @Input() options$: Observable<CardViewSelectItemOption<string | number>[]>;

    @Input()
    displayNoneOption: boolean = true;

    @Input()
    displayEmpty: boolean = true;

    value: string | number;
    filter$: BehaviorSubject<string> = new BehaviorSubject('');
    showInputFilter: boolean = false;

    private onDestroy$ = new Subject<void>();

    list$: Observable<CardViewSelectItemOption<string | number>[]> = null;

    constructor(cardViewUpdateService: CardViewUpdateService, private appConfig: AppConfigService) {
        super(cardViewUpdateService);
    }

    ngOnChanges(): void {
        this.value = this.property.value;
    }

    ngOnInit() {
        this.getOptions()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((options: CardViewSelectItemOption<string>[]) => {
                this.showInputFilter = options.length > this.optionsLimit;
            });

        this.list$ = this.getList();
    }

    onFilterInputChange(value: string) {
        this.filter$.next(value.toString());
    }

    isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    getOptions(): Observable<CardViewSelectItemOption<string | number>[]> {
        return this.options$ || this.property.options$;
    }

    getList(): Observable<CardViewSelectItemOption<string | number>[]> {
        return combineLatest([this.getOptions(), this.filter$])
            .pipe(
                map(([items, filter]) => items.filter((item: CardViewSelectItemOption<string>) =>
                    filter ? item.label.toLowerCase().includes(filter.toLowerCase())
                        : true)),
                takeUntil(this.onDestroy$)
            );
    }

    onChange(event: MatSelectChange): void {
        const selectedOption = event.value !== undefined ? event.value : null;
        this.cardViewUpdateService.update({ ...this.property } as CardViewSelectItemModel<string>, selectedOption);
        this.property.value = selectedOption;
    }

    showNoneOption() {
        return this.displayNoneOption;
    }

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private get optionsLimit(): number {
        return this.appConfig.get<number>('content-metadata.selectFilterLimit', CardViewSelectItemComponent.HIDE_FILTER_LIMIT);
    }
}
