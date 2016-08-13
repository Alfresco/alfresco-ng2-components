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

import { Component } from '@angular/core';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ProcessService } from './process.service';
import { Process } from './process.data';

import { FormService, ActivitiForm } from 'ng2-activiti-form';
import { NotificationService } from '../../services/notification.service';

declare let __moduleName: string;
declare let AlfrescoApi: any;

@Component({
    moduleId: __moduleName,
    selector: 'start-visit-component',
    templateUrl: './start-visit.component.html',
    styleUrls: ['./start-visit.component.css'],
    providers: [ProcessService, FormService],
    directives: [ActivitiForm]
})

export class StartVisitComponent {

    private sub: Subscription;

    currentPath: string = '/Sites/swsdp/documentLibrary';

    metadata: any = {};

    nodeId: string;

    nodeName: string;

    errorMessage: string;

    processName: string = "TEST";

    process: Process;

    taskId: string;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private processService: ProcessService,
                private authService: AlfrescoAuthenticationService,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.retriveNodeMetadataFromEcm(params['id']);
        });


        let self = this;
        this.processService.getDeployedApplications("Visit").subscribe(
            application => {
                console.log("I'm the application hello", application);
                this.processService.getProcessDefinitionByApplication(application).subscribe(
                    process => {
                        console.log("this is the process", process);
                        self.processService.startProcessByID(process.id, process.name).subscribe(
                            startedProcess => {
                                console.log(startedProcess);
                                this.processService.getTaskIdFromProcessID(process.id, application.id, startedProcess.id).subscribe(
                                    response => {
                                        console.log(response.data[0].id);
                                        self.taskId = response.data[0].id;
                                    },
                                    error => {
                                        console.log(error)
                                    }
                                );
                            },
                            error => {
                                console.log(error);
                            }
                        );
                    },
                    error => this.errorMessage = <any>error
                );
                console.log(application);
            },
            error => this.errorMessage = <any>error
        );
    }

    public saveData(){
        this.router.navigate(['/patients']);
        this.notificationService.sendNotification('New Visit Created');
    }

    private retriveNodeMetadataFromEcm(nodeId: string): void {
        var self = this;
        this.nodeId = nodeId;
        this.authService.getAlfrescoApi().nodes.getNodeInfo(this.nodeId).then(function (data) {
            console.log(data.properties);
            self.nodeName = data.name;
            for (var key in data.properties) {
                console.log(key + ' => ' + data[key]);
                self.metadata [key.replace('hc:', '')] = data.properties[key];
            }
            self.metadata.nodeId = self.nodeName;

        }, function (error) {
            console.log('This node does not exist');
        });
    }

    private generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
