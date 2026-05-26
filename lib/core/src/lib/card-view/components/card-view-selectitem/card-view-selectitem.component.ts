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
import { map, debounceTime, filter, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SelectFilterInputComponent } from './select-filter-input/select-filter-input.component';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardViewPropertyValidatorDirective } from '../../directives/card-view-property-validator.directive';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { IconModule } from '../../../icon/icon.module';

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
        ReactiveFormsModule,
        CardViewPropertyValidatorDirective,
        FormsModule,
        MatChipsModule,
        IconModule
    ],
    templateUrl: './card-view-selectitem.component.html',
    styleUrls: ['./card-view-selectitem.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-card-view-selectitem' }
})
export class CardViewSelectItemComponent extends BaseCardView<CardViewSelectItemModel<string | number>> implements OnInit, OnChanges {
    static HIDE_FILTER_LIMIT = 5;
    readonly separatorKeysCodes = [ENTER] as const;

    @Input() options$: Observable<CardViewSelectItemOption<string | number>[]>;

    @Input()
    displayNoneOption: boolean = true;

    @Input()
    displayEmpty: boolean = true;

    filter$ = new BehaviorSubject<string>('');
    showInputFilter: boolean = false;
    list$: Observable<CardViewSelectItemOption<string | number>[]> = null;
    templateType = '';
    autocompleteControl = new UntypedFormControl();
    editedValue = '';
    filteredOptions: CardViewSelectItemOption<string | number>[] = [];

    private readonly destroyRef = inject(DestroyRef);
    private readonly appConfig = inject(AppConfigService);

    private _error = '';

    get error(): string {
        return this._error;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.property.value && this.property.multivalued) {
            this.property.value = [];
        }

        if (changes.property?.firstChange && this.property.autocompleteBased) {
            this.autocompleteControl.valueChanges
                .pipe(
                    filter((textInputValue) => textInputValue !== this.editedValue && textInputValue !== null && !Array.isArray(textInputValue)),
                    debounceTime(50),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe((textInputValue) => {
                    this.editedValue = textInputValue;
                    this.cardViewUpdateService.autocompleteInputValue$.next(textInputValue);
                    this.filterOptions();
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

        if (this.property.autocompleteBased) {
            this.autocompleteControl.setValue(this.property.value);
        }
    }

    onFilterInputChange(value: string) {
        this.filter$.next(value);
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
        const selectedOption = this.filteredOptions.find((option) => option.key === event.option.value);
        if (selectedOption) {
            if (this.property.multivalued) {
                this.property.value.push(event.option.value);
            } else {
                this.property.value = event.option.value;
                this.autocompleteControl.setValue(selectedOption.label);
            }
            this.cardViewUpdateService.update(this.property, this.property.value);
            this.filterOptions();
        }
    }

    onChange(event: MatSelectChange): void {
        const selectedOptions = event.value !== undefined ? event.value : null;
        this.cardViewUpdateService.update(this.property, selectedOptions);
        this.property.value = selectedOptions;
    }

    onValidation(errors: string[]): void {
        this._error = errors.join('<br>');
    }

    removeChip(value: string | number) {
        this.property.value = this.property.value.filter((v) => v !== value);
        this.cardViewUpdateService.update(this.property, this.property.value);
        this.filterOptions();
    }

    addValueToList(newListItem: MatChipInputEvent) {
        const selectedOption = this.filteredOptions.find((option) => option.key === newListItem.value || option.label === newListItem.value);
        if (selectedOption) {
            this.property.value.push(selectedOption.key);
            this.cardViewUpdateService.update(this.property, this.property.value);
            newListItem.chipInput.clear();
            this.filterOptions();
        }
    }

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    getOptionLabel(value: string | number): Observable<string> {
        return this.getOptions().pipe(
            take(1),
            map((options) => options.find((option) => option.key === value)?.label)
        );
    }

    private get optionsLimit(): number {
        return this.appConfig.get<number>('content-metadata.selectFilterLimit', CardViewSelectItemComponent.HIDE_FILTER_LIMIT);
    }

    private filterOptions() {
        if (!this.property.autocompleteBased) {
            return;
        }

        this.getOptions()
            .pipe(
                map((options) => {
                    const filterValue = String(this.editedValue ?? '').toLowerCase();
                    return options.filter((option) => {
                        const isSelected = this.property.multivalued
                            ? this.property.value.some((val) => val === option.key)
                            : this.property.value === option.key;
                        return !isSelected && option.label.toLowerCase().includes(filterValue);
                    });
                })
            )
            .pipe(take(1))
            .subscribe((options: CardViewSelectItemOption<string | number>[]) => {
                this.filteredOptions = options;
            });
    }
}
