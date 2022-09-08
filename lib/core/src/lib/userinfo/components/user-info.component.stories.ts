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

import {
    Meta,
    moduleMetadata,
    Story,
    componentWrapperDecorator
} from '@storybook/angular';
import { CoreStoryModule } from '../../testing/core.story.module';
import { UserInfoComponent } from './user-info.component';
import { UserInfoModule } from '../userinfo.module';
import { PeopleContentService } from './../../services/people-content.service';
import { BpmUserService } from './../../services/bpm-user.service';
import { IdentityUserService } from './../../services/identity-user.service';
import { AuthenticationService } from './../../services/authentication.service';
import { AuthenticationServiceMock } from './mocks/authentication.service.mock';
import {
    BpmUserServiceStub,
    IdentityUserServiceStub,
    PeopleContentServiceStub
} from './mocks/user.service.mock';

export default {
    component: UserInfoComponent,
    title: 'Core/User Info/User Info',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, UserInfoModule],
            providers: [
                {
                    provide: PeopleContentService,
                    useClass: PeopleContentServiceStub
                },
                {
                    provide: BpmUserService,
                    useClass: BpmUserServiceStub
                },
                {
                    provide: IdentityUserService,
                    useClass: IdentityUserServiceStub
                },
                {
                    provide: AuthenticationService,
                    useClass: AuthenticationServiceMock
                }
            ]
        }),
        componentWrapperDecorator(
            (story) =>
                `<div style="height: 100vh; display: flex; align-items: center; justify-content: center;">
                    ${story}
                </div>`
        )
    ],
    argTypes: {
        menuPositionX: {
            description:
                'Material Angular menu horizontal position in regard to User Info',
            control: 'radio',
            options: ['before', 'after'],
            defaultValue: 'after',
            table: {
                type: { summary: 'MenuPositionX' },
                defaultValue: { summary: 'after' }
            }
        },
        menuPositionY: {
            description:
                'Material Angular menu vertical position in regard to User Info',
            control: 'radio',
            options: ['above', 'below'],
            defaultValue: 'below',
            table: {
                type: { summary: 'MenuPositionY' },
                defaultValue: { summary: 'below' }
            }
        },
        showName: {
            description:
                'Determines if name should be shown next to user avatar',
            control: 'boolean',
            defaultValue: true,
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: true }
            }
        },
        namePosition: {
            description: 'User name position in regard to avatar',
            control: 'radio',
            options: ['left', 'right'],
            defaultValue: 'right',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'right' }
            }
        },
        ecmBackgroundImage: {
            description: 'Menu background banner image for ACS users',
            control: {
                disable: true
            },
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: './assets/images/ecm-background.png' }
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
    }
} as Meta;

const template: Story<UserInfoComponent> = (args: UserInfoComponent) => ({
    props: args
});

export const LoginWithSSO = template.bind({});
LoginWithSSO.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'default'
            }
        ]
    })
];

export const LoginWithSSOAndACS = template.bind({});
LoginWithSSOAndACS.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'defaultEcm'
            }
        ]
    })
];

export const LoginWithAPSAndACS = template.bind({});
LoginWithAPSAndACS.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'all'
            }
        ]
    })
];

export const LoginWithACS = template.bind({});
LoginWithACS.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'ecm'
            }
        ]
    })
];

export const LoginWithAPS = template.bind({});
LoginWithAPS.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'bpm'
            }
        ]
    })
];
