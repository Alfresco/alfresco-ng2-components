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

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TaskCloudService } from '../../../../services/task-cloud.service';
import { TaskDetailsCloudModel } from '../../../../models/task-details-cloud.model';
import { QueryTaskDetailsSourceStrategy } from './query-task-details-source.strategy';

describe('QueryTaskDetailsSourceStrategy', () => {
    let strategy: QueryTaskDetailsSourceStrategy;
    let taskCloudService: jasmine.SpyObj<TaskCloudService>;

    const taskDetails = { id: 'task-1' } as TaskDetailsCloudModel;

    beforeEach(() => {
        taskCloudService = jasmine.createSpyObj('TaskCloudService', ['getTaskById', 'canClaimTask', 'canUnclaimTask']);

        TestBed.configureTestingModule({
            providers: [QueryTaskDetailsSourceStrategy, { provide: TaskCloudService, useValue: taskCloudService }]
        });

        strategy = TestBed.inject(QueryTaskDetailsSourceStrategy);
    });

    it('should fetch the task details from the Query Service', () => {
        taskCloudService.getTaskById.and.returnValue(of(taskDetails));

        strategy.getTaskDetails$('app', 'task-1').subscribe();

        expect(taskCloudService.getTaskById).toHaveBeenCalledWith('app', 'task-1');
    });

    it('should delegate claim eligibility to canClaimTask', () => {
        taskCloudService.canClaimTask.and.returnValue(true);

        expect(strategy.canClaim(taskDetails)).toBe(true);
        expect(taskCloudService.canClaimTask).toHaveBeenCalledWith(taskDetails);
    });

    it('should delegate unclaim eligibility to canUnclaimTask', () => {
        taskCloudService.canUnclaimTask.and.returnValue(true);

        expect(strategy.canUnclaim(taskDetails)).toBe(true);
        expect(taskCloudService.canUnclaimTask).toHaveBeenCalledWith(taskDetails);
    });
});
