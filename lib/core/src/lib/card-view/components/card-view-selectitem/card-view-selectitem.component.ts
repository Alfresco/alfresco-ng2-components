/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, OnChanges, OnDestroy, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { CardViewSelectItemOption } from '../../interfaces/card-view.interfaces';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import { BaseCardView } from '../base-card-view';
import { AppConfigService } from '../../../app-config/app-config.service';
import { takeUntil, map } from 'rxjs/operators';

@Component({
    selector: 'adf-card-view-selectitem',
    templateUrl: './card-view-selectitem.component.html',
    styleUrls: ['./card-view-selectitem.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-card-view-selectitem' }
})
export class CardViewSelectItemComponent extends BaseCardView<CardViewSelectItemModel<string | number>> implements OnInit, OnChanges, OnDestroy {
    private appConfig = inject(AppConfigService);
    static HIDE_FILTER_LIMIT = 5;

    @Input() options$: Observable<CardViewSelectItemOption<string | number>[]>;

    @Input()
    displayNoneOption: boolean = true;

    @Input()
    displayEmpty: boolean = true;

    value: string | number;
    filter$ = new BehaviorSubject<string>('');
    showInputFilter: boolean = false;
    list$: Observable<CardViewSelectItemOption<string | number>[]> = null;

    ngOnChanges(): void {
        this.value = this.property.value;
    }

    ngOnInit() {
        this.getOptions()
            .pipe(takeUntil(this.destroy$))
            .subscribe((options) => {
                this.showInputFilter = options.length > this.optionsLimit;
            });

        this.list$ = this.getList();
    }

    onFilterInputChange(value: string) {
        this.filter$.next(value.toString());
    }

    private getOptions(): Observable<CardViewSelectItemOption<string | number>[]> {
        return this.options$ || this.property.options$;
    }

    getList(): Observable<CardViewSelectItemOption<string | number>[]> {
        return combineLatest([this.getOptions(), this.filter$])
            .pipe(
                map(([items, filter]) => items.filter((item) =>
                    filter ? item.label.toLowerCase().includes(filter.toLowerCase())
                        : true)),
                takeUntil(this.destroy$)
            );
    }

    onChange(event: MatSelectChange): void {
        const selectedOption = event.value !== undefined ? event.value : null;
        this.cardViewUpdateService.update({ ...this.property } as CardViewSelectItemModel<string>, selectedOption);
        this.property.value = selectedOption;
    }

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    private get optionsLimit(): number {
        return this.appConfig.get<number>('content-metadata.selectFilterLimit', CardViewSelectItemComponent.HIDE_FILTER_LIMIT);
    }
}
