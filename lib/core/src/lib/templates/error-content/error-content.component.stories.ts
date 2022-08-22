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

import { Meta, moduleMetadata, Story, componentWrapperDecorator } from '@storybook/angular';
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
                { provide: ActivatedRoute, useValue: { params: of({}) }}
            ]
        })
    ],
    argTypes: {
        errorCode: {
            control: 'text',
            description: 'Error code associated with this error.',
            defaultValue: 'UNKNOWN',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'UNKNOWN' }
            }
        }
    }
} as Meta;

const template: Story<ErrorContentComponent> = (args: ErrorContentComponent) => ({
    props: args
});

export const defaultErrorContent = template.bind({});

export const errorCode500 = template.bind({});
errorCode500.args = {
    errorCode: '500'
};

export const errorCode404 = template.bind({});
errorCode404.args = {
    errorCode: '404'
};

const wrap = (story: string, title?: string, content?:  string): string => `<h3>${title ? title : ''}</h3>${story}`.replace('></adf-error-content>',`>${content ? content : ''}</adf-error-content>`);
export const withProjectedContent = template.bind({});
withProjectedContent.decorators = [
    componentWrapperDecorator(story => wrap(
        story,
        `This story supplies the Error Content component with an adf-error-content element:`,
        `<div adf-error-content-actions>
          <button type="button">
            MyAction
          </button>
        </div>`
    ))
];
