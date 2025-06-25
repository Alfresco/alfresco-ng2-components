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
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NodeCommentsComponent } from './node-comments.component';
import { CommentsComponent, CommentModel, ADF_COMMENTS_SERVICE } from '@alfresco/adf-core';
import { NodeCommentsService } from './services/node-comments.service';

@Component({
    selector: 'app-host-component',
    template: ` <adf-node-comments [nodeId]="'test-node-id'" (commentAdded)="onCommentAdded($event)"> </adf-node-comments> `
})
class HostComponent {
    onCommentAdded(): void {}
}

describe('NodeCommentsComponent', () => {
    let fixture: ComponentFixture<HostComponent>;
    let hostComponent: HostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HostComponent],
            imports: [NodeCommentsComponent],
            providers: [
                {
                    provide: ADF_COMMENTS_SERVICE,
                    useClass: NodeCommentsService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        hostComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should re-emit commentAdded when inner CommentsComponent emits commentAdded', () => {
        spyOn(hostComponent, 'onCommentAdded');

        const comment: CommentModel = {
            id: '123',
            message: 'Mock comment',
            created: new Date(),
            createdBy: {
                id: 'user-1',
                displayName: 'John Doe',
                avatarId: 'avatar-001'
            },
            isSelected: false,
            hasAvatarPicture: false,
            userDisplayName: 'John Doe',
            userInitials: 'JD'
        };

        const commentsComponent = fixture.debugElement.query(By.directive(CommentsComponent)).componentInstance;

        commentsComponent.commentAdded.emit(comment);

        expect(hostComponent.onCommentAdded).toHaveBeenCalledWith(comment);
    });
});
