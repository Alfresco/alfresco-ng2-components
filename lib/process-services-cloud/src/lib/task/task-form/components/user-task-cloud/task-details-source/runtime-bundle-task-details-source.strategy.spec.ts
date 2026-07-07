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
import { firstValueFrom, of, throwError } from 'rxjs';
import { TaskCloudService } from '../../../../services/task-cloud.service';
import { TaskDetailsCloudModel } from '../../../../models/task-details-cloud.model';
import { RuntimeBundleTaskDetailsSourceStrategy } from './runtime-bundle-task-details-source.strategy';

describe('RuntimeBundleTaskDetailsSourceStrategy', () => {
    let strategy: RuntimeBundleTaskDetailsSourceStrategy;
    let taskCloudService: jasmine.SpyObj<TaskCloudService>;

    const taskDetails = { id: 'task-1' } as TaskDetailsCloudModel;

    beforeEach(() => {
        taskCloudService = jasmine.createSpyObj('TaskCloudService', [
            'getTaskById',
            'canClaimTask',
            'canClaimTaskByState',
            'canUnclaimTask',
            'canUnclaimTaskByState'
        ]);

        TestBed.configureTestingModule({
            providers: [RuntimeBundleTaskDetailsSourceStrategy, { provide: TaskCloudService, useValue: taskCloudService }]
        });

        strategy = TestBed.inject(RuntimeBundleTaskDetailsSourceStrategy);
    });

    it('should get the task from the task cloud service', async () => {
        taskCloudService.getTaskById.and.returnValue(of(taskDetails));

        const result = await firstValueFrom(strategy.getTaskDetails$('app', 'task-1'));

        expect(taskCloudService.getTaskById).toHaveBeenCalledWith('app', 'task-1');
        expect(result).toEqual(taskDetails);
    });

    it('should retry once when the first attempt returns 404', async () => {
        taskCloudService.getTaskById.and.returnValues(
            throwError(() => ({ status: 404 })),
            of(taskDetails)
        );

        const result = await firstValueFrom(strategy.getTaskDetails$('app', 'task-1'));

        expect(taskCloudService.getTaskById).toHaveBeenCalledTimes(2);
        expect(result).toEqual(taskDetails);
    });

    it('should rethrow errors that are not 404', async () => {
        const error = { status: 500 };
        taskCloudService.getTaskById.and.returnValue(throwError(() => error));

        await expectAsync(firstValueFrom(strategy.getTaskDetails$('app', 'task-1'))).toBeRejectedWith(error);
        expect(taskCloudService.getTaskById).toHaveBeenCalledTimes(1);
    });

    it('should delegate claim eligibility to the state-based check when permissions are absent', () => {
        taskCloudService.canClaimTaskByState.and.returnValue(true);

        expect(strategy.canClaim({ ...taskDetails, permissions: undefined })).toBe(true);
        expect(taskCloudService.canClaimTaskByState).toHaveBeenCalled();
        expect(taskCloudService.canClaimTask).not.toHaveBeenCalled();
    });

    it('should delegate claim eligibility to the permission-based check when permissions are present', () => {
        taskCloudService.canClaimTask.and.returnValue(true);

        expect(strategy.canClaim({ ...taskDetails, permissions: ['CLAIM'] })).toBe(true);
        expect(taskCloudService.canClaimTask).toHaveBeenCalled();
        expect(taskCloudService.canClaimTaskByState).not.toHaveBeenCalled();
    });

    it('should delegate unclaim eligibility to the state-based check when permissions are absent', () => {
        taskCloudService.canUnclaimTaskByState.and.returnValue(true);

        expect(strategy.canUnclaim({ ...taskDetails, permissions: undefined })).toBe(true);
        expect(taskCloudService.canUnclaimTaskByState).toHaveBeenCalled();
        expect(taskCloudService.canUnclaimTask).not.toHaveBeenCalled();
    });

    it('should delegate unclaim eligibility to the permission-based check when permissions are present', () => {
        taskCloudService.canUnclaimTask.and.returnValue(true);

        expect(strategy.canUnclaim({ ...taskDetails, permissions: ['RELEASE'] })).toBe(true);
        expect(taskCloudService.canUnclaimTask).toHaveBeenCalled();
        expect(taskCloudService.canUnclaimTaskByState).not.toHaveBeenCalled();
    });
});
