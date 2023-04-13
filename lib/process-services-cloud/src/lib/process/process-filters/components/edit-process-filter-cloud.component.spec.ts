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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

import { setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { EditProcessFilterCloudComponent, PROCESS_FILTER_ACTION_RESTORE, PROCESS_FILTER_ACTION_SAVE_DEFAULT } from './edit-process-filter-cloud.component';
import { ProcessFiltersCloudModule } from '../process-filters-cloud.module';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { fakeApplicationInstance, fakeApplicationInstanceWithEnvironment } from './../../../app/mock/app-model.mock';
import moment from 'moment';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessCloudService } from '../../services/process-cloud.service';
import { DateCloudFilterType } from '../../../models/date-cloud-filter.model';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { mockAppVersions } from '../mock/process-filters-cloud.mock';
import { DATE_FORMAT_CLOUD } from '../../../models/date-format-cloud.model';
import { fakeEnvironmentList } from '../../../common/mock/environment.mock';

describe('EditProcessFilterCloudComponent', () => {
    let component: EditProcessFilterCloudComponent;
    let service: ProcessFilterCloudService;
    let fixture: ComponentFixture<EditProcessFilterCloudComponent>;
    let dialog: MatDialog;
    let appsService: AppsProcessCloudService;
    let processService: ProcessCloudService;
    let getRunningApplicationsSpy: jasmine.Spy;
    let getProcessFilterByIdSpy: jasmine.Spy;
    let alfrescoApiService: AlfrescoApiService;

    const fakeFilter = new ProcessFilterCloudModel({
        name: 'FakeRunningProcess',
        icon: 'adjust',
        id: 'mock-process-filter-id',
        initiator: 'user1,user2',
        status: 'RUNNING',
        appName: 'mock-app-name',
        appVersion: 1,
        processDefinitionId: 'process-def-id',
        order: 'ASC',
        sort: 'id'
    });

    const mock: any = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(fakeApplicationInstance)
        },
        isEcmLoggedIn: () => false,
        reply: jasmine.createSpy('reply')
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessFiltersCloudModule,
            ProcessServiceCloudTestingModule,
            MatIconTestingModule
        ],
        providers: [
            MatDialog,
            { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProcessFilterCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ProcessFilterCloudService);
        appsService = TestBed.inject(AppsProcessCloudService);
        processService = TestBed.inject(ProcessCloudService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        dialog = TestBed.inject(MatDialog);
        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of({
                action: ProcessFilterDialogCloudComponent.ACTION_SAVE,
                icon: 'icon',
                name: 'fake-name'
            })
        } as any);
        getProcessFilterByIdSpy = spyOn(service, 'getFilterById').and.returnValue(of(fakeFilter));
        getRunningApplicationsSpy = spyOn(appsService, 'getDeployedApplicationsByStatus').and.returnValue(of(fakeApplicationInstance));
        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should not raise filter change events if filter remains the same', () => {
        let count = 0;
        component.filterChange.subscribe(() => count++);

        component.processFilter = fakeFilter;
        component.processFilter = fakeFilter;
        component.processFilter = fakeFilter;

        expect(count).toBe(1);
    });

    it('should fetch process instance filter by id', async () => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(getProcessFilterByIdSpy).toHaveBeenCalled();
        expect(component.processFilter.name).toEqual('FakeRunningProcess');
        expect(component.processFilter.icon).toEqual('adjust');
        expect(component.processFilter.status).toEqual('RUNNING');
        expect(component.processFilter.order).toEqual('ASC');
        expect(component.processFilter.sort).toEqual('id');
    });

    it('should display filter name as title', async () => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.showProcessFilterName = true;
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-sub-title-id');

        expect(title).toBeDefined();
        expect(subTitle).toBeDefined();
        expect(title.innerText).toEqual('FakeRunningProcess');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_PROCESS_FILTER.TITLE');
    });

    it('should not display filter name as title if the flag is false', async () => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.showProcessFilterName = false;
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-title-id');
        expect(title).toBeNull();
    });

    it('should not display mat-spinner if isloading set to false', async () => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-sub-title-id');
        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-process-filter-loading-margin');

        expect(matSpinnerElement).toBeNull();
        expect(title).toBeDefined();
        expect(subTitle).toBeDefined();
        expect(title.innerText).toEqual('FakeRunningProcess');
        expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_PROCESS_FILTER.TITLE');
    });

    it('should display mat-spinner if isloading set to true', async () => {
        component.isLoading = true;
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-process-filter-loading-margin');
        expect(matSpinnerElement).toBeDefined();
    });

    describe('EditProcessFilter form', () => {

        beforeEach(() => {
            const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });
            fixture.detectChanges();
        });

        it('should create editProcessFilter form', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const stateController = component.editProcessFilterForm.get('status');
            const sortController = component.editProcessFilterForm.get('sort');
            const orderController = component.editProcessFilterForm.get('order');

            expect(component.editProcessFilterForm).toBeDefined();
            expect(stateController).toBeDefined();
            expect(sortController).toBeDefined();
            expect(orderController).toBeDefined();

            expect(stateController.value).toEqual('RUNNING');
            expect(sortController.value).toEqual('id');
            expect(orderController.value).toEqual('ASC');
        });

        describe('Save & Delete buttons', () => {
            it('should enable delete button for custom process filters', async () => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(deleteButton.disabled).toEqual(false);
            });

            it('should enable save button if the filter is changed for custom process filters', (done) => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editProcessFilterForm.valueChanges
                    .pipe(debounceTime(500))
                    .subscribe(() => {
                        const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                        fixture.detectChanges();
                        expect(saveButton.disabled).toBe(false);
                        done();
                    });

                const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
                stateElement.click();
                fixture.detectChanges();

                const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                stateOptions[2].nativeElement.click();
                fixture.detectChanges();
            });

            it('should disable save button if the filter is not changed for custom filter', async () => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(saveButton.disabled).toBe(true);
            });
        });

        describe('SaveAs Button', () => {

            it('should disable saveAs button if the process filter is not changed for default filter', async () => {
                getProcessFilterByIdSpy.and.returnValue(of({
                    id: 'filter-id',
                    name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
                    sort: 'my-custom-sort',
                    processDefinitionId: 'process-definition-id',
                    priority: '12'
                }));

                const processFilterIdChange = new SimpleChange(null, 'filter-id', true);
                component.ngOnChanges({ id: processFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                expect(saveButton.disabled).toEqual(true);
            });

            it('should disable saveAs button if the process filter is not changed for custom filter', async () => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();

                fixture.detectChanges();
                await fixture.whenStable();

                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                expect(saveButton.disabled).toEqual(true);
            });

            it('should enable saveAs button if the filter values are changed for default filter', (done) => {
                getProcessFilterByIdSpy.and.returnValue(of({
                    id: 'filter-id',
                    name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
                    sort: 'my-custom-sort',
                    processDefinitionId: 'process-definition-id',
                    priority: '12'
                }));

                const processFilterIdChange = new SimpleChange(null, 'filter-id', true);
                component.ngOnChanges({ id: processFilterIdChange });
                fixture.detectChanges();

                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editProcessFilterForm.valueChanges
                    .pipe(debounceTime(500))
                    .subscribe(() => {
                        const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                        fixture.detectChanges();
                        expect(saveButton.disabled).toEqual(false);
                        done();
                    });

                const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
                stateElement.click();
                fixture.detectChanges();

                const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                stateOptions[2].nativeElement.click();
                fixture.detectChanges();
            });

            it('should enable saveAs button if the filter values are changed for custom filter', (done) => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();

                component.editProcessFilterForm.valueChanges
                    .pipe(debounceTime(500))
                    .subscribe(() => {
                        const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                        fixture.detectChanges();
                        expect(saveButton.disabled).toEqual(false);
                        done();
                    });

                const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
                stateElement.click();
                fixture.detectChanges();

                const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                stateOptions[2].nativeElement.click();
                fixture.detectChanges();
            });
        });

        it('should display current process filter details', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"]');
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"]');
            const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-order"]');
            expect(stateElement).toBeDefined();
            expect(sortElement).toBeDefined();
            expect(orderElement).toBeDefined();
            expect(stateElement.innerText.trim()).toEqual('ADF_CLOUD_PROCESS_FILTERS.STATUS.RUNNING');
            expect(sortElement.innerText.trim()).toEqual('ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.ID');
            expect(orderElement.innerText.trim()).toEqual('ADF_CLOUD_PROCESS_FILTERS.DIRECTION.ASCENDING');
        });

        it('should display state drop down', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const statusOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(statusOptions.length).toEqual(5);
        });

        it('should display sort drop down', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"] .mat-select-trigger');
            sortElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(sortOptions.length).toEqual(4);
        });

        it('should display order drop down', async () => {
            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-order"] .mat-select-trigger');
            orderElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(orderOptions.length).toEqual(2);
        });
    });

    it('should be able to filter filterProperties when input is defined', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        component.filterProperties = ['appName', 'processName'];

        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.processFilterProperties.length).toEqual(2);
        expect(component.processFilterProperties[0].key).toEqual('appName');
        expect(component.processFilterProperties[1].key).toEqual('processName');
    });

    it('should get form attributes', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        component.filterProperties = ['appName', 'completedDateRange'];
        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.editProcessFilterForm.get('_completedFrom')).toBeDefined();
        expect(component.editProcessFilterForm.get('_completedTo')).toBeDefined();
        expect(component.editProcessFilterForm.get('completedDateType')).toBeDefined();
    });

    it('should get form attributes for suspendedData', async () => {
        const filter = new ProcessFilterCloudModel({
            id: 'filter-id',
            name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
            sort: 'my-custom-sort',
            processDefinitionId: 'process-definition-id',
            priority: '12',
            suspendedDateType: DateCloudFilterType.RANGE
        });
        const oneYearAgoDate = moment().add(-1, 'years').format(DATE_FORMAT_CLOUD);
        const todayDate = moment().format(DATE_FORMAT_CLOUD);
        filter.suspendedFrom = oneYearAgoDate.toString();
        filter.suspendedTo = todayDate.toString();
        getProcessFilterByIdSpy.and.returnValue(of(filter));

        fixture.detectChanges();
        await fixture.whenStable();

        component.filterProperties = ['appName', 'suspendedDateRange'];

        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.editProcessFilterForm.get('_suspendedFrom').value).toEqual(oneYearAgoDate.toString());
        expect(component.editProcessFilterForm.get('_suspendedTo').value).toEqual(todayDate.toString());
        expect(component.editProcessFilterForm.get('suspendedDateType').value).toEqual(DateCloudFilterType.RANGE);
    });

    it('should able to build a editProcessFilter form with default properties if input is empty', async () => {
        fixture.detectChanges();
        component.filterProperties = [];

        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const stateController = component.editProcessFilterForm.get('status');
        const sortController = component.editProcessFilterForm.get('sort');
        const orderController = component.editProcessFilterForm.get('order');
        const lastModifiedFromController = component.editProcessFilterForm.get('lastModifiedFrom');
        const lastModifiedToController = component.editProcessFilterForm.get('lastModifiedTo');

        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.processFilterProperties).toBeDefined();
        expect(component.processFilterProperties.length).toEqual(5);
        expect(component.editProcessFilterForm).toBeDefined();
        expect(stateController).toBeDefined();
        expect(sortController).toBeDefined();
        expect(orderController).toBeDefined();
        expect(lastModifiedFromController).toBeDefined();
        expect(lastModifiedToController).toBeDefined();
        expect(stateController.value).toEqual('RUNNING');
        expect(sortController.value).toEqual('id');
        expect(orderController.value).toEqual('ASC');
    });

    it('should able to fetch running applications when appName property defined in the input', async () => {
        component.filterProperties = ['appName', 'processName'];

        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const appController = component.editProcessFilterForm.get('appName');

        expect(getRunningApplicationsSpy).toHaveBeenCalled();
        expect(appController).toBeDefined();
        expect(appController.value).toEqual('mock-app-name');
    });

    it('should fetch applications when appName and appVersion input is set', async () => {
        component.filterProperties = ['appName', 'processName', 'appVersion'];
        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const appController = component.editProcessFilterForm.get('appName');
        const appVersionController = component.editProcessFilterForm.get('appVersion');

        expect(getRunningApplicationsSpy).toHaveBeenCalled();
        expect(appController).toBeDefined();
        expect(appController.value).toEqual('mock-app-name');
        expect(appVersionController).toBeDefined();
        expect(appVersionController.value).toEqual(1);
    });

    it('should fetch appVersionMultiple options when appVersionMultiple filter property is set', async () => {

        const applicationVersionsSpy = spyOn(processService, 'getApplicationVersions').and.returnValue(of(mockAppVersions));
        fixture.detectChanges();

        component.filterProperties = ['appVersionMultiple'];
        fixture.detectChanges();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });
        fixture.detectChanges();

        const controller = component.editProcessFilterForm.get('appVersionMultiple');
        const appVersionMultiple = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-appVersionMultiple"]');
        appVersionMultiple.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const appVersionOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));

        expect(applicationVersionsSpy).toHaveBeenCalled();
        expect(controller).toBeDefined();
        expect(appVersionOptions.length).toEqual(2);
        expect(appVersionOptions[0].nativeElement.innerText).toEqual('1');
        expect(appVersionOptions[1].nativeElement.innerText).toEqual('2');
    });

    it('should fetch process definitions when processDefinitionName filter property is set', async () => {
        const processSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(of([new ProcessDefinitionCloud({ id: 'fake-id', name: 'fake-name' })]));
        component.filterProperties = ['processDefinitionName'];

        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const controller = component.editProcessFilterForm.get('processDefinitionName');
        const processDefinitionNamesElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-processDefinitionName"]');
        processDefinitionNamesElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(processSpy).toHaveBeenCalled();
        expect(controller).toBeDefined();
        const processDefinitionNamesOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        expect(processDefinitionNamesOptions[0].nativeElement.value).toBeUndefined();
        expect(processDefinitionNamesOptions[0].nativeElement.innerText).toEqual(component.allProcessDefinitionNamesOption.label);
    });

    it('should display default sort properties', async () => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
        expansionPanel.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"]');
        sortElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const sortController = component.editProcessFilterForm.get('sort');
        const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        expect(sortController).toBeDefined();
        expect(sortController.value).toEqual('id');
        expect(sortOptions.length).toEqual(4);
    });

    it('should display sort properties when sort properties are specified', async () => {
        getProcessFilterByIdSpy.and.returnValue(of({
            id: 'filter-id',
            processName: 'process-name',
            sort: 'my-custom-sort',
            processDefinitionId: 'process-definition-id',
            priority: '12'
        }));
        component.sortProperties = ['id', 'name', 'processDefinitionId'];

        fixture.detectChanges();
        await fixture.whenStable();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
        expansionPanel.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"]');
        sortElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const sortController = component.editProcessFilterForm.get('sort');
        const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        expect(sortController).toBeDefined();
        expect(component.sortProperties).toBeDefined();
        expect(component.sortProperties.length).toBe(3);
        expect(sortController.value).toBe('my-custom-sort');
        expect(sortOptions.length).toEqual(3);
    });

    it('should display the process name label for the name property', async () => {
        getProcessFilterByIdSpy.and.returnValue(of({
            id: 'filter-id',
            processName: 'process-name',
            sort: 'my-custom-sort',
            processDefinitionId: 'process-definition-id',
            priority: '12'
        }));
        component.sortProperties = ['name'];
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ id: processFilterIdChange });

        fixture.detectChanges();
        await fixture.whenStable();

        const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
        expansionPanel.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"]');
        sortElement.click();

        fixture.detectChanges();
        await fixture.whenStable();

        const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
        expect(sortOptions[0].nativeElement.textContent).toEqual('ADF_CLOUD_EDIT_PROCESS_FILTER.LABEL.PROCESS_NAME');
    });

    describe('edit filter actions', () => {

        beforeEach(() => {
            const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
            getProcessFilterByIdSpy.and.returnValue(of(fakeFilter));

            component.ngOnChanges({ id: processFilterIdChange });
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should emit save event and save the filter on click save button', (done) => {
            component.toggleFilterActions = true;
            const saveFilterSpy = spyOn(service, 'updateFilter').and.returnValue(of([fakeFilter]));
            const saveSpy: jasmine.Spy = spyOn(component.action, 'emit');
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            component.editProcessFilterForm.valueChanges
                .pipe(debounceTime(500))
                .subscribe(() => {
                    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                    fixture.detectChanges();
                    expect(saveButton.disabled).toBe(false);
                    saveButton.click();
                    expect(saveFilterSpy).toHaveBeenCalled();
                    expect(saveSpy).toHaveBeenCalled();
                    done();
                });

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();

            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[2].nativeElement.click();
            fixture.detectChanges();
        });

        it('should emit delete event and delete the filter on click of delete button', async () => {
            component.toggleFilterActions = true;
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.returnValue(of({} as any));
            const deleteSpy = spyOn(component.action, 'emit');

            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            deleteButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(deleteFilterSpy).toHaveBeenCalled();
            expect(deleteSpy).toHaveBeenCalled();
        });

        it('should emit saveAs event and add filter on click saveAs button', (done) => {
            component.toggleFilterActions = true;
            const saveAsFilterSpy = spyOn(service, 'addFilter').and.callThrough();
            const saveAsSpy = spyOn(component.action, 'emit');
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            component.editProcessFilterForm.valueChanges
                .pipe(debounceTime(500))
                .subscribe(() => {
                    const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                    fixture.detectChanges();
                    expect(saveButton.disabled).toBe(false);
                    saveButton.click();
                    expect(saveAsFilterSpy).toHaveBeenCalled();
                    expect(saveAsSpy).toHaveBeenCalled();
                    expect(dialog.open).toHaveBeenCalled();
                    done();
                });

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();

            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[2].nativeElement.click();
            fixture.detectChanges();
        });

        it('should display default filter actions', async () => {
            component.toggleFilterActions = true;
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            expect(component.processFilterActions).toBeDefined();
            expect(component.processFilterActions.length).toEqual(3);
            expect(saveButton).toBeDefined();
            expect(saveAsButton).toBeDefined();
            expect(deleteButton).toBeDefined();
        });

        it('should filter actions when input actions are specified', async () => {
            component.actions = ['save'];

            fixture.detectChanges();
            await fixture.whenStable();

            const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });

            fixture.detectChanges();
            await fixture.whenStable();

            expect(component.processFilterActions).toBeDefined();
            expect(component.actions.length).toEqual(1);
            expect(component.processFilterActions.length).toEqual(1);
        });

        it('should emit save default filter event and save the filter on click save default filter button', async () => {
            const expectedAction = {
                actionType: PROCESS_FILTER_ACTION_SAVE_DEFAULT,
                icon: 'adf:save',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.SAVE',
                filter: jasmine.anything()
            };

            component.actions = [PROCESS_FILTER_ACTION_SAVE_DEFAULT];
            component.toggleFilterActions = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });

            fixture.detectChanges();
            await fixture.whenStable();

            const saveDefaultFilterSpy = spyOn(service, 'updateFilter').and.returnValue(of([fakeFilter]));
            const saveDefaultFilterEmitSpy: jasmine.Spy = spyOn(component.action, 'emit');
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            const saveDefaultFilterButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="adf-filter-action-${PROCESS_FILTER_ACTION_SAVE_DEFAULT}"]`);
            fixture.detectChanges();
            expect(saveDefaultFilterButton.disabled).toBe(false);
            saveDefaultFilterButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(saveDefaultFilterSpy).toHaveBeenCalled();
            expect(saveDefaultFilterEmitSpy).toHaveBeenCalledWith(expectedAction);
        });

        it('should emit reset filter to defaults event and save the default filters on click reset button', async () => {
            const expectedAction = {
                actionType: PROCESS_FILTER_ACTION_RESTORE,
                icon: 'settings_backup_restore',
                tooltip: 'ADF_CLOUD_EDIT_PROCESS_FILTER.TOOL_TIP.RESTORE',
                filter: jasmine.anything()
            };

            component.actions = [PROCESS_FILTER_ACTION_RESTORE];
            component.toggleFilterActions = true;

            fixture.detectChanges();
            await fixture.whenStable();

            const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });

            fixture.detectChanges();
            await fixture.whenStable();

            const restoreDefaultProcessFiltersSpy = spyOn(service, 'getProcessFilters').and.returnValue(of([fakeFilter]));
            const resetDefaultsFilterSpy = spyOn(service, 'resetProcessFilterToDefaults').and.returnValue(of([fakeFilter]));
            const resetDefaultsEmitSpy: jasmine.Spy = spyOn(component.action, 'emit');
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();

            const resetButton = fixture.debugElement.nativeElement.querySelector(`[data-automation-id="adf-filter-action-${PROCESS_FILTER_ACTION_RESTORE}"]`);
            fixture.detectChanges();
            expect(resetButton.disabled).toBe(false);
            resetButton.click();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(resetDefaultsFilterSpy).toHaveBeenCalledWith(fakeFilter.appName, component.processFilter);
            expect(restoreDefaultProcessFiltersSpy).toHaveBeenCalledWith(fakeFilter.appName);
            expect(resetDefaultsEmitSpy).toHaveBeenCalledWith(expectedAction);
        });

        it('should display default filter actions when input is empty', async () => {
            component.toggleFilterActions = true;
            component.actions = [];
            component.id = 'mock-process-filter-id';

            fixture.detectChanges();
            await fixture.whenStable();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            await fixture.whenStable();

            const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            expect(component.processFilterActions).toBeDefined();
            expect(component.processFilterActions.length).toEqual(3);
            expect(saveButton).toBeDefined();
            expect(saveAsButton).toBeDefined();
            expect(deleteButton).toBeDefined();
        });

        it('should set the correct lastModifiedTo date', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'lastModified'];
            const processFilterIdChange = new SimpleChange(undefined, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });
            fixture.detectChanges();

            const date = moment();

            component.filterChange.subscribe(() => {
                expect(component.processFilter.lastModifiedTo.toISOString()).toEqual(date.toISOString());
                done();
            });

            const lastModifiedToControl = component.editProcessFilterForm.get('lastModifiedTo');
            lastModifiedToControl.setValue(date);
            date.set({
                hour: 23,
                minute: 59,
                second: 59
            });
        });

        it('should set date range filter type when range is selected', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedDateRange'];
            const processFilterIdChange = new SimpleChange(undefined, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });
            fixture.detectChanges();

            component.filterChange.subscribe(() => {
                const completedDateTypeControl = component.editProcessFilterForm.get('completedDateType');
                expect(completedDateTypeControl.value).toEqual(DateCloudFilterType.RANGE);
                done();
            });

            component.onFilterChange();
            fixture.detectChanges();

            const dateFilter = {
                startDate: moment().startOf('day').toISOString(true),
                endDate: moment().endOf('day').toISOString(true)
            };

            component.onDateRangeFilterChanged(dateFilter, {
                key: 'completedDateRange',
                label: '',
                type: 'date-range',
                value: '',
                attributes: {
                    dateType: 'completedDateType',
                    from: '_completedFrom',
                    to: '_completedTo'
                }
            });
        });

        it('should set the correct started date range when date range option is changed', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedDateRange'];
            const processFilterIdChange = new SimpleChange(undefined, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });
            fixture.detectChanges();

            component.filterChange.subscribe(() => {
                const dateFilter = {
                    startFrom: moment().startOf('day').toISOString(true),
                    startTo: moment().endOf('day').toISOString(true)
                };
                expect(component.processFilter.completedFrom).toEqual(dateFilter.startFrom);
                expect(component.processFilter.completedTo).toEqual(dateFilter.startTo);
                done();
            });

            const startedDateTypeControl = component.editProcessFilterForm.get('completedDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.TODAY);
        });

        it('should update form on date range value is updated', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'completedDateRange'];
            const processFilterIdChange = new SimpleChange(undefined, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });
            fixture.detectChanges();

            const dateFilter = {
                startDate: moment().startOf('day').toISOString(true),
                endDate: moment().endOf('day').toISOString(true)
            };

            component.filterChange.subscribe(() => {
                expect(component.processFilter.completedFrom).toEqual(dateFilter.startDate);
                expect(component.processFilter.completedTo).toEqual(dateFilter.endDate);
                done();
            });

            const startedDateTypeControl = component.editProcessFilterForm.get('completedDateType');
            startedDateTypeControl.setValue(DateCloudFilterType.RANGE);

            component.onDateRangeFilterChanged(dateFilter, {
                key: 'completedDateRange',
                label: '',
                type: 'date-range',
                value: '',
                attributes: {
                    dateType: 'completedDateType',
                    from: '_completedFrom',
                    to: '_completedTo'
                }
            });
        });

        it('should call restore default filters service on deletion of last filter', (done) => {
            component.toggleFilterActions = true;
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.returnValue(of([]));
            const restoreFiltersSpy = spyOn(component, 'restoreDefaultProcessFilters').and.returnValue(of([]));
            const deleteSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            deleteButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(deleteFilterSpy).toHaveBeenCalled();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(deleteSpy).toHaveBeenCalled();
                    expect(restoreFiltersSpy).toHaveBeenCalled();
                    done();
                });

            });
        });

        it('should not call restore default filters service on deletion first filter', (done) => {
            component.toggleFilterActions = true;
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.returnValue(of([new ProcessFilterCloudModel({ name: 'mock-filter-name' })]));
            const restoreFiltersSpy = spyOn(component, 'restoreDefaultProcessFilters').and.returnValue(of([]));
            const deleteSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
            deleteButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(deleteFilterSpy).toHaveBeenCalled();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(deleteSpy).toHaveBeenCalled();
                    expect(restoreFiltersSpy).not.toHaveBeenCalled();
                    done();
                });

            });
        });

        it('should build initiator as object array', () => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'initiator'];
            const processFilterIdChange = new SimpleChange(undefined, 'mock-process-filter-id', true);
            component.ngOnChanges({ id: processFilterIdChange });
            fixture.detectChanges();

            expect(component.initiatorOptions).toEqual([{ username: 'user1' }, { username: 'user2' }]);
        });
    });

    it('should add environment name to each application selector option label', () => {
        component.environmentList = fakeEnvironmentList;
        component.environmentId = fakeEnvironmentList[0].id;

        getRunningApplicationsSpy.and.returnValue(of(fakeApplicationInstanceWithEnvironment));
        component.getRunningApplications();
        expect(component.applicationNames[0].label).toBe('application-new-1 (test-env-name-1)');
    });
});
