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

import { describe, expect, it, injectAsync, TestComponentBuilder, setBaseTestProviders, beforeEach } from 'angular2/testing';
import { TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS } from 'angular2/platform/testing/browser';
import { ViewerComponent } from './viewer.component';
import { PDFJSmock } from './assets/PDFJS.mock';

describe('Ng2-alfresco-viewer', () => {
    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    describe('View', () => {

        it('Next an Previous Buttons have to be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    expect(element.querySelector('#viewer-previous-page-button')).toBeDefined();
                    expect(element.querySelector('#viewer-next-page-button')).toBeDefined();
                });
        }));

        it('Input Page elements have to be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
                    expect(element.querySelector('#viewer-total-pages')).toBeDefined();

                    expect(element.querySelector('#viewer-previous-page-page-button-input')).toBeDefined();
                    expect(element.querySelector('#viewer-next-page-page-button-input')).toBeDefined();
                });
        }));

        it('Total number of pages should be showed', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());

                    component.ngOnInit().then((resolve) => {
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-total-pages').innerHTML).toEqual('/10');

                        resolve();
                    });
                });
        }));

        it('Name File should be showed', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());

                    fixture.detectChanges();
                    expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('fake-name');
                });
        }));
    });
});
