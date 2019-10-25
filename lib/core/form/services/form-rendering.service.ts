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

import { DynamicComponentMapper, DynamicComponentResolveFunction, DynamicComponentResolver } from '../../services/dynamic-component-mapper.service';
import { Injectable, Type } from '@angular/core';
import * as widgets from './../components/widgets/index';

@Injectable({
    providedIn: 'root'
})
export class FormRenderingService extends DynamicComponentMapper {

    protected defaultValue: Type<{}> = widgets.UnknownWidgetComponent;
    protected types: { [key: string]: DynamicComponentResolveFunction } = {
        'text': DynamicComponentResolver.fromType(widgets.TextWidgetComponent),
        'string': DynamicComponentResolver.fromType(widgets.TextWidgetComponent),
        'integer': DynamicComponentResolver.fromType(widgets.NumberWidgetComponent),
        'multi-line-text': DynamicComponentResolver.fromType(widgets.MultilineTextWidgetComponentComponent),
        'boolean': DynamicComponentResolver.fromType(widgets.CheckboxWidgetComponent),
        'dropdown': DynamicComponentResolver.fromType(widgets.DropdownWidgetComponent),
        'date': DynamicComponentResolver.fromType(widgets.DateWidgetComponent),
        'amount': DynamicComponentResolver.fromType(widgets.AmountWidgetComponent),
        'radio-buttons': DynamicComponentResolver.fromType(widgets.RadioButtonsWidgetComponent),
        'hyperlink': DynamicComponentResolver.fromType(widgets.HyperlinkWidgetComponent),
        'readonly-text': DynamicComponentResolver.fromType(widgets.DisplayTextWidgetComponent),
        'json': DynamicComponentResolver.fromType(widgets.JsonWidgetComponent),
        'readonly': DynamicComponentResolver.fromType(widgets.TextWidgetComponent),
        'typeahead': DynamicComponentResolver.fromType(widgets.TypeaheadWidgetComponent),
        'people': DynamicComponentResolver.fromType(widgets.PeopleWidgetComponent),
        'functional-group': DynamicComponentResolver.fromType(widgets.FunctionalGroupWidgetComponent),
        'dynamic-table': DynamicComponentResolver.fromType(widgets.DynamicTableWidgetComponent),
        'container': DynamicComponentResolver.fromType(widgets.ContainerWidgetComponent),
        'group': DynamicComponentResolver.fromType(widgets.ContainerWidgetComponent),
        'document': DynamicComponentResolver.fromType(widgets.DocumentWidgetComponent),
        'upload':  DynamicComponentResolver.fromType(widgets.UploadWidgetComponent),
        'datetime':  DynamicComponentResolver.fromType(widgets.DateTimeWidgetComponent)
    };
}
