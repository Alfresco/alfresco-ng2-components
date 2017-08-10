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
import { CoreModule } from 'ng2-alfresco-core';
import { MaterialModule } from './../../material.module';
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
                CoreModule.forRoot(),
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

        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
            fixture.destroy();
        });

        it('Dropdown sites should be renedered', async(() => {
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

        // todo: something wrong with the test itself
        xit('should load sites on init', async(() => {
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
                let options: any = debug.queryAll(By.css('md-option'));
                expect(options[0].attributes['ng-reflect-value']).toBe('default');
                expect(options[1].attributes['ng-reflect-value']).toBe('fake-1');
                expect(options[2].attributes['ng-reflect-value']).toBe('fake-2');
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
                let options: any = debug.queryAll(By.css('md-option'));
                options[1].triggerEventHandler('click', null);
                fixture.detectChanges();
            });

            component.change.subscribe((site) => {
                expect(site.guid).toBe('fake-1');
                done();
            });
        });
    });
});
