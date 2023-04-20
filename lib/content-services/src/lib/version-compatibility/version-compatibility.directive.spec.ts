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

import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { setupTestBed, CoreTestingModule } from '@alfresco/adf-core';
import { VersionCompatibilityService } from './version-compatibility.service';
import { VersionInfo } from '@alfresco/js-api';
import { VersionCompatibilityModule } from './version-compatibility.module';

@Component({
    template: `
        <div *adf-acs-version="'8'" class="hidden-content-1">
            My hidden content 1
        </div>
        <div *adf-acs-version="'7.1'" class="hidden-content-2">
            My hidden content 2
        </div>
        <div *adf-acs-version="'7.0.2'" class="hidden-content-3">
            My hidden content 3
        </div>
        <div *adf-acs-version="'6.1.5'" class="visible-content-1">
            My visible content 1
        </div>
        <div *adf-acs-version="'6.1'" class="visible-content-2">
            My visible content 2
        </div>
        <div *adf-acs-version="'6'" class="visible-content-3">
            My visible content 3
        </div>
        `
})
class TestComponent { }

describe('VersionCompatibilityDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let versionCompatibilityService: VersionCompatibilityService;

    const acsResponceMock = new VersionInfo({
        display: '7.0.1',
        major: '7',
        minor: '0',
        patch: '1'
    });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            VersionCompatibilityModule
        ],
        declarations: [TestComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        versionCompatibilityService = TestBed.inject(VersionCompatibilityService);
        spyOn(versionCompatibilityService, 'getAcsVersion').and.returnValue(acsResponceMock);
    });

    it('should display component when the version is supported', () => {
        fixture.detectChanges();
        const element1 = fixture.debugElement.query(By.css('[class="visible-content-1"]'));
        const element2 = fixture.debugElement.query(By.css('[class="visible-content-2"]'));
        const element3 = fixture.debugElement.query(By.css('[class="visible-content-3"]'));
        expect(element1).toBeDefined();
        expect(element2).toBeDefined();
        expect(element3).toBeDefined();
    });

    it('should hide component when the version is not supported', () => {
        fixture.detectChanges();
        const element1 = fixture.debugElement.query(By.css('[class="hidden-content-1"]'));
        const element2 = fixture.debugElement.query(By.css('[class="hidden-content-2"]'));
        const element3 = fixture.debugElement.query(By.css('[class="hidden-content-3"]'));
        expect(element1).toBeNull();
        expect(element2).toBeNull();
        expect(element3).toBeNull();
    });
});
