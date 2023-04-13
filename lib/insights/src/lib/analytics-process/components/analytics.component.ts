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

import { Component, EventEmitter, Input, OnChanges, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReportQuery } from '../../diagram/models/report/report-query.model';
import { AnalyticsGeneratorComponent } from './analytics-generator.component';

@Component({
    selector: 'adf-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AnalyticsComponent implements OnChanges {

    /** appId ID of the target app. */
    @Input()
    appId: number;

    /** reportId. */
    @Input()
    reportId: string;

    /** hideParameters. */
    @Input()
    hideParameters: boolean = false;

    /** emitted when editReport. */
    @Output()
    editReport = new EventEmitter();

    /** emitted when reportSaved. */
    @Output()
    reportSaved = new EventEmitter();

    /** emitted when reportDeleted. */
    @Output()
    reportDeleted = new EventEmitter();

    @ViewChild('analyticsGenerator', { static: true })
    analyticsGenerator: AnalyticsGeneratorComponent;

    reportParamQuery: ReportQuery;

    ngOnChanges() {
        this.analyticsGenerator.reset();
    }

    public showReport($event: any) {
        this.analyticsGenerator.generateReport(`${this.reportId}`, $event);
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
