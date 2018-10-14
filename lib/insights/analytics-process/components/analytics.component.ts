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

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReportQuery } from '../../diagram/models/report/reportQuery.model';
import { AnalyticsGeneratorComponent } from './analytics-generator.component';

@Component({
    selector: 'adf-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent implements OnChanges {

    @Input()
    appId: number;

    @Input()
    reportId: number;

    @Input()
    hideParameters: boolean = false;

    @Output()
    editReport = new EventEmitter();

    @Output()
    reportSaved = new EventEmitter();

    @Output()
    reportDeleted = new EventEmitter();

    @ViewChild('analyticsGenerator')
    analyticsGenerator: AnalyticsGeneratorComponent;

    reportParamQuery: ReportQuery;

    ngOnChanges(changes: SimpleChanges) {
        this.analyticsGenerator.reset();
    }

    public showReport($event) {
        this.analyticsGenerator.generateReport(this.reportId, $event);
    }

    public reset() {
        this.analyticsGenerator.reset();
    }

    public onEditReport(name: string) {
        this.editReport.emit(name);
    }

    public onSaveReportSuccess(reportId) {
        this.reportSaved.emit(reportId);
    }

    public onDeleteReportSuccess() {
        this.reportDeleted.emit();
    }

}
