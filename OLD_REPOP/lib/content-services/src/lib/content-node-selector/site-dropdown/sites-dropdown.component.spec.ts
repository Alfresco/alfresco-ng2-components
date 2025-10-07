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
import { DropdownSitesComponent, Relations } from './sites-dropdown.component';
import { AuthenticationService } from '@alfresco/adf-core';
import { of } from 'rxjs';
import {
    getFakeSitePaging,
    getFakeSitePagingNoMoreItems,
    getFakeSitePagingFirstPage,
    getFakeSitePagingLastPage,
    getFakeSitePagingWithMembers
} from '../../mock';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { SitesService } from '../../common/services/sites.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { SiteEntry } from '@alfresco/js-api';

const customSiteList = {
    list: {
        entries: [
            {
                entry: {
                    guid: '-my-',
                    title: 'PERSONAL_FILES'
                }
            },
            {
                entry: {
                    guid: '-mysites-',
                    title: 'FILE_LIBRARIES'
                }
            }
        ]
    }
};

describe('DropdownSitesComponent', () => {
    let loader: HarnessLoader;
    let component: DropdownSitesComponent;
    let fixture: ComponentFixture<DropdownSitesComponent>;
    let element: HTMLElement;
    let siteService: SitesService;
    let authService: AuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering tests', () => {
        describe('Infinite Loading', () => {
            beforeEach(() => {
                siteService = TestBed.inject(SitesService);
                fixture = TestBed.createComponent(DropdownSitesComponent);
                element = fixture.nativeElement;
                component = fixture.componentInstance;
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePaging()));
                loader = TestbedHarnessEnvironment.loader(fixture);
            });

            it('Should show loading item if there are more items', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(element.querySelector('[data-automation-id="site-loading"]')).toBeDefined();
            });

            it('Should not show loading item if there are more items', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                fixture.detectChanges();
                expect(element.querySelector('[data-automation-id="site-loading"]')).toBeNull();
            });
        });

        describe('Sites', () => {
            beforeEach(() => {
                siteService = TestBed.inject(SitesService);
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePagingNoMoreItems()));

                fixture = TestBed.createComponent(DropdownSitesComponent);
                element = fixture.nativeElement;
                component = fixture.componentInstance;
                loader = TestbedHarnessEnvironment.loader(fixture);
            });

            it('Dropdown sites should be rendered', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(element.querySelector('#site-dropdown-container')).toBeDefined();
                expect(element.querySelector('#site-dropdown')).toBeDefined();
                expect(element.querySelector('#site-dropdown-container')).not.toBeNull();
                expect(element.querySelector('#site-dropdown')).not.toBeNull();
            });

            it('should show the "My files" option by default', async () => {
                component.hideMyFiles = false;

                fixture.detectChanges();
                await fixture.whenStable();

                const select = await loader.getHarness(MatSelectHarness);
                await select.open();

                const options = await select.getOptions();
                expect(await options[0].getText()).toContain('DROPDOWN.MY_FILES_OPTION');
            });

            it('should hide the "My files" option if the developer desires that way', async () => {
                component.hideMyFiles = true;

                fixture.detectChanges();
                await fixture.whenStable();

                const select = await loader.getHarness(MatSelectHarness);
                await select.open();

                const options = await select.getOptions();
                expect(await options[0].getText()).not.toContain('DROPDOWN.MY_FILES_OPTION');
            });

            it('should show the default placeholder label by default', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const select = await loader.getHarness(MatSelectHarness);
                await select.open();

                expect(fixture.nativeElement.innerText.trim()).toContain('NODE_SELECTOR.LOCATION');
            });

            it('should show custom placeholder label when the "placeholder" input property is given a value', async () => {
                component.placeholder = 'NODE_SELECTOR.SELECT_LIBRARY';

                fixture.detectChanges();
                await fixture.whenStable();

                const select = await loader.getHarness(MatSelectHarness);
                await select.open();

                expect(fixture.nativeElement.innerText.trim()).toContain('NODE_SELECTOR.LOCATION');
            });

            it('should load custom sites when the "siteList" input property is given a value', async () => {
                component.siteList = customSiteList as any;

                fixture.detectChanges();
                await fixture.whenStable();

                const select = await loader.getHarness(MatSelectHarness);
                await select.open();

                const options = await select.getOptions();

                expect(await options[0].getText()).toContain('PERSONAL_FILES');
                expect(await options[1].getText()).toContain('FILE_LIBRARIES');
            });

            it('should load sites by default', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const select = await loader.getHarness(MatSelectHarness);
                await select.open();

                const options = await select.getOptions();

                expect(await options[1].getText()).toContain('fake-test-site');
                expect(await options[2].getText()).toContain('fake-test-2');
            });

            it('should raise an event when a site is selected', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                let site: SiteEntry;
                component.change.subscribe((value) => (site = value));

                const select = await loader.getHarness(MatSelectHarness);
                await select.open();

                const options = await select.getOptions();
                await options[1].click();

                expect(site.entry.guid).toBe('fake-1');
            });

            it('should be possible to select the default value', async () => {
                component.value = 'swsdp';

                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.selected.entry.title).toBe('fake-test-2');
            });
        });

        describe('Default value', () => {
            beforeEach(() => {
                siteService = TestBed.inject(SitesService);
                spyOn(siteService, 'getSites').and.returnValues(of(getFakeSitePagingFirstPage()), of(getFakeSitePagingLastPage()));

                fixture = TestBed.createComponent(DropdownSitesComponent);
                component = fixture.componentInstance;
                loader = TestbedHarnessEnvironment.loader(fixture);
            });

            it('should load new sites if default value is not in the first page', (done) => {
                component.value = 'fake-test-4';
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(component.selected.entry.title).toBe('fake-test-4');
                    done();
                });
            });

            it('should NOT reload infinitely if default value is NOT found after all sites are loaded', (done) => {
                component.value = 'nonexistent-site';
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(component.selected).toBeUndefined();
                    expect(component.isLoading).toBeFalsy();
                    done();
                });
            });
        });

        describe('Sites with members', () => {
            beforeEach(() => {
                siteService = TestBed.inject(SitesService);
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePagingWithMembers()));

                fixture = TestBed.createComponent(DropdownSitesComponent);
                element = fixture.nativeElement;
                component = fixture.componentInstance;
                loader = TestbedHarnessEnvironment.loader(fixture);
            });

            afterEach(() => {
                fixture.destroy();
            });

            describe('No relations', () => {
                beforeEach(() => {
                    component.relations = Relations.Members;
                    authService = TestBed.inject(AuthenticationService);
                });

                it('should show only sites which logged user is member of when member relation is set', async () => {
                    spyOn(authService, 'getUsername').and.returnValue('test');
                    fixture.detectChanges();
                    await fixture.whenStable();

                    const select = await loader.getHarness(MatSelectHarness);
                    await select.open();

                    const options = await select.getOptions();

                    expect(await options[1].getText()).toContain('FAKE-SITE-PUBLIC');
                    expect(await options[2].getText()).toContain('FAKE-PRIVATE-SITE-MEMBER');
                });
            });

            describe('No relations', () => {
                beforeEach(() => {
                    component.relations = '';
                    authService = TestBed.inject(AuthenticationService);
                });

                it('should show all the sites if no relation is set', async () => {
                    spyOn(authService, 'getUsername').and.returnValue('test');
                    fixture.detectChanges();
                    await fixture.whenStable();

                    const select = await loader.getHarness(MatSelectHarness);
                    await select.open();

                    const options = await select.getOptions();

                    expect(await options[1].getText()).toContain('FAKE-MODERATED-SITE');
                    expect(await options[2].getText()).toContain('FAKE-SITE-PUBLIC');
                    expect(await options[3].getText()).toContain('FAKE-PRIVATE-SITE-MEMBER');
                });
            });
        });
    });
});
