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
import { Observable } from 'rxjs';
import { TaskCloudService } from '../../../../services/task-cloud.service';
import { TaskDetailsCloudModel } from '../../../../models/task-details-cloud.model';
import { TaskDetailsSourceStrategy } from './task-details-source.strategy';

/**
 * Reads task details from the Query Service and evaluates claim/unclaim eligibility from
 * the candidate `permissions` it returns.
 */
@Injectable({ providedIn: 'root' })
export class QueryTaskDetailsSourceStrategy implements TaskDetailsSourceStrategy {
    private readonly taskCloudService = inject(TaskCloudService);

    getTaskDetails$(appName: string, taskId: string): Observable<TaskDetailsCloudModel> {
        return this.taskCloudService.getTaskById(appName, taskId);
    }

    canClaim(taskDetails: TaskDetailsCloudModel): boolean {
        return this.taskCloudService.canClaimTask(taskDetails);
    }

    canUnclaim(taskDetails: TaskDetailsCloudModel): boolean {
        return this.taskCloudService.canUnclaimTask(taskDetails);
    }
}
