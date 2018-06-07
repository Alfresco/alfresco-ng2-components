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

import { DebugElement, ViewChild, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppsProcessService, AppConfigService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { DataRowEvent, ObjectDataRow, ObjectDataColumn } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

import { defaultApp, deployedApps, nonDeployedApps } from '../mock/apps-list.mock';
import { AppsListComponent } from './apps-list.component';
import { ProcessTestingModule } from '../testing/process.testing.module';

describe('AppsListComponent', () => {

    let component: AppsListComponent;
    let fixture: ComponentFixture<AppsListComponent>;
    let debugElement: DebugElement;
    let service: AppsProcessService;
    let appConfig: AppConfigService;
    let getAppsSpy: jasmine.Spy;

    const fakeCustomSchema = [
        new ObjectDataColumn({
            'key': 'fakeName',
            'type': 'text',
            'title': 'ADF_APPS_LIST.PROPERTIES.FAKE_NAME',
            'sortable': true
        }),
        new ObjectDataColumn({
            'key': 'deploymentId',
            'type': 'text',
            'title': 'ADF_APPS_LIST.PROPERTIES.FAKE-ID',
            'sortable': true
        })
    ];

    const fakeApp = {
        'id': 106,
        'defaultAppId': null,
        'name': 'my cool app',
        'description': '',
        'modelId': 309,
        'theme': 'theme-1',
        'icon': 'glyphicon-asterisk',
        'deploymentId': '4158',
        'tenantId': 1
    };

    setupTestBed({
        imports: [ProcessTestingModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppsListComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

        service = TestBed.get(AppsProcessService);
        appConfig = TestBed.get(AppConfigService);
        appConfig.config.bpmHost = 'http://localhost:9876/bpm';
        getAppsSpy = spyOn(service, 'getDeployedApplications').and.returnValue(Observable.of(deployedApps));
        appConfig.config = Object.assign(appConfig.config, {
            'adf-apps-list': {
                'presets': {
                    'fakeCustomSchema': [
                        {
                            'key': 'fakeName',
                            'type': 'text',
                            'title': 'ADF_APPS_LIST.PROPERTIES.FAKE_NAME',
                            'sortable': true
                        },
                        {
                            'key': 'deploymentId',
                            'type': 'text',
                            'title': 'ADF_APPS_LIST.PROPERTIES.FAKE-ID',
                            'sortable': true
                        }
                    ]
                }
            }
        });
    });

    it('should use the default schemaColumn as default', () => {
        component.ngAfterContentInit();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(1);
    });

    it('should use the custom schemaColumn from app.config.json', () => {
        component.presetColumn = 'fakeCustomSchema';
        component.ngAfterContentInit();
        fixture.detectChanges();
        expect(component.columns).toEqual(fakeCustomSchema);
    });

    it('should fetch custom schemaColumn when the input presetColumn is defined', () => {
        component.presetColumn = 'fakeCustomSchema';
        fixture.detectChanges();
        expect(component.columns).toBeDefined();
        expect(component.columns.length).toEqual(2);
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

    it('loading should be false by default', () => {
        expect(component.loading).toBeFalsy();
    });

    it('should show the loading spinner when the apps are loading', async(() => {
        component.loading = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let loadingSpinner = fixture.nativeElement.querySelector('mat-spinner');
            expect(loadingSpinner).toBeDefined();
        });
    }));

    it('should show the apps filtered by defaultAppId', () => {
        component.filtersAppId = [{ defaultAppId: 'fake-app-1' }];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
    });

    it('should show the apps filtered by deploymentId', () => {
        component.filtersAppId = [{ deploymentId: '4' }];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
        expect(component.appList[0].deploymentId).toEqual('4');
    });

    it('should show the apps filtered by name', () => {
        component.filtersAppId = [{ name: 'App5' }];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
        expect(component.appList[0].name).toEqual('App5');
    });

    it('should show the apps filtered by id', () => {
        component.filtersAppId = [{ id: 6 }];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(1);
        expect(component.appList[0].id).toEqual(6);
    });

    it('should show the apps filtered by modelId', () => {
        component.filtersAppId = [{ modelId: 66 }];
        fixture.detectChanges();
        expect(component.isEmpty()).toBe(false);
        expect(component.appList).toBeDefined();
        expect(component.appList.length).toEqual(2);
        expect(component.appList[0].modelId).toEqual(66);
    });

    it('should show the apps filtered by tenandId', () => {
        component.filtersAppId = [{ tenantId: 9 }];
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

    describe('List apps', () => {

        beforeEach(() => {
            getAppsSpy.and.returnValue(Observable.of(deployedApps));
            this.layoutType = 'LIST';
            fixture.detectChanges();
        });

        it('should emit row click event', (done) => {
            const row = new ObjectDataRow({
                fakeApp
            });
            const rowEvent = new DataRowEvent(row, null);

            component.rowClick.subscribe(a => {
                expect(a).toBeDefined();
                done();
            });

            component.onRowClick(rowEvent);
        });

        it('should emit row click event on Enter', (done) => {
            const prevented = false;
            const keyEvent = new CustomEvent('Keyboard event', {
                detail: {
                    keyboardEvent: { key: 'Enter' },
                    row: new ObjectDataRow(fakeApp)
                }
            });

            spyOn(keyEvent, 'preventDefault').and.callFake(() => prevented = true);

            component.rowClick.subscribe((a: any) => {
                expect(a.deploymentId).toEqual('4158');
                expect(prevented).toBeTruthy();
                done();
            });

            component.onRowKeyUp(keyEvent);
        });

        it('should NOT emit row click event on every other key', async(() => {
            const triggered = false;
            const keyEvent = new CustomEvent('Keyboard event', {
                detail: {
                    keyboardEvent: { key: 'Space' },
                    row: new ObjectDataRow(fakeApp)
                }
            });

            component.rowClick.subscribe(() => triggered = true);
            component.onRowKeyUp(keyEvent);

            fixture.whenStable().then(() => {
                expect(triggered).toBeFalsy();
            });
        }));
    });
});

@Component({
    template: `
    <adf-apps>
        <adf-empty-custom-content>
            <p id="custom-id">No Apps</p>
        </adf-empty-custom-content>
    </adf-apps>
       `
})
class CustomEmptyAppListTemplateComponent {
}

describe('Custom CustomEmptyAppListTemplateComponent', () => {
    let fixture: ComponentFixture<CustomEmptyAppListTemplateComponent>;

    setupTestBed({
        imports: [ProcessTestingModule],
        declarations: [CustomEmptyAppListTemplateComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomEmptyAppListTemplateComponent);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the custom no-apps template', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            let title: any = fixture.debugElement.queryAll(By.css('#custom-id'));
            expect(title.length).toBe(1);
            expect(title[0].nativeElement.innerText).toBe('No Apps');
        });
    }));
});

@Component({
    template: `
    <adf-apps #appList>
        <data-columns>
            <data-column key="name" title="ADF_APPS_LIST.PROPERTIES.NAME" class="full-width name-column"></data-column>
            <data-column key="deploymentId" title="ADF_APPS_LIST.PROPERTIES.ID"></data-column>
            <data-column key="action" title="Action"></data-column>
        </data-columns>
    </adf-apps>`
})

class CustomAppsListComponent {

    @ViewChild(AppsListComponent)
    appList: AppsListComponent;
}

describe('CustomAppsListComponent', () => {
    let fixture: ComponentFixture<CustomAppsListComponent>;
    let component: CustomAppsListComponent;

    setupTestBed({
        imports: [CoreModule],
        declarations: [AppsListComponent, CustomAppsListComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomAppsListComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
    });

    it('should create instance of CustomAppsListComponent', () => {
        expect(component instanceof CustomAppsListComponent).toBe(true, 'should create CustomAppsListComponent');
    });

    it('should fetch custom schemaColumn from html', () => {
        fixture.detectChanges();
        expect(component.appList.columnList).toBeDefined();
        expect(component.appList.columns[0]['title']).toEqual('ADF_APPS_LIST.PROPERTIES.NAME');
        expect(component.appList.columns[1]['title']).toEqual('ADF_APPS_LIST.PROPERTIES.ID');
        expect(component.appList.columns.length).toEqual(3);
    });
});
