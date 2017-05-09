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

import { ReflectiveInjector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { CoreModule, AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { ReportParametersModel, ParameterValueModel } from '../models/report.model';
import { AnalyticsService } from './analytics.service';
import { fakeReportList } from '../assets/analytics.service.mock';

declare let jasmine: any;

describe('Activiti Analytics Service', () => {

    let service: AnalyticsService;
    let apiService: AlfrescoApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                AnalyticsService
            ]
        });
        service = TestBed.get(AnalyticsService);
        apiService = TestBed.get(AlfrescoApiService);
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Content tests', () => {

        it('should return the report list by appId', (done) => {
            service.getReportList('1').subscribe(
                (reportList) => {
                    expect(reportList).toBeDefined();
                    expect(reportList.length).toEqual(2);
                    expect(reportList[0].name).toEqual('Fake Report 1');
                    expect(reportList[1].name).toEqual('Fake Report 2');
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeReportList)
            });
        });

        it('should return the report by report name', (done) => {
            service.getReportByName('Fake Report 2').subscribe(
                (report) => {
                    expect(report).toBeDefined();
                    expect(report).not.toBeNull();
                    expect(report.id).toEqual(2);
                    done();
                }
            );

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'application/json',
                responseText: JSON.stringify(fakeReportList)
            });
        });
    });
});
