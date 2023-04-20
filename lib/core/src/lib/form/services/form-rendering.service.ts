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

import {
    DynamicComponentMapper,
    DynamicComponentResolveFunction,
    DynamicComponentResolver
} from '../../common/services/dynamic-component-mapper.service';
import { Injectable, Type } from '@angular/core';
import * as widgets from '../components/widgets';
import { FormFieldTypes } from '../components/widgets';

/* eslint-disable id-blacklist */
@Injectable({
    providedIn: 'root'
})
export class FormRenderingService extends DynamicComponentMapper {

    protected defaultValue: Type<any> = widgets.UnknownWidgetComponent;
    protected types: { [key: string]: DynamicComponentResolveFunction } = {
        [FormFieldTypes.TEXT]: DynamicComponentResolver.fromType(widgets.TextWidgetComponent),
        [FormFieldTypes.STRING]: DynamicComponentResolver.fromType(widgets.TextWidgetComponent),
        [FormFieldTypes.INTEGER]: DynamicComponentResolver.fromType(widgets.NumberWidgetComponent),
        [FormFieldTypes.MULTILINE_TEXT]: DynamicComponentResolver.fromType(widgets.MultilineTextWidgetComponentComponent),
        [FormFieldTypes.BOOLEAN]: DynamicComponentResolver.fromType(widgets.CheckboxWidgetComponent),
        [FormFieldTypes.DATE]: DynamicComponentResolver.fromType(widgets.DateWidgetComponent),
        [FormFieldTypes.AMOUNT]: DynamicComponentResolver.fromType(widgets.AmountWidgetComponent),
        [FormFieldTypes.HYPERLINK]: DynamicComponentResolver.fromType(widgets.HyperlinkWidgetComponent),
        [FormFieldTypes.READONLY_TEXT]: DynamicComponentResolver.fromType(widgets.DisplayTextWidgetComponent),
        [FormFieldTypes.JSON]: DynamicComponentResolver.fromType(widgets.JsonWidgetComponent),
        [FormFieldTypes.DISPLAY_VALUE]: DynamicComponentResolver.fromType(widgets.TextWidgetComponent),
        [FormFieldTypes.DATETIME]: DynamicComponentResolver.fromType(widgets.DateTimeWidgetComponent),
        [FormFieldTypes.VIEWER]: DynamicComponentResolver.fromType(widgets.BaseViewerWidgetComponent)
    };
}
