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

import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommentListComponent } from './comment-list.component';
import { commentsTaskData, commentsNodeData } from '../mocks/comments.stories.mock';
import { CommentListServiceMock } from './mocks/comment-list.service.mock';
import { CommentsServiceStoriesMock } from '../mocks/comments.service.stories.mock';
import { ADF_COMMENTS_SERVICE } from '../interfaces/comments.token';
import { provideStoryCore } from '../../stories/core-story.providers';

const meta: Meta<CommentListComponent> = {
    component: CommentListComponent,
    title: 'Core/Comments/Comment List',
    decorators: [
        moduleMetadata({
            imports: [CommentListComponent],
            providers: [
                { provide: CommentListServiceMock, useValue: { getUserProfileImage: () => '../assets/images/logo.png' } },
                { provide: ADF_COMMENTS_SERVICE, useClass: CommentsServiceStoriesMock }
            ]
        }),
        applicationConfig({
            providers: [...provideStoryCore()]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: 'Displays a list of comments from users involved in a specified task or node'
            }
        }
    },
    argTypes: {
        comments: {
            control: 'object',
            description: 'CommentModel array',
            table: {
                type: { summary: 'CommentModel[]' }
            }
        },
        clickRow: {
            action: 'clickRow',
            description: 'Emitted when the user clicks on one of the comment rows',
            table: {
                category: 'Actions',
                type: { summary: 'EventEmitter <CommentModel>' }
            }
        }
    }
};

export default meta;
type Story = StoryObj<CommentListComponent>;

export const TaskBased: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        comments: commentsTaskData
    }
};

export const NodeBased: Story = {
    render: (args) => ({
        props: args
    }),
    args: {
        comments: commentsNodeData
    }
};
