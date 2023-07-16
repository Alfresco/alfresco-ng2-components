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

import { Component, ViewEncapsulation, ElementRef, ViewChild, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { EMPTY, Observable, Subject, timer } from 'rxjs';
import { debounce, startWith, takeUntil, tap } from 'rxjs/operators';
import { AutocompleteOption } from '../../models/autocomplete-option.interface';

@Component({
    selector: 'adf-search-chip-autocomplete-input',
    templateUrl: './search-chip-autocomplete-input.component.html',
    styleUrls: ['./search-chip-autocomplete-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchChipAutocompleteInputComponent implements OnInit, OnDestroy {
    @ViewChild('optionInput')
    optionInput: ElementRef<HTMLInputElement>;

    @Input()
    autocompleteOptions$: Observable<AutocompleteOption[]>;

    @Input()
    onReset$: Observable<void>;

    @Input()
    allowOnlyPredefinedValues = true;

    @Input()
    placeholder = 'SEARCH.FILTER.ACTIONS.ADD_OPTION';

    @Input()
    compareOption?: (option1: string, option2: string) => boolean;

    @Input()
    formatChipValue?: (option: string) => string;

    @Input()
    filter = (options: AutocompleteOption[], value: string): AutocompleteOption[] => {
        const filterValue = value.toLowerCase();
        return options.filter(option => option.value.toLowerCase().includes(filterValue)).slice(0, 15);
    };

    @Output()
    optionsChanged: EventEmitter<AutocompleteOption[]> = new EventEmitter();

    @Output()
    inputChanged: EventEmitter<string> = new EventEmitter();

    readonly separatorKeysCodes = [ENTER] as const;
    formCtrl = new FormControl('');
    autocompleteOptions: AutocompleteOption[] = [];
    filteredOptions: AutocompleteOption[] = [];
    selectedOptions: AutocompleteOption[] = [];
    tooltipShowDelay = 800;
    private onDestroy$ = new Subject<void>();
    private _activeAnyOption = false;

    set activeAnyOption(active: boolean) {
        this._activeAnyOption = active;
    }

    ngOnInit() {
        this.formCtrl.valueChanges
            .pipe(
                startWith(''),
                tap(() => this.activeAnyOption = false),
                debounce((value: string) => (value ? timer(300) : EMPTY)),
                takeUntil(this.onDestroy$)
            )
            .subscribe((value: string) => {
                this.filteredOptions = value ? this.filter(this.autocompleteOptions, value) : [];
                this.inputChanged.emit(value);
            });
        this.autocompleteOptions$.pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                this.autocompleteOptions = res;
                this.filteredOptions = res.length > 0 ? this.filter(res, this.formCtrl.value) : []
            });
        this.onReset$?.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.reset());
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    add(event: MatChipInputEvent) {
        if (!this._activeAnyOption) {
            let value = (event.value || '').trim();
            if (this.formatChipValue) {
                value = this.formatChipValue(value);
            }

            if (value && this.isExists(value) && !this.isAdded(value)) {
                if (this.allowOnlyPredefinedValues) {
                    const index = this.autocompleteOptions.map(option => option.value.toLowerCase()).indexOf(value.toLowerCase());
                    this.selectedOptions.push(this.autocompleteOptions[index]);
                } else {
                    this.selectedOptions.push({value});
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
        if (!this.isAdded(event.option.value.value)) {
            this.selectedOptions.push(event.option.value);
            this.optionInput.nativeElement.value = '';
            this.formCtrl.setValue('');
            this.optionsChanged.emit(this.selectedOptions);
        }
    }

    private isAdded(value: string): boolean {
        return this.selectedOptions.map(option => option.value.toLowerCase()).includes(value.toLowerCase());
    }

    private isExists(value: string): boolean {
        return this.allowOnlyPredefinedValues
            ? this.autocompleteOptions.map(option => option.value.toLowerCase()).includes(value.toLowerCase())
            : true;
    }

    private reset() {
        this.selectedOptions = [];
        this.optionsChanged.emit(this.selectedOptions);
        this.formCtrl.setValue('');
        this.optionInput.nativeElement.value = '';
    }
}
