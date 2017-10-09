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

import { AppConfigService } from './app-config.service';
import { PageTitleService } from './page-title.service';

class TestConfig {
    private setup: any = {
        applicationName: undefined
    };

    titleService: Title = null;
    appTitleService: PageTitleService = null;

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
                get: () => this.setup.applicationName
            }
        };

        TestBed.configureTestingModule({
            providers: [
                titleServiceProvider,
                appConfigProvider,
                PageTitleService
            ]
        });

        inject([ Title, PageTitleService ], (titleService, appTitleService) => {
            this.titleService = titleService;
            this.appTitleService = appTitleService;
        })();
    }
}

describe('AppTitle service', () => {
    it('sets default application name', () => {
        const { appTitleService, titleService } = new TestConfig({
            applicationName: undefined
        });

        appTitleService.setTitle();
        expect(titleService.setTitle)
            .toHaveBeenCalledWith('Alfresco ADF Application');
    });

    it('sets only the application name', () => {
        const { appTitleService, titleService } = new TestConfig({
            applicationName: 'My application'
        });

        appTitleService.setTitle();
        expect(titleService.setTitle)
            .toHaveBeenCalledWith('My application');
    });

    it('appends application name to the title', () => {
        const { appTitleService, titleService } = new TestConfig({
            applicationName: 'My application'
        });

        appTitleService.setTitle('My page');
        expect(titleService.setTitle)
            .toHaveBeenCalledWith('My page - My application');
    });
});
