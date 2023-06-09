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

import { Component, ViewEncapsulation, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

export interface SearchMultiselectChipsOption {
    name: string;
    value: string;
}

@Component({
    selector: 'adf-search-chips-autocomplete-ui',
    templateUrl: './search-chips-autocomplete.ui-component.html',
    styleUrls: ['./search-chips-autocomplete.ui-component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchChipsAutocompleteUiComponent {

    separatorKeysCodes: number[] = [ENTER, COMMA];
    formCtrl = new FormControl('', [Validators.required]);
    filteredOptions$: Observable<string[]>;
    selectedOptions: string[] = [];
    private onDestroy$ = new Subject<void>();

    @ViewChild('optionInput')
    optionInput: ElementRef<HTMLInputElement>;

    @ViewChild("chipList") chipList;

    @Input()
    autocompleteOptions: string[];

    @Input()
    onReset: Observable<void>;

    @Output()
    optionsChanged: EventEmitter<string[]> = new EventEmitter();

    constructor( ) {
        this.filteredOptions$ = this.formCtrl.valueChanges.pipe(
            startWith(null),
            map((value: string | null) => (value ? this._filter(value) : [])),
        );
    }

    ngOnInit() {
        this.onReset?.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.reset());
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    hasValidValue() {
        return !!this.selectedOptions;
    }

    getCurrentValue(){
        return this.selectedOptions;
    }


    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (this.autocompleteOptions.map(fruit => fruit.toLowerCase()).includes(value.toLowerCase()) && !this.isAdded(value)) {
            this.selectedOptions.push(value);
            this.optionsChanged.emit(this.selectedOptions);

            // Clear the input value
            event.chipInput!.clear();

            this.formCtrl.setValue(null);
        }

    }

    private reset() {
        this.selectedOptions = [];
        this.optionsChanged.emit(this.selectedOptions);
        this.formCtrl.setValue(null);
        this.optionInput.nativeElement.value = '';
    }

    private isAdded(value): boolean {
        return this.selectedOptions.includes(value);
    }

    remove(value: string): void {
        const index = this.selectedOptions.indexOf(value);

        if (index >= 0) {
            this.selectedOptions.splice(index, 1);
        }
        this.setError()
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        if(!this.isAdded(event.option.viewValue)){
            this.selectedOptions.push(event.option.viewValue);
            this.optionInput.nativeElement.value = '';
            this.formCtrl.setValue(null);
            this.optionsChanged.emit(this.selectedOptions);
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.autocompleteOptions.filter(option => option.toLowerCase().includes(filterValue)).slice(0, 15);
    }

    getFromValidationMessage(): string {
        return this.formCtrl.hasError('invalidOnChange') ? 'SEARCH.FILTER.VALIDATION.INVALID-DATE' :
            this.formCtrl.hasError('matDatepickerMax') ? 'SEARCH.FILTER.VALIDATION.BEYOND-MAX-DATE' :
                this.formCtrl.hasError('required') ? 'SEARCH.FILTER.VALIDATION.REQUIRED-VALUE' :
                    '';
    }

    setError() {
        this.chipList.errorState = true;
    }

}
