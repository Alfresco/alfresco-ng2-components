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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AlfrescoSearchControlComponent } from './alfresco-search-control.component';
import { AlfrescoSearchAutocompleteComponent } from './alfresco-search-autocomplete.component';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { TranslationMock } from './../assets/translation.service.mock';
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

    let alfrescoSearchControlComponentFixture: ComponentFixture<AlfrescoSearchControlComponent>;
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
            alfrescoSearchControlComponentFixture = TestBed.createComponent(AlfrescoSearchControlComponent);
            component = alfrescoSearchControlComponentFixture.componentInstance;
            element = alfrescoSearchControlComponentFixture.nativeElement;
        });
    }));

    it('should setup i18n folder', () => {
        let translationService = alfrescoSearchControlComponentFixture.debugElement.injector.get(AlfrescoTranslationService);
        spyOn(translationService, 'addTranslationFolder');
        alfrescoSearchControlComponentFixture.detectChanges();
        expect(translationService.addTranslationFolder)
            .toHaveBeenCalledWith('node_modules/ng2-alfresco-search/dist/src');
    });

    it('should emit searchChange when search term input changed', (done) => {
        alfrescoSearchControlComponentFixture.componentInstance.searchChange.subscribe(e => {
            expect(e.value).toBe('customSearchTerm');
            done();
        });
        alfrescoSearchControlComponentFixture.detectChanges();
        alfrescoSearchControlComponentFixture.componentInstance.searchTerm = 'customSearchTerm';
        alfrescoSearchControlComponentFixture.componentInstance
            .ngOnChanges({'searchTerm': new SimpleChange('', 'customSearchTerm')});
    });

    it('should emit searchChange when search term changed by user', (done) => {
        alfrescoSearchControlComponentFixture.componentInstance.searchChange.subscribe(e => {
            expect(e.value).toBe('customSearchTerm211');
            done();
        });
        alfrescoSearchControlComponentFixture.detectChanges();
        component.searchControl.setValue('customSearchTerm211', true);
    });

    describe('Component rendering', () => {

        it('should display a text input field by default', () => {
            alfrescoSearchControlComponentFixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]').length).toBe(1);
        });

        it('should display a search input field when specified', () => {
            alfrescoSearchControlComponentFixture.componentInstance.inputType = 'search';
            alfrescoSearchControlComponentFixture.detectChanges();
            expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
        });

        it('should set browser autocomplete to off by default', () => {
            alfrescoSearchControlComponentFixture.detectChanges();
            let attr = element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete');
            expect(attr).toBe('off');
        });

        it('should set browser autocomplete to on when configured', () => {
            alfrescoSearchControlComponentFixture.componentInstance.autocomplete = true;
            alfrescoSearchControlComponentFixture.detectChanges();
            expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete')).toBe('on');
        });

        it('should show an expanding control by default', () => {
            alfrescoSearchControlComponentFixture.detectChanges();
            expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(1);
            expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(1);
            expect(element.querySelectorAll('label.mdl-button--icon').length).toBe(1);
        });

        it('should show a normal non-expanding control when configured', () => {
            alfrescoSearchControlComponentFixture.detectChanges();
            alfrescoSearchControlComponentFixture.componentInstance.expandable = false;
            alfrescoSearchControlComponentFixture.detectChanges();
            expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(0);
            expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(0);
            expect(element.querySelectorAll('label.mdl-button--icon').length).toBe(0);
        });
    });

    describe('search submit', () => {

        it('should fire a search when a term has been entered', () => {
            spyOn(component.searchSubmit, 'emit');
            alfrescoSearchControlComponentFixture.detectChanges();
            let formEl: HTMLElement = element.querySelector('form');
            component.searchTerm = 'searchTerm1';
            component.searchControl.setValue('searchTerm1', true);
            alfrescoSearchControlComponentFixture.detectChanges();
            formEl.dispatchEvent(new Event('submit'));

            alfrescoSearchControlComponentFixture.detectChanges();

            expect(component.searchSubmit.emit).toHaveBeenCalledWith({
                'value': 'searchTerm1'
            });
        });

        it('should not fire a search when no term has been entered', () => {
            spyOn(component.searchSubmit, 'emit');
            alfrescoSearchControlComponentFixture.detectChanges();
            let inputEl: HTMLInputElement = <HTMLInputElement> element.querySelector('input[type="text"]');
            let formEl: HTMLElement = element.querySelector('form');
            inputEl.value = '';
            formEl.dispatchEvent(new Event('submit'));

            alfrescoSearchControlComponentFixture.detectChanges();

            expect(component.searchSubmit.emit).not.toHaveBeenCalled();
        });

    });

    describe('component focus', () => {

        it('should fire an event when the search box receives focus', () => {
            spyOn(component.expand, 'emit');
            let inputEl: HTMLElement = element.querySelector('input');
            inputEl.dispatchEvent(new Event('focus'));
            expect(component.expand.emit).toHaveBeenCalledWith({
                expanded: true
            });
        });

        it('should fire an event when the search box loses focus', () => {
            spyOn(component.expand, 'emit');
            let inputEl: HTMLElement = element.querySelector('input');
            inputEl.dispatchEvent(new Event('blur'));
            expect(component.expand.emit).toHaveBeenCalledWith({
                expanded: false
            });
        });

        it('should NOT fire an event when the search box receives/loses focus but the component is not expandable',
            () => {
                spyOn(component.expand, 'emit');
                component.expandable = false;
                let inputEl: HTMLElement = element.querySelector('input');
                inputEl.dispatchEvent(new Event('focus'));
                inputEl.dispatchEvent(new Event('blur'));
                expect(component.expand.emit).not.toHaveBeenCalled();
            });

    });

    describe('file preview', () => {

        it('should emit a preview event when onFileClicked is called', () => {
            spyOn(component.preview, 'emit');
            component.onFileClicked({
                value: 'node12345'
            });
            expect(component.preview.emit).toHaveBeenCalledWith({
                'value': 'node12345'
            });
        });

    });

});
