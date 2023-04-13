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

import {
    AuthenticationService,
    AppConfigService,
    NotificationService,
    NotificationModel,
    AlfrescoApiService,
    IdentityUserService
} from '@alfresco/adf-core';
import { NotificationCloudService } from '@alfresco/adf-process-services-cloud';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

const SUBSCRIPTION_QUERY = `
    subscription {
        engineEvents(eventType: [
            PROCESS_STARTED
            TASK_ASSIGNED
            TASK_UPDATED,
            TASK_CREATED
        ]) {
            eventType
            entity
        }
    }
`;

@Injectable()
export class AppNotificationsService {

    constructor(
        private appConfigService: AppConfigService,
        private authenticationService: AuthenticationService,
        private notificationCloudService: NotificationCloudService,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private identityUserService: IdentityUserService,
        private alfrescoApiService: AlfrescoApiService
    ) {
        this.alfrescoApiService.alfrescoApiInitialized.subscribe(() => {
            if (this.isProcessServicesEnabled() && this.notificationsEnabled) {
                this.alfrescoApiService.getInstance().oauth2Auth.once('token_issued', () => {

                    const deployedApps = this.appConfigService.get('alfresco-deployed-apps', []);
                    if (deployedApps?.length) {
                        deployedApps.forEach((app) => {
                            this.notificationCloudService
                                .makeGQLQuery(app.name, SUBSCRIPTION_QUERY)
                                .pipe(map((events: any) => events.data.engineEvents))
                                .subscribe((result) => {
                                    result.map((engineEvent) => this.notifyEvent(engineEvent));
                                });
                        });
                    }

                });

            }

        });
    }

    private get notificationsEnabled(): boolean {
        return this.appConfigService.get('notifications', true);
    }

    private isProcessServicesEnabled(): boolean {
        return this.authenticationService.isLoggedIn() && (this.authenticationService.isBPMProvider() || this.authenticationService.isALLProvider());
    }

    notifyEvent(engineEvent) {
        let message;
        switch (engineEvent.eventType) {
            case 'TASK_ASSIGNED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_ASSIGNED', {
                    taskName: engineEvent.entity.name || '',
                    assignee: engineEvent.entity.assignee
                });
                this.pushNotification(engineEvent, message);
                break;
            case 'TASK_UPDATED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_UPDATED', { taskName: engineEvent.entity.name || '' });
                this.pushNotification(engineEvent, message);
                break;
            case 'TASK_COMPLETED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_COMPLETED', { taskName: engineEvent.entity.name || '' });
                this.pushNotification(engineEvent, message);
                break;
            case 'TASK_ACTIVATED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_ACTIVATED', { taskName: engineEvent.entity.name || '' });
                this.pushNotification(engineEvent, message);
                break;
            case 'TASK_CANCELLED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_CANCELLED', { taskName: engineEvent.entity.name || '' });
                this.pushNotification(engineEvent, message);
                break;
            case 'TASK_SUSPENDED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_SUSPENDED', { taskName: engineEvent.entity.name || '' });
                this.pushNotification(engineEvent, message);
                break;
            case 'TASK_CREATED':
                message = this.translateService.instant('NOTIFICATIONS.TASK_CREATED', { taskName: engineEvent.entity.name || '' });
                this.pushNotification(engineEvent, message);
                break;
            default:
        }
    }

    pushNotification(engineEvent: any, message: string) {
        if (engineEvent.entity.assignee === this.identityUserService.getCurrentUserInfo().username) {
            const notification = {
                messages: [message],
                icon: 'info',
                datetime: new Date(),
                initiator: { displayName: engineEvent.entity.initiator || 'System' }
            } as NotificationModel;

            this.notificationService.pushToNotificationHistory(notification);
        }
    }
}
