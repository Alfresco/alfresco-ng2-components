/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CloudLayoutService } from './services/cloud-layout.service';
import { NotificationModel, NotificationService } from '@alfresco/adf-core';
import { gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { NotificationCloudService } from '@alfresco/adf-process-services-cloud';
import { TranslateService } from '@ngx-translate/core';

const SUBSCRIPTION_QUERY = gql`
    subscription {
        engineEvents(eventType: [
            PROCESS_STARTED
            PROCESS_COMPLETED
            PROCESS_CREATED
            PROCESS_CANCELLED
            PROCESS_RESUMED
            PROCESS_SUSPENDED
            PROCESS_DEPLOYED
            TASK_CREATED
            TASK_COMPLETED
            TASK_ASSIGNED
            TASK_ACTIVATED
            TASK_SUSPENDED
            TASK_CANCELLED
            TASK_UPDATED
        ]) {
            eventType
            entity
        }
    }
`;

@Component({
    selector: 'app-cloud-layout',
    templateUrl: './cloud-layout.component.html',
    styleUrls: ['./cloud-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CloudLayoutComponent implements OnInit {
    displayMenu = true;
    appName: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cloudLayoutService: CloudLayoutService,
        private notificationCloudService: NotificationCloudService,
        private notificationService: NotificationService,
        private translateService: TranslateService
    ) { }

    ngOnInit() {
        let root: string = '';
        this.route.params.subscribe((params) => {
            this.appName = params.appName;
            this.notificationCloudService.makeGraphQLQuery(
                this.appName, SUBSCRIPTION_QUERY
            )
                .pipe(map((events: any) => events.data.engineEvents))
                .subscribe((result) => {
                    result.map((engineEvent) => {
                        this.notifyEvent(engineEvent);

                    });
                });
        });

        if (this.route.snapshot && this.route.snapshot.firstChild) {
            root = this.route.snapshot.firstChild.url[0].path;
        }

        this.route.queryParams.subscribe((params) => {
            if (root === 'tasks' && params.id) {
                this.cloudLayoutService.setCurrentTaskFilterParam({ id: params.id });
            }

            if (root === 'processes' && params.id) {
                this.cloudLayoutService.setCurrentProcessFilterParam({ id: params.id });
            }
        });
    }

    onStartTask() {
        this.router.navigate([`/cloud/${this.appName}/start-task/`]);
    }

    onStartProcess() {
        this.router.navigate([`/cloud/${this.appName}/start-process/`]);
    }

    notifyEvent(engineEvent) {
        let message;
        switch (engineEvent.eventType) {
            case 'TASK_ASSIGNED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_ASSIGNED',
                    { taskName: engineEvent.entity.name || '', assignee: engineEvent.entity.assignee });
                this.pushNotification(engineEvent, message);
                break;
            case 'PROCESS_STARTED':
                message = this.translateService.instant('NOTIFICATIONS.PROCESS_STARTED',
                    { processName: engineEvent.entity.name });
                this.pushNotification(engineEvent, message);
                break;
            case 'TASK_UPDATED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_UPDATED',
                    { taskName: engineEvent.entity.name || '' });
                this.pushNotification(engineEvent, message);
                break;
            default:
        }
    }

    pushNotification(engineEvent: any, message: string) {
        const notification = {
            messages: [message],
            icon: 'info',
            datetime: new Date(),
            initiator: { displayName: engineEvent.entity.initiator || 'System' }
        } as NotificationModel;

        this.notificationService.pushToNotificationHistory(notification);
    }
}
