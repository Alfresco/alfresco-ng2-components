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

import { Injectable } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { AlfrescoApiService } from './alfresco-api.service';
import moment from 'moment-es6';
import { Moment } from 'moment';

@Injectable({
    providedIn: 'root'
})
export class LockService {

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    isLocked(node: Node): boolean {
        let isLocked = false;
        if (this.hasLockConfigured(node)) {
            if (this.isReadOnlyLock(node)) {
                isLocked = true;
                if (this.isLockExpired(node)) {
                    isLocked = false;
                }
            } else if (this.isLockOwnerAllowed(node)) {
                isLocked = this.alfrescoApiService.getInstance().getEcmUsername() !== node.properties['cm:lockOwner'].id;
                if (this.isLockExpired(node)) {
                    isLocked = false;
                }
            }
        }
        return isLocked;
    }

    private hasLockConfigured(node: Node): boolean {
        return node.isFile && node.isLocked && node.properties['cm:lockType'];
    }

    private isReadOnlyLock(node: Node): boolean {
        return node.properties['cm:lockType'] === 'READ_ONLY_LOCK' && node.properties['cm:lockLifetime'] === 'PERSISTENT';
    }

    private isLockOwnerAllowed(node: Node): boolean {
        return node.properties['cm:lockType'] === 'WRITE_LOCK' && node.properties['cm:lockLifetime'] === 'PERSISTENT';
    }

    private getLockExpiryTime(node: Node): Moment | undefined {
        if (node.properties['cm:expiryDate']) {
            return moment(node.properties['cm:expiryDate'], 'yyyy-MM-ddThh:mm:ssZ');
        }
        return undefined;
    }

    private isLockExpired(node: Node): boolean {
        const expiryLockTime = this.getLockExpiryTime(node);
        if (expiryLockTime) {
            return moment().isAfter(expiryLockTime);
        }
        return false;
    }
}
