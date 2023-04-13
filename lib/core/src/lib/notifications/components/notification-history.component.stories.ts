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
import { NotificationHistoryComponent } from './notification-history.component';
import { NotificationHistoryModule } from '../notification-history.module';

export default {
    component: NotificationHistoryComponent,
    title: 'Core/Notification History/Notification History',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, NotificationHistoryModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Lists notifications received in the current session. The notifications disappear from the list after refresh.`
            }
        }
    },
    argTypes: {
        menuPositionX: {
            control: 'inline-radio',
            options: ['before', 'after'],
            description: 'Custom choice for opening the menu at the bottom.',
            defaultValue: 'after',
            table: {
                type: { summary: 'MenuPositionX' },
                defaultValue: { summary: 'after' }
            }
        },
        menuPositionY: {
            control: 'inline-radio',
            options: ['below', 'above'],
            description: 'Custom choice for opening the menu at the bottom.',
            defaultValue: 'below',
            table: {
                type: { summary: 'MenuPositionY' },
                defaultValue: { summary: 'below' }
            }
        },
        maxNotifications: {
            control: 'number',
            defaultValue: 5,
            description: 'Maximum number of notifications to display. The rest will remain hidden until load more is clicked.',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '5' }
            }
        }
    }
} as Meta;

const template: Story<NotificationHistoryComponent> = (args: NotificationHistoryComponent) => ({
    props: args,
    template: `
    <div style="display:flex;flex-direction:column;align-items:center;">
        <adf-notification-history
            [menuPositionX]=menuPositionX
            [menuPositionY]=menuPositionY
            [maxNotifications]=maxNotifications>
        </adf-notification-history>
        <adf-add-notification-storybook>
        </adf-add-notification-storybook>
    </div>`
});

export const notificationHistory = template.bind({});
notificationHistory.parameters = { layout: 'centered' };
