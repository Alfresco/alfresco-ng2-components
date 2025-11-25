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

import { FormFieldRule } from '../form-field-rule';
import { FormFieldTypes } from '../form-field-types';
import { RepeatableSectionModel, ROW_ID_PREFIX } from '../repeatable-section.model';

const getRule = (id: string, rule?: FormFieldRule, parent?: RepeatableSectionModel): FormFieldRule =>
    rule?.ruleOn && parent?.fields
        ? ({
              ...rule,
              ruleOn: getRuleOn(id, rule.ruleOn, parent.fields)
          } as FormFieldRule)
        : rule;

const getRuleOn = (id: string, ruleOn: string, fields: any): string => {
    for (const column of Object.values(fields)) {
        for (const field of column as any) {
            if (field.type === FormFieldTypes.SECTION) {
                for (const sectionColumn of Object.values(field.fields)) {
                    for (const sectionField of sectionColumn as any) {
                        if (sectionField.id === ruleOn) {
                            return getRepeatableSectionChildRuleOn(id, ruleOn);
                        }
                    }
                }
            }

            if (field.id === ruleOn) {
                return getRepeatableSectionChildRuleOn(id, ruleOn);
            }
        }
    }

    return ruleOn;
};

const getRepeatableSectionChildRuleOn = (id: string, ruleOn: string): string => ruleOn + ROW_ID_PREFIX + getRowId(id);

const getRowId = (id: string): string => {
    const split = id.split(ROW_ID_PREFIX);

    return split.length > 1 ? split[1] : '';
};

export const formFieldRuleHandler = {
    getRule
};
