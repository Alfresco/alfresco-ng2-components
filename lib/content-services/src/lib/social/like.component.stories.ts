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
import { RatingService } from './services/rating.service';
import { LikeComponent } from './like.component';
import { RatingServiceMock } from './mock/rating.service.mock';
import { SocialModule } from './social.module';

export default {
    component: LikeComponent,
    title: 'Content Services/Components/Like',
    decorators: [
        moduleMetadata({
            imports: [SocialModule],
            providers: [
                { provide: RatingService, useClass: RatingServiceMock }
            ]
        })
    ],
    argTypes: {
        nodeId: { table: { disable: true } }
    }
} as Meta;

const template: Story<LikeComponent> = (args: LikeComponent) => ({
    props: args
});

export const primary = template.bind({});
primary.args = {
    nodeId: 'fake-like-node-id'
};
