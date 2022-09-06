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
        })
    ],
    argTypes: {
        menuPositionX: {
            control: 'radio',
            options: ['before', 'after'],
            defaultValue: 'after'
        },
        menuPositionY: {
            control: 'radio',
            options: ['above', 'below'],
            defaultValue: 'below'
        },
        showName: {
            control: 'boolean',
            defaultValue: true
        },
        namePosition: {
            control: 'radio',
            options: ['left', 'right'],
            defaultValue: 'right'
        }
    }
} as Meta;

const template: Story<UserInfoComponent> = (args: UserInfoComponent) => ({
    props: args
});

export const LoginWithOAuth = template.bind({});
LoginWithOAuth.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'default'
            }
        ]
    })
];

export const LoginWithOAuthAndECM = template.bind({});
LoginWithOAuthAndECM.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'defaultEcm'
            }
        ]
    })
];

export const LoginWithBPMAndECM = template.bind({});
LoginWithBPMAndECM.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'all'
            }
        ]
    })
];

export const LoginWithECM = template.bind({});
LoginWithECM.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'ecm'
            }
        ]
    })
];

export const LoginWithBPM = template.bind({});
LoginWithBPM.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: 'MODE',
                useValue: 'bpm'
            }
        ]
    })
];
