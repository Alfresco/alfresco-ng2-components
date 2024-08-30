/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { IdentityUserInfoComponent } from './identity-user-info.component';
import { importProvidersFrom } from '@angular/core';

const fakeIdentityUser = {
    familyName: 'Identity',
    givenName: 'John',
    email: 'john.identity@gmail.com',
    username: 'johnyIdentity99'
};

export default {
    component: IdentityUserInfoComponent,
    title: 'Core/Identity User Info/Identity User Info',
    decorators: [
        moduleMetadata({
            imports: [IdentityUserInfoComponent]
        }),
        applicationConfig({
            providers: [importProvidersFrom(CoreStoryModule)]
        })
    ],
    argTypes: {
        isLoggedIn: {
            description: 'Determines if user is logged in',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        identityUser: {
            description: 'Identity User Info',
            control: 'object',
            table: {
                type: { summary: 'IdentityUserModel' }
            }
        },
        menuPositionX: {
            description: 'Material Angular menu horizontal position in regard to User Info',
            control: 'radio',
            options: ['before', 'after'],
            table: {
                type: { summary: 'MenuPositionX' },
                defaultValue: { summary: 'after' }
            }
        },
        menuPositionY: {
            description: 'Material Angular menu vertical position in regard to User Info',
            control: 'radio',
            options: ['above', 'below'],
            table: {
                type: { summary: 'MenuPositionY' },
                defaultValue: { summary: 'below' }
            }
        },
        showName: {
            description: 'Determines if name should be shown next to user avatar',
            control: 'boolean',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' }
            }
        },
        namePosition: {
            description: 'User name position in regard to avatar',
            control: 'radio',
            options: ['left', 'right'],
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'right' }
            }
        },
        bpmBackgroundImage: {
            description: 'Menu background banner image for APS users',
            control: {
                disable: true
            },
            table: {
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: './assets/images/bpm-background.png'
                }
            }
        }
    },
    args: {
        identityUser: fakeIdentityUser,
        isLoggedIn: true,
        menuPositionX: 'after',
        menuPositionY: 'below',
        showName: true,
        namePosition: 'right',
        bpmBackgroundImage: './assets/images/bpm-background.png'
    }
} as Meta<IdentityUserInfoComponent>;

const template: StoryFn<IdentityUserInfoComponent> = (args) => ({
    props: args
});

export const LoginWithSSO = template.bind({});
LoginWithSSO.parameters = { layout: 'centered' };
