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
    AmountWidget,
    AttachWidget,
    CheckboxWidget,
    ContainerWidget,
    DateWidget,
    DisplayTextWidget,
    DisplayValueWidget,
    DropdownWidget,
    DynamicTableWidget,
    FormFieldModel,
    FunctionalGroupWidget,
    HyperlinkWidget,
    MultilineTextWidget,
    NumberWidget,
    PeopleWidget,
    RadioButtonsWidget,
    TextWidget,
    TypeaheadWidget,
    UnknownWidget,
    UploadWidget
} from './../components/widgets/index';

@Injectable()
export class FormRenderingService {

    private types: { [key: string]: ComponentTypeResolver } = {
        'text': DefaultTypeResolver.fromType(TextWidget),
        'integer': DefaultTypeResolver.fromType(NumberWidget),
        'multi-line-text': DefaultTypeResolver.fromType(MultilineTextWidget),
        'boolean': DefaultTypeResolver.fromType(CheckboxWidget),
        'dropdown': DefaultTypeResolver.fromType(DropdownWidget),
        'date': DefaultTypeResolver.fromType(DateWidget),
        'amount': DefaultTypeResolver.fromType(AmountWidget),
        'radio-buttons': DefaultTypeResolver.fromType(RadioButtonsWidget),
        'hyperlink': DefaultTypeResolver.fromType(HyperlinkWidget),
        'readonly': DefaultTypeResolver.fromType(DisplayValueWidget),
        'readonly-text': DefaultTypeResolver.fromType(DisplayTextWidget),
        'typeahead': DefaultTypeResolver.fromType(TypeaheadWidget),
        'people': DefaultTypeResolver.fromType(PeopleWidget),
        'functional-group': DefaultTypeResolver.fromType(FunctionalGroupWidget),
        'dynamic-table': DefaultTypeResolver.fromType(DynamicTableWidget),
        'container': DefaultTypeResolver.fromType(ContainerWidget),
        'group': DefaultTypeResolver.fromType(ContainerWidget)
    };

    constructor() {
        this.types['upload'] = (field: FormFieldModel): Type<{}> => {
            if (field) {
                let params = field.params;
                if (params && params.link) {
                    return AttachWidget;
                }
                return UploadWidget;
            }
            return UnknownWidget;
        };
    }

    getComponentTypeResolver(fieldType: string, defaultValue: Type<{}> = UnknownWidget): ComponentTypeResolver {
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

    resolveComponentType(field: FormFieldModel, defaultValue: Type<{}> = UnknownWidget): Type<{}> {
        if (field) {
            let resolver = this.getComponentTypeResolver(field.type, defaultValue);
            return resolver(field);
        }
        return defaultValue;
    }

}

export interface ComponentTypeResolver {
    (field: FormFieldModel): Type<{}>;
}

export class DefaultTypeResolver {
    static fromType(type: Type<{}>): ComponentTypeResolver {
        return (field: FormFieldModel) => {
            return type;
        };
    }
}
