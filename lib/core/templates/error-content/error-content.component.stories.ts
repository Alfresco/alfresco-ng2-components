/*!
 * @license
 * Copyright 2022 Alfresco Software, Ltd.
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
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';

export default {
    component: ErrorContentComponent,
    title: 'Core/Components/Error Content',
    decorators: [
        moduleMetadata({
            imports: [CoreStoryModule, TemplateModule, MatButtonModule],
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
            defaultValue: '404'
        },
        isAdditionalContent: {
            type: 'boolean',
            defaultValue: true
        }
    }
} as Meta;

export const errorCodeStory: Story = args => ({
    props: args,
    template: `
    <adf-error-content [errorCode]="${args.errorCode}">
        <div adf-error-content-actions *ngIf="${args.isAdditionalContent}">
        <button mat-raised-button type="button">MyAction</button>
        </div>
    </adf-error-content>`
});

const templateArgTypes = {
    errorCode: {
        control: {
            disable: true
        }
    }
};

const template: Story = args => ({
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
errorKnownParamStory.args = {
    isAdditionalContent: true
};
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

export const errorUnknownParamStory = template.bind({});
errorUnknownParamStory.args = {
    isAdditionalContent: true
};
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
