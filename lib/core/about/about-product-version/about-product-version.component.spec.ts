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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { setupTestBed } from '../../testing/setup-test-bed';
import { AboutProductVersionComponent } from './about-product-version.component';
import { DiscoveryApiService } from '../../services/discovery-api.service';
import { AuthenticationService } from '../../services/authentication.service';
import { of } from 'rxjs';
import { aboutAPSMockDetails, mockModules } from '../about.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('AboutProductVersionComponent', () => {
    let fixture: ComponentFixture<AboutProductVersionComponent>;
    let authenticationService: AuthenticationService;
    let discoveryApiService:  DiscoveryApiService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutProductVersionComponent);
        authenticationService = TestBed.inject(AuthenticationService);
        discoveryApiService = TestBed.inject(DiscoveryApiService);
        spyOn(discoveryApiService, 'getEcmProductInfo').and.returnValue(of(mockModules));
        spyOn(authenticationService, 'isBpmLoggedIn').and.returnValue(true);
        spyOn(authenticationService, 'isEcmLoggedIn').and.returnValue(true);
        spyOn(discoveryApiService, 'getBpmProductInfo').and.returnValue(of(aboutAPSMockDetails));
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Should display title', () => {
        const titleElement = fixture.nativeElement.querySelector('[data-automation-id="adf-about-product-version-title"]');
        expect(titleElement === null).toBeFalsy();
        expect(titleElement.innerText).toBe('ABOUT.VERSIONS.TITLE');
    });

    it('should display bpm details', async() => {
        fixture.detectChanges();
        await fixture.whenStable();
        const version = fixture.nativeElement.querySelector('[data-automation-id="adf-about-bpm-version"]');
        expect(version.innerText).toEqual('ABOUT.VERSIONS.LABELS.VERSION: 1.10.0');
    });

    it('should display ecm details', async() => {
        fixture.detectChanges();
        await fixture.whenStable();
        const version = fixture.nativeElement.querySelector('[data-automation-id="adf-about-ecm-version"]');
        expect(version.innerText).toEqual('ABOUT.VERSIONS.LABELS.VERSION: 6.2.0.0');
    });

    it('should display both bpm & ecm details', async() => {
        fixture.detectChanges();
        await fixture.whenStable();
        const bpmVersion = fixture.nativeElement.querySelector('[data-automation-id="adf-about-bpm-version"]');
        const ecmVersion = fixture.nativeElement.querySelector('[data-automation-id="adf-about-ecm-version"]');
        expect(bpmVersion.innerText).toEqual('ABOUT.VERSIONS.LABELS.VERSION: 1.10.0');
        expect(ecmVersion.innerText).toEqual('ABOUT.VERSIONS.LABELS.VERSION: 6.2.0.0');
    });

    it('should display license details', async() => {
        fixture.detectChanges();
        await fixture.whenStable();
        const dataTable =  fixture.nativeElement.querySelector('.adf-datatable');
        const issueAt =  fixture.nativeElement.querySelector('[data-automation-id="text_2018-12-20T12:07:31.276+0000"]');
        const expiresAt =  fixture.nativeElement.querySelector('[data-automation-id="text_2019-05-31T23:00:00.000+0000"]');
        expect(dataTable).not.toBeNull();
        expect(issueAt.innerText).toEqual('2018-12-20T12:07:31.276+0000');
        expect(expiresAt.innerText).toEqual('2019-05-31T23:00:00.000+0000');
    });

    it('should display status details', async() => {
        fixture.detectChanges();
        await fixture.whenStable();
        const dataTable =  fixture.nativeElement.querySelector('.adf-datatable');
        const readOnly =  fixture.nativeElement.querySelector('[data-automation-id="text_false"]');
        const isAuditEnabled =  fixture.nativeElement.querySelector('[data-automation-id="text_true"]');
        expect(dataTable).not.toBeNull();
        expect(readOnly.innerText).toEqual('false');
        expect(isAuditEnabled.innerText).toEqual('true');
    });

    it('should display module details', async() => {
        fixture.detectChanges();
        await fixture.whenStable();
        const dataTable =  fixture.nativeElement.querySelector('.adf-datatable');
        const moduleTitle =  fixture.nativeElement.querySelector('[data-automation-id="text_ABC Repo"]');
        const moduleTitleTwo =  fixture.nativeElement.querySelector('[data-automation-id="text_AOFS Module"]');
        expect(dataTable).not.toBeNull();
        expect(moduleTitle.innerText).toEqual('ABC Repo');
        expect(moduleTitleTwo.innerText).toEqual('AOFS Module');
    });
});
