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

import { NgModule } from '@angular/core';
import { StartFormCustomButtonDirective } from './components/form-custom-button.directive';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { FormRendererComponent } from './components/form-renderer.component';
import { InplaceFormInputComponent } from './components/inplace-form-input/inplace-form-input.component';
import { DecimalRenderMiddlewareService } from './components/middlewares/decimal-middleware.service';
import { FORM_FIELD_MODEL_RENDER_MIDDLEWARE } from './components/middlewares/middleware';
import { MASK_DIRECTIVE, WIDGET_DIRECTIVES, WidgetComponent } from './components/widgets';

@NgModule({
    imports: [
        FormFieldComponent,
        FormRendererComponent,
        WidgetComponent,
        StartFormCustomButtonDirective,
        InplaceFormInputComponent,
        ...WIDGET_DIRECTIVES,
        ...MASK_DIRECTIVE
    ],
    declarations: [],
    exports: [
        FormFieldComponent,
        FormRendererComponent,
        StartFormCustomButtonDirective,
        ...WIDGET_DIRECTIVES,
        InplaceFormInputComponent,
        WidgetComponent
    ],
    providers: [
        {
            provide: FORM_FIELD_MODEL_RENDER_MIDDLEWARE,
            useClass: DecimalRenderMiddlewareService,
            multi: true
        }
    ]
})
export class FormBaseModule { /* empty */ }
