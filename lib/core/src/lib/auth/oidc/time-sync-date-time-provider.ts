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

import { Injectable, inject } from '@angular/core';
import { DateTimeProvider } from 'angular-oauth2-oidc';
import { TimeSyncService } from '../services/time-sync.service';

/**
 * Custom DateTimeProvider for angular-oauth2-oidc that uses the
 * TimeSyncService to provide clock-drift-corrected timestamps.
 *
 * This ensures token validation within the OAuth library uses the
 * server-synchronized time rather than the potentially drifted local clock.
 */
@Injectable()
export class TimeSyncDateTimeProvider extends DateTimeProvider {
    private readonly timeSyncService = inject(TimeSyncService);

    now(): number {
        return this.timeSyncService.getCorrectedNow();
    }

    new(): Date {
        return new Date(this.timeSyncService.getCorrectedNow());
    }
}
