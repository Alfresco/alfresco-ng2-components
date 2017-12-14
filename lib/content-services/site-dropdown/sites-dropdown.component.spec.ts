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
import { MaterialModule } from '../material.module';
import { DropdownSitesComponent } from './sites-dropdown.component';

declare let jasmine: any;

let sitesList = {
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

describe('DropdownSitesComponent', () => {

    let component: any;
    let fixture: ComponentFixture<DropdownSitesComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [
                MaterialModule
            ],
            declarations: [
                DropdownSitesComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DropdownSitesComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
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
            TestBed.resetTestingModule();
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
            jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json', responseText: sitesList });

            openSelectbox();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(window.document.querySelector('[data-automation-id="site-my-files-option"]')).not.toBeNull();
            });
        }));

        it('should hide the "My files" option if the developer desires that way', async(() => {
            component.hideMyFiles = true;
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json', responseText: sitesList });

            openSelectbox();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(window.document.querySelector('[data-automation-id="site-my-files-option"]')).toBeNull();
            });
        }));

        it('should show the default placeholder label by default', async(() => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json', responseText: sitesList });

            openSelectbox();

            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(fixture.nativeElement.innerText.trim()).toContain('DROPDOWN.PLACEHOLDER_LABEL');
            });
        }));

        it('should show custom placeholder label when the \'placeholder\' input property is given a value', async(() => {
            component.placeholder = 'NODE_SELECTOR.SELECT_LOCATION';
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json', responseText: sitesList });

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
                expect(options[0].attributes['ng-reflect-value']).toBe('default');
                expect(options[1].attributes['ng-reflect-value']).toBe('-my-');
                expect(options[2].attributes['ng-reflect-value']).toBe('-mysites-');
            });
        }));

        it('should load sites by default', (done) => {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });

            openSelectbox();

            let options: any = [];
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                options = debug.queryAll(By.css('mat-option'));
                options[0].triggerEventHandler('click', null);
                fixture.detectChanges();
            });

            component.change.subscribe(() => {
                expect(options[0].attributes['ng-reflect-value']).toBe('default');
                expect(options[1].attributes['ng-reflect-value']).toBe('fake-1');
                expect(options[2].attributes['ng-reflect-value']).toBe('fake-2');

                done();
            });
        });

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
                options[1].triggerEventHandler('click', null);
                fixture.detectChanges();
            });

            component.change.subscribe((site) => {
                expect(site.entry.guid).toBe('fake-1');
                done();
            });
        });
    });
});
