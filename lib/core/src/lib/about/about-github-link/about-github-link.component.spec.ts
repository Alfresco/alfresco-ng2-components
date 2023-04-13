/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { setupTestBed } from '../../testing/setup-test-bed';
import { AboutGithubLinkComponent } from './about-github-link.component';
import { aboutGithubDetails } from '../about.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('AboutGithubLinkComponent', () => {
    let fixture: ComponentFixture<AboutGithubLinkComponent>;
    let component: AboutGithubLinkComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutGithubLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Should fetch appName for app.config and display as title', async () => {
        component.application = 'mock-application-name';
        fixture.detectChanges();
        await fixture.whenStable();
        const titleElement = fixture.nativeElement.querySelector('[data-automation-id="adf-github-app-title"]');
        expect(titleElement === null).toBeFalsy();
        expect(titleElement.innerText).toEqual('mock-application-name');
    });

    it('should display version', async () => {
        component.version = aboutGithubDetails.version;
        fixture.detectChanges();
        await fixture.whenStable();
        const version = fixture.nativeElement.querySelector('[data-automation-id="adf-github-version"]');
        expect(version.innerText).toEqual('ABOUT.VERSION: 0.0.7');
    });

    it('should display adf github link as default if url is not specified', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const githubUrl = fixture.nativeElement.querySelector('[data-automation-id="adf-github-url"]');
        expect(githubUrl.innerText).toEqual(aboutGithubDetails.defualrUrl);
    });

    it('should display the github link', async () => {
        component.url = aboutGithubDetails.url;
        fixture.detectChanges();
        await fixture.whenStable();
        const githubUrl = fixture.nativeElement.querySelector('[data-automation-id="adf-github-url"]');
        expect(githubUrl.innerText).toEqual(aboutGithubDetails.url);
    });
});
