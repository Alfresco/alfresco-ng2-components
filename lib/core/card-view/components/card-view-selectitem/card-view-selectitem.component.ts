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

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { Observable, Subject } from 'rxjs';
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
export class CardViewSelectItemComponent extends BaseCardView<CardViewSelectItemModel<string>> implements OnChanges, OnDestroy {
    static HIDE_FILTER_LIMIT = 5;

    @Input() editable: boolean = false;

    @Input() options$: Observable<CardViewSelectItemOption<string>[]>;

    @Input()
    displayNoneOption: boolean = true;

    @Input()
    displayEmpty: boolean = true;

    value: string;
    filter: string = '';
    showInputFilter: boolean = false;

    private onDestroy$ = new Subject<void>();

    constructor(cardViewUpdateService: CardViewUpdateService, private appConfig: AppConfigService) {
        super(cardViewUpdateService);
    }

    ngOnChanges(): void {
        this.value = this.property.value?.toString();
    }

    ngOnInit() {
        this.getOptions()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((options: CardViewSelectItemOption<string>[]) => {
                this.showInputFilter = options.length > this.optionsLimit;
            });
    }

    onFilterInputChange(value: string) {
        this.filter = value;
    }

    isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    getOptions(): Observable<CardViewSelectItemOption<string>[]> {
        return this.options$ || this.property.options$;
    }

    getList(): Observable<CardViewSelectItemOption<string>[]> {
        return this.getOptions()
            .pipe(
                map((items: CardViewSelectItemOption<string>[]) => items.filter(
                    (item: CardViewSelectItemOption<string>) =>
                        item.label.toLowerCase().includes(this.filter.toLowerCase()))),
                takeUntil(this.onDestroy$)
            );
    }

    onChange(event: MatSelectChange): void {
        const selectedOption = event.value !== undefined ? event.value : null;
        this.cardViewUpdateService.update(<CardViewSelectItemModel<string>> { ...this.property }, selectedOption);
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
