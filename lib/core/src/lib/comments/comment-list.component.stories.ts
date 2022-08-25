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
import { action } from '@storybook/addon-actions';
import { CommentModel } from '../models/comment.model';
import { CoreStoryModule } from '../testing/core.story.module';
import { CommentListComponent } from './comment-list.component';
import { CommentsModule } from './comments.module';
import { commentsTaskData, commentsNodeData } from '../mock/comment-content.mock';
import { EcmUserService } from '../services';

export default {
    component: CommentListComponent,
    title: 'Core/Comments/Comment List',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, CommentsModule],
            providers: [
                { provide: EcmUserService, useValue: { getUserProfileImage: () => '../assets/images/logo.png' } }
            ]
        })
    ],
    argTypes: {
        comments: {
            type: CommentModel,
            description: 'CommentModel array',
            table: {
                type: { summary: 'CommentModel' }
            }
        }
    }
} as Meta;

const template: Story<CommentListComponent> = (args: CommentListComponent) => ({
    props: {
        ...args,
        clickRow: action('clickRow')
    }
});

export const taskBased = template.bind({});
taskBased.args = {
    comments: commentsTaskData
};

export const nodeBased = template.bind({});
nodeBased.args = {
    comments: commentsNodeData
};
