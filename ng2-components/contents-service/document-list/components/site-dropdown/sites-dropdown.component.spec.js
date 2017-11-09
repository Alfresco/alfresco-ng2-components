"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var material_module_1 = require("../../../material.module");
var sites_dropdown_component_1 = require("./sites-dropdown.component");
var sitesList = {
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
describe('DropdownSitesComponent', function () {
    var component;
    var fixture;
    var debug;
    var element;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                material_module_1.MaterialModule
            ],
            declarations: [
                sites_dropdown_component_1.DropdownSitesComponent
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(sites_dropdown_component_1.DropdownSitesComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
    });
    describe('Rendering tests', function () {
        function openSelectbox() {
            var selectBox = debug.query(platform_browser_1.By.css(('[data-automation-id="site-my-files-select"] .mat-select-trigger')));
            selectBox.triggerEventHandler('click', null);
        }
        beforeEach(function () {
            jasmine.Ajax.install();
        });
        afterEach(function () {
            jasmine.Ajax.uninstall();
            fixture.destroy();
            testing_1.TestBed.resetTestingModule();
        });
        it('Dropdown sites should be renedered', testing_1.async(function () {
            fixture.detectChanges();
            fixture.whenStable().then(function () {
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
        it('should show the "My files" option by default', testing_1.async(function () {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json', responseText: sitesList });
            openSelectbox();
            fixture.whenStable().then(function () {
                fixture.detectChanges();
                expect(window.document.querySelector('[data-automation-id="site-my-files-option"]')).not.toBeNull();
            });
        }));
        it('should hide the "My files" option if the developer desires that way', testing_1.async(function () {
            component.hideMyFiles = true;
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({ status: 200, contentType: 'json', responseText: sitesList });
            openSelectbox();
            fixture.whenStable().then(function () {
                fixture.detectChanges();
                expect(window.document.querySelector('[data-automation-id="site-my-files-option"]')).toBeNull();
            });
        }));
        // todo: something wrong with the test itself
        xit('should load sites on init', testing_1.async(function () {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });
            fixture.whenStable().then(function () {
                fixture.detectChanges();
                debug.query(platform_browser_1.By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                var options = debug.queryAll(platform_browser_1.By.css('mat-option'));
                expect(options[0].attributes['ng-reflect-value']).toBe('default');
                expect(options[1].attributes['ng-reflect-value']).toBe('fake-1');
                expect(options[2].attributes['ng-reflect-value']).toBe('fake-2');
            });
        }));
        it('should raise an event when a site is selected', function (done) {
            fixture.detectChanges();
            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: sitesList
            });
            fixture.whenStable().then(function () {
                fixture.detectChanges();
                debug.query(platform_browser_1.By.css('.mat-select-trigger')).triggerEventHandler('click', null);
                fixture.detectChanges();
                var options = debug.queryAll(platform_browser_1.By.css('mat-option'));
                options[1].triggerEventHandler('click', null);
                fixture.detectChanges();
            });
            component.change.subscribe(function (site) {
                expect(site.guid).toBe('fake-1');
                done();
            });
        });
    });
});
