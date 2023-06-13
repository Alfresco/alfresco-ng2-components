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
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

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
    autocompleteOptions: string[] = [];

    @Input()
    onReset$: Observable<void>;

    @Input()
    allowOnlyPredefinedValues = true;

    @Output()
    optionsChanged: EventEmitter<string[]> = new EventEmitter();

    readonly separatorKeysCodes = [ENTER] as const;
    formCtrl = new FormControl('');
    filteredOptions$: Observable<string[]>;
    selectedOptions: string[] = [];
    private onDestroy$ = new Subject<void>();

    constructor() {
        this.filteredOptions$ = this.formCtrl.valueChanges.pipe(
            startWith(null),
            map((value: string | null) => (value ? this.filter(value) : []))
        );
    }

    ngOnInit() {
        this.onReset$?.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.reset());
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    add(event: MatChipInputEvent) {
        const value = (event.value || '').trim();

        if (value && this.isExists(value) && !this.isAdded(value)) {
            this.selectedOptions.push(value);
            this.optionsChanged.emit(this.selectedOptions);
            event.chipInput.clear();
            this.formCtrl.setValue(null);
        }
    }

    remove(value: string) {
        const index = this.selectedOptions.indexOf(value);

        if (index >= 0) {
            this.selectedOptions.splice(index, 1);
            this.optionsChanged.emit(this.selectedOptions);
        }
    }

    selected(event: MatAutocompleteSelectedEvent) {
        if (!this.isAdded(event.option.viewValue)) {
            this.selectedOptions.push(event.option.viewValue);
            this.optionInput.nativeElement.value = '';
            this.formCtrl.setValue(null);
            this.optionsChanged.emit(this.selectedOptions);
        }
    }

    private filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.autocompleteOptions.filter(option => option.toLowerCase().includes(filterValue)).slice(0, 15);
    }

     private isAdded(value: string): boolean {
        return this.selectedOptions.includes(value);
    }

    private isExists(value: string): boolean {
        return this.allowOnlyPredefinedValues
            ? this.autocompleteOptions.map(option => option.toLowerCase()).includes(value.toLowerCase())
            : true;
    }

    private reset() {
        this.selectedOptions = [];
        this.optionsChanged.emit(this.selectedOptions);
        this.formCtrl.setValue(null);
        this.optionInput.nativeElement.value = '';
    }
}
