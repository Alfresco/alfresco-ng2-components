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

import { DateAlfresco } from '../../content-custom-api/model/dateAlfresco';
import { EntitlementsInfo } from './entitlementsInfo';

export class LicenseInfo {
    issuedAt: Date;
    expiresAt: Date;
    remainingDays: number;
    holder: string;
    mode: string;
    entitlements?: EntitlementsInfo;

    constructor(input?: Partial<LicenseInfo>) {
        if (input) {
            Object.assign(this, input);
            this.issuedAt = input.issuedAt ? DateAlfresco.parseDate(input.issuedAt) : undefined;
            this.expiresAt = input.expiresAt ? DateAlfresco.parseDate(input.expiresAt) : undefined;
            this.entitlements = input.entitlements ? new EntitlementsInfo(input.entitlements) : undefined;
        }
    }
}
