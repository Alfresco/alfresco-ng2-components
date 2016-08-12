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
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { FormService, ActivitiForm } from 'ng2-activiti-form';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { ALFRESCO_ULPOAD_COMPONENTS } from 'ng2-alfresco-upload';

declare let __moduleName: string;
declare let AlfrescoApi: any;

@Component({
    moduleId: __moduleName,
    selector: 'createpatient-component',
    templateUrl: './createpatient.component.html',
    styleUrls: ['./createpatient.component.css'],
    providers: [FormService],
    directives: [ALFRESCO_ULPOAD_COMPONENTS, ActivitiForm]
})
export class CreatePatientComponent {

    currentPath: string = '/Sites/swsdp/documentLibrary';

    metadata: any = {};

    photoNode: string = "";

    imgSrc: string = "app/img/anonymous.gif";

    constructor(private authService: AlfrescoAuthenticationService, private router: Router,
                private notificationService: NotificationService,
                private alfrescoSettingsService: AlfrescoSettingsService) {
    }

    public fileUploaded(data) {
        if (data && data.value) {
            this.photoNode = data.value.entry.id;
            this.imgSrc = this.alfrescoSettingsService.ecmHost + '/alfresco/api/-default-/public/alfresco/versions/1/nodes/' + data.value.entry.id + '/content?attachment=false';
            console.log(this.photoNode);
        }
    }

    saveMetadata(data: any) {
        let name = '';
        if (!this.photoNode) {
            name = this.generateUuid();
        } else {
            name = this.photoNode;
        }

        let body = {
            name: name,
            nodeType: 'hc:patientFolder',
            properties: {},
            relativePath: this.currentPath
        };

        for (var key in data) {
            if (data[key]) {
                body.properties['hc:' + key] = data[key];
            }
        }
        let opts = {};

        let self = this;
        this.authService.getAlfrescoApi().nodes.addNode('-root-', body, opts).then(
            (data) => {
                console.log('The folder created', data);
                self.router.navigate(['/patients']);
                this.notificationService.sendNotification('User Created');
            },
            (err) => {
                window.alert('See console output for error details');
                console.log(err);
            }
        );
    }

    private generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
