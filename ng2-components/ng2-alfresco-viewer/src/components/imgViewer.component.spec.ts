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
import { ImgViewerComponent } from './imgViewer.component';
import { DebugElement, SimpleChange }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule,
    ContentService
} from 'ng2-alfresco-core';

describe('Test ng2-alfresco-viewer Img viewer component ', () => {

    let component: ImgViewerComponent;
    let service: ContentService;
    let fixture: ComponentFixture<ImgViewerComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    function createFakeBlob() {
        let data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        return new Blob([data], {type: 'image/png'});
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [ImgViewerComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService
            ]
        }).compileComponents();
        service = TestBed.get(ContentService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImgViewerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('If no url or blob are passed should thrown an error', () => {
        let change = new SimpleChange(null, null, true);
        expect(() => {
            component.ngOnChanges({ 'blobFile': change });
        }).toThrow(new Error('Attribute urlFile or blobFile is required'));
    });

    it('If  url is passed should not thrown an error', () => {
        component.urlFile = 'fake-url';
        expect(() => {
            component.ngOnChanges(null);
        }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
    });

    it('The file Name should be present in the alt attribute', () => {
        component.nameFile = 'fake-name';
        fixture.detectChanges();
        expect(element.querySelector('#viewer-image').getAttribute('alt')).toEqual('fake-name');
    });

    it('If blob is passed should not thrown an error', () => {
        let blob = createFakeBlob();

        spyOn(service, 'createTrustedUrl').and.returnValue('fake-blob-url');
        let change = new SimpleChange(null, blob, true);
        expect(() => {
            component.ngOnChanges({ 'blobFile': change });
        }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
        expect(component.urlFile).toEqual('fake-blob-url');
    });
});
