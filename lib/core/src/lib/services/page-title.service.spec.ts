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

import { TestBed } from '@angular/core/testing';
import { setupTestBed } from '../testing/setupTestBed';
import { CoreModule } from '../core.module';
import { AppConfigService } from '../app-config/app-config.service';
import { PageTitleService } from './page-title.service';
import { TranslationService } from './translation.service';
import { Title } from '@angular/platform-browser';

describe('AppTitle service', () => {

    let titleService: any;
    let translationService: any;
    let pageTitleService: any;
    let appConfigService: any;
    let titleServiceSpy: any;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        titleService = TestBed.get(Title);
        pageTitleService = TestBed.get(PageTitleService);
        translationService = TestBed.get(TranslationService);
        appConfigService = TestBed.get(AppConfigService);

        titleServiceSpy = spyOn(titleService, 'setTitle').and.callThrough();

        appConfigService.config.application.name = 'My application';
    });

    it('should set default application name', () => {
        appConfigService.config.application = {};
        pageTitleService.setTitle();
        expect(titleServiceSpy).toHaveBeenCalledWith('Alfresco ADF Application');
    });

    it('should set only the application name', () => {
        pageTitleService.setTitle();
        expect(titleServiceSpy).toHaveBeenCalledWith('My application');
    });

    it('should append application name to the title', () => {
        pageTitleService.setTitle('My page');
        expect(titleServiceSpy).toHaveBeenCalledWith('My page - My application');
    });

    it('should update title on language change', () => {
        // cspell: disable-next
        spyOn(translationService, 'instant').and.returnValues('hello', 'привет');

        pageTitleService.setTitle('key');
        expect(titleServiceSpy).toHaveBeenCalledWith('hello - My application');

        (<any> titleService).setTitle.calls.reset();

        translationService.translate.onLangChange.next(<any> {});
        // cspell: disable-next
        expect(titleServiceSpy).toHaveBeenCalledWith('привет - My application');
    });

    it('should update title on new content download', () => {
        // cspell: disable-next
        spyOn(translationService, 'instant').and.returnValues('hello', 'привет');

        pageTitleService.setTitle('key');
        expect(titleServiceSpy).toHaveBeenCalledWith('hello - My application');

        (<any> titleService).setTitle.calls.reset();

        translationService.translate.onTranslationChange.next(<any> {});
        // cspell: disable-next
        expect(titleServiceSpy).toHaveBeenCalledWith('привет - My application');
    });
});
