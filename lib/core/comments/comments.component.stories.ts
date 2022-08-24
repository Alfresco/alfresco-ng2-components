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

import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommentContentService, CommentProcessService, EcmUserService } from '../services';
import { CoreStoryModule } from '../testing/core.story.module';
import { CommentsComponent } from './comments.component';
import { CommentsModule } from './comments.module';
import { CommentModel } from '../models/comment.model';
import { CommentContentServiceMock } from '../mock/comment-content-service.mock';
import { CommentProcessServiceMock } from '../mock/comment-process-service.mock';
import { commentsTaskData, commentsNodeData } from '../mock/comment-content.mock';

export default {
    component: CommentsComponent,
    title: 'Core/Comments/Comment',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, CommentsModule],
            providers: [
                { provide: CommentContentService, useClass: CommentContentServiceMock },
                { provide: CommentProcessService, useClass: CommentProcessServiceMock },
                { provide: EcmUserService, useValue: { getUserProfileImage: () => '../assets/images/logo.png' } }
            ]
        })
    ],
    argTypes: {
        comments: {
            type: CommentModel,
            description: 'CommentModel array',
            table: { type: { summary: 'CommentModel' } }
        },
        readOnly: {
            control: 'boolean',
            description: 'Displays input area to add new comment',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false'}
            }
        },
        nodeId: {
            control: 'text',
            description: 'Necessary in order to add a new Node comment',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            },
            if: { arg: 'taskId', exists: false }
        },
        taskId: {
            control: 'text',
            description: 'Necessary in order to add a new Task comment',
            defaultValue: undefined,
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'undefined' }
            },
            if: { arg: 'nodeId', exists: false }
        }
    }
} as Meta;

const template: Story<CommentsComponent> = (args: CommentsComponent) => ({
    props: args
});

export const singleCommentWithAvatar = template.bind({});
singleCommentWithAvatar.args = {
    comments: [commentsNodeData[0]],
    readOnly: true
};

export const singleCommentWithoutAvatar = template.bind({});
singleCommentWithoutAvatar.args = {
    comments: [commentsTaskData[1]],
    readOnly: true
};

export const noComments = template.bind({});
noComments.args = {
    comments: [],
    readOnly: true
};

export const nodeComments = template.bind({});
nodeComments.args = {
    comments: commentsNodeData,
    nodeId: '-fake-'
};

export const taskComments = template.bind({});
taskComments.args = {
    comments: commentsTaskData,
    taskId: '-fake-'
};
