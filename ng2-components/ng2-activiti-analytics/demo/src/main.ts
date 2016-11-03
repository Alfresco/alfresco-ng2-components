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

import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreModule } from 'ng2-alfresco-core';
import { AnalyticsModule } from 'ng2-activiti-analytics';

@Component({
    selector: 'activiti-analytics-demo',
    template: `
    <div class="page-content">
        <label for="appId"><b>Insert the appId:</b></label><br>
        <input id="appId" size="10" type="text" [(ngModel)]="appId">
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--4-col task-column mdl-shadow--2dp">
                <analytics-report-list (reportClick)="onReportClick($event)"></analytics-report-list>
            </div>
            <div class="mdl-cell mdl-cell--8-col task-column mdl-shadow--2dp">
                <activiti-analytics [appId]="appId" *ngIf="report" [reportId]="report.id"></activiti-analytics>
            </div>
        </div>
    </div>`
})

export class AnalyticsDemoComponent {

    appId: number;
    report: any;

    onReportClick(event: any) {
        this.report = event;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        AnalyticsModule
    ],
    declarations: [ AnalyticsDemoComponent ],
    bootstrap:    [ AnalyticsDemoComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
