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
                { provide: ActivatedRoute, useValue: { params: of({}) } }
            ]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: `Displays information about a specific error.`
            }
        }
    },
    argTypes: {
        errorCode: {
            control: 'text',
            description: 'Error code associated with this error.',
            defaultValue: 'UNKNOWN',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'UNKNOWN' }
            }
        },
        errorContentActions: {
            name: 'with adf-error-content-actions selector',
            control: 'boolean',
            description: 'Showcase content projection with <span style="color:red">adf-error-content-actions</span> selector',
            defaultValue: false,
            table: {
                category: 'Content Projection',
                type: {
                    summary: 'code',
                    detail: '<div adf-error-content-actions>\n  <button>MyAction</button>\n</div>'
                },
                defaultValue: { summary: false }
            }
        }
    }
} as Meta;

const template: Story<ErrorContentComponent> = (args: ErrorContentComponent & { errorContentActions: boolean }) => ({
    props: args,
    template: `
    <adf-error-content errorCode="${args.errorCode}">
        <div adf-error-content-actions *ngIf="${args.errorContentActions}">
        <button mat-raised-button type="button">MyAction</button>
        </div>
    </adf-error-content>`
});

export const errorContent = template.bind({});
errorContent.parameters = { layout: 'centered' };
