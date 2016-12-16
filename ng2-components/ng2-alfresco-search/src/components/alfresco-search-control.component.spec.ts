/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AlfrescoSearchControlComponent } from './alfresco-search-control.component';
import { AlfrescoSearchAutocompleteComponent } from './alfresco-search-autocomplete.component';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { result } from './../assets/alfresco-search.component.mock';
import {
    AlfrescoSettingsService,
    AlfrescoApiService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService,
    CoreModule
} from 'ng2-alfresco-core';
import { AlfrescoSearchService } from '../services/alfresco-search.service';

describe('AlfrescoSearchControlComponent', () => {

    let fixture: ComponentFixture<AlfrescoSearchControlComponent>;
    let component: AlfrescoSearchControlComponent, element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                AlfrescoSearchControlComponent,
                AlfrescoSearchAutocompleteComponent
            ],
            providers: [
                {provide: AlfrescoTranslationService, useClass: TranslationMock},
                AlfrescoThumbnailService,
                AlfrescoSettingsService,
                AlfrescoApiService,
                AlfrescoAuthenticationService,
                AlfrescoContentService,
                AlfrescoSearchService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(AlfrescoSearchControlComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
        });
    }));

    it('should setup i18n folder', () => {
        let translationService = fixture.debugElement.injector.get(AlfrescoTranslationService);
        spyOn(translationService, 'addTranslationFolder');
        fixture.detectChanges();
        expect(translationService.addTranslationFolder)
            .toHaveBeenCalledWith('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/src');
    });

    it('should emit searchChange when search term input changed', (done) => {
        fixture.componentInstance.searchChange.subscribe(e => {
            expect(e.value).toBe('customSearchTerm');
            done();
        });
        fixture.detectChanges();
        fixture.componentInstance.searchTerm = 'customSearchTerm';
        fixture.detectChanges();
    });

    it('should emit searchChange when search term changed by user', (done) => {
        fixture.detectChanges();
        fixture.componentInstance.searchChange.subscribe(e => {
            expect(e.value).toBe('customSearchTerm211');
            done();
        });
        component.searchControl.setValue('customSearchTerm211', true);
        fixture.detectChanges();
    });

    describe('Component rendering', () => {

        it('should display a text input field by default', () => {
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]').length).toBe(1);
        });

        it('should display a search input field when specified', () => {
            fixture.componentInstance.inputType = 'search';
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        });

        it('should set browser autocomplete to off by default', () => {
            fixture.detectChanges();
            let attr = element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete');
            expect(attr).toBe('off');
        });

        it('should set browser autocomplete to on when configured', () => {
            fixture.componentInstance.autocomplete = true;
            fixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete')).toBe('on');
        });

        it('should show an expanding control by default', () => {
            fixture.detectChanges();
            expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(1);
            expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(1);
            expect(element.querySelectorAll('label.mdl-button--icon').length).toBe(1);
        });

        it('should show a normal non-expanding control when configured', () => {
            fixture.detectChanges();
            fixture.componentInstance.expandable = false;
            fixture.detectChanges();
            expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(0);
            expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(0);
            expect(element.querySelectorAll('label.mdl-button--icon').length).toBe(0);
        });
    });

    describe('Find as you type', () => {

        let inputEl: HTMLInputElement;

        beforeEach(() => {
            inputEl = element.querySelector('input');
        });

        it('should display a find-as-you-type control by default', () => {
            fixture.detectChanges();
            let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete).not.toBeNull();
        });

        it('should make find-as-you-type control hidden initially', () => {
            fixture.detectChanges();
            let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete.classList.contains('active')).toBe(false);
        });

        it('should make find-as-you-type control visible when search box has focus', (done) => {
            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            window.setTimeout(() => { // wait for debounce() to complete
                fixture.detectChanges();
                let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
                expect(autocomplete.classList.contains('active')).toBe(true);
                done();
            }, 100);
        });

        it('should hide find-as-you-type results when the search box loses focus', (done) => {
            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            inputEl.dispatchEvent(new FocusEvent('blur'));
            window.setTimeout(() => {
                fixture.detectChanges();
                let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
                expect(autocomplete.classList.contains('active')).toBe(false);
                done();
            }, 100);
        });

        it('should keep find-as-you-type control visible when user tabs into results', (done) => {
            let searchService = fixture.debugElement.injector.get(AlfrescoSearchService);
            spyOn(searchService, 'getQueryNodesPromise')
                .and.returnValue(Promise.resolve(result));

            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('focus'));
            fixture.detectChanges();
            inputEl.dispatchEvent(new FocusEvent('blur'));
            component.onAutoCompleteFocus(new FocusEvent('focus'));
            window.setTimeout(() => { // wait for debounce() to complete
                fixture.detectChanges();
                let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
                expect(autocomplete.classList.contains('active')).toBe(true);
                done();
            }, 100);
        });

        it('should hide find-as-you-type results when escape key pressed', () => {
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Escape'
            }));
            fixture.detectChanges();
            let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete.classList.contains('active')).toBe(false);
        });

        it('should make find-as-you-type control visible again when down arrow is pressed', () => {
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Escape'
            }));
            inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'ArrowDown'
            }));
            fixture.detectChanges();
            let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete.classList.contains('active')).toBe(true);
        });

        it('should select the first result in find-as-you-type when down arrow is pressed and FAYT is visible', (done) => {
            fixture.detectChanges();
            spyOn(component.liveSearchComponent, 'focusResult');
            fixture.detectChanges();
            inputEl.dispatchEvent(new Event('focus'));
            window.setTimeout(() => { // wait for debounce() to complete
                fixture.detectChanges();
                inputEl.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'ArrowDown'
                }));
                fixture.detectChanges();
                expect(component.liveSearchComponent.focusResult).toHaveBeenCalled();
                done();
            }, 100);
        });

        it('should focus input element when find-as-you-type returns control', () => {
            fixture.detectChanges();
            spyOn(inputEl, 'focus');
            fixture.detectChanges();
            component.onAutoCompleteReturn(new KeyboardEvent('keyup', {
                key: 'ArrowUp'
            }));
            expect(inputEl.focus).toHaveBeenCalled();
        });

        it('should focus input element when find-as-you-type is cancelled', () => {
            fixture.detectChanges();
            spyOn(inputEl, 'focus');
            fixture.detectChanges();
            component.onAutoCompleteCancel(new KeyboardEvent('keyup', {
                key: 'ArrowUp'
            }));
            expect(inputEl.focus).toHaveBeenCalled();
        });

        it('should NOT display a find-as-you-type control when configured not to', () => {
            fixture.componentInstance.liveSearchEnabled = false;
            fixture.detectChanges();
            let autocomplete: Element = element.querySelector('alfresco-search-autocomplete');
            expect(autocomplete).toBeNull();
        });

    });

    describe('search submit', () => {

        it('should fire a search when a term has been entered', () => {
            spyOn(component.searchSubmit, 'emit');
            fixture.detectChanges();
            let formEl: HTMLElement = element.querySelector('form');
            component.searchTerm = 'searchTerm1';
            component.searchControl.setValue('searchTerm1', true);
            fixture.detectChanges();
            formEl.dispatchEvent(new Event('submit'));

            fixture.detectChanges();

            expect(component.searchSubmit.emit).toHaveBeenCalledWith({
                'value': 'searchTerm1'
            });
        });

        it('should not fire a search when no term has been entered', () => {
            spyOn(component.searchSubmit, 'emit');
            fixture.detectChanges();
            let inputEl: HTMLInputElement = <HTMLInputElement> element.querySelector('input[type="text"]');
            let formEl: HTMLElement = element.querySelector('form');
            inputEl.value = '';
            formEl.dispatchEvent(new Event('submit'));

            fixture.detectChanges();

            expect(component.searchSubmit.emit).not.toHaveBeenCalled();
        });

    });

    describe('component focus', () => {

        it('should fire an event when the search box receives focus', (done) => {
            spyOn(component.expand, 'emit');
            let inputEl: HTMLElement = element.querySelector('input');
            inputEl.dispatchEvent(new FocusEvent('focus'));
            window.setTimeout(() => {
                expect(component.expand.emit).toHaveBeenCalledWith({
                    expanded: true
                });
                done();
            }, 100);
        });

        it('should fire an event when the search box loses focus', (done) => {
            spyOn(component.expand, 'emit');
            let inputEl: HTMLElement = element.querySelector('input');
            inputEl.dispatchEvent(new FocusEvent('blur'));
            window.setTimeout(() => {
                expect(component.expand.emit).toHaveBeenCalledWith({
                    expanded: false
                });
                done();
            }, 100);
        });

        it('should NOT fire an event when the search box receives/loses focus but the component is not expandable',
            (done) => {
                spyOn(component.expand, 'emit');
                component.expandable = false;
                let inputEl: HTMLElement = element.querySelector('input');
                inputEl.dispatchEvent(new FocusEvent('focus'));
                inputEl.dispatchEvent(new FocusEvent('blur'));
                window.setTimeout(() => {
                    expect(component.expand.emit).not.toHaveBeenCalled();
                    done();
                }, 100);
            });

    });

    describe('file preview', () => {

        it('should emit a file select event when onFileClicked is called', () => {
            spyOn(component.fileSelect, 'emit');
            component.onFileClicked({
                value: 'node12345'
            });
            expect(component.fileSelect.emit).toHaveBeenCalledWith({
                'value': 'node12345'
            });
        });

        it('should set un-active  the search after file/folder is clicked', () => {
            component.searchActive = true;
            component.onFileClicked({
                value: 'node12345'
            });

            expect(component.searchActive).toBe(false);
        });

        it('should reset the search term after file/folder is clicked', () => {
            component.liveSearchTerm = 'test';
            component.onFileClicked({
                value: 'node12345'
            });

            expect(component.liveSearchTerm).toBe('');
        });
    });
});
