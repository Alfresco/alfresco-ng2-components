/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import type { ThemeModel } from '@alfresco/adf-core';
import type {
    FormVariable,
    NumberFieldValue,
    SectionRowOptions,
    SourceFieldReference,
    TabDefinition,
    VisibilityCondition
} from './form-definition.interface';

/**
 * A field as the modeler saves it. The properties the form reads are typed; a field type or widget of its own can read
 * any other one, which it narrows itself.
 */
export interface FieldJson {
    id: string;
    type: string;
    name?: string;
    tab?: string | null;
    fields?: Record<string, FieldJson[]>;
    params?: {
        initialNumberOfRows?: number;
        maxNumberOfRows?: number | null;
        multiple?: boolean;
        field?: SourceFieldReference | null;
        inputMask?: string;
        inputMaskReversed?: boolean;
        inputMaskPlaceholder?: string;
        allowCollapse?: boolean;
        collapseByDefault?: boolean;
        hideHeader?: boolean;
        autoGrow?: boolean;
        [setting: string]: unknown;
    } & SectionRowOptions;
    visibilityCondition?: VisibilityCondition | null;
    value?: unknown;
    placeholder?: string | null;
    tooltip?: string;
    colspan?: number;
    numberOfColumns?: number;
    required?: boolean;
    readOnly?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: NumberFieldValue;
    maxValue?: NumberFieldValue;
    regexPattern?: string | null;
    customValidationMessage?: string;
    style?: string;
    className?: string;
    isCustomType?: boolean;
    valueType?: string;
    options?: unknown;
    optionType?: string;
    hasEmptyValue?: boolean;
    selectionType?: string;
    dateDisplayFormat?: string;
    enableFractions?: boolean;
    currency?: string;
    precision?: number;
    dynamicDateRangeSelection?: boolean;
    minDateRangeValue?: number | null;
    maxDateRangeValue?: number | null;
    hyperlinkUrl?: string;
    displayText?: string;
    [property: string]: unknown;
}

export interface OutcomeJson {
    id: string;
    name: string;
    skipValidation?: boolean;
    visibilityCondition?: VisibilityCondition | null;
}

export interface FormDefinitionContentJson {
    name?: string;
    theme?: ThemeModel;
    showBottomTabNavButtons?: boolean;
    stickyTabs?: boolean;
    leftLabels?: boolean;
    className?: string;
    fields?: FieldJson[];
    variables?: FormVariable[];
    tabs?: TabDefinition[];
    outcomes?: OutcomeJson[];
    selectedOutcome?: string;
}

/**
 * A form representation as the backend and the designer exchange it: either nested (`formDefinition` holds the
 * content) or flattened (the content is at the top level, as the cloud form passes it to the engine).
 */
export interface FormRepresentationJson extends FormDefinitionContentJson {
    formDefinition?: FormDefinitionContentJson;
    processVariables?: FormVariable[];
}

export interface FormDefinitionJson extends FormRepresentationJson {
    formRepresentation?: FormRepresentationJson;
}
