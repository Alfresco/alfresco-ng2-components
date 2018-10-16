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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaPlayerComponent } from './mediaPlayer.component';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { ContentService } from '../../services/content.service';

xdescribe('Test Media player component ', () => {

    let component: MediaPlayerComponent;
    let service: ContentService;
    let fixture: ComponentFixture<MediaPlayerComponent>;

    function createFakeBlob() {
        let data = atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        return new Blob([data], {type: 'image/png'});
    }

    setupTestBed({
        imports: [CoreModule.forRoot()]
    });

    beforeEach(() => {
        service = TestBed.get(ContentService);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaPlayerComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should thrown an error If no url or no blob are passed', () => {
        expect(() => {
            component.ngOnChanges({});
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
