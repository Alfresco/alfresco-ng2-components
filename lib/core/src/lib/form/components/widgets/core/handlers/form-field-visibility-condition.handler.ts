/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { RepeatableSectionModel, ROW_ID_PREFIX } from '../repeatable-section.model';
import { WidgetTypeEnum, WidgetVisibilityModel } from '../../../../models/widget-visibility.model';
import { FormFieldTypes } from '../form-field-types';

const getVisibilityCondition = (id: string, json?: any, parent?: RepeatableSectionModel): WidgetVisibilityModel | undefined => {
    if (!json) {
        return undefined;
    }

    return new WidgetVisibilityModel(
        parent?.fields
            ? {
                  ...json,
                  ...(shouldUpdateValue(json.leftType, json.leftValue) && {
                      leftValue: getValue(id, json.leftValue, parent.fields)
                  }),
                  ...(shouldUpdateValue(json.rightType, json.rightValue) && {
                      rightValue: getValue(id, json.rightValue, parent.fields)
                  })
              }
            : json
    );
};

const shouldUpdateValue = (type: WidgetTypeEnum, value: string): boolean => type === WidgetTypeEnum.field && !!value;

const getValue = (id: string, value: string, fields: any): string => {
    for (const column of Object.values(fields)) {
        for (const field of column as any) {
            if (field.type === FormFieldTypes.SECTION) {
                for (const sectionColumn of Object.values(field.fields)) {
                    for (const sectionField of sectionColumn as any) {
                        if (sectionField.id === value) {
                            return getRepeatableSectionChildValue(id, value);
                        }
                    }
                }
            }

            if (field.id === value) {
                return getRepeatableSectionChildValue(id, value);
            }
        }
    }

    return value;
};

const getRepeatableSectionChildValue = (id: string, value: string): string => value + ROW_ID_PREFIX + getRowId(id);

const getRowId = (id: string) => {
    const split = id.split(ROW_ID_PREFIX);

    return split.length > 1 ? split[1] : '';
};

export const formFieldVisibilityConditionHandler = {
    getVisibilityCondition
};
