/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, OnChanges, OnInit, inject, ViewEncapsulation, SimpleChanges, DestroyRef } from '@angular/core';
import { CardViewSelectItemModel } from '../../models/card-view-selectitem.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { CardViewSelectItemOption } from '../../interfaces/card-view.interfaces';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BaseCardView } from '../base-card-view';
import { AppConfigService } from '../../../app-config/app-config.service';
import { map, debounceTime, filter, first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SelectFilterInputComponent } from './select-filter-input/select-filter-input.component';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-card-view-selectitem',
    imports: [
        CommonModule,
        TranslatePipe,
        MatFormFieldModule,
        MatSelectModule,
        SelectFilterInputComponent,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    templateUrl: './card-view-selectitem.component.html',
    styleUrls: ['./card-view-selectitem.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-card-view-selectitem' }
})
export class CardViewSelectItemComponent extends BaseCardView<CardViewSelectItemModel<string | number>> implements OnInit, OnChanges {
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
    templateType = '';
    autocompleteControl = new UntypedFormControl();
    editedValue: string | number;

    private readonly destroyRef = inject(DestroyRef);

    ngOnChanges(changes: SimpleChanges): void {
        this.value = this.property.value;
        if (changes.property?.firstChange) {
            this.autocompleteControl.valueChanges
                .pipe(
                    filter((textInputValue) => textInputValue !== this.editedValue && textInputValue !== null),
                    debounceTime(50),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe((textInputValue) => {
                    this.editedValue = textInputValue;
                    this.cardViewUpdateService.autocompleteInputValue$.next(textInputValue);
                });
        }

        if (changes.editable) {
            if (this.isEditable) {
                this.autocompleteControl.enable();
            } else {
                this.autocompleteControl.disable();
            }
        }
    }

    ngOnInit() {
        if (this.property.autocompleteBased) {
            this.templateType = 'autocompleteBased';
        }

        this.getOptions()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((options) => {
                this.showInputFilter = options.length > this.optionsLimit;
            });

        this.list$ = this.getList();
        this.autocompleteControl.setValue(this.property.value);
    }

    onFilterInputChange(value: string) {
        this.filter$.next(value.toString());
    }

    private getOptions(): Observable<CardViewSelectItemOption<string | number>[]> {
        return this.options$ || this.property.options$;
    }

    getList(): Observable<CardViewSelectItemOption<string | number>[]> {
        return combineLatest([this.getOptions(), this.filter$]).pipe(
            map(([items, searchTerm]) => items.filter((item) => (filter ? item.label.toLowerCase().includes(searchTerm.toLowerCase()) : true)))
        );
    }

    onOptionSelected(event: MatAutocompleteSelectedEvent) {
        this.getOptions()
            .pipe(first())
            .subscribe((options) => {
                const selectedOption = options.find((option) => option.key === event.option.value);
                if (selectedOption) {
                    this.autocompleteControl.setValue(selectedOption.label);
                    this.cardViewUpdateService.update({ ...this.property } as CardViewSelectItemModel<string>, selectedOption.key);
                }
            });
    }

    onChange(event: MatSelectChange): void {
        const selectedOption = event.value !== undefined ? event.value : null;
        this.cardViewUpdateService.update({ ...this.property } as CardViewSelectItemModel<string>, selectedOption);
        this.property.value = selectedOption;
    }

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    private get optionsLimit(): number {
        return this.appConfig.get<number>('content-metadata.selectFilterLimit', CardViewSelectItemComponent.HIDE_FILTER_LIMIT);
    }
}
