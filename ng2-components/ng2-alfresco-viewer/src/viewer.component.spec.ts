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

import { describe, expect, it, injectAsync, TestComponentBuilder, setBaseTestProviders } from 'angular2/testing';
import { TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS } from 'angular2/platform/testing/browser';
import { ViewerComponent } from './viewer.component';
import { PDFJSmock } from './assets/PDFJS.mock';

describe('Ng2-alfresco-viewer', () => {
    setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

    describe('View', () => {

        it('Canvas should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-the-canvas')).not.toBeNull();
                    expect(element.querySelector('#viewer-canvas-container')).not.toBeNull();
                });
        }));

        it('shadow overlay should be present if overlay is true', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    component.urlFile = 'fake-url-file';
                    component.overlayMode = true;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-shadow-transparent')).not.toBeNull();
                });
        }));

        it('Next an Previous Buttons should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
                    expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
                });
        }));

        it('Input Page elements should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-pagenumber-input')).toBeDefined();
                    expect(element.querySelector('#viewer-total-pages')).toBeDefined();

                    expect(element.querySelector('#viewer-previous-page-button')).not.toBeNull();
                    expect(element.querySelector('#viewer-next-page-button')).not.toBeNull();
                });
        }));

        it('Total number of pages should be showed', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;

                    component.urlFile = 'fake-url-file';
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());

                    component.ngOnChanges().then((resolve) => {
                        expect(element.querySelector('#viewer-total-pages').innerHTML).toEqual('/10');
                        resolve();
                    });
                });
        }));

        it('Name File should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    component.urlFile = 'fake-url-file';

                    fixture.detectChanges();

                    component.ngOnChanges().then((resolve) => {
                        expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('fake-name');
                        resolve();
                    });
                });
        }));

        it('Close button should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    component.urlFile = 'fake-url-file';

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-close-button')).not.toBeNull();
                });
        }));

        it('if showViewer is false the viewer should be hide', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    component.showViewer = false;

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-the-canvas')).toBeNull();
                    expect(element.querySelector('#viewer-canvas-container')).toBeNull();
                });
        }));
    });

    describe('Attribute', () => {
        it('Url File should be mandatory', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.showViewer = true;

                    expect(() => {
                        component.ngOnChanges();
                    }).toThrow();
                });
        }));

        it('showViewer default value should be true', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;

                    expect(component.showViewer).toBe(true);
                });
        }));

        it('if showViewer value is false the viewer should be hide', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    let element = fixture.nativeElement;
                    component.urlFile = 'fake-url-file';
                    component.showViewer = false;

                    fixture.detectChanges();
                    expect(element.querySelector('#viewer-the-canvas')).toBeNull();
                    expect(element.querySelector('#viewer-canvas-container')).toBeNull();
                });
        }));
    });

    describe('User interaction', () => {
        it('Click on close button should hide the viewer', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    spyOn(component, 'getPDFJS').and.returnValue(new PDFJSmock());
                    component.urlFile = 'fake-url-file';

                    fixture.detectChanges();
                    expect(element.querySelector('#viewer-canvas-container')).not.toBeNull();
                    element.querySelector('#viewer-close-button').click();
                    fixture.detectChanges();
                    expect(element.querySelector('#viewer-canvas-container')).toBeNull();

                });
        }));
    });
});
