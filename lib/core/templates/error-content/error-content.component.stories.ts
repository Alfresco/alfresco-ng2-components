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
import { ErrorContentComponent } from './error-content.component';
import { CoreStoryModule } from '../../testing/core.story.module';
import { TemplateModule } from '../template.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

export default {
    component: ErrorContentComponent,
    title: 'Core/Template/Error Content',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, TemplateModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { params: of({}) }
                }
            ]
        })
    ],
    argTypes: {
        errorCode: {
            type: 'string',
            description: 'Component level Error Code',
            table: {
                category: 'Component Inputs',
                type: {
                    summary: 'string'
                },
                defaultValue: {
                    summary: 'UNKNOWN'
                }
            },
            defaultValue: '404'
        },
        errorCodeTranslated: {
            type: 'string',
            description:
                'Code of translated Error - if translation doesn\'t exist then is UNKNOWN',
            table: {
                category: 'Component Variables',
                type: {
                    summary: 'string'
                }
            },
            control: {
                disable: true
            }
        },
        isAdditionalContent: {
            type: 'boolean',
            description: 'Enable Content Projection',
            defaultValue: false,
            table: {
                category: 'Story Controls',
                type: {
                    summary: 'boolean'
                },
                defaultValue: {
                    summary: false
                }
            }
        }
    }
} as Meta;

const templateArgTypes = {
    errorCode: {
        control: {
            disable: true
        }
    }
};

const template: Story<ErrorContentComponent> = (
    args: ErrorContentComponent & { isAdditionalContent: boolean }
) => ({
    props: args,
    template: `
        <adf-error-content>
            <div adf-error-content-actions *ngIf="${args.isAdditionalContent}">
            <button mat-raised-button type="button">MyAction</button>
            </div>
        </adf-error-content>
        `
});

export const errorKnownParamStory = template.bind({});
errorKnownParamStory.argTypes = templateArgTypes;
errorKnownParamStory.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: ActivatedRoute,
                useValue: {
                    params: of({ id: '500' })
                }
            }
        ]
    })
];
errorKnownParamStory.storyName = 'Error Param with Known ID';

export const errorUnknownParamStory = template.bind({});
errorUnknownParamStory.argTypes = templateArgTypes;
errorUnknownParamStory.decorators = [
    moduleMetadata({
        providers: [
            {
                provide: ActivatedRoute,
                useValue: {
                    params: of({ id: '200' })
                }
            }
        ]
    })
];
errorUnknownParamStory.storyName = 'Error Param with Unknown ID';

export const errorCodeStory: Story<ErrorContentComponent> = (
    args: ErrorContentComponent & { isAdditionalContent: boolean }
) => ({
    props: args,
    template: `
    <adf-error-content [errorCode]="${args.errorCode}">
        <div adf-error-content-actions *ngIf="${args.isAdditionalContent}">
        <button mat-raised-button type="button">MyAction</button>
        </div>
    </adf-error-content>`
});
