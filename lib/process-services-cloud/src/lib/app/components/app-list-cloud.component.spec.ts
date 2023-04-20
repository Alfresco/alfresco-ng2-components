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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';

import { fakeApplicationInstance } from '../mock/app-model.mock';
import { AppListCloudComponent, LAYOUT_GRID, LAYOUT_LIST } from './app-list-cloud.component';
import { AppsProcessCloudService } from '../services/apps-process-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('AppListCloudComponent', () => {

    let component: AppListCloudComponent;
    let fixture: ComponentFixture<AppListCloudComponent>;
    let appsProcessCloudService: AppsProcessCloudService;
    let getAppsSpy: jasmine.Spy;
    let alfrescoApiService: AlfrescoApiService;

    const mock: any = {
            oauth2Auth: {
                callCustomApi: () => Promise.resolve(fakeApplicationInstance)
            },
            isEcmLoggedIn: () => false,
            reply: jasmine.createSpy('reply')
    };

    @Component({
        template: `
        <adf-cloud-app-list>
            <adf-custom-empty-content-template>
                <mat-icon>apps</mat-icon>
                <p id="custom-id">No Apps Found</p>
            </adf-custom-empty-content-template>
        </adf-cloud-app-list>
           `
    })
    class CustomEmptyAppListCloudTemplateComponent {
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        declarations: [CustomEmptyAppListCloudTemplateComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppListCloudComponent);
        component = fixture.componentInstance;
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        appsProcessCloudService = TestBed.inject(AppsProcessCloudService);

        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
        getAppsSpy = spyOn(appsProcessCloudService, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
    });

    it('should define layoutType with the default value', () => {
        component.layoutType = '';
        fixture.detectChanges();
        expect(component.isGrid()).toBe(true);
    });

    it('Should fetch deployed apps', (done) => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            component.apps$.subscribe((response: any[]) => {
                expect(response).toBeDefined();
                expect(response.length).toEqual(3);
                expect(response[0].name).toEqual('application-new-1');
                expect(response[0].status).toEqual('Running');
                expect(response[0].icon).toEqual('favorite_border');
                expect(response[0].theme).toEqual('theme-2');
                expect(response[1].name).toEqual('application-new-2');
                expect(response[1].status).toEqual('Pending');
                expect(response[1].icon).toEqual('favorite_border');
                expect(response[1].theme).toEqual('theme-2');
                done();
            });
        });
    });

    it('should display default adf-empty-content template when response empty', () => {
        getAppsSpy.and.returnValue(of([]));
        fixture.detectChanges();
        const defaultEmptyTemplate = fixture.nativeElement.querySelector('.adf-app-list-empty');
        const emptyContent = fixture.debugElement.nativeElement.querySelector('.adf-empty-content');
        const emptyTitle = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__title');
        const emptySubtitle = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__subtitle');
        expect(defaultEmptyTemplate).toBeDefined();
        expect(defaultEmptyTemplate).not.toBeNull();
        expect(emptyContent).not.toBeNull();
        expect(emptyTitle.innerText).toBe('ADF_CLOUD_TASK_LIST.APPS.NO_APPS.TITLE');
        expect(emptySubtitle.innerText).toBe('ADF_CLOUD_TASK_LIST.APPS.NO_APPS.SUBTITLE');
        expect(getAppsSpy).toHaveBeenCalled();
    });

    it('should display default no permissions template when response returns exception', (done) => {
        getAppsSpy.and.returnValue(throwError({}));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            component.loadingError$.next(true);
            fixture.detectChanges();
            const errorTemplate = fixture.nativeElement.querySelector('.adf-app-list-error');
            const errorTitle = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__title');
            const errorSubtitle = fixture.debugElement.nativeElement.querySelector('.adf-empty-content__subtitle');
            expect(errorTemplate).not.toBeNull();
            expect(errorTitle.innerText).toBe('ADF_CLOUD_TASK_LIST.APPS.ERROR.TITLE');
            expect(errorSubtitle.innerText).toBe('ADF_CLOUD_TASK_LIST.APPS.ERROR.SUBTITLE');
            expect(getAppsSpy).toHaveBeenCalled();
            done();
        });
   });

    describe('Grid Layout ', () => {

        it('should display a grid by default', () => {
            fixture.detectChanges();
            expect(component.isGrid()).toBe(true);
            expect(component.isList()).toBe(false);
        });

        it('should defined adf-cloud-app-details when layout type is grid', () => {
            fixture.detectChanges();
            const adfCloudDetailsElement = fixture.nativeElement.querySelectorAll('adf-cloud-app-details');
            const appName = fixture.nativeElement.querySelector('.adf-app-listgrid-item-card-title');
            expect(adfCloudDetailsElement).toBeDefined();
            expect(adfCloudDetailsElement).not.toBeNull();

            expect(adfCloudDetailsElement.length).toEqual(3);
            expect(component.isGrid()).toBe(true);
            expect(component.isList()).toBe(false);

            expect(appName.innerText.trim()).toEqual(fakeApplicationInstance[0].name);
        });

        it('should display a grid when configured to', () => {
            component.layoutType = LAYOUT_GRID;
            fixture.detectChanges();
            expect(component.isGrid()).toBe(true);
            expect(component.isList()).toBe(false);
        });

        it('should throw an exception on init if unknown type configured', () => {
            component.layoutType = 'unknown';
            expect(component.ngOnInit).toThrowError();
        });
    });

    describe('List Layout ', () => {

        beforeEach(() => {
            component.layoutType = LAYOUT_LIST;
        });

        it('should display a LIST when configured to', () => {
            fixture.detectChanges();
            expect(component.isGrid()).toBe(false);
            expect(component.isList()).toBe(true);
        });

        it('should defined mat-list when layout type is LIST', () => {
            fixture.detectChanges();
            const appListElement = fixture.nativeElement.querySelectorAll('mat-list');
            const appListItemElement = fixture.nativeElement.querySelectorAll('mat-list-item');
            const appName = fixture.nativeElement.querySelector('.mat-list-text');
            expect(appListElement).toBeDefined();
            expect(appListElement).not.toBeNull();

            expect(appListItemElement.length).toEqual(3);
            expect(component.isGrid()).toBe(false);
            expect(component.isList()).toBe(true);

            expect(appName.innerText.trim()).toEqual(fakeApplicationInstance[0].name);
        });

        it('should throw an exception on init if unknown type configured', () => {
            component.layoutType = 'unknown';
            expect(component.ngOnInit).toThrowError();
        });
    });

    it('should emit a click event when app selected', () => {
        spyOn(component.appClick, 'emit');
        fixture.detectChanges();
        const onAppClick = fixture.nativeElement.querySelector('.mat-card');
        onAppClick.click();
        expect(component.appClick.emit).toHaveBeenCalledWith(fakeApplicationInstance[0]);
    });

    describe('Custom CustomEmptyAppListCloudTemplateComponent', () => {
        let customFixture: ComponentFixture<CustomEmptyAppListCloudTemplateComponent>;

        beforeEach(() => {
            getAppsSpy.and.returnValue(of([]));
            customFixture = TestBed.createComponent(CustomEmptyAppListCloudTemplateComponent);
        });

        afterEach(() => {
            customFixture.destroy();
        });

        it('should render the custom empty template', async () => {
            customFixture.detectChanges();
            await customFixture.whenStable();

            const title: any =  customFixture.nativeElement.querySelector('#custom-id');
            expect(title.innerText).toBe('No Apps Found');
        });
    });
});
