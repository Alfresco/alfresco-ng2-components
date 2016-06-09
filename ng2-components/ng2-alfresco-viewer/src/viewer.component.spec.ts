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

import { describe, expect, it, injectAsync, TestComponentBuilder } from 'angular2/testing';
import { ViewerComponent } from './viewer.component';

describe('ViewerComponent', () => {

    describe('View', () => {
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

        it('Name File should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    component.urlFile = 'http://localhost:9876/fake-url-file.pdf';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('fake-url-file.pdf');
                    });
                });
        }));

        it('Close button should be present', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    component.urlFile = 'fake-url-file';

                    fixture.detectChanges();

                    expect(element.querySelector('#viewer-close-button')).not.toBeNull();
                });
        }));

        it('Click on close button should hide the viewer', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let element = fixture.nativeElement;
                    let component = fixture.componentInstance;
                    component.urlFile = 'fake-url-file';

                    fixture.detectChanges();
                    element.querySelector('#viewer-close-button').click();
                    fixture.detectChanges();
                    expect(element.querySelector('#viewer-main-container')).toBeNull();
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
                    expect(element.querySelector('#viewer-main-container')).toBeNull();
                });
        }));
    });

    /* tslint:disable:max-line-length */
    describe('Extension Type Test', () => {
        it('if extension file is a pdf the pdf viewer should be loaded', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    let element = fixture.nativeElement;
                    component.urlFile = 'fake-url-file.pdf';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('pdf-viewer')).not.toBeNull();
                    });
                });
        }));

        /* tslint:disable:max-line-length */
        it('if extension file is a image the img viewer should be loaded', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    let element = fixture.nativeElement;
                    component.urlFile = 'fake-url-file.png';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('#viewer-image')).not.toBeNull();
                    });
                });
        }));

        /* tslint:disable:max-line-length */
        it('if extension file is a not supported the not supported div should be loaded', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(ViewerComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    let element = fixture.nativeElement;
                    component.urlFile = 'fake-url-file.unsupported';

                    component.ngOnChanges().then(() => {
                        fixture.detectChanges();
                        expect(element.querySelector('not-supported-format')).not.toBeNull();
                    });
                });
        }));
    });
});
