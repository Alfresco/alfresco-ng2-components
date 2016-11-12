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
import {
    ActivitiTaskListModule,
    AppDefinitionRepresentationModel,
    FilterRepresentationModel,
    ActivitiApps,
    ActivitiTaskList
} from 'ng2-activiti-tasklist';
import { CoreModule } from 'ng2-alfresco-core';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { ObjectDataTableAdapter, DataSorting } from 'ng2-alfresco-datatable';

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
                <a id="tasks-header" href="#tasks" class="mdl-layout__tab">TASKS LIST</a>
            </div>
        </header>

        <main class="mdl-layout__content activiti" #tabmain>

            <!--  APPPS COMPONENT -->

            <section class="mdl-layout__tab-panel is-active" id="apps">
                <div class="page-content">
                    <activiti-apps [layoutType]="'GRID'" (appClick)="onAppClick($event)" #activitiapps></activiti-apps>
                </div>
            </section>

            <!--  TASKS COMPONENT -->

            <section class="mdl-layout__tab-panel" id="tasks">
                <div class="page-content">
                    <div class="mdl-grid">
                        <div class="mdl-cell mdl-cell--2-col task-column mdl-shadow--2dp">
                            <span>Task Filters</span>
                            <activiti-start-task [appId]="appId"
                                                 (onSuccess)="onStartTaskSuccess($event)"></activiti-start-task>
                            <activiti-filters [appId]="appId"
                                              (filterClick)="onTaskFilterClick($event)"
                                              (onSuccess)="onSuccessTaskFilterList($event)"
                                              #activitifilter></activiti-filters>
                        </div>
                        <div class="mdl-cell mdl-cell--3-col task-column mdl-shadow--2dp">
                            <span>Task List</span>
                            <activiti-tasklist [taskFilter]="taskFilter"
                                               [data]="dataTasks"
                                               (rowClick)="onTaskRowClick($event)"
                                               (onSuccess)="onSuccessTaskList($event)"
                                               #activititasklist></activiti-tasklist>
                        </div>
                        <div class="mdl-cell mdl-cell--7-col task-column mdl-shadow--2dp">
                            <span>Task Details</span>
                            <activiti-task-details [taskId]="currentTaskId"
                                                   (formCompleted)="onFormCompleted($event)"
                                                   #activitidetails></activiti-task-details>
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

    @ViewChild('activitiapps')
    activitiapps: ActivitiApps;

    @ViewChild('tabmain')
    tabMain: any;

    @ViewChild('tabheader')
    tabHeader: any;

    @ViewChild('activitifilter')
    activitifilter: any;

    @ViewChild('activitidetails')
    activitidetails: any;

    @ViewChild('activititasklist')
    activititasklist: ActivitiTaskList;

    @Input()
    appId: number;

    layoutType: string;

    currentTaskId: string;

    taskSchemaColumns: any [] = [];

    taskFilter: any;

    dataTasks: ObjectDataTableAdapter;

    constructor(private authService: AlfrescoAuthenticationService, private settingsService: AlfrescoSettingsService) {
        settingsService.bpmHost = this.host;
        settingsService.setProviders('BPM');

        if (this.authService.getTicketBpm()) {
            this.ticket = this.authService.getTicketBpm();
        }

        this.dataTasks = new ObjectDataTableAdapter(
            [],
            [
                {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true},
                {type: 'text', key: 'started', title: 'Started', cssClass: 'hidden', sortable: true}
            ]
        );
        this.dataTasks.setSorting(new DataSorting('started', 'desc'));
    }

    public updateTicket(): void {
        localStorage.setItem('ticket-BPM', this.ticket);
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

        this.changeTab('apps', 'tasks');
    }

    onTaskFilterClick(event: FilterRepresentationModel) {
        this.taskFilter = event;
    }

    onSuccessTaskFilterList(event: any) {
        this.taskFilter = this.activitifilter.getCurrentFilter();
    }

    onStartTaskSuccess(event: any) {
        this.activititasklist.reload();
    }

    onSuccessTaskList(event: FilterRepresentationModel) {
        this.currentTaskId = this.activititasklist.getCurrentTaskId();
    }

    onTaskRowClick(taskId) {
        this.currentTaskId = taskId;
    }

    onFormCompleted(form) {
        this.activititasklist.load(this.taskFilter);
        this.currentTaskId = null;
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
        ActivitiTaskListModule.forRoot()
    ],
    declarations: [MyDemoApp],
    bootstrap: [MyDemoApp]
})
export class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
