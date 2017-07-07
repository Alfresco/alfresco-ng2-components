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
import { MediaPlayerComponent } from './mediaPlayer.component';
import { DebugElement, SimpleChange }    from '@angular/core';
import { ContentService } from 'ng2-alfresco-core';

import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule
} from 'ng2-alfresco-core';

describe('Test ng2-alfresco-viewer Media player component ', () => {

    let component: MediaPlayerComponent;
    let service: ContentService;
    let fixture: ComponentFixture<MediaPlayerComponent>;
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
            declarations: [MediaPlayerComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService
            ]
        }).compileComponents();
        service = TestBed.get(ContentService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaPlayerComponent);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should thrown an error If no url or no blob are passed', () => {
        let change = new SimpleChange(null, null, true);
        expect(() => {
            component.ngOnChanges({ 'blobFile': change });
        }).toThrow(new Error('Attribute urlFile or blobFile is required'));
    });

    it('should not thrown an error If url is passed', () => {
        component.urlFile = 'fake-url';
        expect(() => {
            component.ngOnChanges(null);
        }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
    });

    it('should not thrown an error If url is passed', () => {
        component.urlFile = 'fake-url';
        expect(() => {
            component.ngOnChanges(null);
        }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
    });

    it('should not thrown an error If blob is passed', () => {
        let blob = createFakeBlob();

        spyOn(service, 'createTrustedUrl').and.returnValue('fake-blob-url');
        let change = new SimpleChange(null, blob, true);
        expect(() => {
            component.ngOnChanges({ 'blobFile': change });
        }).not.toThrow(new Error('Attribute urlFile or blobFile is required'));
        expect(component.urlFile).toEqual('fake-blob-url');
    });
});
