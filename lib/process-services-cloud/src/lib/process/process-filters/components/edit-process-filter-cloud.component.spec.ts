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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

import { setupTestBed, AlfrescoApiService } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { EditProcessFilterCloudComponent } from './edit-process-filter-cloud.component';
import { ProcessFiltersCloudModule } from '../process-filters-cloud.module';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { fakeApplicationInstance } from './../../../app/mock/app-model.mock';
import moment from 'moment-es6';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessCloudService } from '../../services/process-cloud.service';
import { DateCloudFilterType } from '../../../models/date-cloud-filter.model';
import { ApplicationVersionModel } from '../../../models/application-version.model';
import { MatIconTestingModule } from '@angular/material/icon/testing';

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

    const mock = {
        oauth2Auth: {
            callCustomApi: () => Promise.resolve(fakeApplicationInstance),
            on: jasmine.createSpy('on')
        },
        isEcmLoggedIn() {
            return false;
        }
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
            afterClosed() {
                return of({
                    action: ProcessFilterDialogCloudComponent.ACTION_SAVE,
                    icon: 'icon',
                    name: 'fake-name'
                });
            }
        });
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

    it('should fetch process instance filter by id', async(() => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(getProcessFilterByIdSpy).toHaveBeenCalled();
            expect(component.processFilter.name).toEqual('FakeRunningProcess');
            expect(component.processFilter.icon).toEqual('adjust');
            expect(component.processFilter.status).toEqual('RUNNING');
            expect(component.processFilter.order).toEqual('ASC');
            expect(component.processFilter.sort).toEqual('id');
        });
    }));

    it('should display filter name as title', async(() => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.showProcessFilterName = true;
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-sub-title-id');

        fixture.whenStable().then(() => {
            expect(title).toBeDefined();
            expect(subTitle).toBeDefined();
            expect(title.innerText).toEqual('FakeRunningProcess');
            expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_PROCESS_FILTER.TITLE');
        });
    }));

    it('should not display filter name as title if the flag is false', async(() => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.showProcessFilterName = false;
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-title-id');

        fixture.whenStable().then(() => {
            expect(title).toBeNull();
        });
    }));

    it('should not display mat-spinner if isloading set to false', async(() => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const title = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-title-id');
        const subTitle = fixture.debugElement.nativeElement.querySelector('#adf-edit-process-filter-sub-title-id');
        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-process-filter-loading-margin');

        fixture.whenStable().then(() => {
            expect(matSpinnerElement).toBeNull();
            expect(title).toBeDefined();
            expect(subTitle).toBeDefined();
            expect(title.innerText).toEqual('FakeRunningProcess');
            expect(subTitle.innerText.trim()).toEqual('ADF_CLOUD_EDIT_PROCESS_FILTER.TITLE');
        });
    }));

    it('should display mat-spinner if isloading set to true', async(() => {
        component.isLoading = true;
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();

        const matSpinnerElement = fixture.debugElement.nativeElement.querySelector('.adf-cloud-edit-process-filter-loading-margin');

        fixture.whenStable().then(() => {
            expect(matSpinnerElement).toBeDefined();
        });
    }));

    describe('EditProcessFilter form', () => {

        beforeEach(() => {
            const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
            component.ngOnChanges({ 'id': processFilterIdChange });
            fixture.detectChanges();
        });

        it('should defined editProcessFilter form', () => {
            expect(component.editProcessFilterForm).toBeDefined();
        });

        it('should create editProcessFilter form', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
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
        }));

        describe('Save & Delete buttons', () => {
            it('should enable delete button for custom process filters', async(() => {
                component.toggleFilterActions = true;
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                    expect(deleteButton.disabled).toEqual(false);
                });
            }));
        });

        describe('SaveAs Button', () => {
            it('should enable saveAs button if the filter values are changed for default filter', (done) => {
                getProcessFilterByIdSpy.and.returnValue(of({
                    id: 'filter-id',
                    name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
                    sort: 'my-custom-sort',
                    processDefinitionId: 'process-definition-id',
                    priority: '12'
                }));

                const processFilterIdChange = new SimpleChange(null, 'filter-id', true);
                component.ngOnChanges({ 'id': processFilterIdChange });
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

        it('should display current process filter details', async(() => {
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
                expansionPanel.click();
                fixture.detectChanges();
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
        }));

        it('should display state drop down', async(() => {
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const statusOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(statusOptions.length).toEqual(5);
            });
        }));

        it('should display sort drop down', async(() => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"] .mat-select-trigger');
            sortElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(sortOptions.length).toEqual(4);
            });
        }));

        it('should display order drop down', async(() => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const orderElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-order"] .mat-select-trigger');
            orderElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const orderOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
                expect(orderOptions.length).toEqual(2);
            });
        }));
    });

    it('should have floating labels when values are present', async(() => {
        fixture.detectChanges();
        const inputLabelsNodes = document.querySelectorAll('mat-form-field');
        inputLabelsNodes.forEach(labelNode => {
            expect(labelNode.getAttribute('ng-reflect-float-label')).toBe('auto');
        });
    }));

    it('should be able to filter filterProperties when input is defined', async(() => {
        fixture.detectChanges();
        component.filterProperties = ['appName', 'processName'];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.processFilterProperties.length).toEqual(2);
            expect(component.processFilterProperties[0].key).toEqual('appName');
            expect(component.processFilterProperties[1].key).toEqual('processName');
        });
    }));

    it('should get form attributes', async() => {
        fixture.detectChanges();
        component.filterProperties = ['appName', 'completedDateRange'];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.editProcessFilterForm.get('_completedFrom')).toBeDefined();
            expect(component.editProcessFilterForm.get('_completedTo')).toBeDefined();
            expect(component.editProcessFilterForm.get('completedDateType')).toBeDefined();
        });
    });

    it('should get form attributes for suspendedData', async() => {
        const filter = new ProcessFilterCloudModel({
            id: 'filter-id',
            name: 'ADF_CLOUD_PROCESS_FILTERS.RUNNING_PROCESSES',
            sort: 'my-custom-sort',
            processDefinitionId: 'process-definition-id',
            priority: '12',
            suspendedDateType: DateCloudFilterType.RANGE
        });
        filter.suspendedFrom = new Date(2021, 1, 1).toString();
        filter.suspendedTo =  new Date(2021, 1, 2).toString();
        getProcessFilterByIdSpy.and.returnValue(of(filter));

        fixture.detectChanges();
        component.filterProperties = ['appName', 'suspendedDateRange'];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.editProcessFilterForm.get('_suspendedFrom').value).toEqual(new Date(2021, 1, 1).toString());
            expect(component.editProcessFilterForm.get('_suspendedTo').value).toEqual(new Date(2021, 1, 2).toString());
            expect(component.editProcessFilterForm.get('suspendedDateType').value).toEqual(DateCloudFilterType.RANGE);
        });
    });

    it('should able to build a editProcessFilter form with default properties if input is empty', async(() => {
        fixture.detectChanges();
        component.filterProperties = [];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const stateController = component.editProcessFilterForm.get('status');
            const sortController = component.editProcessFilterForm.get('sort');
            const orderController = component.editProcessFilterForm.get('order');
            const lastModifiedFromController = component.editProcessFilterForm.get('lastModifiedFrom');
            const lastModifiedToController = component.editProcessFilterForm.get('lastModifiedTo');
            fixture.detectChanges();
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
    }));

    it('should able to fetch running applications when appName property defined in the input', async(() => {
        fixture.detectChanges();
        component.filterProperties = ['appName', 'processName'];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const appController = component.editProcessFilterForm.get('appName');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getRunningApplicationsSpy).toHaveBeenCalled();
            expect(appController).toBeDefined();
            expect(appController.value).toEqual('mock-app-name');
        });
    }));

    it('should fetch applications when appName and appVersion input is set', async(() => {
        fixture.detectChanges();
        component.filterProperties = ['appName', 'processName', 'appVersion'];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const appController = component.editProcessFilterForm.get('appName');
        const appVersionController = component.editProcessFilterForm.get('appVersion');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(getRunningApplicationsSpy).toHaveBeenCalled();
            expect(appController).toBeDefined();
            expect(appController.value).toEqual('mock-app-name');
            expect(appVersionController).toBeDefined();
            expect(appVersionController.value).toEqual(1);
        });
    }));

    it('should fetch appVersionMultiple options when appVersionMultiple filter property is set', async () => {
        const mockAppVersion1: ApplicationVersionModel = {
            entry: {
                id: 'mock-version-1-id',
                name: 'mock-version-1-name',
                version: '1'
            }
        };

        const mockAppVersion2: ApplicationVersionModel = {
            entry: {
                id: 'mock-version-2-id',
                name: 'mock-version-2-name',
                version: '2'
            }
        };

        const applicationVersionsSpy = spyOn(processService, 'getApplicationVersions').and.returnValue(of([mockAppVersion1, mockAppVersion2]));
        fixture.detectChanges();

        component.filterProperties = ['appVersionMultiple'];
        fixture.detectChanges();

        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
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

    it('should fetch process definitions when processDefinitionName filter property is set', async(() => {
        const processSpy = spyOn(processService, 'getProcessDefinitions').and.returnValue(of([{ id: 'fake-id', name: 'fake-name' }]));
        fixture.detectChanges();
        component.filterProperties = ['processDefinitionName'];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const controller = component.editProcessFilterForm.get('processDefinitionName');
        const processDefinitionNamesElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-processDefinitionName"]');
        processDefinitionNamesElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(processSpy).toHaveBeenCalled();
            expect(controller).toBeDefined();
            const processDefinitionNamesOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(processDefinitionNamesOptions[0].nativeElement.value).toBeUndefined();
            expect(processDefinitionNamesOptions[0].nativeElement.innerText).toEqual(component.allProcessDefinitionNamesOption.label);
        });
    }));

    it('should display default sort properties', async(() => {
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
        expansionPanel.click();
        fixture.detectChanges();
        const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"]');
        sortElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const sortController = component.editProcessFilterForm.get('sort');
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            fixture.detectChanges();
            expect(sortController).toBeDefined();
            expect(sortController.value).toEqual('id');
            expect(sortOptions.length).toEqual(4);
        });
    }));

    it('should display sort properties when sort properties are specified', async(() => {
        getProcessFilterByIdSpy.and.returnValue(of({
            id: 'filter-id',
            processName: 'process-name',
            sort: 'my-custom-sort',
            processDefinitionId: 'process-definition-id',
            priority: '12'
        }));
        component.sortProperties = ['id', 'name', 'processDefinitionId'];
        fixture.detectChanges();
        const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
        expansionPanel.click();
        fixture.detectChanges();
        const sortElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-sort"]');
        sortElement.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const sortController = component.editProcessFilterForm.get('sort');
            const sortOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            expect(sortController).toBeDefined();
            expect(component.sortProperties).toBeDefined();
            expect(component.sortProperties.length).toBe(3);
            expect(sortController.value).toBe('my-custom-sort');
            expect(sortOptions.length).toEqual(3);
        });
    }));

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
        component.ngOnChanges({ 'id': processFilterIdChange });
        fixture.detectChanges();
        const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
        expansionPanel.click();
        fixture.detectChanges();
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
            component.ngOnChanges({ 'id': processFilterIdChange });
            getProcessFilterByIdSpy.and.returnValue(of(fakeFilter));
            fixture.detectChanges();
        });

        it('should emit save event and save the filter on click save button', async(() => {
            component.toggleFilterActions = true;
            const saveFilterSpy = spyOn(service, 'updateFilter').and.returnValue(of(fakeFilter));
            const saveSpy: jasmine.Spy = spyOn(component.action, 'emit');

            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[2].nativeElement.click();
            saveButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveFilterSpy).toHaveBeenCalled();
                expect(saveSpy).toHaveBeenCalled();
            });
        }));

        it('should emit delete event and delete the filter on click of delete button', (done) => {
            component.toggleFilterActions = true;
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.returnValue(of({}));
            const deleteSpy = spyOn(component.action, 'emit');
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
                    done();
                });

            });
        });

        it('should emit saveAs event and add filter on click saveAs button', async(() => {
            component.toggleFilterActions = true;
            const saveAsFilterSpy = spyOn(service, 'addFilter').and.callThrough();
            const saveAsSpy: jasmine.Spy = spyOn(component.action, 'emit');
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
            const stateOptions = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            stateOptions[2].nativeElement.click();
            fixture.detectChanges();
            saveButton.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveAsFilterSpy).toHaveBeenCalled();
                expect(saveAsSpy).toHaveBeenCalled();
                expect(dialog.open).toHaveBeenCalled();
            });
        }));

        it('should display default filter actions', async(() => {
            fixture.detectChanges();
            component.toggleFilterActions = true;
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(component.processFilterActions).toBeDefined();
                expect(component.processFilterActions.length).toEqual(3);
                expect(saveButton).toBeDefined();
                expect(saveAsButton).toBeDefined();
                expect(deleteButton).toBeDefined();
            });
        }));

        it('should filter actions when input actions are specified', async(() => {
            fixture.detectChanges();
            component.actions = ['save'];
            fixture.detectChanges();
            const processFilterIdChange = new SimpleChange(null, 'mock-process-filter-id', true);
            component.ngOnChanges({ 'id': processFilterIdChange });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.processFilterActions).toBeDefined();
                expect(component.actions.length).toEqual(1);
                expect(component.processFilterActions.length).toEqual(1);
            });
        }));

        it('should display default filter actions when input is empty', async(() => {
            fixture.detectChanges();
            component.toggleFilterActions = true;
            component.actions = [];
            component.id = 'mock-process-filter-id';
            fixture.detectChanges();

            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveAsButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(component.processFilterActions).toBeDefined();
                expect(component.processFilterActions.length).toEqual(3);
                expect(saveButton).toBeDefined();
                expect(saveAsButton).toBeDefined();
                expect(deleteButton).toBeDefined();
            });
        }));

        it('should set the correct lastModifiedTo date', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'lastModified'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
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
            const deleteFilterSpy = spyOn(service, 'deleteFilter').and.returnValue(of([{ name: 'mock-filter-name'}]));
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
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            expect(component.initiatorOptions).toEqual([ { username: 'user1' }, { username: 'user2'} ]);
        });
    });
});
