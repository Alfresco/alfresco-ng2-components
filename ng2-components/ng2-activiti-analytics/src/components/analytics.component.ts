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

import { Component, EventEmitter, OnChanges, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { AnalyticsService } from '../services/analytics.service';
import { ReportQuery } from '../models/report.model';
import { AnalyticsGeneratorComponent } from './analytics-generator.component';

@Component({
    moduleId: module.id,
    selector: 'activiti-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnChanges {

    @Input()
    appId: number;

    @Input()
    reportId: number;

    @Input()
    hideParameters: boolean = false;

    @Input()
    debug: boolean = false;

    @Output()
    editReport = new EventEmitter();

    @Output()
    reportSaved = new EventEmitter();

    @Output()
    reportDeleted = new EventEmitter();

    @ViewChild('analyticsgenerator')
    analyticsgenerator: AnalyticsGeneratorComponent;

    reportParamQuery: ReportQuery;

    constructor(private translateService: AlfrescoTranslationService,
                private analyticsService: AnalyticsService,
                private logService: LogService) {
        logService.info('AnalyticsComponent');
        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-analytics', 'node_modules/ng2-activiti-analytics/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.analyticsgenerator.reset();
    }

    public showReport($event) {
        this.analyticsgenerator.generateReport(this.reportId, $event);
    }

    public reset() {
        this.analyticsgenerator.reset();
    }

    public onEditReport(name: string) {
        this.editReport.emit(name);
    }

    public onSaveReportSuccess() {
        this.reportSaved.emit();
    }

    public onDeleteReportSuccess() {
        this.reportDeleted.emit();
    }

}
