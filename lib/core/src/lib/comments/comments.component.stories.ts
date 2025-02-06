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

import { applicationConfig, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CoreStoryModule } from '../testing/core.story.module';
import { CommentsComponent } from './comments.component';
import { ADF_COMMENTS_SERVICE } from './interfaces/comments.token';
import { commentsStoriesData } from './mocks/comments.stories.mock';
import { CommentsServiceStoriesMock } from './mocks/comments.service.stories.mock';
import { importProvidersFrom } from '@angular/core';

export default {
    component: CommentsComponent,
    title: 'Core/Comments/Comment',
    decorators: [
        moduleMetadata({
            imports: [CommentsComponent],
            providers: [
                { provide: CommentsServiceStoriesMock, useValue: { getUserProfileImage: () => '../assets/images/logo.png' } },
                { provide: ADF_COMMENTS_SERVICE, useClass: CommentsServiceStoriesMock }
            ]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Displays comments from users involved in a specified environment.
                    Allows an involved user to add a comment to a environment.`
            }
        }
    },
    argTypes: {
        comments: {
            control: 'object',
            description: 'CommentModel array',
            table: { type: { summary: 'CommentModel[]' } }
        },
        readOnly: {
            control: 'boolean',
            description: 'Displays input area to add new comment',
            defaultValue: false,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' }
            }
        },
        id: {
            control: 'text',
            description: 'Necessary in order to add a new comment',
            table: {
                type: { summary: 'string' }
            }
        },
        error: {
            action: 'error',
            description: 'Emitted when an error occurs while displaying/adding a comment',
            table: {
                category: 'Actions',
                type: { summary: 'EventEmitter <any>' }
            }
        }
    }
} as Meta<CommentsComponent>;

const template: StoryFn<CommentsComponent> = (args) => ({
    props: args
});

export const SingleCommentWithAvatar = template.bind({});
SingleCommentWithAvatar.args = {
    comments: [commentsStoriesData[0]],
    readOnly: true
};

export const SingleCommentWithoutAvatar = template.bind({});
SingleCommentWithoutAvatar.args = {
    comments: [commentsStoriesData[1]],
    readOnly: true
};

export const NoComments = template.bind({});
NoComments.args = {
    comments: [],
    readOnly: true
};

export const Comments = template.bind({});
Comments.args = {
    comments: commentsStoriesData,
    id: '-fake-'
};
