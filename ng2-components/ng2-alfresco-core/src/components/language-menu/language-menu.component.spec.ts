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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { providers } from '../../../index';
import { MaterialModule } from '../../material.module';
import { AppConfigService } from '../../services/app-config.service';
import { AlfrescoTranslateLoader } from '../../services/translate-loader.service';
import { UserPreferencesService } from '../../services/user-preferences.service';

import { LanguageMenuComponent } from './language-menu.component';

describe('LanguageMenuComponent', () => {

    let fixture: ComponentFixture<LanguageMenuComponent>;
    let component: LanguageMenuComponent;
    let appConfig: AppConfigService;
    let translate: TranslateService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: AlfrescoTranslateLoader
                    }
                })
            ],
            declarations: [
                LanguageMenuComponent
            ],
            providers: [
                ...providers(),
                AppConfigService,
                UserPreferencesService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LanguageMenuComponent);
        component = fixture.componentInstance;
        appConfig = TestBed.get(AppConfigService);
        translate = TestBed.get(TranslateService);
    });

    it('should have the default language', () => {
        fixture.detectChanges();
        expect(component.languages).toEqual([{ key: 'en', label: 'English'}]);
    });

    it('should fetch the languages from the app config if present', () => {
        appConfig.config.languages = [
            {
                key: 'fake-key-1',
                label: 'fake-label-1'
            },
            {
                key: 'fake-key-2',
                label: 'fake-label-2'
            }
        ];

        fixture.detectChanges();
        expect(component.languages).toEqual([
            {
                key: 'fake-key-1',
                label: 'fake-label-1'
            },
            {
                key: 'fake-key-2',
                label: 'fake-label-2'
            }
        ]);
    });
});
