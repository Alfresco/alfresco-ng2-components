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

import { inject, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';

import { AppConfigService } from '../app-config/app-config.service';
import { PageTitleService } from './page-title.service';
import { CoreTestingModule } from '../testing/core.testing.module';
import { TranslationService } from './translation.service';
import { TranslationMock } from '../mock/translation.service.mock';

class TestConfig {
    private setup: any = {
        applicationName: undefined
    };

    titleService: Title = null;
    appTitleService: PageTitleService = null;
    translationService: TranslationService;

    constructor(setup: any = {}) {
        Object.assign(this.setup, setup);

        const titleServiceProvider = {
            provide: Title,
            useValue: {
                setTitle: jasmine.createSpy('setTitleSpy')
            }
        };

        const appConfigProvider = {
            provide: AppConfigService,
            useValue: {
                config: {
                    application: {
                        name: this.setup.applicationName
                    }
                },
                get: () => this.setup.applicationName,
                load: () => {}
            }
        };

        TestBed.configureTestingModule({
            imports: [
                CoreTestingModule
            ],
            providers: [
                titleServiceProvider,
                appConfigProvider,
                PageTitleService,
                {
                    provide: TranslationService,
                    useClass: TranslationMock
                }
            ]
        });

        inject([ Title, PageTitleService, TranslationService ], (titleService, appTitleService, translationService) => {
            this.titleService = titleService;
            this.appTitleService = appTitleService;
            this.translationService = translationService;
        })();
    }
}

describe('AppTitle service', () => {
    it('should set default application name', () => {
        const { appTitleService, titleService } = new TestConfig({
            applicationName: undefined
        });

        appTitleService.setTitle();
        expect(titleService.setTitle).toHaveBeenCalledWith('Alfresco ADF Application');
    });

    it('should set only the application name', () => {
        const { appTitleService, titleService } = new TestConfig({
            applicationName: 'My application'
        });

        appTitleService.setTitle();
        expect(titleService.setTitle).toHaveBeenCalledWith('My application');
    });

    it('should append application name to the title', () => {
        const { appTitleService, titleService } = new TestConfig({
            applicationName: 'My application'
        });

        appTitleService.setTitle('My page');
        expect(titleService.setTitle).toHaveBeenCalledWith('My page - My application');
    });

    it('should update title on language change', () => {
        const { appTitleService, titleService, translationService } = new TestConfig({
            applicationName: 'My application'
        });

        spyOn(translationService, 'instant').and.returnValues('hello', 'привет');

        appTitleService.setTitle('key');
        expect(titleService.setTitle).toHaveBeenCalledWith('hello - My application');

        (<any>titleService).setTitle.calls.reset();

        translationService.translate.onLangChange.next(<any> {});
        expect(titleService.setTitle).toHaveBeenCalledWith('привет - My application');
    });
});
