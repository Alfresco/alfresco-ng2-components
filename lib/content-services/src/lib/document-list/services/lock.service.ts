/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AuthenticationService } from '@alfresco/adf-core';
import { isAfter } from 'date-fns';

@Injectable({
    providedIn: 'root'
})
export class LockService {
    constructor(private authService: AuthenticationService) {}

    isLocked(node: Node): boolean {
        let isLocked = false;
        if (this.hasLockConfigured(node)) {
            if (this.isReadOnlyLock(node)) {
                isLocked = !this.isLockExpired(node);
            } else if (this.isLockOwnerAllowed(node)) {
                isLocked = this.authService.getEcmUsername() !== node.properties['cm:lockOwner'].id;
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

    private getLockExpiryTime(node: Node): Date | undefined {
        if (node.properties['cm:expiryDate']) {
            return new Date(node.properties['cm:expiryDate']);
        }
        return undefined;
    }

    private isLockExpired(node: Node): boolean {
        const expiryLockTime = this.getLockExpiryTime(node);
        if (expiryLockTime) {
            return isAfter(new Date(), expiryLockTime);
        }
        return false;
    }
}
