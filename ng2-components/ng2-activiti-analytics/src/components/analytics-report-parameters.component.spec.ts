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

import { DebugElement, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdButtonModule, MdTooltipModule, OVERLAY_PROVIDERS } from '@angular/material';
import * as moment from 'moment';
import { AlfrescoTranslationService, AppConfigModule, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

import * as analyticParamsMock from '../assets/analyticsParamsReportComponent.mock';
import { AnalyticsReportParametersComponent } from '../components/analytics-report-parameters.component';
import { WIDGET_DIRECTIVES } from '../components/widgets/index';
import { ReportParametersModel } from '../models/report.model';
import { AnalyticsService } from '../services/analytics.service';

declare let jasmine: any;

describe('AnalyticsReportParametersComponent', () => {

    let component: AnalyticsReportParametersComponent;
    let fixture: ComponentFixture<AnalyticsReportParametersComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    let componentHandler: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                AppConfigModule.forRoot('app.config.json', {
                    bpmHost: 'http://localhost:9876/bpm'
                }),
                MdTooltipModule,
                MdButtonModule
            ],
            declarations: [
                AnalyticsReportParametersComponent,
                ...WIDGET_DIRECTIVES
            ],
            providers: [
                AnalyticsService,
                OVERLAY_PROVIDERS
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => {
            return Observable.of(key);
        });

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalyticsReportParametersComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Rendering tests', () => {
        beforeEach(() => {
            jasmine.Ajax.install();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it('Should initialize the Report form with a Form Group ', (done) => {
            let fakeReportParam = new ReportParametersModel(analyticParamsMock.reportDefParamTask);
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();
                expect(component.reportForm.get('taskGroup')).toBeDefined();
                expect(component.reportForm.get('taskGroup').get('taskName')).toBeDefined();
                done();
            });
            component.onSuccessReportParams.emit(fakeReportParam);
        });

        it('Should render a dropdown with all the status when the definition parameter type is \'status\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-status');
                expect(element.querySelector('h4').textContent.trim()).toEqual('Fake Task overview status');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(4);
                expect(dropDown[0].innerHTML).toEqual('Choose One');
                expect(dropDown[1].innerHTML).toEqual('All');
                expect(dropDown[2].innerHTML).toEqual('Active');
                expect(dropDown[3].innerHTML).toEqual('Complete');
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamStatus
            });
        });

        it('Should render a number with the default value when the definition parameter type is \'integer\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();
                let numberElement: any = element.querySelector('#slowProcessInstanceInteger');
                expect(numberElement.value).toEqual('10');

                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamNumber
            });
        });

        it('Should render a duration component when the definition parameter type is \'duration\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();
                let numberElement: any = element.querySelector('#duration');
                expect(numberElement.value).toEqual('0');

                let dropDown: any = element.querySelector('#select-duration');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(4);
                expect(dropDown[0].innerHTML).toEqual('Seconds');
                expect(dropDown[1].innerHTML).toEqual('Minutes');
                expect(dropDown[2].innerHTML).toEqual('Hours');
                expect(dropDown[3].innerHTML).toEqual('Days');
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamDuration
            });
        });

        it('Should save an Params object when the submit is performed', () => {
            component.onSuccess.subscribe((res) => {
                expect(res.dateRange.startDate).toEqual('2016-09-01T00:00:00.000Z');
                expect(res.dateRange.endDate).toEqual('2016-10-05T00:00:00.000Z');
                expect(res.status).toEqual('All');
                expect(res.processDefinitionId).toEqual('FakeProcess:1:22');
                expect(res.taskName).toEqual('FakeTaskName');
                expect(res.duration).toEqual(22);
                expect(res.dateRangeInterval).toEqual(120);
                expect(res.slowProcessInstanceInteger).toEqual(2);
                expect(res.typeFiltering).toEqual(true);
            });

            let values: any = {
                dateRange: {
                    startDate: '2016-09-01', endDate: '2016-10-05'
                },
                statusGroup: {
                    status: 'All'
                },
                processDefGroup: {
                    processDefinitionId: 'FakeProcess:1:22'
                },
                taskGroup: {
                    taskName: 'FakeTaskName'
                },
                durationGroup: {
                    duration: 22
                },
                dateIntervalGroup: {
                    dateRangeInterval: 120
                },
                processInstanceGroup: {
                    slowProcessInstanceInteger: 2
                },
                typeFilteringGroup: {
                    typeFiltering: true
                }
            };
            component.submit(values);
        });

        it('Should render a checkbox with the value true when the definition parameter type is \'boolean\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();
                let checkElement: any = element.querySelector('#typeFiltering');
                expect(checkElement.checked).toBeTruthy();
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamCheck
            });
        });

        it('Should render a date range components when the definition parameter type is \'dateRange\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();

                let today = moment().format('YYYY-MM-DD');

                const startDate: any = element.querySelector('#startDateInput');
                const endDate: any = element.querySelector('#endDateInput');

                expect(startDate.value).toEqual(today);
                expect(endDate.value).toEqual(today);
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamDateRange
            });
        });

        it('Should render a dropdown with all the RangeInterval when the definition parameter type is \'dateRangeInterval\' ', (done) => {
            component.onSuccessReportParams.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-dateRangeInterval');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(5);
                expect(dropDown[0].innerHTML).toEqual('By hour');
                expect(dropDown[1].innerHTML).toEqual('By day');
                expect(dropDown[2].innerHTML).toEqual('By week');
                expect(dropDown[3].innerHTML).toEqual('By month');
                expect(dropDown[4].innerHTML).toEqual('By year');
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamRangeInterval
            });
        });

        it('Should render a dropdown with all the process definition when the definition parameter type is \'processDefinition\' and the' +
            ' reportId change', (done) => {
            component.onSuccessParamOpt.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-processDefinitionId');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(5);
                expect(dropDown[0].innerHTML).toEqual('Choose One');
                expect(dropDown[1].innerHTML).toEqual('Fake Process Test 1 Name  (v 1) ');
                expect(dropDown[2].innerHTML).toEqual('Fake Process Test 1 Name  (v 2) ');
                expect(dropDown[3].innerHTML).toEqual('Fake Process Test 2 Name  (v 1) ');
                expect(dropDown[4].innerHTML).toEqual('Fake Process Test 3 Name  (v 1) ');
                done();
            });

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/report-params/1').andReturn({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamProcessDef
            });

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/process-definitions').andReturn({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamProcessDefOptionsNoApp
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

        });

        it('Should render a dropdown with all the process definition when the definition parameter type is \'processDefinition\' and the' +
            ' appId change', (done) => {
            component.onSuccessParamOpt.subscribe(() => {
                fixture.detectChanges();
                let dropDown: any = element.querySelector('#select-processDefinitionId');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(3);
                expect(dropDown[0].innerHTML).toEqual('Choose One');
                expect(dropDown[1].innerHTML).toEqual('Fake Process Test 1 Name  (v 1) ');
                expect(dropDown[2].innerHTML).toEqual('Fake Process Test 1 Name  (v 2) ');
                done();
            });

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/report-params/1').andReturn({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamProcessDef
            });

            let appId = '1';

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/api/enterprise/process-definitions?appDefinitionId=' + appId).andReturn({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamProcessDefOptionsApp
            });

            component.appId = appId;
            component.reportId = '1';
            let change = new SimpleChange(null, appId, true);
            component.ngOnChanges({ 'appId': change });

        });

        it('Should create an empty valid form when there are no parameters definitions', () => {
            component.onSuccess.subscribe((res) => {
                expect(component.reportForm).toBeDefined();
                expect(component.reportForm.valid).toEqual(true);
                expect(component.reportForm.controls).toEqual({});
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportNoParameterDefinitions
            });
        });

        it('Should load the task list when a process definition is selected', () => {
            component.onSuccessReportParams.subscribe((res) => {
                expect(res).toBeDefined();
                expect(res.length).toEqual(2);
                expect(res[0].id).toEqual('Fake task name 1');
                expect(res[0].name).toEqual('Fake task name 1');
                expect(res[1].id).toEqual('Fake task name 2');
                expect(res[1].name).toEqual('Fake task name 2');
            });

            component.reportId = '100';
            component.reportParameters = new ReportParametersModel(analyticParamsMock.reportDefParamTask);
            component.onProcessDefinitionChanges(analyticParamsMock.fieldProcessDef);

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamTaskOptions
            });
        });

        it('Should emit an error with a 404 response when the options response is not found', (done) => {
            component.onError.subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/report-params/1').andReturn({
                status: 200,
                contentType: 'json',
                responseText: analyticParamsMock.reportDefParamProcessDef
            });

            jasmine.Ajax.stubRequest('http://localhost:9876/bpm/activiti-app/app/rest/reporting/process-definitions').andReturn({
                status: 404,
                contentType: 'json',
                responseText: []
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

        });

        it('Should emit an error with a 404 response when the report parameters response is not found', (done) => {
            component.onError.subscribe((err) => {
                expect(err).toBeDefined();
                done();
            });

            let reportId = 1;
            let change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ 'reportId': change });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 404,
                contentType: 'json',
                responseText: []
            });
        });

        it('Should convert a string in number', () => {
            let numberConvert = component.convertNumber('2');
            expect(numberConvert).toEqual(2);
        });

        describe('When the form is rendered correctly', () => {
            let validForm: boolean = true;
            let values: any = {
                dateRange: {
                    startDate: '2016-09-01', endDate: '2016-10-05'
                },
                statusGroup: {
                    status: 'All'
                },
                processDefGroup: {
                    processDefinitionId: 'FakeProcess:1:22'
                },
                taskGroup: {
                    taskName: 'FakeTaskName'
                },
                durationGroup: {
                    duration: 22
                },
                dateIntervalGroup: {
                    dateRangeInterval: 120
                },
                processInstanceGroup: {
                    slowProcessInstanceInteger: 2
                },
                typeFilteringGroup: {
                    typeFiltering: true
                }
            };

            beforeEach(async(() => {
                let reportId = 1;
                let change = new SimpleChange(null, reportId, true);
                component.ngOnChanges({ 'reportId': change });
                fixture.detectChanges();

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json',
                    responseText: analyticParamsMock.reportDefParamStatus
                });

                fixture.whenStable().then(() => {
                    component.toggleParameters();
                    component.reportId = '1';
                    spyOn(component, 'isFormValid').and.callFake(() => {
                        return validForm;
                    });
                    fixture.detectChanges();
                });
            }));

            afterEach(() => {
                validForm = true;
            });

            it('Should be able to change the report title', (done) => {

                let title: HTMLElement = element.querySelector('h4');
                title.click();
                fixture.detectChanges();

                let reportName: HTMLInputElement = <HTMLInputElement> element.querySelector('#reportName');
                expect(reportName).not.toBeNull();

                reportName.focus();
                component.reportParameters.name = 'FAKE_TEST_NAME';
                reportName.value = 'FAKE_TEST_NAME';
                reportName.dispatchEvent(new Event('blur'));

                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let titleChanged: HTMLElement = element.querySelector('h4');
                    expect(titleChanged.textContent.trim()).toEqual('FAKE_TEST_NAME');
                    done();
                });

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json',
                    responseText: analyticParamsMock.reportDefParamStatus
                });
            });

            it('Should show a dialog to allowing report save', async(() => {
                component.saveReportSuccess.subscribe((repId) => {
                    let reportDialogTitle: HTMLElement = <HTMLElement> element.querySelector('#report-dialog');
                    expect(reportDialogTitle.getAttribute('open')).toBeNull();
                    expect(repId).toBe('1');
                });

                component.submit(values);
                fixture.detectChanges();
                let saveButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#save-button');
                expect(saveButton).toBeDefined();
                expect(saveButton).not.toBeNull();
                saveButton.click();

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let reportDialogTitle: HTMLElement = <HTMLElement> element.querySelector('#report-dialog-title');
                    let saveTitleSubMessage: HTMLElement = <HTMLElement> element.querySelector('#save-title-submessage');
                    let inputSaveName: HTMLInputElement = <HTMLInputElement> element.querySelector('#repName');
                    let performActionButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#action-dialog-button');
                    let todayDate = component.getTodayDate();

                    expect(reportDialogTitle).not.toBeNull();
                    expect(saveTitleSubMessage).not.toBeNull();
                    expect(inputSaveName.value.trim()).toEqual(analyticParamsMock.reportDefParamStatus.name + ' ( ' + todayDate + ' )');
                    expect(performActionButton).not.toBeNull();

                    performActionButton.click();

                    jasmine.Ajax.requests.mostRecent().respondWith({
                        status: 200,
                        contentType: 'json'
                    });
                });
            }));

            it('Should show a dialog to allowing report export', async(() => {
                component.submit(values);
                fixture.detectChanges();
                let exportButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#export-button');

                expect(exportButton).toBeDefined();
                expect(exportButton).not.toBeNull();
                exportButton.click();

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let reportDialogTitle: HTMLElement = <HTMLElement> element.querySelector('#report-dialog-title');
                    let inputSaveName: HTMLInputElement = <HTMLInputElement> element.querySelector('#repName');
                    let performActionButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#action-dialog-button');
                    let todayDate = component.getTodayDate();

                    expect(reportDialogTitle).not.toBeNull();
                    expect(inputSaveName.value.trim()).toEqual(analyticParamsMock.reportDefParamStatus.name + ' ( ' + todayDate + ' )');
                    expect(performActionButton).not.toBeNull();

                    performActionButton.click();

                    jasmine.Ajax.requests.mostRecent().respondWith({
                        status: 200,
                        contentType: 'json'
                    });
                });
            }));

            it('Should raise an event for report deleted', async(() => {
                let deleteButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#delete-button');
                expect(deleteButton).toBeDefined();
                expect(deleteButton).not.toBeNull();

                component.deleteReportSuccess.subscribe((reportId) => {
                    expect(reportId).not.toBeNull();
                });

                deleteButton.click();

                jasmine.Ajax.requests.mostRecent().respondWith({
                    status: 200,
                    contentType: 'json'
                });
            }));

            it('Should hide export button if the form is not valid', async(() => {
                let exportButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#export-button');
                expect(exportButton).toBeDefined();
                expect(exportButton).not.toBeNull();
                validForm = false;

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    exportButton = <HTMLButtonElement> element.querySelector('#export-button');
                    expect(exportButton).toBeNull();
                });
            }));

            it('Should hide save button if the form is not valid', async(() => {
                let saveButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#save-button');
                expect(saveButton).toBeDefined();
                expect(saveButton).not.toBeNull();
                validForm = false;

                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    saveButton = <HTMLButtonElement> element.querySelector('#save-button');
                    expect(saveButton).toBeNull();
                });
            }));

            it('Should show export and save button when the form became valid', async(() => {
                validForm = false;
                fixture.detectChanges();
                let saveButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#save-button');
                let exportButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#export-button');
                expect(saveButton).toBeNull();
                expect(exportButton).toBeNull();
                validForm = true;

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    saveButton = <HTMLButtonElement> element.querySelector('#save-button');
                    exportButton = <HTMLButtonElement> element.querySelector('#export-button');

                    expect(saveButton).not.toBeNull();
                    expect(saveButton).toBeDefined();
                    expect(exportButton).not.toBeNull();
                    expect(exportButton).toBeDefined();
                });
            }));
        });

    });
});
