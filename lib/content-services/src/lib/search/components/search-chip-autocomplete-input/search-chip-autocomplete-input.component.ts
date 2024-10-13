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

import {
    Component,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { EMPTY, Observable, timer } from 'rxjs';
import { debounce, startWith, tap } from 'rxjs/operators';
import { AutocompleteOption } from '../../models/autocomplete-option.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-search-chip-autocomplete-input',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatChipsModule, TranslateModule, MatIconModule, ReactiveFormsModule, MatAutocompleteModule],
    templateUrl: './search-chip-autocomplete-input.component.html',
    styleUrls: ['./search-chip-autocomplete-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchChipAutocompleteInputComponent implements OnInit, OnChanges {
    @ViewChild('optionInput')
    optionInput: ElementRef<HTMLInputElement>;

    @Input()
    autocompleteOptions: AutocompleteOption[] = [];

    @Input()
    preselectedOptions: AutocompleteOption[] = [];

    @Input()
    onReset$: Observable<void>;

    @Input()
    allowOnlyPredefinedValues = true;

    @Input()
    placeholder = 'SEARCH.FILTER.ACTIONS.ADD_OPTION';

    @Input()
    compareOption?: (option1: AutocompleteOption, option2: AutocompleteOption) => boolean;

    @Input()
    formatChipValue?: (option: string) => string;

    @Input()
    filter = (options: AutocompleteOption[], value: string): AutocompleteOption[] => {
        const filterValue = value.toLowerCase();
        return options.filter((option) => option.value.toLowerCase().includes(filterValue)).slice(0, 15);
    };

    @Output()
    optionsChanged = new EventEmitter<AutocompleteOption[]>();

    @Output()
    inputChanged = new EventEmitter<string>();

    readonly separatorKeysCodes = [ENTER] as const;
    formCtrl = new FormControl('');
    filteredOptions: AutocompleteOption[] = [];
    selectedOptions: AutocompleteOption[] = [];

    private _activeAnyOption = false;

    private readonly destroyRef = inject(DestroyRef);

    set activeAnyOption(active: boolean) {
        this._activeAnyOption = active;
    }

    ngOnInit() {
        this.formCtrl.valueChanges
            .pipe(
                startWith(''),
                tap(() => (this.activeAnyOption = false)),
                debounce((value: string) => (value ? timer(300) : EMPTY)),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((value: string) => {
                this.filteredOptions = value ? this.filter(this.autocompleteOptions, value) : [];
                this.inputChanged.emit(value);
            });
        this.onReset$?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.reset());
        this.selectedOptions = this.preselectedOptions ?? [];
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.autocompleteOptions) {
            this.filteredOptions =
                changes.autocompleteOptions.currentValue?.length > 0
                    ? this.filter(changes.autocompleteOptions.currentValue, this.formCtrl.value)
                    : [];
        }
    }

    add(event: MatChipInputEvent) {
        if (!this._activeAnyOption) {
            let value = (event.value || '').trim();
            if (this.formatChipValue) {
                value = this.formatChipValue(value);
            }

            if (value && this.isExists(value) && !this.isAdded(value)) {
                if (this.allowOnlyPredefinedValues) {
                    const index = this.autocompleteOptions.findIndex((option) => option.value.toLowerCase() === value.toLowerCase());
                    this.selectedOptions.push(this.autocompleteOptions[index]);
                } else {
                    this.selectedOptions.push({ value });
                }
                this.optionsChanged.emit(this.selectedOptions);
                event.chipInput.clear();
                this.formCtrl.setValue('');
            }
        }
    }

    remove(value: AutocompleteOption) {
        const index = this.selectedOptions.indexOf(value);

        if (index >= 0) {
            this.selectedOptions.splice(index, 1);
            this.optionsChanged.emit(this.selectedOptions);
        }
    }

    selected(event: MatAutocompleteSelectedEvent) {
        this.selectedOptions.push(event.option.value);
        this.optionInput.nativeElement.value = '';
        this.formCtrl.setValue('');
        this.optionsChanged.emit(this.selectedOptions);
    }

    /**
     * Determines if a given option is already selected.
     *
     * This method checks if the provided `option` is present in the `selectedOptions` array.
     * If a custom comparison function (`compareOption`) is provided, it uses this function to determine equality.
     * Otherwise, it falls back to using strict equality comparison.
     * @param option - The option to check for selection.
     * @returns `true` if the option is selected, `false` otherwise.
     */
    isOptionSelected(option: AutocompleteOption): boolean {
        const compare = this.compareOption;
        const array = this.selectedOptions;

        return compare ? array.some((arrayValue) => compare(option, arrayValue)) : array.includes(option);
    }

    private isAdded(value: string): boolean {
        const valueLowerCase = value.toLowerCase();
        return this.selectedOptions.some((option) => option.value.toLowerCase() === valueLowerCase);
    }

    private isExists(value: string): boolean {
        const valueLowerCase = value.toLowerCase();
        return this.allowOnlyPredefinedValues ? this.autocompleteOptions.some((option) => option.value.toLowerCase() === valueLowerCase) : true;
    }

    private reset() {
        this.selectedOptions = [];
        this.optionsChanged.emit(this.selectedOptions);
        this.formCtrl.setValue('');
        this.optionInput.nativeElement.value = '';
    }
}
