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

import { setupTestBed } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';
import { EditProcessFilterCloudComponent } from './edit-process-filter-cloud.component';
import { ProcessFiltersCloudModule } from '../process-filters-cloud.module';
import { ProcessFilterCloudModel } from '../models/process-filter-cloud.model';
import { ProcessFilterCloudService } from '../services/process-filter-cloud.service';
import { AppsProcessCloudService } from '../../../app/services/apps-process-cloud.service';
import { fakeApplicationInstance } from './../../../app/mock/app-model.mock';
import moment from 'moment-es6';
import { AbstractControl } from '@angular/forms';
import { PROCESS_FILTERS_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { LocalPreferenceCloudService } from '../../../services/local-preference-cloud.service';

describe('EditProcessFilterCloudComponent', () => {
    let component: EditProcessFilterCloudComponent;
    let service: ProcessFilterCloudService;
    let fixture: ComponentFixture<EditProcessFilterCloudComponent>;
    let dialog: MatDialog;
    let appsService: AppsProcessCloudService;
    let getRunningApplicationsSpy: jasmine.Spy;
    let getProcessFilterByIdSpy: jasmine.Spy;

    const fakeFilter = new ProcessFilterCloudModel({
        name: 'FakeRunningProcess',
        icon: 'adjust',
        id: 'mock-process-filter-id',
        status: 'RUNNING',
        appName: 'mock-app-name',
        appVersion: 1,
        processDefinitionId: 'process-def-id',
        order: 'ASC',
        sort: 'id'
    });

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, ProcessFiltersCloudModule],
        providers: [
            MatDialog,
            { provide: PROCESS_FILTERS_SERVICE_TOKEN, useClass: LocalPreferenceCloudService }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditProcessFilterCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.get(ProcessFilterCloudService);
        appsService = TestBed.get(AppsProcessCloudService);
        dialog = TestBed.get(MatDialog);
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
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
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

        it('should disable save button if the process filter is not changed', async(() => {
            component.toggleFilterActions = true;
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
                expect(saveButton.disabled).toEqual(true);
            });
        }));

        it('should disable saveAs button if the process filter is not changed', async(() => {
            component.toggleFilterActions = true;
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-saveAs"]');
                expect(saveButton.disabled).toEqual(true);
            });
        }));

        it('should enable delete button by default', async(() => {
            component.toggleFilterActions = true;
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const deleteButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-delete"]');
                expect(deleteButton.disabled).toEqual(false);
            });
        }));

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
                expect(stateElement.innerText.trim()).toEqual('RUNNING');
                expect(sortElement.innerText.trim()).toEqual('Id');
                expect(orderElement.innerText.trim()).toEqual('ASC');
            });
        }));

        it('should enable save button if the process filter is changed', async(() => {
            fixture.detectChanges();
            const expansionPanel = fixture.debugElement.nativeElement.querySelector('mat-expansion-panel-header');
            expansionPanel.click();
            const stateElement = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-cloud-edit-process-property-status"] .mat-select-trigger');
            stateElement.click();
            fixture.detectChanges();
            const saveButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="adf-filter-action-save"]');
            const options = fixture.debugElement.queryAll(By.css('.mat-option-text'));
            options[2].nativeElement.click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(saveButton.disabled).toEqual(false);
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
        component.sortProperties = ['id', 'processName', 'processDefinitionId'];
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
                expect(saveButton.disabled).toBeTruthy();
                expect(saveAsButton.disabled).toBeTruthy(false);
                expect(deleteButton.disabled).toEqual(false);
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
                expect(saveButton.disabled).toBeTruthy();
                expect(saveAsButton.disabled).toBeTruthy(false);
                expect(deleteButton.disabled).toEqual(false);
            });
        }));

        it('should set the correct lastModifiedTo date', (done) => {
            component.appName = 'fake';
            component.filterProperties = ['appName', 'processInstanceId', 'priority', 'lastModified'];
            const taskFilterIdChange = new SimpleChange(undefined, 'mock-task-filter-id', true);
            component.ngOnChanges({ 'id': taskFilterIdChange });
            fixture.detectChanges();

            const lastModifiedToControl: AbstractControl = component.editProcessFilterForm.get('lastModifiedTo');
            lastModifiedToControl.setValue(new Date().toISOString());
            const lastModifiedToFilter = moment(lastModifiedToControl.value);
            lastModifiedToFilter.set({
                hour: 23,
                minute: 59,
                second: 59
            });

            component.filterChange.subscribe(() => {
                expect(component.changedProcessFilter.lastModifiedTo.toISOString()).toEqual(lastModifiedToFilter.toISOString());
                done();
            });
            component.onFilterChange();
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
    });
});
