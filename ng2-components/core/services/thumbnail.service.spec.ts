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

import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CookieServiceMock } from './../mock/cookie.service.mock';
import { AlfrescoApiService } from './alfresco-api.service';
import { ContentService } from './content.service';
import { SettingsService } from './settings.service';
import { AppConfigService } from './app-config.service';
import { AuthenticationService } from './authentication.service';
import { CookieService } from './cookie.service';
import { LogService } from './log.service';
import { StorageService } from './storage.service';
import { ThumbnailService } from './thumbnail.service';
import { TranslateLoaderService } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';

describe('ThumbnailService', () => {

    let service: ThumbnailService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: TranslateLoaderService
                    }
                })
            ],
            providers: [
                UserPreferencesService,
                AuthenticationService,
                ContentService,
                SettingsService,
                AppConfigService,
                { provide: CookieService, useClass: CookieServiceMock },
                ThumbnailService,
                AlfrescoApiService,
                SettingsService,
                StorageService,
                LogService,
                MatIconRegistry
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        service = TestBed.get(ThumbnailService);
    });

    it('should return the correct icon for a plain text file', () => {
        expect(service.getMimeTypeIcon('text/plain')).toContain('ft_ic_document');
    });

    it('should return the correct icon for a PNG file', () => {
        expect(service.getMimeTypeIcon('image/png')).toContain('ft_ic_raster_image');
    });

    it('should return the correct icon for a MP4 video file', () => {
        expect(service.getMimeTypeIcon('video/mp4')).toContain('ft_ic_video');
    });

    it('should return a generic icon for an unknown file', () => {
        expect(service.getMimeTypeIcon('x-unknown/yyy')).toContain('ft_ic_miscellaneous');
    });

    it('should return the thumbnail URL for a content item', () => {
        spyOn(service.contentService, 'getDocumentThumbnailUrl').and.returnValue('/fake-thumbnail.png');
        expect(service.getDocumentThumbnailUrl({})).toContain('/fake-thumbnail.png');
    });

});
