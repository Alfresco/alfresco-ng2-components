/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MediaPlayerComponent } from './media-player.component';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService } from '../../services';
import { NodeEntry } from '@alfresco/js-api';

describe('Test Media player component ', () => {

    let component: MediaPlayerComponent;
    let fixture: ComponentFixture<MediaPlayerComponent>;
    let alfrescoApiService: AlfrescoApiService;
    let change: SimpleChanges;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    describe('Media tracks', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(MediaPlayerComponent);
            alfrescoApiService = TestBed.inject(AlfrescoApiService);
            change = { nodeId: new SimpleChange(null, 'nodeId', true) };

            component = fixture.componentInstance;
            component.urlFile = 'http://fake.url';
            fixture.detectChanges();
        });

        it('should generate tracks for media file when webvtt rendition exists', fakeAsync(() => {
            const fakeRenditionUrl = 'http://fake.rendition.url';
            spyOn(alfrescoApiService.nodesApi, 'getNode').and.returnValues(
                Promise.resolve(new NodeEntry({ entry: { name: 'file1', content: {} } }))
            );
            spyOn(alfrescoApiService.renditionsApi, 'getRenditions').and.returnValues(
                { list: { entries: [{ entry: { id: 'webvtt', status: 'CREATED' } }] } }
            );
            spyOn(alfrescoApiService.contentApi, 'getContentUrl').and.returnValues('http://iam-fake.url');
            spyOn(alfrescoApiService.contentApi, 'getRenditionUrl').and.returnValue(fakeRenditionUrl);

            component.ngOnChanges(change);
            tick();
            fixture.detectChanges();
            expect(component.tracks).toEqual([{ src: fakeRenditionUrl, kind: 'subtitles', label: 'ADF_VIEWER.SUBTITLES' }]);
        }));

        it('should not generate tracks for media file when webvtt rendition is not created', fakeAsync(() => {
            spyOn(alfrescoApiService.nodesApi, 'getNode').and.returnValues(
                Promise.resolve(new NodeEntry({ entry: { name: 'file1', content: {} } }))
            );

            spyOn(alfrescoApiService.renditionsApi, 'getRenditions').and.returnValues(
                { list: { entries: [{ entry: { id: 'webvtt', status: 'NOT_CREATED' } }] } }
            );

            spyOn(alfrescoApiService.contentApi, 'getContentUrl').and.returnValues('http://iam-fake.url');

            component.ngOnChanges(change);
            tick();
            fixture.detectChanges();
            expect(component.tracks.length).toBe(0);
        }));

        it('should not generate tracks for media file when webvtt rendition does not exist', fakeAsync(() => {
            spyOn(alfrescoApiService.nodesApi, 'getNode').and.returnValues(
                Promise.resolve(new NodeEntry({ entry: { name: 'file1', content: {} } }))
            );

            spyOn(alfrescoApiService.renditionsApi, 'getRenditions').and.returnValues(
                { list: { entries: [] } }
            );

            spyOn(alfrescoApiService.contentApi, 'getContentUrl').and.returnValues('http://iam-fake.url');

            component.ngOnChanges(change);
            tick();
            fixture.detectChanges();
            expect(component.tracks.length).toBe(0);
        }));
    });
});
