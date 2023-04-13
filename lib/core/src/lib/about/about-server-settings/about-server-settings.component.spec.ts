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
import { AboutServerSettingsComponent } from './about-server-settings.component';
import { AppConfigService } from '../../app-config/app-config.service';
import { aboutGithubDetails } from '../about.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('AboutServerSettingsComponent', () => {
    let fixture: ComponentFixture<AboutServerSettingsComponent>;
    let component: AboutServerSettingsComponent;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutServerSettingsComponent);
        component = fixture.componentInstance;
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config = Object.assign(appConfigService.config, {
            ecmHost: aboutGithubDetails.ecmHost,
            bpmHost: aboutGithubDetails.bpmHost
        });
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should fetch process and content hosts from the app.config.json file', async () => {
        await fixture.whenStable();
        expect(component.bpmHost).toEqual(aboutGithubDetails.bpmHost);
        expect(component.ecmHost).toEqual(aboutGithubDetails.ecmHost);
    });
});
