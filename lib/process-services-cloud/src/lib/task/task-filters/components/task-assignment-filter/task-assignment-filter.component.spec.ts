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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { TaskAssignmentFilterCloudComponent } from './task-assignment-filter.component';
import { GroupCloudModule } from '../../../../group/group-cloud.module';
import { TaskFiltersCloudModule } from '../../task-filters-cloud.module';
import { AssignmentType } from '../../models/filter-cloud.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IdentityUserService } from '../../../../people/services/identity-user.service';

describe('EditTaskFilterCloudComponent', () => {
    let component: TaskAssignmentFilterCloudComponent;
    let fixture: ComponentFixture<TaskAssignmentFilterCloudComponent>;
    let identityUserService: IdentityUserService;
    const identityUserMock = {
        firstName: 'fake-identity-first-name',
        lastName: 'fake-identity-last-name',
        email: 'fakeIdentity@email.com'
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            GroupCloudModule,
            TaskFiltersCloudModule,
            NoopAnimationsModule
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskAssignmentFilterCloudComponent);
        component = fixture.componentInstance;
        identityUserService = TestBed.inject(IdentityUserService);
        component.taskFilterProperty = {
            key: 'assignment',
            label: 'mock-filter',
            value: null,
            type: 'dateRange',
            attributes: null,
            options: null
        };
        fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('should emit the current user info when assignment is the current user', () => {
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(identityUserMock as any);
        spyOn(component.assignedChange, 'emit');
        component.onAssignmentTypeChange(AssignmentType.CURRENT_USER);
        fixture.detectChanges();
        expect(component.assignedChange.emit).toHaveBeenCalledWith(identityUserMock);
    });

    it('should show the candidate groups', () => {
        component.assignmentType = AssignmentType.CANDIDATE_GROUPS;
        fixture.detectChanges();
        const candidateGroups = fixture.debugElement.nativeElement.querySelector('.adf-group-cloud-filter');
        expect(candidateGroups).toBeTruthy();
    });

    it('should have floating labels when values are present', () => {
        fixture.detectChanges();
        const inputLabelsNodes = document.querySelectorAll('mat-form-field');
        inputLabelsNodes.forEach(labelNode => {
            expect(labelNode.getAttribute('ng-reflect-float-label')).toBe('auto');
        });
    });
});
