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

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DropdownSitesComponent, Relations } from './sites-dropdown.component';
import { SitesService, setupTestBed, CoreModule, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { getFakeSitePaging, getFakeSitePagingNoMoreItems, getFakeSitePagingWithMembers } from '../mock';

const customSiteList = {
    'list': {
        'entries': [
            {
                'entry': {
                    'guid': '-my-',
                    'title': 'PERSONAL_FILES'
                }
            },
            {
                'entry': {
                    'guid': '-mysites-',
                    'title': 'FILE_LIBRARIES'
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
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [
            DropdownSitesComponent
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    describe('Rendering tests', () => {

        describe('Infinite Loading', () => {

            beforeEach(async(() => {
                siteService = TestBed.get(SitesService);
                fixture = TestBed.createComponent(DropdownSitesComponent);
                debug = fixture.debugElement;
                element = fixture.nativeElement;
                component = fixture.componentInstance;
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePaging()));
            }));

            it('Should show loading item if there are more itemes', async(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('[data-automation-id="site-loading"]')).toBeDefined();
                });
            }));

            it('Should not show loading item if there are more itemes', async(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('[data-automation-id="lsite-loading"]')).toBeNull();
                });
            }));

        });

        describe('Sites', () => {

            beforeEach(async(() => {
                siteService = TestBed.get(SitesService);
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePagingNoMoreItems()));

                fixture = TestBed.createComponent(DropdownSitesComponent);
                debug = fixture.debugElement;
                element = fixture.nativeElement;
                component = fixture.componentInstance;
            }));

            function openSelectBox() {
                const selectBox = debug.query(By.css(('[data-automation-id="site-my-files-option"] .mat-select-trigger')));
                selectBox.triggerEventHandler('click', null);
            }

            it('Dropdown sites should be rendered', async(() => {
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(element.querySelector('#site-dropdown-container')).toBeDefined();
                    expect(element.querySelector('#site-dropdown')).toBeDefined();
                    expect(element.querySelector('#site-dropdown-container')).not.toBeNull();
                    expect(element.querySelector('#site-dropdown')).not.toBeNull();
                });
            }));

            it('should show the "My files" option by default', async(() => {
                component.hideMyFiles = false;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                    fixture.detectChanges();
                    const options: any = debug.queryAll(By.css('mat-option'));
                    expect(options[0].nativeElement.innerText).toContain('DROPDOWN.MY_FILES_OPTION');
                });
            }));

            it('should hide the "My files" option if the developer desires that way', async(() => {
                component.hideMyFiles = true;
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                    fixture.detectChanges();
                    const options: any = debug.queryAll(By.css('mat-option'));
                    expect(options[0].nativeElement.innerText).not.toContain('DROPDOWN.MY_FILES_OPTION');
                });
            }));

            it('should show the default placeholder label by default', async(() => {
                fixture.detectChanges();

                openSelectBox();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(fixture.nativeElement.innerText.trim()).toContain('DROPDOWN.PLACEHOLDER_LABEL');
                });
            }));

            it('should show custom placeholder label when the \'placeholder\' input property is given a value', async(() => {
                fixture.detectChanges();

                component.placeholder = 'NODE_SELECTOR.SELECT_LOCATION';
                fixture.detectChanges();

                openSelectBox();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(fixture.nativeElement.innerText.trim()).toContain('NODE_SELECTOR.SELECT_LOCATION');
                });
            }));

            it('should load custom sites when the \'siteList\' input property is given a value', async(() => {
                component.siteList = customSiteList;

                fixture.detectChanges();

                openSelectBox();

                let options: any = [];
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    options = debug.queryAll(By.css('mat-option'));
                    options[0].triggerEventHandler('click', null);
                    fixture.detectChanges();
                });

                component.change.subscribe(() => {
                    expect(options[0].nativeElement.innerText).toContain('PERSONAL_FILES');
                    expect(options[1].nativeElement.innerText).toContain('FILE_LIBRARIES');
                });
            }));

            it('should load sites by default', async(() => {
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                    fixture.detectChanges();
                    const options: any = debug.queryAll(By.css('mat-option'));
                    expect(options[1].nativeElement.innerText).toContain('fake-test-site');
                    expect(options[2].nativeElement.innerText).toContain('fake-test-2');
                });
            }));

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

            it('should be possible to select the default value', (done) => {
                component.value = 'swsdp';
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    expect(component.selected.entry.title).toBe('fake-test-2');
                    done();
                });
            });
        });

        describe('Sites with members', () => {

            beforeEach(async(() => {
                siteService = TestBed.get(SitesService);
                spyOn(siteService, 'getSites').and.returnValue(of(getFakeSitePagingWithMembers()));

                fixture = TestBed.createComponent(DropdownSitesComponent);
                debug = fixture.debugElement;
                element = fixture.nativeElement;
                component = fixture.componentInstance;
            }));

            afterEach(async(() => {
                fixture.destroy();
                TestBed.resetTestingModule();
            }));

            describe('No relations', () => {

                beforeEach(async(() => {
                    component.relations = Relations.Members;
                }));

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
                beforeEach(async(() => {
                    component.relations = [];
                }));

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
