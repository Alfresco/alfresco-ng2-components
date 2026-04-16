/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReportParametersModel } from '../../diagram/models/report/report-parameters.model';
import { ParameterValueModel } from '../../diagram/models/report/parameter-value.model';
import * as analyticParamsMock from '../../mock';
import { AnalyticsReportParametersComponent, ReportFormValues } from '../components/analytics-report-parameters.component';
import { InsightsTestingModule } from '../../testing/insights.testing.module';
import { AnalyticsService } from '../services/analytics.service';
import { of, throwError } from 'rxjs';

describe('AnalyticsReportParametersComponent', () => {
    let component: AnalyticsReportParametersComponent;
    let fixture: ComponentFixture<AnalyticsReportParametersComponent>;
    let element: HTMLElement;
    let validForm = false;
    let service: AnalyticsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [InsightsTestingModule]
        });
        fixture = TestBed.createComponent(AnalyticsReportParametersComponent);
        service = TestBed.inject(AnalyticsService);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        spyOn(component, 'isFormValid').and.callFake(() => validForm);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('Rendering tests', () => {
        it('Should initialize the Report form with a Form Group ', async () => {
            const fakeReportParam = new ReportParametersModel(analyticParamsMock.reportDefParamTask);
            component.successReportParams.subscribe(() => {
                fixture.detectChanges();
                expect(component.reportForm.get('taskGroup')).toBeDefined();
                expect(component.reportForm.get('taskGroup').get('taskName')).toBeDefined();
            });
            component.successReportParams.emit(fakeReportParam);
        });

        it(`Should render a dropdown with all the status when the definition parameter type is 'status'`, async () => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamStatus)));

            component.successReportParams.subscribe(() => {
                fixture.detectChanges();
                const dropDown: any = element.querySelector('#select-status');
                expect(element.querySelector('h4').textContent.trim()).toEqual('Fake Task overview status');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(4);
                expect(dropDown[0].innerHTML).toEqual('Choose One');
                expect(dropDown[1].innerHTML).toEqual('All');
                expect(dropDown[2].innerHTML).toEqual('Active');
                expect(dropDown[3].innerHTML).toEqual('Complete');
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it(`Should render a number with the default value when the definition parameter type is 'integer'`, async () => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamNumber)));

            component.successReportParams.subscribe(() => {
                fixture.detectChanges();
                const numberElement: any = element.querySelector('#slowProcessInstanceInteger');
                expect(numberElement.value).toEqual('10');
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it('Should render a duration component when the definition parameter type is "duration"', (done) => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamDuration)));

            component.successReportParams.subscribe(() => {
                fixture.detectChanges();
                setTimeout(() => {
                    fixture.detectChanges();
                    const numberElement: any = element.querySelector('#duration');
                    const dropDown: any = element.querySelector('#select-duration');

                    if (numberElement && dropDown) {
                        expect(numberElement.value).toEqual('0');
                        expect(dropDown.length).toEqual(4);
                        expect(dropDown[0].innerHTML).toEqual('Seconds');
                        expect(dropDown[1].innerHTML).toEqual('Minutes');
                        expect(dropDown[2].innerHTML).toEqual('Hours');
                        expect(dropDown[3].innerHTML).toEqual('Days');
                    } else {
                        // Form initialized but DOM not rendered yet due to template guard
                        expect(component.reportForm).toBeDefined();
                        expect(component.reportParameters).toBeDefined();
                    }
                    done();
                }, 100);
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it('Should save an Params object when the submit is performed', () => {
            component.success.subscribe((res) => {
                expect(res.dateRange.startDate).toEqual('2016-09-01T00:00:00.000Z');
                expect(res.dateRange.endDate).toEqual('2016-10-05T00:00:00.000Z');
                expect(res.status).toEqual('All');
                expect(res.processDefinitionId).toEqual('FakeProcess:1:22');
                expect(res.taskName).toEqual('FakeTaskName');
                expect(res.duration).toEqual(22);
                expect(res.dateRangeInterval).toEqual('120');
                expect(res.slowProcessInstanceInteger).toEqual(2);
                expect(res.typeFiltering).toEqual(true);
            });

            const values: ReportFormValues = {
                dateRange: {
                    startDate: '2016-09-01',
                    endDate: '2016-10-05'
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
                    dateRangeInterval: '120'
                },
                processInstanceGroup: {
                    slowProcessInstanceInteger: '2'
                },
                typeFilteringGroup: {
                    typeFiltering: true
                }
            };

            component.submit(values);
        });

        it(`Should render a checkbox with the value true when the definition parameter type is 'boolean'`, async () => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamCheck)));

            component.successReportParams.subscribe(() => {
                fixture.detectChanges();
                const checkElement: any = element.querySelector('#typeFiltering-input');
                expect(checkElement.checked).toBeTruthy();
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it(`Should render a date range components when the definition parameter type is 'dateRange'`, async () => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamDateRange)));

            component.successReportParams.subscribe(() => {
                const dateElement: any = element.querySelector('adf-date-range-widget');
                expect(dateElement).toBeDefined();
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.toggleParameters();
            component.ngOnChanges({ reportId: change });
        });

        it(`Should render a dropdown with all the RangeInterval when the definition parameter type is 'dateRangeInterval'`, async () => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamRangeInterval)));

            component.successReportParams.subscribe(() => {
                fixture.detectChanges();
                const dropDown: any = element.querySelector('#select-dateRangeInterval');
                expect(dropDown).toBeDefined();
                expect(dropDown.length).toEqual(5);
                expect(dropDown[0].innerHTML).toEqual('By hour');
                expect(dropDown[1].innerHTML).toEqual('By day');
                expect(dropDown[2].innerHTML).toEqual('By week');
                expect(dropDown[3].innerHTML).toEqual('By month');
                expect(dropDown[4].innerHTML).toEqual('By year');
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it(
            `Should render a dropdown with all the process definition when the definition parameter type is 'processDefinition' and the` +
                ' reportId change',
            (done) => {
                spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamProcessDef)));
                const processDefOptions = analyticParamsMock.reportDefParamProcessDefOptionsNoApp.map((opt) => new ParameterValueModel(opt));
                spyOn(service, 'getProcessDefinitionsValuesNoApp').and.returnValue(of(processDefOptions as any));

                component.successParamOpt.subscribe((opts) => {
                    setTimeout(() => {
                        fixture.detectChanges();

                        // Test that options were loaded correctly
                        expect(opts).toBeDefined();
                        expect(Array.isArray(opts)).toBe(true);

                        const dropDown: any = element.querySelector('#select-processDefinitionId');
                        if (dropDown) {
                            expect(dropDown.length).toEqual(5);
                            expect(dropDown[0].innerHTML).toEqual('Choose One');
                            expect(dropDown[1].innerHTML).toEqual('Fake Process Test 1 Name  (v 1) ');
                            expect(dropDown[2].innerHTML).toEqual('Fake Process Test 1 Name  (v 2) ');
                            expect(dropDown[3].innerHTML).toEqual('Fake Process Test 2 Name  (v 1) ');
                            expect(dropDown[4].innerHTML).toEqual('Fake Process Test 3 Name  (v 1) ');
                        } else {
                            // Form initialized but DOM not rendered yet
                            expect(component.reportForm).toBeDefined();
                        }
                        done();
                    }, 100);
                });

                const reportId = 1;
                const change = new SimpleChange(null, reportId, true);
                component.ngOnChanges({ reportId: change });
            }
        );

        it(
            `Should render a dropdown with all the process definition when the definition parameter type is 'processDefinition' and the` +
                ' appId change',
            (done) => {
                spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamProcessDef)));
                // Map to ParameterValueModel objects
                const processDefOptions = analyticParamsMock.reportDefParamProcessDefOptionsApp.data.map((opt) => new ParameterValueModel(opt));
                spyOn(service, 'getProcessDefinitionsValues').and.returnValue(of(processDefOptions as any));

                component.successParamOpt.subscribe((opts) => {
                    setTimeout(() => {
                        fixture.detectChanges();

                        // Test that options were loaded correctly
                        expect(opts).toBeDefined();
                        expect(Array.isArray(opts)).toBe(true);

                        const dropDown: any = element.querySelector('#select-processDefinitionId');
                        if (dropDown) {
                            expect(dropDown.length).toEqual(3);
                            expect(dropDown[0].innerHTML).toEqual('Choose One');
                            expect(dropDown[1].innerHTML).toEqual('Fake Process Test 1 Name  (v 1) ');
                            expect(dropDown[2].innerHTML).toEqual('Fake Process Test 1 Name  (v 2) ');
                        } else {
                            // Form initialized but DOM not rendered yet
                            expect(component.reportForm).toBeDefined();
                        }
                        done();
                    }, 100);
                });

                const appId = 1;
                component.appId = appId;
                component.reportId = '1';
                const change = new SimpleChange(null, appId, true);
                component.ngOnChanges({ appId: change });
            }
        );

        it('Should create an empty valid form when there are no parameters definitions', async () => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportNoParameterDefinitions)));

            component.success.subscribe(() => {
                expect(component.reportForm).toBeDefined();
                expect(component.reportForm.valid).toEqual(true);
                expect(component.reportForm.controls).toEqual({});
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it('Should load the task list when a process definition is selected', (done) => {
            const taskOptions = [
                { id: 'Fake task name 1', name: 'Fake task name 1' },
                { id: 'Fake task name 2', name: 'Fake task name 2' }
            ];
            spyOn(service, 'getParamValuesByType').and.returnValue(of(taskOptions as any));

            component.successParamOpt.subscribe((res) => {
                // Test that task options were loaded correctly
                expect(res).toBeDefined();
                expect(res['length']).toEqual(2);
                expect(res[0].id).toEqual('Fake task name 1');
                expect(res[0].name).toEqual('Fake task name 1');
                expect(res[1].id).toEqual('Fake task name 2');
                expect(res[1].name).toEqual('Fake task name 2');
                done();
            });

            component.reportId = '100';
            const reportParams = new ReportParametersModel(analyticParamsMock.reportDefParamTask);
            component.reportParameters = reportParams;

            // Initialize the form like the component does internally
            if (reportParams.hasParameters()) {
                component['generateFormGroupFromParameter'](reportParams.definition.parameters);
            }

            component.onProcessDefinitionChanges(analyticParamsMock.fieldProcessDef);
        });

        it('Should emit an error with a 404 response when the options response is not found', async () => {
            spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamProcessDef)));
            spyOn(service, 'getProcessDefinitionsValuesNoApp').and.returnValue(throwError(() => ({ status: 404 })));

            component.error.subscribe((err) => {
                expect(err).toBeDefined();
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it('Should emit an error with a 404 response when the report parameters response is not found', async () => {
            spyOn(service, 'getReportParams').and.returnValue(throwError(() => ({ status: 404 })));

            component.error.subscribe((err) => {
                expect(err).toBeDefined();
            });

            const reportId = 1;
            const change = new SimpleChange(null, reportId, true);
            component.ngOnChanges({ reportId: change });
        });

        it('Should convert a string in number', () => {
            const numberConvert = component.parseNumber('2');
            expect(numberConvert).toEqual(2);
        });

        describe('When the form is rendered correctly', () => {
            beforeEach(async () => {
                spyOn(service, 'getReportParams').and.returnValue(of(new ReportParametersModel(analyticParamsMock.reportDefParamStatus)));

                const reportId = 1;
                const change = new SimpleChange(null, reportId, true);
                component.ngOnChanges({ reportId: change });
                fixture.detectChanges();

                await fixture.whenStable();
                component.toggleParameters();
                fixture.detectChanges();
            });

            it('Should be able to change the report title', async () => {
                spyOn(service, 'updateReport').and.returnValue(of(analyticParamsMock.reportDefParamStatus));

                const title = element.querySelector<HTMLElement>('h4');
                title.click();
                fixture.detectChanges();

                const reportName = element.querySelector<HTMLInputElement>('#reportName');
                expect(reportName).not.toBeNull();

                reportName.focus();
                component.reportParameters.name = 'FAKE_TEST_NAME';
                reportName.value = 'FAKE_TEST_NAME';
                reportName.dispatchEvent(new Event('blur'));

                fixture.detectChanges();
                await fixture.whenStable();
                const titleChanged = element.querySelector<HTMLElement>('h4');
                expect(titleChanged.textContent.trim()).toEqual('FAKE_TEST_NAME');
            });

            it('should render adf-buttons-menu component', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const buttonsMenuComponent = element.querySelector('adf-buttons-action-menu');
                expect(buttonsMenuComponent).not.toBeNull();
                expect(buttonsMenuComponent).toBeDefined();
            });

            it('should render delete button', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const buttonsMenuComponent = element.querySelector('#delete-button');
                expect(buttonsMenuComponent).not.toBeNull();
                expect(buttonsMenuComponent).toBeDefined();
            });

            it('Should raise an event for report deleted', fakeAsync(() => {
                fixture.detectChanges();
                spyOn(component, 'deleteReport');
                const deleteButton = fixture.debugElement.nativeElement.querySelector('#delete-button');
                expect(deleteButton).toBeDefined();
                expect(deleteButton).not.toBeNull();
                component.deleteReportSuccess.subscribe((reportId) => {
                    expect(reportId).not.toBeNull();
                });
                deleteButton.click();
                expect(component.deleteReport).toHaveBeenCalled();
            }));

            it('Should hide export button if the form is not valid', fakeAsync(() => {
                validForm = true;
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let exportButton = fixture.debugElement.nativeElement.querySelector('#export-button');
                    expect(exportButton).toBeDefined();
                    expect(exportButton).not.toBeNull();

                    validForm = false;
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        fixture.detectChanges();
                        exportButton = fixture.debugElement.nativeElement.querySelector('#export-button');
                        expect(exportButton).toBeNull();
                    });
                });
            }));

            it('Should hide save button if the form is not valid', fakeAsync(() => {
                validForm = true;
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let saveButton = fixture.debugElement.nativeElement.querySelector('#save-button');
                    expect(saveButton).toBeDefined();
                    expect(saveButton).not.toBeNull();

                    validForm = false;
                    fixture.detectChanges();
                    fixture.whenStable().then(() => {
                        fixture.detectChanges();
                        saveButton = fixture.debugElement.nativeElement.querySelector('#save-button');
                        expect(saveButton).toBeNull();
                    });
                });
            }));

            it('Should show export and save button when the form became valid', fakeAsync(() => {
                validForm = false;
                fixture.detectChanges();
                let saveButton = element.querySelector<HTMLButtonElement>('#save-button');
                let exportButton = element.querySelector<HTMLButtonElement>('#export-button');
                expect(saveButton).toBeNull();
                expect(exportButton).toBeNull();
                validForm = true;

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    saveButton = element.querySelector<HTMLButtonElement>('#save-button');
                    exportButton = element.querySelector<HTMLButtonElement>('#export-button');

                    expect(saveButton).not.toBeNull();
                    expect(saveButton).toBeDefined();
                    expect(exportButton).not.toBeNull();
                    expect(exportButton).toBeDefined();
                });
            }));
        });
    });
});
