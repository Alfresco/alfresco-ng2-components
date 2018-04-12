/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Observable } from 'rxjs/Observable';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

declare let jasmine: any;

describe('DropdownSitesComponent', () => {

    let component: any;
    let fixture: ComponentFixture<DropdownSitesComponent>;
    let debug: DebugElement;
    let element: HTMLElement;
    let sitesList: any;
    let siteListWitMembers: any;
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

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownSitesComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        siteService = TestBed.get(SitesService);

        sitesList = {
            'list': {
                'pagination': {
                    'count': 2,
                    'hasMoreItems': false,
                    'totalItems': 2,
                    'skipCount': 0,
                    'maxItems': 100
                },
                'entries': [
                    {
                        'entry': {
                            'role': 'SiteManager',
                            'visibility': 'PUBLIC',
                            'guid': 'fake-1',
                            'description': 'fake-test-site',
                            'id': 'fake-test-site',
                            'preset': 'site-dashboard',
                            'title': 'fake-test-site'
                        }
                    },
                    {
                        'entry': {
                            'role': 'SiteManager',
                            'visibility': 'PUBLIC',
                            'guid': 'fake-2',
                            'description': 'This is a Sample Alfresco Team site.',
                            'id': 'swsdp',
                            'preset': 'site-dashboard',
                            'title': 'fake-test-2'
                        }
                    }
                ]
            }
        };

        siteListWitMembers = {
            'list': {
                'entries': [{
                    'entry': {
                        'visibility': 'MODERATED',
                        'guid': 'b4cff62a-664d-4d45-9302-98723eac1319',
                        'description': 'This is a Sample Alfresco Team site.',
                        'id': 'MODERATED-SITE',
                        'preset': 'site-dashboard',
                        'title': 'FAKE-MODERATED-SITE'
                    },
                    'relations': {
                        'members': {
                            'list': {
                                'pagination': {
                                    'count': 3,
                                    'hasMoreItems': false,
                                    'skipCount': 0,
                                    'maxItems': 100
                                },
                                'entries': [
                                    {
                                        'entry': {
                                            'role': 'SiteManager',
                                            'person': {
                                                'firstName': 'Administrator',
                                                'emailNotificationsEnabled': true,
                                                'company': {},
                                                'id': 'admin',
                                                'enabled': true,
                                                'email': 'admin@alfresco.com'
                                            },
                                            'id': 'admin'
                                        }
                                    },
                                    {
                                        'entry': {
                                            'role': 'SiteCollaborator',
                                            'person': {
                                                'lastName': 'Beecher',
                                                'userStatus': 'Helping to design the look and feel of the new web site',
                                                'jobTitle': 'Graphic Designer',
                                                'statusUpdatedAt': '2011-02-15T20:20:13.432+0000',
                                                'mobile': '0112211001100',
                                                'emailNotificationsEnabled': true,
                                                'description': 'Alice is a demo user for the sample Alfresco Team site.',
                                                'telephone': '0112211001100',
                                                'enabled': false,
                                                'firstName': 'Alice',
                                                'skypeId': 'abeecher',
                                                'avatarId': '198500fc-1e99-4f5f-8926-248cea433366',
                                                'location': 'Tilbury, UK',
                                                'company': {
                                                    'organization': 'Moresby, Garland and Wedge',
                                                    'address1': '200 Butterwick Street',
                                                    'address2': 'Tilbury',
                                                    'address3': 'UK',
                                                    'postcode': 'ALF1 SAM1'
                                                },
                                                'id': 'abeecher',
                                                'email': 'abeecher@example.com'
                                            },
                                            'id': 'abeecher'
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }, {
                    'entry': {
                        'visibility': 'PUBLIC',
                        'guid': 'b4cff62a-664d-4d45-9302-98723eac1319',
                        'description': 'This is a Sample Alfresco Team site.',
                        'id': 'PUBLIC-SITE',
                        'preset': 'site-dashboard',
                        'title': 'FAKE-SITE-PUBLIC'
                    }
                }, {
                    'entry': {
                        'visibility': 'PRIVATE',
                        'guid': 'b4cff62a-664d-4d45-9302-98723eac1319',
                        'description': 'This is a Sample Alfresco Team site.',
                        'id': 'MEMBER-SITE',
                        'preset': 'site-dashboard',
                        'title': 'FAKE-PRIVATE-SITE-MEMBER'
                    },
                    'relations': {
                        'members': {
                            'list': {
                                'pagination': {
                                    'count': 3,
                                    'hasMoreItems': false,
                                    'skipCount': 0,
                                    'maxItems': 100
                                },
                                'entries': [
                                    {
                                        'entry': {
                                            'role': 'SiteManager',
                                            'person': {
                                                'firstName': 'Administrator',
                                                'emailNotificationsEnabled': true,
                                                'company': {},
                                                'id': 'admin',
                                                'enabled': true,
                                                'email': 'admin@alfresco.com'
                                            },
                                            'id': 'test'
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
                ]
            }
        };
    });

    describe('Rendering tests', () => {

        function openSelectbox() {
            const selectBox = debug.query(By.css(('[data-automation-id="site-my-files-select"] .mat-select-trigger')));
            selectBox.triggerEventHandler('click', null);
        }

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
            fixture.destroy();
        });

        it('Dropdown sites should be rendered', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(element.querySelector('#site-dropdown-container')).toBeDefined();
                expect(element.querySelector('#site-dropdown')).toBeDefined();
                expect(element.querySelector('#site-dropdown-container')).not.toBeNull();
                expect(element.querySelector('#site-dropdown')).not.toBeNull();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });
        }));

        it('should show the "My files" option by default', async(() => {
            component.hideMyFiles = false;
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                let options: any = debug.queryAll(By.css('mat-option'));
                expect(options[0].nativeElement.innerText).toContain('DROPDOWN.MY_FILES_OPTION');
            });
        });

        it('should hide the "My files" option if the developer desires that way', async(() => {
            component.hideMyFiles = true;
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                let options: any = debug.queryAll(By.css('mat-option'));
                expect(options[0].nativeElement.innerText).not.toContain('DROPDOWN.MY_FILES_OPTION');
            });
        }));

        it('should show the default placeholder label by default', async(() => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });

            openSelectbox();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.nativeElement.innerText.trim()).toContain('DROPDOWN.PLACEHOLDER_LABEL');
            });
        }));

        it('should show custom placeholder label when the \'placeholder\' input property is given a value', async(() => {
            component.placeholder = 'NODE_SELECTOR.SELECT_LOCATION';
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });

            openSelectbox();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.nativeElement.innerText.trim()).toContain('NODE_SELECTOR.SELECT_LOCATION');
            });
        }));

        it('should load custom sites when the \'siteList\' input property is given a value', async(() => {
            component.siteList = {
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

            fixture.detectChanges();

            openSelectbox();

            let options: any = [];
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                options = debug.queryAll(By.css('mat-option'));
                options[0].triggerEventHandler('click', null);
                fixture.detectChanges();
            });

            component.change.subscribe(() => {
                expect(options[2].nativeElement.innerText).toContain('PERSONAL_FILES');
                expect(options[3].nativeElement.innerText).toContain('FILE_LIBRARIES');
            });
        }));

        it('should load sites by default', async(() => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                let options: any = debug.queryAll(By.css('mat-option'));
                expect(options[1].nativeElement.innerText).toContain('fake-test-site');
                expect(options[2].nativeElement.innerText).toContain('fake-test-2');
            });
        }));

        it('should raise an event when a site is selected', (done) => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                let options: any = debug.queryAll(By.css('mat-option'));
                options[1].nativeElement.click();
                fixture.detectChanges();
            });

            component.change.subscribe((site) => {
                expect(site.entry.guid).toBe('fake-1');
                done();
            });
        });

        it('should be possiblle to select the default value', (done) => {
            component.value = 'swsdp';
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                expect(component.selected.entry.title).toBe('fake-test-2');
                done();
            });
        });

        it('should show only sites which logged user is member of when member relation is set', async(() => {
            spyOn(siteService, 'getEcmCurrentLoggedUserName').and.returnValue('test');
            spyOn(siteService, 'getSites').and.returnValue(Observable.of(siteListWitMembers));
            component.relations = Relations.Members;
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let options: any = debug.queryAll(By.css('mat-option'));
                    expect(options[1].nativeElement.innerText).toContain('FAKE-SITE-PUBLIC');
                    expect(options[2].nativeElement.innerText).toContain('FAKE-PRIVATE-SITE-MEMBER');
                    expect(options[3]).toBeUndefined();
                });
            });
        }));

        it('should show all the sites if no relation is set', async(() => {
            spyOn(siteService, 'getEcmCurrentLoggedUserName').and.returnValue('test');
            spyOn(siteService, 'getSites').and.returnValue(Observable.of(siteListWitMembers));
            component.siteList = null;
            component.relations = null;
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                debug.query(By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    let options: any = debug.queryAll(By.css('mat-option'));
                    expect(options[1].nativeElement.innerText).toContain('FAKE-MODERATED-SITE');
                    expect(options[2].nativeElement.innerText).toContain('FAKE-SITE-PUBLIC');
                    expect(options[3].nativeElement.innerText).toContain('FAKE-PRIVATE-SITE-MEMBER');
                });
            });
        }));

    });
});
