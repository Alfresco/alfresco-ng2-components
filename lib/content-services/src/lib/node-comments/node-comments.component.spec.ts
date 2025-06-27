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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeCommentsComponent } from './node-comments.component';
import { CommentsComponent } from '../../../../core/src/lib/comments/comments.component';
import { CommentModel } from '../../../../core/src/lib/models';
import { UnitTestingUtils } from '../../../../core/src/lib/testing/unit-testing-utils';
import { ContentTestingModule } from '../testing/content.testing.module';

describe('NodeCommentsComponent', () => {
    let fixture: ComponentFixture<NodeCommentsComponent>;
    let component: NodeCommentsComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NodeCommentsComponent, ContentTestingModule]
        }).compileComponents();

        fixture = TestBed.createComponent(NodeCommentsComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        component.nodeId = 'test-node-id';
        fixture.detectChanges();
    });

    it('should emit commentAdded when CommentsComponent emits', () => {
        const mockComment: CommentModel = {
            id: '123',
            message: 'Sample comment',
            created: new Date(),
            createdBy: {
                id: 'user1',
                displayName: 'User 1',
                avatarId: 'avatar-123'
            },
            isSelected: false,
            hasAvatarPicture: true,
            userDisplayName: 'User 1',
            userInitials: 'U1'
        };

        spyOn(component.commentAdded, 'emit');

        const commentsComponent: CommentsComponent = testingUtils.getByDirective(CommentsComponent).componentInstance;
        commentsComponent.commentAdded.emit(mockComment);

        expect(component.commentAdded.emit).toHaveBeenCalledWith(mockComment);
    });
});
