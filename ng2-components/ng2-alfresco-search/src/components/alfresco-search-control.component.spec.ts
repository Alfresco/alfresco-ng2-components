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

import {
    TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';
import { it, describe, expect, inject, setBaseTestProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { AlfrescoSearchControlComponent } from './alfresco-search-control.component';

describe('AlfrescoSearchControlComponent', () => {

    setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

    it('should setup i18n folder', () => {

        let translation = jasmine.createSpyObj('AlfrescoTranslationService', [
            'addTranslationFolder'
        ]);

        let alfrescoSearchControlComponent = new AlfrescoSearchControlComponent(translation);
        expect(alfrescoSearchControlComponent).toBeDefined();

    });

    it('should emit searchChange when search term changed',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(AlfrescoSearchControlComponent).then((componentFixture) => {
                componentFixture.componentInstance.searchTerm = 'customSearchTerm';
                componentFixture.detectChanges();
                componentFixture.componentInstance.searchChange.subscribe(e => {
                    expect(e.value).toBe('customSearchTerm');
                });
            });
        }));

    describe('Component rendering', () => {

        it('should display a text input field by default',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb.createAsync(AlfrescoSearchControlComponent).then((componentFixture) => {
                    const element = componentFixture.nativeElement;
                    expect(element.querySelectorAll('input[type="text"]').length).toBe(1);
                });
        }));

        it('should display a search input field when specified',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb.createAsync(AlfrescoSearchControlComponent).then((componentFixture) => {
                    const element = componentFixture.nativeElement;
                    componentFixture.componentInstance.inputType = 'search';
                    componentFixture.detectChanges();
                    expect(element.querySelectorAll('input[type="search"]').length).toBe(1);
                });
            }));

        it('should set browser autocomplete to off by default',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb.createAsync(AlfrescoSearchControlComponent).then((componentFixture) => {
                    const element = componentFixture.nativeElement;
                    expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete'))
                        .toBe('off');
                });
            }));

        it('should set browser autocomplete to on when configured',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb.createAsync(AlfrescoSearchControlComponent).then((componentFixture) => {
                    const element = componentFixture.nativeElement;
                    componentFixture.componentInstance.autocomplete = true;
                    componentFixture.detectChanges();
                    expect(element.querySelectorAll('input[type="text"]')[0].getAttribute('autocomplete'))
                        .toBe('on');
                });
            }));

        it('should show an expanding control by default',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb.createAsync(AlfrescoSearchControlComponent).then((componentFixture) => {
                    const element = componentFixture.nativeElement;
                    expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(1);
                    expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(1);
                });
            }));

        it('should show a normal non-expanding control when configured',
            inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return tcb.createAsync(AlfrescoSearchControlComponent).then((componentFixture) => {
                    const element = componentFixture.nativeElement;
                    componentFixture.componentInstance.expandable = true;
                    componentFixture.detectChanges();
                    expect(element.querySelectorAll('div.mdl-textfield--expandable').length).toBe(0);
                    expect(element.querySelectorAll('div.mdl-textfield__expandable-holder').length).toBe(0);
                });
            }));
    });
});
