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

import {
    NotificationInitiator,
    NOTIFICATION_TYPE,
    NotificationModel
} from '../models/notification.model';

export const rootInitiator: NotificationInitiator  = {
    key: '*',
    displayName: 'NOTIFICATIONS.SYSTEM'
};

export function info(messages: string | string[], initiator: NotificationInitiator = rootInitiator): NotificationModel {
    return {
        type: NOTIFICATION_TYPE.INFO,
        datetime: new Date(),
        initiator,
        messages: [].concat(messages)
    };
}

export function warning(messages: string | string[], initiator: NotificationInitiator = rootInitiator): NotificationModel {
    return {
        type: NOTIFICATION_TYPE.WARN,
        datetime: new Date(),
        initiator,
        messages: [].concat(messages)
    };
}

export function error(messages: string | string[], initiator: NotificationInitiator = rootInitiator): NotificationModel {
    return {
        type: NOTIFICATION_TYPE.ERROR,
        datetime: new Date(),
        initiator,
        messages: [].concat(messages)
    };
}
