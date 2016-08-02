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

import {describe, expect, it, inject } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { ViewerComponent } from './viewer.component';
import { EventMock } from './assets/event.mock';

 describe('ViewerComponent', () => {

     describe('View', () => {
         it('shadow overlay should be present if overlay is true', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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

         it('Name File should be present', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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

         /* tslint:disable:max-line-length */
         it('should pick up filename from the fileName property when specified', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let element = fixture.nativeElement;
                     let component = fixture.componentInstance;
                     component.urlFile = 'http://localhost:9876/fake-url-file.pdf';
                     component.fileName = 'My Example.pdf';

                     component.ngOnChanges().then(() => {
                         fixture.detectChanges();
                         expect(element.querySelector('#viewer-name-file').innerHTML).toEqual('My Example.pdf');
                     });
                 });
         }));

         it('Close button should be present if overlay mode', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let element = fixture.nativeElement;
                     let component = fixture.componentInstance;
                     component.urlFile = 'fake-url-file';
                     component.overlayMode = true;

                     fixture.detectChanges();

                     expect(element.querySelector('#viewer-close-button')).not.toBeNull();
                 });
         }));

         it('Close button should be not present if is not overlay mode', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let element = fixture.nativeElement;
                     let component = fixture.componentInstance;
                     component.urlFile = 'fake-url-file';
                     component.overlayMode = false;

                     fixture.detectChanges();

                     expect(element.querySelector('#viewer-close-button')).toBeNull();
                 });
         }));


         it('Click on close button should hide the viewer', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let element = fixture.nativeElement;
                     let component = fixture.componentInstance;
                     component.urlFile = 'fake-url-file';
                     component.overlayMode = true;

                     fixture.detectChanges();
                     element.querySelector('#viewer-close-button').click();
                     fixture.detectChanges();
                     expect(element.querySelector('#viewer-main-container')).toBeNull();
                 });
         }));

         it('Esc button should hide the viewer', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let element = fixture.nativeElement;
                     let component = fixture.componentInstance;
                     component.urlFile = 'fake-url-file';

                     fixture.detectChanges();
                     EventMock.keyDown(27);
                     fixture.detectChanges();
                     expect(element.querySelector('#viewer-main-container')).toBeNull();
                 });
         }));
     });

     describe('Attribute', () => {
         it('Url File should be mandatory', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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

         it('showViewer default value should be true', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let component = fixture.componentInstance;

                     expect(component.showViewer).toBe(true);
                 });
         }));

         it('if showViewer value is false the viewer should be hide', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
         it('if extension file is a pdf the pdf viewer should be loaded', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
         it('if extension file is a image the img viewer should be loaded', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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
         it('if extension file is a not supported the not supported div should be loaded', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
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

     /* tslint:disable:max-line-length */
     describe('MimeType handling', () => {
         it('should display a PDF file identified by mimetype when the filename has no extension', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let component = fixture.componentInstance;
                     let element = fixture.nativeElement;
                     component.urlFile = 'content';
                     component.mimeType = 'application/pdf';

                     component.ngOnChanges().then(() => {
                         fixture.detectChanges();
                         expect(element.querySelector('pdf-viewer')).not.toBeNull();
                     });
                 });
         }));

         it('should display a PDF file identified by mimetype when the file extension is wrong', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let component = fixture.componentInstance;
                     let element = fixture.nativeElement;
                     component.urlFile = 'content.bin';
                     component.mimeType = 'application/pdf';

                     component.ngOnChanges().then(() => {
                         fixture.detectChanges();
                         expect(element.querySelector('pdf-viewer')).not.toBeNull();
                     });
                 });
         }));

         it('should display an image file identified by mimetype when the filename has no extension', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let component = fixture.componentInstance;
                     let element = fixture.nativeElement;
                     component.urlFile = 'content';
                     component.mimeType = 'image/png';

                     component.ngOnChanges().then(() => {
                         fixture.detectChanges();
                         expect(element.querySelector('#viewer-image')).not.toBeNull();
                     });
                 });
         }));

         it('should display a image file identified by mimetype when the file extension is wrong', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
             return tcb
                 .createAsync(ViewerComponent)
                 .then((fixture) => {
                     let component = fixture.componentInstance;
                     let element = fixture.nativeElement;
                     component.urlFile = 'content.bin';
                     component.mimeType = 'image/png';

                     component.ngOnChanges().then(() => {
                         fixture.detectChanges();
                         expect(element.querySelector('#viewer-image')).not.toBeNull();
                     });
                 });
         }));
     });
 });
