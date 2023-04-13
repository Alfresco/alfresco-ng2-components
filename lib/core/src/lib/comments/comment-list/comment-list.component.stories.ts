/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { CoreStoryModule } from '../../testing/core.story.module';
import { CommentListComponent } from './comment-list.component';
import { CommentsModule } from '../comments.module';
import { commentsTaskData, commentsNodeData } from '../mocks/comments.stories.mock';
import { CommentListServiceMock } from './mocks/comment-list.service.mock';

export default {
    component: CommentListComponent,
    title: 'Core/Comments/Comment List',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, CommentsModule],
            providers: [
                { provide: CommentListServiceMock, useValue: { getUserProfileImage: () => '../assets/images/logo.png' } }
            ]
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
} as Meta;

const template: Story<CommentListComponent> = (args: CommentListComponent) => ({
    props: args
});

export const taskBased = template.bind({});
taskBased.args = {
    comments: commentsTaskData
};

export const nodeBased = template.bind({});
nodeBased.args = {
    comments: commentsNodeData
};
