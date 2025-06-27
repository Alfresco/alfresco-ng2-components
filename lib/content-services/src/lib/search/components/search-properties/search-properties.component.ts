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

import { AfterViewChecked, Component, DestroyRef, ElementRef, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileSizeCondition } from './file-size-condition';
import { FileSizeOperator } from './file-size-operator.enum';
import { FileSizeUnit } from './file-size-unit.enum';
import { ReplaySubject, Subject } from 'rxjs';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchProperties } from './search-properties';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SearchWidget } from '../../models/search-widget.interface';
import { AutocompleteOption } from '../../models/autocomplete-option.interface';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SearchChipAutocompleteInputComponent } from '../search-chip-autocomplete-input';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-search-properties',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe, MatFormFieldModule, MatSelectModule, SearchChipAutocompleteInputComponent],
    templateUrl: './search-properties.component.html',
    styleUrls: ['./search-properties.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchPropertiesComponent implements OnInit, AfterViewChecked, SearchWidget {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    startValue: SearchProperties;
    displayValue$ = new ReplaySubject<string>(1);
    autocompleteOptions: AutocompleteOption[] = [];
    preselectedOptions: AutocompleteOption[] = [];

    private _form = this.formBuilder.nonNullable.group<FileSizeCondition>({
        fileSizeOperator: FileSizeOperator.AT_LEAST,
        fileSize: undefined,
        fileSizeUnit: FileSizeUnit.KB
    });
    private _fileSizeOperators = Object.keys(FileSizeOperator).map<string>((key) => FileSizeOperator[key]);
    private _fileSizeUnits = [FileSizeUnit.KB, FileSizeUnit.MB, FileSizeUnit.GB];
    private canvas = document.createElement('canvas');
    private _fileSizeOperatorsMaxWidth: number;
    private _selectedExtensions: string[];
    private _reset$ = new Subject<void>();
    private sizeField: string;
    private nameField: string;

    @ViewChild('fileSizeOperatorSelect', { read: ElementRef })
    fileSizeOperatorSelectElement: ElementRef;

    get form(): SearchPropertiesComponent['_form'] {
        return this._form;
    }

    get fileSizeOperators(): string[] {
        return this._fileSizeOperators;
    }

    get fileSizeUnits(): FileSizeUnit[] {
        return this._fileSizeUnits;
    }

    get fileSizeOperatorsMaxWidth(): number {
        return this._fileSizeOperatorsMaxWidth;
    }

    get reset$(): Subject<void> {
        return this._reset$;
    }

    get selectedExtensions(): AutocompleteOption[] {
        return this.parseToAutocompleteOptions(this._selectedExtensions);
    }

    set selectedExtensions(extensions: AutocompleteOption[]) {
        this._selectedExtensions = this.parseFromAutocompleteOptions(extensions);
    }

    private readonly destroyRef = inject(DestroyRef);

    constructor(private formBuilder: FormBuilder, private translateService: TranslateService) {}

    ngOnInit() {
        if (this.settings) {
            if (!this.settings.fileExtensions) {
                this.settings.fileExtensions = [];
            }
            this.autocompleteOptions = this.parseToAutocompleteOptions(this.settings.fileExtensions);
            [this.sizeField, this.nameField] = this.settings.field.split(',');
        }
        if (this.startValue) {
            this.setValue(this.startValue);
        }
        this.context.populateFilters
            .asObservable()
            .pipe(
                map((filtersQueries) => filtersQueries[this.id]),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((filterQuery) => {
                if (filterQuery) {
                    filterQuery.fileSizeCondition.fileSizeUnit = this.fileSizeUnits.find(
                        (fileSizeUnit) => fileSizeUnit.bytes === filterQuery.fileSizeCondition.fileSizeUnit.bytes
                    );
                    this.form.patchValue(filterQuery.fileSizeCondition);
                    this.form.updateValueAndValidity();
                    this._selectedExtensions = filterQuery.fileExtensions ?? [];
                    this.preselectedOptions = this.parseToAutocompleteOptions(this._selectedExtensions);
                    this.submitValues(false);
                } else {
                    this.reset(false);
                }
                this.context.filterLoaded.next();
            });
    }

    ngAfterViewChecked() {
        if (this.fileSizeOperatorSelectElement?.nativeElement.clientWidth && !this._fileSizeOperatorsMaxWidth) {
            setTimeout(() => {
                const extraFreeSpace = 20;
                this._fileSizeOperatorsMaxWidth =
                    Math.max(
                        ...this._fileSizeOperators.map((operator) =>
                            this.getOperatorNameWidth(operator, this.getCanvasFont(this.fileSizeOperatorSelectElement.nativeElement))
                        )
                    ) +
                    this.fileSizeOperatorSelectElement.nativeElement.querySelector('.mat-mdc-select-arrow-wrapper').clientWidth +
                    extraFreeSpace;
            });
        }
    }

    narrowDownAllowedCharacters(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (!(event.target as HTMLInputElement).value) {
            return;
        }
        if ((event as InputEvent).data !== ',' && (event as InputEvent).data !== '.') {
            (event.target as HTMLInputElement).value = value.replace(/[^0-9.,]/g, '');
        }
    }

    clearNumberFieldWhenInvalid(event: FocusEvent) {
        if (!(event.target as HTMLInputElement).validity.valid) {
            this.form.controls.fileSize.setValue(undefined);
        }
    }

    preventIncorrectNumberCharacters(event: KeyboardEvent): boolean {
        return event.key !== '-' && event.key !== 'e' && event.key !== '+';
    }

    compareFileExtensions(extension1: AutocompleteOption, extension2: AutocompleteOption): boolean {
        return extension1.value.toUpperCase() === extension2.value.toUpperCase();
    }

    getExtensionWithoutDot(extension: string): string {
        const extensionSplitByDot = extension.split('.');
        return extensionSplitByDot[extensionSplitByDot.length - 1];
    }

    filterExtensions = (extensions: AutocompleteOption[], filterValue: string): AutocompleteOption[] => {
        const filterValueLowerCase = this.getExtensionWithoutDot(filterValue).toLowerCase();
        const extensionWithDot = filterValue.startsWith('.');
        return extensions.filter((option) => {
            const optionLowerCase = option.value.toLowerCase();
            return extensionWithDot && filterValueLowerCase
                ? optionLowerCase.startsWith(filterValueLowerCase)
                : optionLowerCase.includes(filterValue);
        });
    };

    reset(updateContext = true) {
        this.form.reset();
        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            this.context.filterRawParams[this.id] = undefined;
            if (updateContext) {
                this.context.update();
            }
        }
        this.reset$.next();
        this.displayValue$.next('');
    }

    submitValues(updateContext = true) {
        if (this.context?.filterRawParams) {
            this.context.filterRawParams[this.id] = {
                fileExtensions: this._selectedExtensions,
                fileSizeCondition: this.form.value
            };
        }
        if (this.settings && this.context) {
            this.updateSettingsAndContext(updateContext);
        }
    }

    hasValidValue(): boolean {
        return true;
    }

    getCurrentValue(): SearchProperties {
        return {
            fileSizeCondition: this.form.getRawValue(),
            fileExtensions: this._selectedExtensions
        };
    }

    setValue(searchProperties: SearchProperties) {
        this.form.patchValue(searchProperties.fileSizeCondition);
        this.selectedExtensions = this.parseToAutocompleteOptions(searchProperties.fileExtensions ?? []);
        this.submitValues();
    }

    private updateSettingsAndContext(updateContext = true): void {
        let query = '';
        let displayedValue = '';
        if (this.form.value.fileSize !== undefined && this.form.value.fileSize !== null) {
            displayedValue = `${this.translateService.instant(this.form.value.fileSizeOperator)} ${
                this.form.value.fileSize
            } ${this.translateService.instant(this.form.value.fileSizeUnit.abbreviation)}`;
            const size = this.form.value.fileSize * this.form.value.fileSizeUnit.bytes;
            switch (this.form.value.fileSizeOperator) {
                case FileSizeOperator.AT_MOST:
                    query = `${this.sizeField}:[0 TO ${size}]`;
                    break;
                case FileSizeOperator.AT_LEAST:
                    query = `${this.sizeField}:[${size} TO MAX]`;
                    break;
                default:
                    query = `${this.sizeField}:[${size} TO ${size}]`;
            }
        }
        if (this._selectedExtensions?.length) {
            if (query) {
                query += ' AND ';
                displayedValue += ', ';
            }
            query += `${this.nameField}:("*.${this._selectedExtensions.join('" OR "*.')}")`;
            displayedValue += this._selectedExtensions.join(', ');
        }
        this.displayValue$.next(displayedValue);
        this.context.queryFragments[this.id] = query;
        if (updateContext) {
            this.context.update();
        }
    }

    private parseToAutocompleteOptions(array: string[]): AutocompleteOption[] {
        return array.map((value) => ({ value }));
    }

    private parseFromAutocompleteOptions(array: AutocompleteOption[]): string[] {
        return array.flatMap((option) => option.value);
    }

    private getOperatorNameWidth(operator: string, font: string): number {
        const context = this.canvas.getContext('2d');
        context.font = font;
        return context.measureText(this.translateService.instant(operator)).width;
    }

    private getCssStyle(element: HTMLElement, property: string): string {
        return window.getComputedStyle(element, null).getPropertyValue(property);
    }

    private getCanvasFont(el: HTMLElement): string {
        return `${this.getCssStyle(el, 'font-weight')} ${this.getCssStyle(el, 'font-size')} ${this.getCssStyle(el, 'font-family')}`;
    }
}
