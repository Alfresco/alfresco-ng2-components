/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Injectable, Type } from '@angular/core';

import {
    AmountWidgetComponent,
    AttachWidgetComponent,
    CheckboxWidgetComponent,
    ContainerWidgetComponent,
    DateWidgetComponent,
    DisplayTextWidgetComponentComponent,
    DropdownWidgetComponent,
    DynamicTableWidgetComponent,
    FormFieldModel,
    FunctionalGroupWidgetComponent,
    HyperlinkWidgetComponent,
    MultilineTextWidgetComponentComponent,
    NumberWidgetComponent,
    PeopleWidgetComponent,
    RadioButtonsWidgetComponent,
    TextWidgetComponent,
    TypeaheadWidgetComponent,
    UnknownWidgetComponent,
    UploadWidgetComponent
} from './../components/widgets/index';

@Injectable()
export class FormRenderingService {

    private types: { [key: string]: ComponentTypeResolver } = {
        'text': DefaultTypeResolver.fromType(TextWidgetComponent),
        'integer': DefaultTypeResolver.fromType(NumberWidgetComponent),
        'multi-line-text': DefaultTypeResolver.fromType(MultilineTextWidgetComponentComponent),
        'boolean': DefaultTypeResolver.fromType(CheckboxWidgetComponent),
        'dropdown': DefaultTypeResolver.fromType(DropdownWidgetComponent),
        'date': DefaultTypeResolver.fromType(DateWidgetComponent),
        'amount': DefaultTypeResolver.fromType(AmountWidgetComponent),
        'radio-buttons': DefaultTypeResolver.fromType(RadioButtonsWidgetComponent),
        'hyperlink': DefaultTypeResolver.fromType(HyperlinkWidgetComponent),
        'readonly-text': DefaultTypeResolver.fromType(DisplayTextWidgetComponentComponent),
        'typeahead': DefaultTypeResolver.fromType(TypeaheadWidgetComponent),
        'people': DefaultTypeResolver.fromType(PeopleWidgetComponent),
        'functional-group': DefaultTypeResolver.fromType(FunctionalGroupWidgetComponent),
        'dynamic-table': DefaultTypeResolver.fromType(DynamicTableWidgetComponent),
        'container': DefaultTypeResolver.fromType(ContainerWidgetComponent),
        'group': DefaultTypeResolver.fromType(ContainerWidgetComponent)
    };

    constructor() {
        this.types['upload'] = (field: FormFieldModel): Type<{}> => {
            if (field) {
                let params = field.params;
                if (params && params.link) {
                    return AttachWidgetComponent;
                }
                return UploadWidgetComponent;
            }
            return UnknownWidgetComponent;
        };
    }

    getComponentTypeResolver(fieldType: string, defaultValue: Type<{}> = UnknownWidgetComponent): ComponentTypeResolver {
        if (fieldType) {
            return this.types[fieldType] || DefaultTypeResolver.fromType(defaultValue);
        }
        return DefaultTypeResolver.fromType(defaultValue);
    }

    setComponentTypeResolver(fieldType: string, resolver: ComponentTypeResolver, override: boolean = false) {
        if (!fieldType) {
            throw new Error(`fieldType is null or not defined`);
        }

        if (!resolver) {
            throw new Error(`resolver is null or not defined`);
        }

        let existing = this.types[fieldType];
        if (existing && !override) {
            throw new Error(`already mapped, use override option if you intend replacing existing mapping.`);
        }

        this.types[fieldType] = resolver;
    }

    resolveComponentType(field: FormFieldModel, defaultValue: Type<{}> = UnknownWidgetComponent): Type<{}> {
        if (field) {
            let resolver = this.getComponentTypeResolver(field.type, defaultValue);
            return resolver(field);
        }
        return defaultValue;
    }

}

export type ComponentTypeResolver = (field: FormFieldModel) => Type<{}>;

export class DefaultTypeResolver {
    static fromType(type: Type<{}>): ComponentTypeResolver {
        return (field: FormFieldModel) => {
            return type;
        };
    }
}
