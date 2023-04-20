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

import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownSitesComponent, Relations } from './sites-dropdown.component';
import { setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { getFakeSitePaging,
    getFakeSitePagingNoMoreItems,
    getFakeSitePagingFirstPage,
    getFakeSitePagingLastPage,
    getFakeSitePagingWithMembers
} from '../mock';
import { ContentTestingModule } from '../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SitesService } from '../common/services/sites.service';

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

    let component: any;
    let fixture: ComponentFixture<DropdownSitesComponent>;
    let debug: DebugElement;
    let element: HTMLElement;
    let siteService: SitesService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    describe('Rendering tests', () => {

        describe('Infinite Loading', () => {

            beforeEach(() => {
                siteService = TestBed.inject(SitesService);
                fixture = TestBed.createComponent(DropdownSitesComponent);
                debug = fixture.debugElement;
                element = fixture.nativeElement;
                component = fixture.componentInstance;
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePaging()));
            });

            it('Should show loading item if there are more itemes', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                expect(element.querySelector('[data-automation-id="site-loading"]')).toBeDefined();
            });

            it('Should not show loading item if there are more itemes', async () => {
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
                debug = fixture.debugElement;
                element = fixture.nativeElement;
                component = fixture.componentInstance;
            });

            const openSelectBox = () => {
                const selectBox = debug.query(By.css(('[data-automation-id="site-my-files-option"] .mat-select-trigger')));
                selectBox.triggerEventHandler('click', null);
            };

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

                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);

                fixture.detectChanges();
                await fixture.whenStable();

                const options: any = debug.queryAll(By.css('mat-option'));
                expect(options[0].nativeElement.innerText).toContain('DROPDOWN.MY_FILES_OPTION');
            });

            it('should hide the "My files" option if the developer desires that way', async () => {
                component.hideMyFiles = true;

                fixture.detectChanges();
                await fixture.whenStable();

                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);

                fixture.detectChanges();
                await fixture.whenStable();

                const options: any = debug.queryAll(By.css('mat-option'));
                expect(options[0].nativeElement.innerText).not.toContain('DROPDOWN.MY_FILES_OPTION');
            });

            it('should show the default placeholder label by default', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                openSelectBox();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(fixture.nativeElement.innerText.trim()).toContain('NODE_SELECTOR.LOCATION');
            });

            it('should show custom placeholder label when the "placeholder" input property is given a value', async () => {
                component.placeholder = 'NODE_SELECTOR.SELECT_LIBRARY';

                fixture.detectChanges();
                await fixture.whenStable();

                openSelectBox();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(fixture.nativeElement.innerText.trim()).toContain('NODE_SELECTOR.LOCATION');
            });

            it('should load custom sites when the "siteList" input property is given a value', async () => {
                component.siteList = customSiteList;

                fixture.detectChanges();
                await fixture.whenStable();

                openSelectBox();

                fixture.detectChanges();
                await fixture.whenStable();

                const options = debug.queryAll(By.css('mat-option'));
                options[0].triggerEventHandler('click', null);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(options[0].nativeElement.innerText).toContain('PERSONAL_FILES');
                expect(options[1].nativeElement.innerText).toContain('FILE_LIBRARIES');
            });

            it('should load sites by default', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);

                fixture.detectChanges();
                await fixture.whenStable();

                const options: any = debug.queryAll(By.css('mat-option'));
                expect(options[1].nativeElement.innerText).toContain('fake-test-site');
                expect(options[2].nativeElement.innerText).toContain('fake-test-2');
            });

            it('should raise an event when a site is selected', (done) => {
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                    fixture.detectChanges();
                    const options: any = debug.queryAll(By.css('mat-option'));
                    options[1].nativeElement.click();
                    fixture.detectChanges();
                });

                component.change.subscribe((site) => {
                    expect(site.entry.guid).toBe('fake-1');
                    done();
                });
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
                    expect(component.loading).toBeFalsy();
                    done();
                });
            });
        });

        describe('Sites with members', () => {

            beforeEach(() => {
                siteService = TestBed.inject(SitesService);
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePagingWithMembers()));

                fixture = TestBed.createComponent(DropdownSitesComponent);
                debug = fixture.debugElement;
                element = fixture.nativeElement;
                component = fixture.componentInstance;
            });

            afterEach(() => {
                fixture.destroy();
            });

            describe('No relations', () => {

                beforeEach(() => {
                    component.relations = Relations.Members;
                });

                it('should show only sites which logged user is member of when member relation is set', (done) => {
                    spyOn(siteService, 'getEcmCurrentLoggedUserName').and.returnValue('test');

                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        fixture.detectChanges();
                        debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            const options: any = debug.queryAll(By.css('mat-option'));
                            expect(options[1].nativeElement.innerText).toContain('FAKE-SITE-PUBLIC');
                            expect(options[2].nativeElement.innerText).toContain('FAKE-PRIVATE-SITE-MEMBER');
                            expect(options[3]).toBeUndefined();
                            done();
                        });
                    });
                });
            });

            describe('No relations', () => {
                beforeEach(() => {
                    component.relations = [];
                });

                it('should show all the sites if no relation is set', (done) => {
                    spyOn(siteService, 'getEcmCurrentLoggedUserName').and.returnValue('test');

                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        fixture.detectChanges();
                        debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                        fixture.detectChanges();
                        fixture.whenStable().then(() => {
                            const options: any = debug.queryAll(By.css('mat-option'));
                            expect(options[1].nativeElement.innerText).toContain('FAKE-MODERATED-SITE');
                            expect(options[2].nativeElement.innerText).toContain('FAKE-SITE-PUBLIC');
                            expect(options[3].nativeElement.innerText).toContain('FAKE-PRIVATE-SITE-MEMBER');
                            done();
                        });
                    });
                });
            });
        });
    });
});
