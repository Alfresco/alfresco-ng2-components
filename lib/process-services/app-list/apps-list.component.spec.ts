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
import { AppsProcessService, CoreModule } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

import { MaterialModule } from '../material.module';
import { defaultApp, deployedApps, nonDeployedApps } from '../mock/apps-list.mock';
import { AppsListComponent } from './apps-list.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AppsListComponent', () => {

    let component: AppsListComponent;
    let fixture: ComponentFixture<AppsListComponent>;
    let debugElement: DebugElement;
    let service: AppsProcessService;
    let getAppsSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                MaterialModule,
                TranslateModule
            ],
            declarations: [
                AppsListComponent
            ],
            providers: [
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppsListComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        service = fixture.debugElement.injector.get(AppsProcessService);
        getAppsSpy = spyOn(service, 'getDeployedApplications').and.returnValue(Observable.of(deployedApps));
    });

    it('should define layoutType with the default value', () => {
        component.layoutType = '';
        fixture.detectChanges();
        expect(component.isGrid()).toBe(true);
    });

    it('should load apps on init', () => {
        fixture.detectChanges();
        expect(getAppsSpy).toHaveBeenCalled();
    });

    it('should show the apps filtered by defaultAppId', () => {
        component.filtersAppId = [{defaultAppId: 'fake-app-1'}];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
    });

    it('should show the apps filtered by deploymentId', () => {
        component.filtersAppId = [{deploymentId: '4'}];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
        expect(component.appList[0].deploymentId).toEqual('4');
    });

    it('should show the apps filtered by name', () => {
        component.filtersAppId = [{name: 'App5'}];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
        expect(component.appList[0].name).toEqual('App5');
    });

    it('should show the apps filtered by id', () => {
        component.filtersAppId = [{id: 6}];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
        expect(component.appList[0].id).toEqual(6);
    });

    it('should show the apps filtered by modelId', () => {
        component.filtersAppId = [{modelId: 66}];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(2);
        expect(component.appList[0].modelId).toEqual(66);
    });

    it('should show the apps filtered by tenandId', () => {
        component.filtersAppId = [{tenantId: 9}];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(2);
        expect(component.appList[0].tenantId).toEqual(9);
    });

    it('should emit an error when an error occurs loading apps', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getAppsSpy.and.returnValue(Observable.throw({}));
        fixture.detectChanges();
        expect(emitSpy).toHaveBeenCalled();
    });

    describe('internationalization', () => {

        it('should provide a translation for the default application name, when app name is not provided', () => {
            const appDataMock = {
                defaultAppId: 'tasks',
                name: null
            };
            component.getAppName(appDataMock).subscribe((name) => {
                expect(name).toBe('ADF_TASK_LIST.APPS.TASK_APP_NAME');
            });
        });

        it('should provide the application name, when it exists', () => {
            const appDataMock = {
                defaultAppId: 'uiu',
                name: 'the-name'
            };

            component.getAppName(appDataMock).subscribe((name) => {
                expect(name).toBe(appDataMock.name);
            });
        });
    });

    describe('layout', () => {

        it('should display a grid by default', () => {
            fixture.detectChanges();
            expect(component.isGrid()).toBe(true);
            expect(component.isList()).toBe(false);
        });

        it('should display a grid when configured to', () => {
            component.layoutType = AppsListComponent.LAYOUT_GRID;
            fixture.detectChanges();
            expect(component.isGrid()).toBe(true);
            expect(component.isList()).toBe(false);
        });

        it('should display a list when configured to', () => {
            component.layoutType = AppsListComponent.LAYOUT_LIST;
            fixture.detectChanges();
            expect(component.isGrid()).toBe(false);
            expect(component.isList()).toBe(true);
        });

        it('should throw an exception on init if unknown type configured', () => {
            component.layoutType = 'unknown';
            expect(component.ngOnInit).toThrowError();
        });
    });

    describe('display apps', () => {

        it('should display all deployed apps', () => {
            getAppsSpy.and.returnValue(Observable.of(deployedApps));
            fixture.detectChanges();
            expect(debugElement.queryAll(By.css('h1')).length).toBe(6);
        });

        it('should not display undeployed apps', () => {
            getAppsSpy.and.returnValue(Observable.of(nonDeployedApps));
            fixture.detectChanges();
            expect(debugElement.queryAll(By.css('h1')).length).toBe(0);
        });

        it('should display default app', () => {
            getAppsSpy.and.returnValue(Observable.of(defaultApp));
            fixture.detectChanges();
            expect(debugElement.queryAll(By.css('h1')).length).toBe(1);
        });

    });

    describe('select apps', () => {

        beforeEach(() => {
            getAppsSpy.and.returnValue(Observable.of(deployedApps));
            fixture.detectChanges();
        });

        it('should initially have no app selected', () => {
            let selectedEls = debugElement.queryAll(By.css('.selectedIcon'));
            expect(selectedEls.length).toBe(0);
        });

        it('should emit a click event when app selected', () => {
            spyOn(component.appClick, 'emit');
            component.selectApp(deployedApps[1]);
            expect(component.appClick.emit).toHaveBeenCalledWith(deployedApps[1]);
        });

        it('should have one app shown as selected after app selected', () => {
            component.selectApp(deployedApps[1]);
            fixture.detectChanges();
            let selectedEls = debugElement.queryAll(By.css('.adf-app-listgrid-item-card-actions-icon'));
            expect(selectedEls.length).toBe(1);
        });

        it('should have the correct app shown as selected after app selected', () => {
            component.selectApp(deployedApps[1]);
            fixture.detectChanges();
            let appEls = debugElement.queryAll(By.css('.adf-app-listgrid > div'));
            expect(appEls[1].query(By.css('.adf-app-listgrid-item-card-actions-icon'))).not.toBeNull();
        });

    });

});
