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

import { Input, NgModule, Component, OnInit, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppDefinitionRepresentationModel, ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { CoreModule } from 'ng2-alfresco-core';
import { ActivitiProcessListModule } from 'ng2-activiti-processlist';
import { AlfrescoAuthenticationService, AlfrescoSettingsService, StorageService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter } from 'ng2-alfresco-datatable';

const currentProcessIdNew = '__NEW__';

@Component({
    selector: 'alfresco-app-demo',
    template: `
    <label for="ticket"><b>Insert a valid ticket:</b></label><br>
    <input id="ticket" type="text" size="48" (change)="updateTicket()" [(ngModel)]="ticket"><br>
    <label for="host"><b>Insert the ip of your Activiti instance:</b></label><br>
    <input id="host" type="text" size="48" (change)="updateHost()" [(ngModel)]="host"><br><br>
    <div *ngIf="!authenticated" style="color:#FF2323">
        Authentication failed to ip {{ host }} with user: admin, admin, you can still try to add a valid ticket to perform
        operations.
    </div>
    <hr>

    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">

        <header class="mdl-layout__header">

            <!-- TABS -->

            <div class="mdl-layout__tab-bar mdl-js-ripple-effect" #tabheader>
                <a id="apps-header" href="#apps" class="mdl-layout__tab is-active">APPS</a>
                <a id="processes-header" href="#processes" class="mdl-layout__tab">PROCESS LIST</a>
            </div>
        </header>

        <main class="mdl-layout__content activiti" #tabmain>

            <!--  APPPS COMPONENT -->

            <section class="mdl-layout__tab-panel is-active" id="apps">
                <div class="page-content">
                    <activiti-apps [layoutType]="'GRID'" (appClick)="onAppClick($event)" #activitiapps></activiti-apps>
                </div>
            </section>

            <!--  PROCESS COMPONENT -->

            <section class="mdl-layout__tab-panel" id="processes">
                <div class="page-content">
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--2-col task-column">
                            <span>Process Filters</span>
                            <button type="button" (click)="navigateStartProcess()"
                                    class="mdl-button" data-automation-id="btn-start-process">Start Process</button>
                            <activiti-process-instance-filters
                                        [appId]="appId"
                                        (filterClick)="onProcessFilterClick($event)"
                                        (onSuccess)="onSuccessProcessFilterList($event)"
                                        #activitiprocessfilter></activiti-process-instance-filters>
                        </div>
                        <div class="mdl-cell mdl-cell--3-col task-column">
                            <span>Process List</span>
                            <activiti-process-instance-list *ngIf="processFilter?.hasFilter()" [appId]="processFilter.appId"
                                       [processDefinitionKey]="processFilter.filter.processDefinitionKey"
                                       [name]="processFilter.filter.name"
                                       [state]="processFilter.filter.state"
                                       [sort]="processFilter.filter.sort"
                                       [data]="dataProcesses"
                                        (rowClick)="onProcessRowClick($event)"
                                        (onSuccess)="onSuccessProcessList($event)"
                                        #activitiprocesslist></activiti-process-instance-list>
                        </div>
                        <div class="mdl-cell mdl-cell--7-col task-column" *ngIf="!isStartProcessMode()">
                            <span>Process Details</span>
                            <activiti-process-instance-details
                                        [processInstanceId]="currentProcessInstanceId"
                                        (taskFormCompleted)="taskFormCompleted()"
                                        (processCancelled)="processCancelled()"
                                        #activitiprocessdetails></activiti-process-instance-details>
                        </div>
                        <div class="mdl-cell mdl-cell--7-col task-column" *ngIf="isStartProcessMode()">
                            <span>Start Process</span>
                            <activiti-start-process [appId]="appId" (start)="onStartProcessInstance($event)"></activiti-start-process>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    </div>
`
})
class MyDemoApp implements OnInit {

    authenticated: boolean;

    host: string = 'http://localhost:9999';

    ticket: string;

    @ViewChild('tabmain')
    tabMain: any;

    @ViewChild('tabheader')
    tabHeader: any;

    @ViewChild('activitiprocessfilter')
    activitiprocessfilter: any;

    @ViewChild('activitiprocesslist')
    activitiprocesslist: any;

    @ViewChild('activitiprocessdetails')
    activitiprocessdetails: any;

    @ViewChild(ActivitiStartProcessInstance)
    activitiStartProcess: ActivitiStartProcessInstance;

    @Input()
    appId: number;

    processFilter: any;

    currentProcessInstanceId: string;

    dataProcesses: ObjectDataTableAdapter;

    constructor(private authService: AlfrescoAuthenticationService,
                private settingsService: AlfrescoSettingsService,
                private storage: StorageService) {
        settingsService.bpmHost = this.host;
        settingsService.setProviders('BPM');

        if (this.authService.getTicketBpm()) {
            this.ticket = this.authService.getTicketBpm();
        }

        this.dataProcesses = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'id', title: 'Id'},
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                {type: 'text', key: 'started', title: 'Started', sortable: true},
                {type: 'text', key: 'startedBy.email', title: 'Started By', sortable: true}
            ]
        );
    }

    public updateTicket(): void {
        this.storage.setItem('ticket-BPM', this.ticket);
    }

    public updateHost(): void {
        this.settingsService.bpmHost = this.host;
        this.login();
    }

    public ngOnInit(): void {
        this.login();
    }

    login() {
        this.authService.login('admin', 'admin').subscribe(
            ticket => {
                console.log(ticket);
                this.ticket = this.authService.getTicketBpm();
                this.authenticated = true;
            },
            error => {
                console.log(error);
                this.authenticated = false;
            });
    }

    onAppClick(app: AppDefinitionRepresentationModel) {
        this.appId = app.id;

        this.processFilter = null;
        this.currentProcessInstanceId = null;

        this.changeTab('apps', 'processes');
    }

    navigateStartProcess() {
        this.currentProcessInstanceId = currentProcessIdNew;
    }

    onStartProcessInstance(instance: ProcessInstance) {
        this.currentProcessInstanceId = instance.id;
        this.activitiStartProcess.reset();
    }

    isStartProcessMode() {
        return this.currentProcessInstanceId === currentProcessIdNew;
    }

    onProcessFilterClick(event: any) {
        this.processFilter = event;
    }

    onSuccessProcessFilterList(event: any) {
        this.processFilter = this.activitiprocessfilter.getCurrentFilter();
    }

    onSuccessProcessList(event: any) {
        this.currentProcessInstanceId = this.activitiprocesslist.getCurrentId();
    }

    onProcessRowClick(processInstanceId) {
        this.currentProcessInstanceId = processInstanceId;
    }

    processCancelled(data: any) {
        this.currentProcessInstanceId = null;
        this.activitiprocesslist.reload();
    }

    changeTab(origin: string, destination: string) {
        this.tabMain.nativeElement.children[origin].classList.remove('is-active');
        this.tabMain.nativeElement.children[destination].classList.add('is-active');

        this.tabHeader.nativeElement.children[`${origin}-header`].classList.remove('is-active');
        this.tabHeader.nativeElement.children[`${destination}-header`].classList.add('is-active');
    }

}

@NgModule({
    imports: [
        BrowserModule,
        CoreModule.forRoot(),
        ActivitiProcessListModule,
        ActivitiTaskListModule.forRoot()
    ],
    declarations: [MyDemoApp],
    bootstrap: [MyDemoApp]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
