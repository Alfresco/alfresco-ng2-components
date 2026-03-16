/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AboutRepositoryInfoComponent, RepositoryInfo, UnitTestingUtils } from '@alfresco/adf-core';

describe('AboutRepositoryInfoComponent', () => {
    let component: AboutRepositoryInfoComponent;
    let fixture: ComponentFixture<AboutRepositoryInfoComponent>;
    let unitTestingUtils: UnitTestingUtils;

    const headerTag = 'H2';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AboutRepositoryInfoComponent]
        });
        fixture = TestBed.createComponent(AboutRepositoryInfoComponent);
        component = fixture.componentInstance;
        unitTestingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    describe('License', () => {
        it('should render license header', () => {
            component.data = {
                status: {},
                license: {
                    holder: 'Some holder'
                }
            } as RepositoryInfo;

            fixture.detectChanges();
            const licenseHeader = unitTestingUtils.getByDataAutomationId('adf-about-repository-info-header-license').nativeElement;
            expect(licenseHeader.innerText).toBe('ABOUT.LICENSE.TITLE');
            expect(licenseHeader.tagName).toBe(headerTag);
        });
    });

    describe('Status', () => {
        it('should render status header', () => {
            component.data = {
                status: {
                    isReadOnly: true
                }
            } as RepositoryInfo;

            fixture.detectChanges();
            const statusHeader = unitTestingUtils.getByDataAutomationId('adf-about-repository-info-header-status').nativeElement;
            expect(statusHeader.innerText).toBe('ABOUT.STATUS.TITLE');
            expect(statusHeader.tagName).toBe(headerTag);
        });
    });

    describe('Modules', () => {
        it('should render modules header', () => {
            component.data = {
                status: {},
                modules: [
                    {
                        title: 'Module 1'
                    }
                ]
            } as RepositoryInfo;

            fixture.detectChanges();
            const modulesHeader = unitTestingUtils.getByDataAutomationId('adf-about-repository-info-header-modules').nativeElement;
            expect(modulesHeader.innerText).toBe('ABOUT.MODULES.TITLE');
            expect(modulesHeader.tagName).toBe(headerTag);
        });
    });
});
