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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { setupTestBed } from '../../testing/setupTestBed';
import { AboutGithubLinkComponent } from './about-github-link.component';
import { AppConfigService } from '../../app-config/app-config.service';

describe('AboutGithubLinkComponent', () => {
    let fixture: ComponentFixture<AboutGithubLinkComponent>;
    let component: AboutGithubLinkComponent;
    let appConfigService: AppConfigService;

    const aboutDetails = {
        url: 'https://github.com/componany/repository/commits/',
        version: '0.0.7',
        ecmHost: 'https://mock.ecmhost.com',
        bpmHost: 'https://mock.bpmhost.com',
        appName: 'mock-application-name'
    };

    setupTestBed({
        imports: [CoreTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutGithubLinkComponent);
        component = fixture.componentInstance;
        appConfigService = TestBed.get(AppConfigService);
        appConfigService.config = Object.assign(appConfigService.config, {
            'ecmHost': 'https://mock.ecmhost.com',
            'bpmHost': 'https://mock.bpmhost.com',
            'application': {
                'name': 'mock-application-name'
            }
        });
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Should fetch appName for app.config and display as title', () => {
        const titleElement = fixture.nativeElement.querySelector('[data-automation-id="adf-github-app-title"]');
        expect(titleElement === null).toBeFalsy();
        expect(titleElement.innerText).toBeFalsy();
    });

    it('should display version', async(() => {
        component.version = aboutDetails.version;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const version = fixture.nativeElement.querySelector('[data-automation-id="adf-github-version"]');
            expect(version.innerText).toEqual('ABOUT.VERSION: 0.0.7');
        });
    }));

    it('should display the github link', async(() => {
        component.url = aboutDetails.url;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const githubUrl = fixture.nativeElement.querySelector('[data-automation-id="adf-github-url"]');
            expect(githubUrl.innerText).toEqual(aboutDetails.url);
        });
    }));

    it('should fetch process and content hosts from the app.config.json file', async(() => {
        fixture.whenStable().then(() => {
            expect(component.application).toEqual(aboutDetails.appName);
            expect(component.bpmHost).toEqual(aboutDetails.bpmHost);
            expect(component.ecmHost).toEqual(aboutDetails.ecmHost);
        });
    }));
});
