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

import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TaskCloudService } from '../../../../services/task-cloud.service';
import { TaskDetailsCloudModel } from '../../../../models/task-details-cloud.model';
import { TaskDetailsSourceStrategy } from './task-details-source.strategy';

/**
 * Reads task details from the Runtime Bundle (always up to date, unlike the eventually
 * consistent Query Service). Terminal tasks are no longer served by the Runtime Bundle, so a
 * `404` transparently falls back to the Query Service.
 *
 * Claim/unclaim eligibility prefers the candidate `permissions` when the Runtime Bundle
 * provides them, and falls back to a task-state evaluation when it does not (its responses
 * historically omit `permissions`). This way the strategy keeps working as-is if the Runtime
 * Bundle starts returning `permissions` in the future.
 */
@Injectable({ providedIn: 'root' })
export class RuntimeBundleTaskDetailsSourceStrategy implements TaskDetailsSourceStrategy {
    private readonly taskCloudService = inject(TaskCloudService);

    getTaskDetails$(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return this.taskCloudService
            .getTaskById(appName, taskId)
            .pipe(catchError((error) => (error?.status === 404 ? this.taskCloudService.getTaskById(appName, taskId) : throwError(() => error))));
    }

    canClaim(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails?.permissions ? this.taskCloudService.canClaimTask(taskDetails) : this.taskCloudService.canClaimTaskByState(taskDetails);
    }

    canUnclaim(taskDetails: TaskDetailsCloudModel): boolean {
        return taskDetails?.permissions
            ? this.taskCloudService.canUnclaimTask(taskDetails)
            : this.taskCloudService.canUnclaimTaskByState(taskDetails);
    }
}
