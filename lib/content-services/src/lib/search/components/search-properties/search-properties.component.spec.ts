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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchPropertiesComponent } from './search-properties.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { MatOption } from '@angular/material/core';
import { SearchChipAutocompleteInputComponent, SearchQueryBuilderService } from '@alfresco/adf-content-services';
import { FileSizeUnit } from './file-size-unit.enum';
import { FileSizeOperator } from './file-size-operator.enum';
import { SearchProperties } from './search-properties';

describe('SearchPropertiesComponent', () => {
    let component: SearchPropertiesComponent;
    let fixture: ComponentFixture<SearchPropertiesComponent>;

    const clickFileSizeOperatorsSelect = () => {
        fixture.debugElement.query(By.css('[data-automation-id=adf-search-properties-file-size-operator-select]')).nativeElement.click();
        fixture.detectChanges();
    };

    const clickFileSizeUnitsSelect = () => {
        fixture.debugElement.query(By.css('[data-automation-id=adf-search-properties-file-size-unit-select]')).nativeElement.click();
        fixture.detectChanges();
    };

    const getSelectOptions = () => fixture.debugElement.queryAll(By.directive(MatOption));

    const getFileSizeInput = () => fixture.debugElement.query(By.css('#adf-search-properties-file-size'));

    const typeInFileSizeInput = (value = '321', data = '1'): HTMLInputElement => {
        const fileSizeElement = getFileSizeInput();
        fileSizeElement.nativeElement.value = value;
        const event = new InputEvent('input', {
            data
        });
        spyOnProperty(event, 'target').and.returnValue(fileSizeElement.nativeElement);
        fileSizeElement.triggerEventHandler('input', event);
        fixture.detectChanges();
        return fileSizeElement.nativeElement;
    };

    const getSearchChipAutocompleteInputComponent = (): SearchChipAutocompleteInputComponent => fixture.debugElement.query(
        By.directive(SearchChipAutocompleteInputComponent)
    ).componentInstance;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ SearchPropertiesComponent ],
            imports: [ ContentTestingModule, TranslateModule.forRoot() ]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchPropertiesComponent);
        component = fixture.componentInstance;
    });

    describe('File size', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });

        it('should display correct operators for file size after opening select', () => {
            clickFileSizeOperatorsSelect();

            const options = getSelectOptions();
            expect(options.length).toBe(3);
            expect(options[0].nativeElement.innerText).toBe('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.AT_LEAST');
            expect(options[1].nativeElement.innerText).toBe('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.AT_MOST');
            expect(options[2].nativeElement.innerText).toBe('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.EXACTLY');
        });

        it('should display correct units for file size after opening select', () => {
            clickFileSizeUnitsSelect();

            const options = getSelectOptions();
            expect(options.length).toBe(3);
            expect(options[0].nativeElement.innerText).toBe('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.KB');
            expect(options[1].nativeElement.innerText).toBe('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.MB');
            expect(options[2].nativeElement.innerText).toBe('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.GB');
        });

        it('should allow type digit value in file size input', () => {
            const fileSizeElement = typeInFileSizeInput();
            expect(fileSizeElement.value).toBe('321');
        });

        it('should allow type decimal value in file size input', () => {
            const value = '3.21';
            const fileSizeElement = typeInFileSizeInput(value);
            expect(fileSizeElement.value).toBe(value);
        });

        it('should allow clear value in file size input', () => {
            const value = '';
            const fileSizeElement = typeInFileSizeInput(value);
            expect(fileSizeElement.value).toBe(value);
        });

        it('should not allow type non digit value in file size input', () => {
            const fileSizeElement = typeInFileSizeInput('e');
            expect(fileSizeElement.value).toBe('');
        });

        it('should call preventIncorrectNumberCharacters on keydown event for file size input', () => {
            spyOn(component, 'preventIncorrectNumberCharacters');
            const event = new KeyboardEvent('keydown');
            const fileSizeElement = getFileSizeInput();

            fileSizeElement.triggerEventHandler('keydown', event);
            expect(component.preventIncorrectNumberCharacters).toHaveBeenCalledWith(event);
        });
    });

    describe('File type', () => {
        let searchChipAutocompleteInputComponent: SearchChipAutocompleteInputComponent;

        beforeEach(() => {
            fixture.detectChanges();
            searchChipAutocompleteInputComponent = getSearchChipAutocompleteInputComponent();
        });

        it('should set autocompleteOptions for SearchChipAutocompleteInputComponent from settings', () => {
            component.settings = {
                field: 'field',
                fileExtensions: ['pdf', 'doc', 'txt']
            };
            component.ngOnInit();

            fixture.detectChanges();
            expect(searchChipAutocompleteInputComponent.autocompleteOptions).toEqual([{value: 'pdf'}, {value: 'doc'}, {value: 'txt'}]);
        });

        it('should set onReset$ for SearchChipAutocompleteInputComponent to correct value', () => {
            expect(searchChipAutocompleteInputComponent.onReset$).toBe(component.reset$);
        });

        it('should set allowOnlyPredefinedValues for SearchChipAutocompleteInputComponent to false', () => {
            expect(searchChipAutocompleteInputComponent.allowOnlyPredefinedValues).toBeFalse();
        });

        it('should compare file extensions case insensitive after calling compareOption on SearchChipAutocompleteInputComponent', () => {
            const option1 = {value: 'pdf'};
            const option2 = {value: 'PdF'};
            expect(searchChipAutocompleteInputComponent.compareOption(option1, option2)).toBeTrue();
            expect(searchChipAutocompleteInputComponent.compareOption(option1, {value: `${option2.value}1`})).toBeFalse();
        });

        it('should remove preceding dot after calling formatChipValue on SearchChipAutocompleteInputComponent', () => {
            const extension = 'pdf';
            expect(searchChipAutocompleteInputComponent.formatChipValue(`.${extension}`)).toBe(extension);
            expect(searchChipAutocompleteInputComponent.formatChipValue(extension)).toBe(extension);
        });

        it('should filter file extensions case insensitive without dots after calling filter on SearchChipAutocompleteInputComponent', () => {
            const extensions = [{value: 'pdf'}, {value: 'jpg'}, {value: 'txt'}, {value: 'png'}];
            const searchValue = 'p';

            expect(searchChipAutocompleteInputComponent.filter(extensions, searchValue)).toEqual([{value:'pdf'}, {value:'jpg'}, {value:'png'}]);
            expect(searchChipAutocompleteInputComponent.filter(extensions, `.${searchValue}`)).toEqual([{value:'pdf'}, {value:'png'}]);
        });

        it('should set placeholder for SearchChipAutocompleteInputComponent to correct value', () => {
            expect(searchChipAutocompleteInputComponent.placeholder).toBe('SEARCH.SEARCH_PROPERTIES.FILE_TYPE');
        });
    });

    describe('submitValues', () => {
        const sizeField = 'content.size';
        const nameField = 'cm:name';

        beforeEach(() => {
            component.id = 'properties';
            component.settings = {
                field: `${sizeField},${nameField}`
            };
            component.context = TestBed.inject(SearchQueryBuilderService);
            fixture.detectChanges();
            spyOn(component.displayValue$, 'next');
            spyOn(component.context, 'update');
        });

        it('should not search when settings is not set', () => {
            component.settings = undefined;
            typeInFileSizeInput();

            component.submitValues();
            expect(component.displayValue$.next).not.toHaveBeenCalled();
            expect(component.context.queryFragments[component.id]).toBeUndefined();
            expect(component.context.update).not.toHaveBeenCalled();
        });

        it('should not search when context is not set', () => {
            component.context = undefined;
            typeInFileSizeInput();

            component.submitValues();
            expect(component.displayValue$.next).not.toHaveBeenCalled();
        });

        it('should set empty search when nothing is set', () => {
            component.submitValues();
            expect(component.displayValue$.next).toHaveBeenCalledWith('');
            expect(component.context.queryFragments[component.id]).toBe('');
            expect(component.context.update).toHaveBeenCalled();
        });

        it('should search by at least KB by default when any size is typed', () => {
            typeInFileSizeInput();

            component.submitValues();
            expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.AT_LEAST 321 SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.KB');
            expect(component.context.queryFragments[component.id]).toBe(`${sizeField}:[328704 TO MAX]`);
            expect(component.context.update).toHaveBeenCalled();
        });

        it('should search by at most MB after selecting proper options', () => {
            typeInFileSizeInput();
            clickFileSizeOperatorsSelect();
            getSelectOptions()[1].nativeElement.click();
            fixture.detectChanges();
            clickFileSizeUnitsSelect();
            getSelectOptions()[1].nativeElement.click();
            fixture.detectChanges();

            component.submitValues();
            expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.AT_MOST 321 SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.MB');
            expect(component.context.queryFragments[component.id]).toBe(`${sizeField}:[0 TO 336592896]`);
            expect(component.context.update).toHaveBeenCalled();
        });

        it('should search by exactly GB after selecting proper options', () => {
            typeInFileSizeInput();
            clickFileSizeOperatorsSelect();
            getSelectOptions()[2].nativeElement.click();
            fixture.detectChanges();
            clickFileSizeUnitsSelect();
            getSelectOptions()[2].nativeElement.click();
            fixture.detectChanges();

            component.submitValues();
            expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.EXACTLY 321 SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.GB');
            expect(component.context.queryFragments[component.id]).toBe(`${sizeField}:[344671125504 TO 344671125504]`);
            expect(component.context.update).toHaveBeenCalled();
        });

        it('should search by single file type', () => {
            const extension = {value: 'pdf'};
            getSearchChipAutocompleteInputComponent().optionsChanged.emit([extension]);

            component.submitValues();
            expect(component.displayValue$.next).toHaveBeenCalledWith('pdf');
            expect(component.context.queryFragments[component.id]).toBe(`${nameField}:("*.${extension.value}")`);
            expect(component.context.update).toHaveBeenCalled();
        });

        it('should search by multiple file types', () => {
            getSearchChipAutocompleteInputComponent().optionsChanged.emit([{value:'pdf'}, {value:'txt'}]);

            component.submitValues();
            expect(component.displayValue$.next).toHaveBeenCalledWith('pdf, txt');
            expect(component.context.queryFragments[component.id]).toBe(`${nameField}:("*.pdf" OR "*.txt")`);
            expect(component.context.update).toHaveBeenCalled();
        });

        it('should search by file size and type', () => {
            typeInFileSizeInput();
            getSearchChipAutocompleteInputComponent().optionsChanged.emit([{value:'pdf'}, {value:'txt'}]);

            component.submitValues();
            expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.AT_LEAST 321 SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.KB, pdf, txt');
            expect(component.context.queryFragments[component.id]).toBe(`${sizeField}:[328704 TO MAX] AND ${nameField}:("*.pdf" OR "*.txt")`);
            expect(component.context.update).toHaveBeenCalled();
        });
    });

    describe('hasValidValue', () => {
        it('should return true', () => {
            expect(component.hasValidValue()).toBeTrue();
        });
    });

    describe('getCurrentValue', () => {
        it('should return correct value when nothing changed', () => {
            expect(component.getCurrentValue()).toEqual({
                fileSizeCondition: {
                    fileSize: null,
                    fileSizeUnit: FileSizeUnit.KB,
                    fileSizeOperator: FileSizeOperator.AT_LEAST
                },
                fileExtensions: undefined
            });
        });

        it('should return correct value when inputs changed', () => {
            fixture.detectChanges();
            typeInFileSizeInput();
            clickFileSizeOperatorsSelect();
            getSelectOptions()[1].nativeElement.click();
            fixture.detectChanges();
            clickFileSizeUnitsSelect();
            getSelectOptions()[1].nativeElement.click();
            fixture.detectChanges();
            const extensions = [{value: 'pdf'}, {value: 'txt'}];
            getSearchChipAutocompleteInputComponent().optionsChanged.emit(extensions);

            expect(component.getCurrentValue()).toEqual({
                fileSizeCondition: {
                    fileSize: 321,
                    fileSizeUnit: FileSizeUnit.MB,
                    fileSizeOperator: FileSizeOperator.AT_MOST
                },
                fileExtensions: ['pdf', 'txt']
            });
        });
    });

    describe('reset', () => {
        let searchChipAutocompleteInputComponent: SearchChipAutocompleteInputComponent;

        beforeEach(() => {
            fixture.detectChanges();
            typeInFileSizeInput();
            clickFileSizeOperatorsSelect();
            getSelectOptions()[1].nativeElement.click();
            fixture.detectChanges();
            clickFileSizeUnitsSelect();
            getSelectOptions()[1].nativeElement.click();
            fixture.detectChanges();
            searchChipAutocompleteInputComponent = getSearchChipAutocompleteInputComponent();
            searchChipAutocompleteInputComponent.optionsChanged.emit([{value: 'pdf'}, {value: 'txt'}]);
        });

        it('should reset form', () => {
            spyOn(searchChipAutocompleteInputComponent.optionsChanged, 'emit');

            component.reset();
            fixture.detectChanges();
            expect(component.form.value).toEqual({
                fileSize: null,
                fileSizeUnit: FileSizeUnit.KB,
                fileSizeOperator: FileSizeOperator.AT_LEAST
            });
            expect(searchChipAutocompleteInputComponent.optionsChanged.emit).toHaveBeenCalledWith([]);
        });

        it('should display empty value', () => {
            spyOn(component.displayValue$, 'next');

            component.reset();
            expect(component.displayValue$.next).toHaveBeenCalledWith('');
        });
    });

    describe('setValue', () => {
        let searchProperties: SearchProperties;

        beforeEach(() => {
            searchProperties = {
                fileSizeCondition: {
                    fileSize: 321,
                    fileSizeUnit: FileSizeUnit.MB,
                    fileSizeOperator: FileSizeOperator.AT_MOST
                },
                fileExtensions: ['pdf', 'txt']
            };
        });

        it('should fill form', () => {
            component.setValue(searchProperties);
            expect(component.form.value).toEqual(searchProperties.fileSizeCondition);
        });

        it('should search based on passed value', () => {
            const sizeField = 'content.size';
            const nameField = 'cm:name';
            component.id = 'properties';
            component.settings = {
                field: `${sizeField},${nameField}`
            };
            component.context = TestBed.inject(SearchQueryBuilderService);
            component.ngOnInit();
            spyOn(component.displayValue$, 'next');
            spyOn(component.context, 'update');

            component.setValue(searchProperties);
            expect(component.displayValue$.next).toHaveBeenCalledWith('SEARCH.SEARCH_PROPERTIES.FILE_SIZE_OPERATOR.AT_MOST 321 SEARCH.SEARCH_PROPERTIES.FILE_SIZE_UNIT_ABBREVIATION.MB, pdf, txt');
            expect(component.context.queryFragments[component.id]).toBe(`${sizeField}:[0 TO 336592896] AND ${nameField}:("*.pdf" OR "*.txt")`);
            expect(component.context.update).toHaveBeenCalled();
        });
    });

    describe('preventIncorrectNumberCharacters', () => {
        it('should prevent typing - character', () => {
            expect(component.preventIncorrectNumberCharacters(new KeyboardEvent('keydown', {
                key: '-'
            }))).toBeFalse();
        });

        it('should prevent typing e character', () => {
            expect(component.preventIncorrectNumberCharacters(new KeyboardEvent('keydown', {
                key: 'e'
            }))).toBeFalse();
        });

        it('should prevent typing + character', () => {
            expect(component.preventIncorrectNumberCharacters(new KeyboardEvent('keydown', {
                key: '+'
            }))).toBeFalse();
        });

        it('should allow typing digit', () => {
            expect(component.preventIncorrectNumberCharacters(new KeyboardEvent('keydown', {
                key: '1'
            }))).toBeTrue();
        });
    });
});
